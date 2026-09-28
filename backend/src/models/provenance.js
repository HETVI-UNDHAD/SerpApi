/**
 * Shared Data Provenance Model for TravelOS AI
 *
 * Defines the provenance schema for live grounding credibility:
 * {
 *   source: "serpapi_google_flights" | "serpapi_google_hotels" | "serpapi_google_maps"
 *         | "serpapi_google_search" | "serpapi_maps_directions" | "haversine_estimate"
 *         | "llm_inferred" | "curated_static" | "unavailable",
 *   status: "LIVE" | "ESTIMATED" | "INFERRED" | "FALLBACK" | "UNAVAILABLE",
 *   retrievedAt: ISO timestamp,
 *   method?: string,
 *   confidence: 0..1
 * }
 */

export const PROVENANCE_SOURCES = Object.freeze([
  'serpapi_google_flights',
  'serpapi_google_hotels',
  'serpapi_google_maps',
  'serpapi_google_search',
  'serpapi_maps_directions',
  'haversine_estimate',
  'llm_inferred',
  'curated_static',
  'unavailable'
]);

export const PROVENANCE_STATUSES = Object.freeze([
  'LIVE',
  'ESTIMATED',
  'INFERRED',
  'FALLBACK',
  'UNAVAILABLE'
]);

/**
 * Validates and constructs a standard Provenance object.
 */
export function createProvenance({
  source = 'unavailable',
  status = 'UNAVAILABLE',
  retrievedAt = new Date().toISOString(),
  method = undefined,
  confidence = 0
} = {}) {
  const normalizedSource = PROVENANCE_SOURCES.includes(source) ? source : 'unavailable';
  const normalizedStatus = PROVENANCE_STATUSES.includes(status) ? status : 'UNAVAILABLE';
  const parsedConfidence = typeof confidence === 'number' && Number.isFinite(confidence)
    ? Math.max(0, Math.min(1, Math.round(confidence * 100) / 100))
    : (normalizedStatus === 'LIVE' ? 1.0 : normalizedStatus === 'ESTIMATED' ? 0.75 : normalizedStatus === 'INFERRED' ? 0.6 : normalizedStatus === 'FALLBACK' ? 0.4 : 0);

  const prov = {
    source: normalizedSource,
    status: normalizedStatus,
    retrievedAt: typeof retrievedAt === 'string' ? retrievedAt : new Date().toISOString(),
    confidence: parsedConfidence
  };

  if (method && typeof method === 'string') {
    prov.method = method;
  }

  return prov;
}

/**
 * Attaches provenance to a specific value.
 * Returns an object with `value` and `provenance`, along with convenience accessors.
 */
export function withProvenance(value, meta = {}) {
  const provenance = createProvenance(meta);

  return {
    value,
    provenance,
    // Convenience property getters
    get status() { return provenance.status; },
    get source() { return provenance.source; },
    get confidence() { return provenance.confidence; },
    get method() { return provenance.method; },
    get retrievedAt() { return provenance.retrievedAt; },
    valueOf() { return value; },
    toString() { return value != null ? String(value) : ''; }
  };
}

/**
 * Helper to attach field-level provenance to an existing object
 * @param {Object} target - The object receiving provenance (e.g., hotel, place, leg)
 * @param {string} fieldGroup - Field group name ('price', 'rating', 'coordinates', 'distance', 'openingHours', 'reviews', 'duration')
 * @param {*} value - The raw value (can be null)
 * @param {Object} meta - Provenance metadata (source, status, method, confidence, retrievedAt)
 */
export function attachFieldProvenance(target, fieldGroup, value, meta = {}) {
  if (!target || typeof target !== 'object') return target;
  if (!target.provenance) {
    target.provenance = {};
  }
  const wrapped = withProvenance(value, meta);
  target.provenance[fieldGroup] = wrapped.provenance;
  return wrapped;
}

/**
 * Helper to calculate grounding statistics across a collection of provenance records.
 * Returns counts of statuses, percentages, and overall Grounding Score (0-100).
 */
export function calculateGroundingScore(provenanceList = []) {
  if (!Array.isArray(provenanceList) || provenanceList.length === 0) {
    return {
      total: 0,
      liveCount: 0,
      estimatedCount: 0,
      inferredCount: 0,
      fallbackCount: 0,
      unavailableCount: 0,
      livePercent: 0,
      estimatedPercent: 0,
      fallbackPercent: 0,
      unavailablePercent: 0,
      score: 0
    };
  }

  let liveCount = 0;
  let estimatedCount = 0;
  let inferredCount = 0;
  let fallbackCount = 0;
  let unavailableCount = 0;

  for (const item of provenanceList) {
    const prov = item?.provenance || (item?.source && item?.status ? item : null);
    const status = prov?.status || 'UNAVAILABLE';
    if (status === 'LIVE') liveCount++;
    else if (status === 'ESTIMATED') estimatedCount++;
    else if (status === 'INFERRED') inferredCount++;
    else if (status === 'FALLBACK') fallbackCount++;
    else unavailableCount++;
  }

  const total = provenanceList.length;
  // Weighted score: LIVE = 100%, ESTIMATED = 70%, INFERRED = 50%, FALLBACK = 30%, UNAVAILABLE = 0%
  const weightedSum = (liveCount * 100) + (estimatedCount * 70) + (inferredCount * 50) + (fallbackCount * 30);
  const score = Math.round(weightedSum / total);

  return {
    total,
    liveCount,
    estimatedCount,
    inferredCount,
    fallbackCount,
    unavailableCount,
    livePercent: Math.round((liveCount / total) * 100),
    estimatedPercent: Math.round((estimatedCount / total) * 100),
    inferredPercent: Math.round((inferredCount / total) * 100),
    fallbackPercent: Math.round((fallbackCount / total) * 100),
    unavailablePercent: Math.round((unavailableCount / total) * 100),
    score: Math.max(0, Math.min(100, score))
  };
}
