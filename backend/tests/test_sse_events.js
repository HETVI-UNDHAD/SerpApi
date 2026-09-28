import 'dotenv/config';
import assert from 'assert';
import { planTripWorkflow } from '../src/services/aiAgentService.js';

if (!process.env.SERPAPI_KEY) {
  console.log('\n--- Skipping P1-2 Real SSE Events Test Suite (SERPAPI_KEY not configured) ---\n');
  process.exit(0);
}

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

console.log('\n--- Running P1-2 Real SSE Events Test Suite ---\n');

(async () => {
  const events = [];
  const onProgress = (eventObj) => {
    events.push(eventObj);
  };

  const trip = await planTripWorkflow({
    origin: 'Ahmedabad',
    destination: 'Goa',
    duration: 3,
    budget: 25000,
    travelers: 2,
    interests: ['Beaches', 'Food'],
    transportPreference: 'Flight'
  }, onProgress);

  // Test 1: Trip was generated
  await test('planTripWorkflow successfully generated trip with onProgress attached', async () => {
    assert.ok(trip);
    assert.strictEqual(trip.destination, 'Goa');
    assert.strictEqual(trip.duration, 3);
  });

  // Test 2: Stage events were received
  await test('Received streaming stage events via onProgress callback', async () => {
    assert.ok(events.length >= 8, `Expected at least 8 events, received ${events.length}`);
  });

  // Test 3: Required stage events are present
  const eventNames = events.map(e => e.event);
  const requiredStages = [
    'TRANSPORT_SEARCH_STARTED',
    'TRANSPORT_SEARCH_COMPLETE',
    'HOTEL_SEARCH_STARTED',
    'HOTEL_SEARCH_COMPLETE',
    'PLACES_SEARCH_STARTED',
    'PLACES_SEARCH_COMPLETE',
    'REVIEWS_SEARCH_STARTED',
    'REVIEWS_SEARCH_COMPLETE',
    'EVENTS_SEARCH_STARTED',
    'EVENTS_SEARCH_COMPLETE',
    'ROUTING_STARTED',
    'ROUTING_COMPLETE',
    'BUDGET_EVALUATION_STARTED',
    'BUDGET_EVALUATION_COMPLETE',
    'VALIDATION_STARTED',
    'VALIDATION_COMPLETE'
  ];

  for (const reqStage of requiredStages) {
    await test(`Stage event "${reqStage}" is emitted`, async () => {
      assert.ok(eventNames.includes(reqStage), `Missing expected event: ${reqStage}`);
    });
  }

  // Test 4: Schema validation for each emitted event
  await test('Every stage event satisfies the provenance contract (duration_ms, result_count, status, detail)', async () => {
    const validStatuses = ['IN_PROGRESS', 'LIVE', 'ESTIMATED', 'INFERRED', 'FALLBACK', 'UNAVAILABLE', 'FAILED'];
    for (const ev of events) {
      assert.ok(typeof ev.event === 'string' && ev.event.length > 0, 'Invalid ev.event');
      assert.ok(typeof ev.stage === 'string' && ev.stage.length > 0, 'Invalid ev.stage');
      assert.ok(typeof ev.duration_ms === 'number' && ev.duration_ms >= 0, `Invalid ev.duration_ms: ${ev.duration_ms}`);
      assert.ok(typeof ev.result_count === 'number' && ev.result_count >= 0, `Invalid ev.result_count: ${ev.result_count}`);
      assert.ok(validStatuses.includes(ev.status), `Invalid status: ${ev.status}`);
      assert.ok(typeof ev.detail === 'string' && ev.detail.length > 0, 'Invalid ev.detail');
      assert.ok(typeof ev.timestamp === 'string', 'Invalid ev.timestamp');
    }
  });

  // Test 5: Complete events have duration > 0 and honest data status
  await test('Completed stage events report honest statuses and elapsed duration', async () => {
    const completedEvents = events.filter(e => e.event.endsWith('_COMPLETE'));
    assert.strictEqual(completedEvents.length, 8);
    for (const ev of completedEvents) {
      assert.notStrictEqual(ev.status, 'IN_PROGRESS');
      assert.ok(ev.duration_ms >= 0, 'Duration should be non-negative');
    }
  });

  // Test 6: Routing complete event includes real leg count
  await test('ROUTING_COMPLETE reports leg counts', async () => {
    const routingEv = events.find(e => e.event === 'ROUTING_COMPLETE');
    assert.ok(routingEv);
    assert.ok(routingEv.result_count > 0, 'Expected positive leg count');
    assert.ok(['LIVE', 'ESTIMATED', 'FALLBACK'].includes(routingEv.status));
  });

  console.log(`\nP1-2 Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
})();
