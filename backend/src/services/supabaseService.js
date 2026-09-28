import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-ref')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[OK] Supabase client initialized:', supabaseUrl);
  } catch (err) {
    console.warn('[WARN] Supabase init warning:', err.message);
  }
}

// Resilient in-memory store for instantaneous access and fallback
const tripStore = new Map();

export async function saveTrip(trip) {
  tripStore.set(trip.id, trip);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .upsert({
          id: trip.id,
          origin: trip.origin,
          destination: trip.destination,
          duration: trip.duration,
          budget: trip.budget,
          travelers: trip.travelers,
          trip_data: trip,
          created_at: trip.createdAt || new Date().toISOString()
        });
      if (error) {
        console.warn('[Supabase upsert info]:', error.message);
      }
    } catch (err) {
      console.warn('[Supabase save fallback]:', err.message);
    }
  }

  return trip;
}

export async function getTripById(id) {
  if (tripStore.has(id)) {
    return tripStore.get(id);
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data?.trip_data) {
        tripStore.set(id, data.trip_data);
        return data.trip_data;
      }
    } catch (err) {
      console.warn('[Supabase getTripById fallback]:', err.message);
    }
  }

  return null;
}

export async function listSavedTrips() {
  const localList = Array.from(tripStore.values());
  return localList;
}

// In-memory + Supabase Route Cache (P1-1)
const routeStore = new Map();

export async function getCachedRoute(origin, destination, mode = 'driving') {
  const cacheKey = `${String(origin).toLowerCase().trim()}|${String(destination).toLowerCase().trim()}|${mode}`;
  if (routeStore.has(cacheKey)) {
    return routeStore.get(cacheKey);
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('route_cache')
        .select('route_data')
        .eq('cache_key', cacheKey)
        .single();
      if (!error && data?.route_data) {
        routeStore.set(cacheKey, data.route_data);
        return data.route_data;
      }
    } catch (err) {
      // Non-blocking in case table doesn't exist
    }
  }

  return null;
}

export async function setCachedRoute(origin, destination, mode = 'driving', routeData) {
  const cacheKey = `${String(origin).toLowerCase().trim()}|${String(destination).toLowerCase().trim()}|${mode}`;
  routeStore.set(cacheKey, routeData);

  if (supabase) {
    try {
      await supabase
        .from('route_cache')
        .upsert({
          cache_key: cacheKey,
          origin,
          destination,
          mode,
          route_data: routeData,
          created_at: new Date().toISOString()
        });
    } catch (err) {
      // Non-blocking fallback
    }
  }

  return routeData;
}
