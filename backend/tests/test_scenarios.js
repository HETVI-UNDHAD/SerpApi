/**
 * TravelOS AI — Automated Evaluation & Test Suite
 * 
 * Tests core pipeline components:
 * 1. Natural Language Prompt Parser (LLM + Deterministic Fallback)
 * 2. Constraint Engine Validation & Relaxation Advice
 * 3. Haversine Distance & Geospatial Optimization
 * 4. Multi-tier Budget Optimizer
 * 5. Dynamic Replanning Engine (Flight Delay Adaptation)
 * 6. SerpApi Live Search Normalization & Events
 */

import { buildConstraintModel, validateConstraints, calculateGeospatialMetrics } from '../src/services/constraintEngine.js';
import { parseTravelPrompt, deterministicParsePrompt } from '../src/services/llmService.js';
import { planTripWorkflow, optimizeTripForBudget, applyWhatIfSimulation } from '../src/services/aiAgentService.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 TravelOS AI — Automated Test Suite & Benchmark');
  console.log('======================================================\n');

  const startTime = Date.now();

  // ──── TEST SUITE 1: NLP Prompt Parser ────
  console.log('--- Suite 1: Natural Language Travel Requirement Parsing ---');
  const samplePrompt = '3 days in Goa from Ahmedabad under ₹20,000 for 2 people, prefer beaches and local food';
  const parsed = deterministicParsePrompt(samplePrompt);
  assert(parsed.origin.toLowerCase() === 'ahmedabad', 'Extracts origin "Ahmedabad"');
  assert(parsed.destination.toLowerCase() === 'goa', 'Extracts destination "Goa"');
  assert(parsed.duration === 3, 'Extracts duration "3 days"');
  assert(parsed.budget === 20000, 'Extracts budget "₹20,000"');
  assert(parsed.travelers === 2, 'Extracts travelers "2 pax"');
  assert(parsed.interests.includes('Beaches'), 'Extracts interest "Beaches"');

  // ──── TEST SUITE 2: Constraint Engine ────
  console.log('\n--- Suite 2: Constraint Engine Validation & Relaxation ---');
  const constraintModel = buildConstraintModel({ budget: 20000, duration: 3, travelers: 2 });
  assert(constraintModel.hard.maxBudget === 20000, 'Hard budget ceiling configured');
  assert(constraintModel.hard.durationDays === 3, 'Hard duration constraint configured');

  // Over-budget test
  const overBudgetTrip = {
    budgetBreakdown: { totalEstimatedCost: 24500 },
    itinerary: [{}, {}, {}],
    selectedOptions: { hotel: { rating: 4.6 } }
  };
  const overBudgetReport = validateConstraints(overBudgetTrip, constraintModel);
  assert(!overBudgetReport.valid, 'Correctly flags over-budget plan as invalid');
  assert(overBudgetReport.relaxationSuggestion !== null, 'Provides smallest required relaxation suggestion');
  assert(overBudgetReport.relaxationSuggestion.requiredIncrease === 4500, 'Calculates exact ₹4,500 relaxation required');

  // Feasible budget test
  const feasibleTrip = {
    budgetBreakdown: { totalEstimatedCost: 18500 },
    itinerary: [{}, {}, {}],
    selectedOptions: { hotel: { rating: 4.6 } }
  };
  const feasibleReport = validateConstraints(feasibleTrip, constraintModel);
  assert(feasibleReport.valid, 'Validates feasible budget plan as valid');

  // ──── TEST SUITE 3: Geospatial Metrics & Haversine Distance ────
  console.log('\n--- Suite 3: Geospatial Distance & Optimization Metrics ---');
  const mockDays = [
    {
      totalDistanceKm: 18.5,
      activities: [
        { placeDetails: { gpsCoordinates: { latitude: 15.4989, longitude: 73.8278 } } },
        { placeDetails: { gpsCoordinates: { latitude: 15.5100, longitude: 73.8350 } } },
        { placeDetails: { gpsCoordinates: { latitude: 15.5250, longitude: 73.8400 } } }
      ]
    }
  ];
  const geoMetrics = calculateGeospatialMetrics(mockDays);
  assert(geoMetrics.totalOptimizedDistanceKm > 0, 'Computes total route distance');
  assert(geoMetrics.estimatedDistanceSavedKm >= 0, 'Computes estimated distance saved by clustering');
  assert(geoMetrics.efficiencyGainPercent >= 0, 'Computes efficiency gain percentage');

  // ──── TEST SUITE 4: End-to-End Trip Planning with Live SerpApi ────
  console.log('\n--- Suite 4: End-to-End Trip Generation (Hackathon Benchmark) ---');
  const tripStart = Date.now();
  const trip = await planTripWorkflow({
    origin: 'Ahmedabad',
    destination: 'Goa',
    duration: 3,
    budget: 20000,
    travelers: 2,
    transportPreference: 'Flight'
  });
  const tripLatency = Date.now() - tripStart;

  assert(trip.id && trip.id.startsWith('trip-'), 'Generated unique trip ID');
  assert(trip.destination === 'Goa', 'Destination verified as Goa');
  assert(trip.itinerary && trip.itinerary.length === 3, 'Itinerary generated with 3 days');
  assert(trip.geospatialMetrics !== undefined, 'Geospatial metrics attached');
  assert(trip.constraintReport !== undefined, 'Constraint report attached');
  assert(trip.explainability !== undefined, 'Explainability engine output attached');
  assert(trip.liveData.events && trip.liveData.events.length > 0, 'Live local events retrieved via SerpApi');
  console.log(`    ↳ Planning latency: ${tripLatency}ms, Initial cost: ₹${trip.budgetBreakdown?.totalEstimatedCost?.toLocaleString('en-IN')}`);

  // ──── TEST SUITE 5: Budget Optimization Engine ────
  console.log('\n--- Suite 5: Autonomous Budget Optimizer ---');
  const initialCost = trip.budgetBreakdown.totalEstimatedCost;
  const optimized = optimizeTripForBudget(trip);
  const optimizedCost = optimized.budgetBreakdown.totalEstimatedCost;
  assert(optimizedCost <= initialCost, 'Budget optimizer reduced or maintained total cost');
  assert(optimized.replanningReason !== undefined, 'Optimizer provided actionable explanation');
  console.log(`    ↳ Cost reduced from ₹${initialCost.toLocaleString('en-IN')} to ₹${optimizedCost.toLocaleString('en-IN')} (Saved ₹${(initialCost - optimizedCost).toLocaleString('en-IN')})`);

  // ──── TEST SUITE 6: Hero Replanning Engine (Flight Delay Adaptation) ────
  console.log('\n--- Suite 6: Dynamic Replanning Engine (Flight Delay Shock) ---');
  const replanned = await applyWhatIfSimulation(trip, 'flight_delayed', 'My flight is delayed by 3 hours');
  assert(replanned.replanDiff !== null, 'Generated structured replanDiff');
  assert(replanned.replanDiff.delayHours === 3, 'Accurately parsed 3-hour delay');
  assert(replanned.replanDiff.preserved && replanned.replanDiff.preserved.length > 0, 'Identified preserved constraints (hotel, dinner)');
  assert(replanned.replanDiff.changed && replanned.replanDiff.changed.length > 0, 'Identified adapted schedules (arrival, check-in, morning tours)');
  assert(replanned.replanDiff.timelineComparison?.before !== undefined, 'Includes before timeline');
  assert(replanned.replanDiff.timelineComparison?.after !== undefined, 'Includes after timeline');

  const totalTime = Date.now() - startTime;
  console.log('\n======================================================');
  console.log(`📊 Benchmark Summary: ${passed} Passed, ${failed} Failed (${totalTime}ms)`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('[Test Suite Error]:', err);
  process.exit(1);
});
