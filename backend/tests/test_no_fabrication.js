import {
  resolveTransitHub,
  calculateHaversineKm,
  calculateEstimatedRoadKm,
  estimateDriveMinutes,
  buildOriginTransfer,
  buildDestinationArrivalTransfer,
  buildReturnDepartureTransfer
} from '../src/services/routeIntelligenceService.js';
import { searchHotels, searchPlaces, searchReviews } from '../src/services/serpapiService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('🧪 Anti-Fabrication & Grounding Tests (P0-2)');
console.log('======================================================\n');

// 1. Unknown Transit Hubs must NEVER return fake 20.0/75.0 or 20.1/75.1 coordinates
console.log('--- 1. Transit Hub Coordinates Integrity ---');
const unknownAirportHub = resolveTransitHub('AtlantisCity', 'flight');
assert(unknownAirportHub.gpsCoordinates === null, 'Unknown airport returns null coordinates (not 20.1/75.1)');
assert(unknownAirportHub.provenance?.status === 'UNAVAILABLE', 'Unknown airport provenance is UNAVAILABLE');

const unknownStationHub = resolveTransitHub('AtlantisCity', 'train');
assert(unknownStationHub.gpsCoordinates === null, 'Unknown station returns null coordinates (not 20.0/75.0)');
assert(unknownStationHub.provenance?.status === 'UNAVAILABLE', 'Unknown station provenance is UNAVAILABLE');

// 2. Haversine & Road Distance with null coordinates must NOT fabricate 5.0 km
console.log('\n--- 2. Geodesic Distance Null Handling ---');
assert(calculateHaversineKm(null, null, 15.5, 73.8) === null, 'Haversine returns null when origin is missing');
assert(calculateHaversineKm(15.5, 73.8, null, null) === null, 'Haversine returns null when destination is missing');
assert(calculateEstimatedRoadKm(null, null, 15.5, 73.8) === null, 'Estimated road km returns null for missing coords');
assert(estimateDriveMinutes(null) === null, 'Drive minutes returns null for null distance');

// 3. Transfer Legs with Unknown Hubs must exclude leg from totals and warn
console.log('\n--- 3. Physical Transfer Legs Integrity ---');
const originTransfer = buildOriginTransfer({ origin: 'AtlantisCity', transportMode: 'flight' });
assert(originTransfer.roadDistanceKm === null, 'Origin transfer roadDistanceKm is null when hub coords unavailable');
assert(originTransfer.estimatedDriveMinutes === null, 'Origin transfer driveMinutes is null');
assert(originTransfer.excludedFromTotals === true, 'Leg is flagged as excludedFromTotals');
assert(typeof originTransfer.warning === 'string' && originTransfer.warning.length > 0, 'Includes visible warning message');
assert(originTransfer.provenance.status === 'UNAVAILABLE', 'Leg provenance status is UNAVAILABLE');

const destTransfer = buildDestinationArrivalTransfer({
  destination: 'AtlantisCity',
  hotel: { gpsCoordinates: null },
  transportMode: 'flight'
});
assert(destTransfer.roadDistanceKm === null, 'Destination arrival transfer roadDistanceKm is null when coords missing');
assert(destTransfer.excludedFromTotals === true, 'Destination transfer flagged as excludedFromTotals');
assert(destTransfer.provenance.status === 'UNAVAILABLE', 'Destination transfer provenance is UNAVAILABLE');

// 4. Review Intelligence: No hardcoded 92% satisfaction or fabricated themes
console.log('\n--- 4. Review Intelligence Honesty ---');
const emptyReviews = await searchReviews({ destination: 'NonExistentPlaceXYZ999', subject: 'XYZ999' });
assert(emptyReviews.overallSentiment === null || emptyReviews.status === 'LIVE' || emptyReviews.status === 'UNAVAILABLE', 'Reviews return honest status');
if (emptyReviews.status === 'UNAVAILABLE') {
  assert(emptyReviews.provenance.status === 'UNAVAILABLE', 'Provenance is UNAVAILABLE when no snippets');
  assert(!String(emptyReviews.overallSentiment).includes('92% satisfaction'), 'Never returns fabricated "92% satisfaction"');
  assert(emptyReviews.positiveThemes.length === 0, 'No fabricated positive themes');
  assert(emptyReviews.potentialConcerns.length === 0, 'No fabricated concerns');
} else {
  assert(!String(emptyReviews.overallSentiment).includes('92% satisfaction'), 'Never returns fabricated "92% satisfaction"');
  assert(emptyReviews.basedOnText.includes('Based on'), 'Includes transparent "Based on N snippets" label');
  assert(Array.isArray(emptyReviews.sources), 'Includes real source citations');
}

console.log('\n======================================================');
console.log(`📊 Anti-Fabrication Summary: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
}
