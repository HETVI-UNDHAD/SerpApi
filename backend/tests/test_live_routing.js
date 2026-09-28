import assert from 'assert';
import {
  runWithConcurrency,
  withTimeout,
  routeSingleLeg,
  routeDailyLegs
} from '../src/services/liveRoutingService.js';
import { getCachedRoute, setCachedRoute } from '../src/services/supabaseService.js';
import { buildRouteAwareItinerary } from '../src/services/aiAgentService.js';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    failed++;
  }
}

console.log('\n--- Running P1-1 Live Routing Test Suite ---\n');

(async () => {
  // Test 1: runWithConcurrency limit and execution
  await test('runWithConcurrency executes all tasks and maintains results order', async () => {
    let activeWorkers = 0;
    let maxSimultaneous = 0;

    const tasks = [1, 2, 3, 4, 5, 6, 7].map(n => async () => {
      activeWorkers++;
      maxSimultaneous = Math.max(maxSimultaneous, activeWorkers);
      await new Promise(r => setTimeout(r, 20));
      activeWorkers--;
      return n * 10;
    });

    const results = await runWithConcurrency(tasks, 3);
    assert.deepStrictEqual(results, [10, 20, 30, 40, 50, 60, 70]);
    assert.ok(maxSimultaneous <= 3, `Max simultaneous was ${maxSimultaneous}, expected <= 3`);
  });

  // Test 2: withTimeout helper
  await test('withTimeout resolves if promise completes before timeout', async () => {
    const fastPromise = new Promise(r => setTimeout(() => r('done'), 10));
    const result = await withTimeout(fastPromise, 100);
    assert.strictEqual(result, 'done');
  });

  await test('withTimeout rejects if promise exceeds timeout', async () => {
    const slowPromise = new Promise(r => setTimeout(() => r('done'), 150));
    await assert.rejects(
      async () => await withTimeout(slowPromise, 25),
      /timed out/
    );
  });

  // Test 3: In-memory cache keyed by origin, destination, mode
  await test('Route cache stores and retrieves routes by (origin, destination, mode)', async () => {
    const orig = '28.6139,77.2090';
    const dest = '28.6129,77.2295';
    const mockData = {
      distanceKm: 3.2,
      durationMinutes: 9,
      formattedDistance: '3.2 km',
      formattedDuration: '9 mins'
    };

    await setCachedRoute(orig, dest, 'driving', mockData);
    const cached = await getCachedRoute(orig, dest, 'driving');
    assert.ok(cached, 'Expected route in cache');
    assert.strictEqual(cached.distanceKm, 3.2);
    assert.strictEqual(cached.durationMinutes, 9);
  });

  // Test 4: routeSingleLeg uses cache and returns LIVE provenance
  await test('routeSingleLeg retrieves from cache with LIVE status and serpapi_maps_directions source', async () => {
    const leg = {
      fromName: 'India Gate',
      fromCoords: { latitude: 28.6129, longitude: 77.2295 },
      toName: 'National Museum',
      toCoords: { latitude: 28.6117, longitude: 77.2195 },
      destination: 'New Delhi'
    };

    // Pre-populate cache
    const originKey = `${leg.fromCoords.latitude},${leg.fromCoords.longitude}`;
    const destKey = `${leg.toCoords.latitude},${leg.toCoords.longitude}`;
    await setCachedRoute(originKey, destKey, 'driving', {
      distanceKm: 1.8,
      durationMinutes: 6,
      formattedDistance: '1.8 km',
      formattedDuration: '6 mins'
    });

    const result = await routeSingleLeg(leg);
    assert.strictEqual(result.isLiveRouted, true);
    assert.strictEqual(result.distanceKm, 1.8);
    assert.strictEqual(result.durationMinutes, 6);
    assert.strictEqual(result.provenance.status, 'LIVE');
    assert.strictEqual(result.provenance.source, 'serpapi_maps_directions');
    assert.strictEqual(result.provenance.confidence, 1.0);
  });

  // Test 5: routeSingleLeg on API failure falls back to Haversine x 1.32 with ESTIMATED status
  await test('routeSingleLeg falls back to Haversine x 1.32 with ESTIMATED status when directions unavailable', async () => {
    // Unique coordinates not in cache
    const leg = {
      fromName: 'Uncached Place A',
      fromCoords: { latitude: 12.9716, longitude: 77.5946 },
      toName: 'Uncached Place B',
      toCoords: { latitude: 12.9352, longitude: 77.6245 },
      destination: 'Bengaluru',
      timeoutMs: 1 // Force fast timeout so it triggers fallback without real network
    };

    const result = await routeSingleLeg(leg);
    assert.strictEqual(result.isLiveRouted, false);
    assert.ok(result.distanceKm > 0, 'Expected positive estimated distance');
    assert.ok(result.durationMinutes > 0, 'Expected positive estimated duration');
    assert.strictEqual(result.provenance.status, 'ESTIMATED');
    assert.strictEqual(result.provenance.source, 'haversine_estimate');
    assert.ok(result.provenance.method.includes('Haversine x 1.32'), `Expected method string, got: ${result.provenance.method}`);
  });

  // Test 6: routeSingleLeg when coordinates are missing returns UNAVAILABLE
  await test('routeSingleLeg returns UNAVAILABLE when coordinates are missing', async () => {
    const leg = {
      fromName: 'Mystery Location',
      fromCoords: null,
      toName: 'Unknown Spot',
      toCoords: null,
      destination: 'Nowhere'
    };

    const result = await routeSingleLeg(leg);
    assert.strictEqual(result.distanceKm, null);
    assert.strictEqual(result.durationMinutes, null);
    assert.strictEqual(result.isLiveRouted, false);
    assert.strictEqual(result.provenance.status, 'UNAVAILABLE');
    assert.strictEqual(result.provenance.source, 'unavailable');
  });

  // Test 7: routeDailyLegs calculates ratioText and live count
  await test('routeDailyLegs correctly aggregates live-routed count and ratioText', async () => {
    // 2 cached (live), 1 timed-out (estimated)
    const leg1 = {
      fromCoords: { latitude: 19.0760, longitude: 72.8777 },
      toCoords: { latitude: 19.0800, longitude: 72.8800 },
      destination: 'Mumbai'
    };
    const leg2 = {
      fromCoords: { latitude: 19.0800, longitude: 72.8800 },
      toCoords: { latitude: 19.0900, longitude: 72.8900 },
      destination: 'Mumbai'
    };
    const leg3 = {
      fromCoords: { latitude: 19.0900, longitude: 72.8900 },
      toCoords: { latitude: 19.1000, longitude: 72.9000 },
      destination: 'Mumbai',
      timeoutMs: 1 // force fallback
    };

    // Cache leg 1 & 2
    await setCachedRoute('19.076,72.8777', '19.08,72.88', 'driving', { distanceKm: 1.2, durationMinutes: 5 });
    await setCachedRoute('19.08,72.88', '19.09,72.89', 'driving', { distanceKm: 2.1, durationMinutes: 8 });

    const summary = await routeDailyLegs([leg1, leg2, leg3], { concurrency: 4, timeoutMs: 1 });
    assert.strictEqual(summary.totalLegsCount, 3);
    assert.strictEqual(summary.liveRoutedCount, 2);
    assert.strictEqual(summary.ratioText, '2 of 3 legs live-routed');
    assert.strictEqual(summary.routedLegs[0].isLiveRouted, true);
    assert.strictEqual(summary.routedLegs[1].isLiveRouted, true);
    assert.strictEqual(summary.routedLegs[2].isLiveRouted, false);
  });

  // Test 8: buildRouteAwareItinerary attaches ratioText to every day
  await test('buildRouteAwareItinerary attaches live routing ratioText and counts to each day', async () => {
    const itinerary = await buildRouteAwareItinerary({
      origin: 'Mumbai',
      destination: 'Goa',
      duration: 2,
      places: [
        {
          id: 'p1',
          title: 'Aguada Fort',
          gpsCoordinates: { latitude: 15.4920, longitude: 73.7737 },
          rating: 4.5,
          reviewsCount: 300
        },
        {
          id: 'p2',
          title: 'Candolim Beach',
          gpsCoordinates: { latitude: 15.5164, longitude: 73.7634 },
          rating: 4.4,
          reviewsCount: 200
        }
      ],
      hotel: {
        name: 'Taj Holiday Village',
        gpsCoordinates: { latitude: 15.5000, longitude: 73.7700 }
      },
      enableLiveRouting: false // Fast mode for structure testing
    });

    assert.strictEqual(itinerary.length, 2);
    itinerary.forEach(day => {
      assert.ok(typeof day.liveRoutingRatioText === 'string');
      assert.ok(day.liveRoutingRatioText.includes('legs live-routed'));
      assert.ok(typeof day.liveRoutedCount === 'number');
      assert.ok(typeof day.totalLegsCount === 'number');
    });
  });

  console.log(`\nP1-1 Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
})();
