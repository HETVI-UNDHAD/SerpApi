/**
 * Live Road Routing Service for Daily Activity Legs (P1-1)
 *
 * For Hotel->A1, A1->A2, ..., An->Hotel:
 * - Calls SerpApi google_maps_directions for live road routing.
 * - Multi-tier cache (in-memory Map + Supabase route_cache) keyed by (origin, destination, mode).
 * - Runs legs in parallel with a concurrency limit (4) and timeout.
 * - On success: distance/duration provenance = LIVE (source: serpapi_maps_directions).
 * - On failure: falls back to Haversine x 1.32 with provenance = ESTIMATED and method string.
 * - Reports on each day: "X of Y legs live-routed".
 */

import { searchDirections } from './serpapiService.js';
import { getCachedRoute, setCachedRoute } from './supabaseService.js';
import { createProvenance } from '../models/provenance.js';
import { calculateEstimatedRoadKm, estimateDriveMinutes } from './routeIntelligenceService.js';

/**
 * Runs tasks with a specified concurrency limit (default 4).
 */
export async function runWithConcurrency(tasks, limit = 4) {
  if (!tasks || tasks.length === 0) return [];
  const results = new Array(tasks.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < tasks.length) {
      const idx = currentIndex++;
      try {
        results[idx] = await tasks[idx]();
      } catch (err) {
        results[idx] = { error: err };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Executes a promise with a timeout in milliseconds.
 */
export function withTimeout(promise, ms = 4000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Directions API timed out after ${ms}ms`)), ms);
  });
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    timeoutPromise
  ]);
}

/**
 * Routes a single activity leg using Google Maps Directions via SerpApi with caching and Haversine fallback.
 */
export async function routeSingleLeg({
  fromName,
  fromCoords,
  fromAddress,
  toName,
  toCoords,
  toAddress,
  destination,
  timeoutMs = 4000
}) {
  const lat1 = fromCoords?.latitude ?? null;
  const lon1 = fromCoords?.longitude ?? null;
  const lat2 = toCoords?.latitude ?? null;
  const lon2 = toCoords?.longitude ?? null;

  const hasCoords = lat1 != null && lon1 != null && lat2 != null && lon2 != null;

  // If coordinates are completely unavailable, return UNAVAILABLE without fabricating
  if (!hasCoords && !fromAddress && !toAddress) {
    return {
      distanceKm: null,
      durationMinutes: null,
      isLiveRouted: false,
      provenance: createProvenance({
        source: 'unavailable',
        status: 'UNAVAILABLE',
        confidence: 0
      }),
      warning: 'Origin or destination coordinates missing; leg excluded from route totals.'
    };
  }

  const originQuery = hasCoords ? `${lat1},${lon1}` : `${fromName}, ${destination}`;
  const destQuery = hasCoords ? `${lat2},${lon2}` : `${toName}, ${destination}`;

  // 1. Check in-memory + Supabase Cache
  try {
    const cached = await getCachedRoute(originQuery, destQuery, 'driving');
    if (cached && typeof cached.distanceKm === 'number') {
      return {
        distanceKm: cached.distanceKm,
        durationMinutes: cached.durationMinutes,
        formattedDistance: cached.formattedDistance || `${cached.distanceKm} km`,
        formattedDuration: cached.formattedDuration || `${cached.durationMinutes} mins`,
        overviewPolyline: cached.overviewPolyline || null,
        steps: cached.steps || [],
        isLiveRouted: true,
        isCached: true,
        provenance: createProvenance({
          source: 'serpapi_maps_directions',
          status: 'LIVE',
          method: 'Google Maps Directions (Cached)',
          confidence: 1.0
        })
      };
    }
  } catch (err) {
    // Non-blocking cache lookup error
  }

  // 2. Call SerpApi Google Maps Directions
  try {
    const directionsResult = await withTimeout(
      searchDirections({
        origin: originQuery,
        destination: destQuery,
        mode: 'driving'
      }),
      timeoutMs
    );

    if (directionsResult && directionsResult.distanceMeters != null && directionsResult.durationSeconds != null) {
      const distanceKm = Math.round((directionsResult.distanceMeters / 1000) * 10) / 10;
      const durationMinutes = Math.max(1, Math.round(directionsResult.durationSeconds / 60));

      const routeData = {
        distanceKm,
        durationMinutes,
        formattedDistance: directionsResult.formattedDistance || `${distanceKm} km`,
        formattedDuration: directionsResult.formattedDuration || `${durationMinutes} mins`,
        overviewPolyline: directionsResult.route?.overviewPolyline || null,
        steps: directionsResult.route?.steps || []
      };

      // Save to cache asynchronously
      setCachedRoute(originQuery, destQuery, 'driving', routeData).catch(() => {});

      return {
        ...routeData,
        isLiveRouted: true,
        isCached: false,
        provenance: createProvenance({
          source: 'serpapi_maps_directions',
          status: 'LIVE',
          method: 'SerpApi Google Maps Directions API',
          confidence: 1.0
        })
      };
    }
  } catch (err) {
    // Falls through to Haversine fallback on error or timeout
  }

  // 3. Fallback: Haversine x 1.32 Empirical Road Factor
  if (hasCoords) {
    const estDistanceKm = calculateEstimatedRoadKm(lat1, lon1, lat2, lon2);
    const estDurationMinutes = estimateDriveMinutes(estDistanceKm);

    return {
      distanceKm: estDistanceKm,
      durationMinutes: estDurationMinutes,
      formattedDistance: estDistanceKm != null ? `${estDistanceKm} km` : null,
      formattedDuration: estDurationMinutes != null ? `${estDurationMinutes} mins` : null,
      overviewPolyline: null,
      steps: [],
      isLiveRouted: false,
      provenance: createProvenance({
        source: 'haversine_estimate',
        status: 'ESTIMATED',
        method: 'Haversine x 1.32 empirical road factor',
        confidence: 0.75
      })
    };
  }

  return {
    distanceKm: null,
    durationMinutes: null,
    isLiveRouted: false,
    provenance: createProvenance({
      source: 'unavailable',
      status: 'UNAVAILABLE',
      confidence: 0
    }),
    warning: 'Could not resolve road distance; leg excluded from route totals.'
  };
}

/**
 * Routes all daily activity legs in parallel with concurrency limit (4) and timeout.
 * Calculates "X of Y legs live-routed" metrics per day.
 */
export async function routeDailyLegs(legs = [], { concurrency = 4, timeoutMs = 4000 } = {}) {
  if (!legs || legs.length === 0) {
    return {
      routedLegs: [],
      liveRoutedCount: 0,
      totalLegsCount: 0,
      ratioText: '0 of 0 legs live-routed'
    };
  }

  const tasks = legs.map(leg => () => routeSingleLeg({
    fromName: leg.from?.name || leg.fromName,
    fromCoords: leg.from?.coords || leg.fromCoords,
    fromAddress: leg.from?.address || leg.fromAddress,
    toName: leg.to?.name || leg.toName,
    toCoords: leg.to?.coords || leg.toCoords,
    toAddress: leg.to?.address || leg.toAddress,
    destination: leg.destination,
    timeoutMs
  }));
  const results = await runWithConcurrency(tasks, concurrency);

  let liveRoutedCount = 0;
  const routedLegs = legs.map((leg, idx) => {
    const route = results[idx] && !results[idx].error ? results[idx] : null;
    const isLive = Boolean(route?.isLiveRouted);
    if (isLive) liveRoutedCount++;

    return {
      ...leg,
      distanceKm: route?.distanceKm ?? leg.distanceKm ?? null,
      durationMinutes: route?.durationMinutes ?? leg.durationMinutes ?? null,
      formattedDistance: route?.formattedDistance ?? (route?.distanceKm ? `${route.distanceKm} km` : null),
      formattedDuration: route?.formattedDuration ?? (route?.durationMinutes ? `${route.durationMinutes} mins` : null),
      overviewPolyline: route?.overviewPolyline || null,
      steps: route?.steps || [],
      isLiveRouted: isLive,
      provenance: route?.provenance || createProvenance({
        source: 'haversine_estimate',
        status: 'ESTIMATED',
        method: 'Haversine x 1.32 empirical road factor',
        confidence: 0.75
      })
    };
  });

  const totalLegsCount = legs.length;
  const ratioText = `${liveRoutedCount} of ${totalLegsCount} legs live-routed`;

  return {
    routedLegs,
    liveRoutedCount,
    totalLegsCount,
    ratioText
  };
}
