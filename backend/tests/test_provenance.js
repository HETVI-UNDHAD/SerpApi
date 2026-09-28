import {
  PROVENANCE_SOURCES,
  PROVENANCE_STATUSES,
  createProvenance,
  withProvenance,
  attachFieldProvenance,
  calculateGroundingScore
} from '../src/models/provenance.js';

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
console.log('🧪 Provenance Model — Unit Tests');
console.log('======================================================\n');

// 1. Provenance Model Defaults & Normalization
const defaultProv = createProvenance();
assert(defaultProv.source === 'unavailable', 'Default source is "unavailable"');
assert(defaultProv.status === 'UNAVAILABLE', 'Default status is "UNAVAILABLE"');
assert(typeof defaultProv.retrievedAt === 'string', 'RetrievedAt is an ISO string');
assert(defaultProv.confidence === 0, 'Default confidence for UNAVAILABLE is 0');

// 2. Custom Valid Provenance
const liveProv = createProvenance({
  source: 'serpapi_google_flights',
  status: 'LIVE',
  confidence: 0.98,
  method: 'Direct Google Flights pricing'
});
assert(liveProv.source === 'serpapi_google_flights', 'Preserves valid source');
assert(liveProv.status === 'LIVE', 'Preserves LIVE status');
assert(liveProv.confidence === 0.98, 'Preserves numeric confidence');
assert(liveProv.method === 'Direct Google Flights pricing', 'Preserves method string');

// 3. Status and Source Safeguards
const invalidProv = createProvenance({ source: 'untrusted_scrape', status: 'MAGIC' });
assert(invalidProv.source === 'unavailable', 'Unknown source normalized to "unavailable"');
assert(invalidProv.status === 'UNAVAILABLE', 'Unknown status normalized to "UNAVAILABLE"');

// 4. Confidence Clamping
const highConf = createProvenance({ confidence: 1.5, status: 'LIVE' });
assert(highConf.confidence === 1.0, 'Confidence > 1 clamped to 1.0');
const lowConf = createProvenance({ confidence: -0.2, status: 'LIVE' });
assert(lowConf.confidence === 0.0, 'Confidence < 0 clamped to 0.0');

// 5. withProvenance Helper
const priceWrapper = withProvenance(4850, {
  source: 'serpapi_google_hotels',
  status: 'LIVE',
  confidence: 1.0
});
assert(priceWrapper.value === 4850, 'withProvenance holds value');
assert(priceWrapper.provenance.source === 'serpapi_google_hotels', 'withProvenance holds provenance');
assert(priceWrapper.status === 'LIVE', 'withProvenance getter exposes status');
assert(priceWrapper.source === 'serpapi_google_hotels', 'withProvenance getter exposes source');
assert(Number(priceWrapper) === 4850, 'withProvenance valueOf converts to number');

const nullWrapper = withProvenance(null, {
  source: 'unavailable',
  status: 'UNAVAILABLE'
});
assert(nullWrapper.value === null, 'withProvenance supports null values');
assert(nullWrapper.status === 'UNAVAILABLE', 'withProvenance reports UNAVAILABLE status for null');

// 6. Field Group Provenance Attachment
const hotel = {
  name: 'Seaside Resort',
  rating: 4.6,
  pricePerNight: 5200,
  gpsCoordinates: { latitude: 15.5, longitude: 73.8 }
};

attachFieldProvenance(hotel, 'price', hotel.pricePerNight, {
  source: 'serpapi_google_hotels',
  status: 'LIVE',
  confidence: 1.0
});
attachFieldProvenance(hotel, 'rating', hotel.rating, {
  source: 'serpapi_google_hotels',
  status: 'LIVE',
  confidence: 1.0
});
attachFieldProvenance(hotel, 'coordinates', hotel.gpsCoordinates, {
  source: 'serpapi_google_hotels',
  status: 'LIVE',
  confidence: 1.0
});
attachFieldProvenance(hotel, 'openingHours', null, {
  source: 'unavailable',
  status: 'UNAVAILABLE',
  confidence: 0.0
});

assert(hotel.provenance !== undefined, 'Target object received .provenance map');
assert(hotel.provenance.price?.status === 'LIVE', 'Price field provenance is LIVE');
assert(hotel.provenance.rating?.status === 'LIVE', 'Rating field provenance is LIVE');
assert(hotel.provenance.coordinates?.status === 'LIVE', 'Coordinates field provenance is LIVE');
assert(hotel.provenance.openingHours?.status === 'UNAVAILABLE', 'Opening hours provenance is UNAVAILABLE');

// 7. Grounding Score Calculation
const scoreMetrics = calculateGroundingScore([
  hotel.provenance.price,
  hotel.provenance.rating,
  { source: 'haversine_estimate', status: 'ESTIMATED', confidence: 0.75 },
  hotel.provenance.openingHours
]);

assert(scoreMetrics.total === 4, 'Total provenance records counted');
assert(scoreMetrics.liveCount === 2, '2 LIVE records counted');
assert(scoreMetrics.estimatedCount === 1, '1 ESTIMATED record counted');
assert(scoreMetrics.unavailableCount === 1, '1 UNAVAILABLE record counted');
assert(scoreMetrics.livePercent === 50, '50% live percentage');
assert(scoreMetrics.score === 68, 'Calculates weighted score ((200 + 70 + 0)/4 = 68)');

console.log('\n======================================================');
console.log(`📊 Provenance Test Summary: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
}
