import express from 'express';
import {
  searchFlights,
  searchHotels,
  searchPlaces,
  searchReviews,
  searchEvents,
  discoverDestinations,
  searchImage,
  verifyLocationQuery
} from '../services/serpapiService.js';
import {
  planTripWorkflow,
  optimizeTripForBudget,
  applyWhatIfSimulation,
  checkForLiveChanges
} from '../services/aiAgentService.js';
import { parseTravelPrompt } from '../services/llmService.js';
import { saveTrip, getTripById, listSavedTrips } from '../services/supabaseService.js';

const router = express.Router();

// Location Verification Endpoint (SerpApi + Indian Gazetteer)
router.post('/locations/verify', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }
    const result = await verifyLocationQuery(query);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[Error in /locations/verify]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 0. Natural Language Prompt Parser (AI + Deterministic Fallback)
router.post('/trips/parse-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required' });
    const parsed = await parseTravelPrompt(prompt);
    res.json({ success: true, parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1. Initialize or Generate a Trip (Standard HTTP)
router.post('/trips', async (req, res) => {
  try {
    const tripData = req.body;
    const plan = await planTripWorkflow(tripData);
    await saveTrip(plan);
    res.json({ success: true, trip: plan });
  } catch (err) {
    console.error('[Error in POST /api/trips]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 1b. Stream Trip Generation via Server-Sent Events (SSE) (P1-2)
router.post('/trips/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (res.flushHeaders) res.flushHeaders();

  const sendSSE = (eventType, payload) => {
    res.write(`event: ${eventType}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    const tripData = req.body;
    const plan = await planTripWorkflow(tripData, (stageEvent) => {
      sendSSE('stage', stageEvent);
    });
    await saveTrip(plan);
    sendSSE('complete', { success: true, trip: plan });
    res.end();
  } catch (err) {
    console.error('[Error in POST /api/trips/stream]:', err);
    sendSSE('error', { success: false, error: err.message });
    res.end();
  }
});

// 2. Destination Discovery
router.post('/destinations/discover', async (req, res) => {
  try {
    const { origin, budget, duration, interests } = req.body;
    const destinations = await discoverDestinations({ origin, budget, duration, interests });
    res.json({ success: true, destinations });
  } catch (err) {
    console.error('[Error in /destinations/discover]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// Legacy route alias for compatibility
router.post('/travel/destinations', async (req, res) => {
  try {
    const { origin, budget, days, interests } = req.body;
    const destinations = await discoverDestinations({ origin, budget, duration: days, interests });
    res.json({ success: true, destinations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Search Flights
router.post('/flights/search', async (req, res) => {
  try {
    const { origin, destination, outboundDate, returnDate, travelers, cabinClass } = req.body;
    const flights = await searchFlights({ origin, destination, outboundDate, returnDate, travelers, cabinClass });
    res.json({ success: true, flights });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Search Hotels
router.post('/hotels/search', async (req, res) => {
  try {
    const { destination, checkInDate, checkOutDate, adults, maxPrice, style } = req.body;
    const hotels = await searchHotels({ destination, checkInDate, checkOutDate, adults, maxPrice, style });
    res.json({ success: true, hotels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Search Places (with GPS coordinates)
router.post('/places/search', async (req, res) => {
  try {
    const { destination, interests, limit } = req.body;
    if (!destination || typeof destination !== 'string') {
      return res.status(400).json({ success: false, error: 'A destination is required.' });
    }
    const places = await searchPlaces({ destination, interests, limit, strict: true });
    if (!places.length) return res.status(502).json({ success: false, error: 'No live destination data found.' });
    res.json({ success: true, places });
  } catch (err) {
    console.error('[Error in /places/search]:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Search Reviews
router.post('/reviews/search', async (req, res) => {
  try {
    const { destination, subject } = req.body;
    const reviews = await searchReviews({ destination, subject });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Get Trip By ID
router.get('/trips/:id', async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.json({ success: true, trip });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. List Saved Trips
router.get('/trips', async (req, res) => {
  try {
    const trips = await listSavedTrips();
    res.json({ success: true, trips });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Plan / Re-generate Itinerary for existing trip
router.post('/trips/:id/plan', async (req, res) => {
  try {
    const existing = await getTripById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    const updated = await planTripWorkflow({ ...existing, ...req.body });
    await saveTrip(updated);
    res.json({ success: true, trip: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Optimize for Budget
router.post('/trips/:id/optimize', async (req, res) => {
  try {
    const existing = await getTripById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    const optimized = optimizeTripForBudget(existing);
    await saveTrip(optimized);
    res.json({ success: true, trip: optimized });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. What-If Simulation
router.post('/trips/:id/what-if', async (req, res) => {
  try {
    const existing = await getTripById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    const { simulationType, prompt } = req.body;
    const modified = await applyWhatIfSimulation(existing, simulationType, prompt);
    await saveTrip(modified);
    res.json({ success: true, trip: modified });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Dynamic Replanner
router.post('/trips/:id/replan', async (req, res) => {
  try {
    const existing = await getTripById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    const { message } = req.body;
    const replanned = await applyWhatIfSimulation(existing, 'custom_replan', message);
    await saveTrip(replanned);
    res.json({ success: true, trip: replanned });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Check for Live Changes (SerpApi Price/Schedule Monitor)
router.post('/trips/:id/check-changes', async (req, res) => {
  try {
    const existing = await getTripById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    const checkReport = await checkForLiveChanges(existing);
    res.json({ success: true, report: checkReport });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Dynamic Image Search via SerpApi Google Images
router.get('/images/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    const imageUrl = await searchImage(q);
    res.json({ success: true, imageUrl: imageUrl || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. Floating AI Assistant Chat — rule-based, no external API needed
const RESPONSES = [
  { match: /how.*(work|does it|travelos work)/i, reply: "TravelOS works in 3 steps:\n1. Enter your origin, destination, duration, budget & interests in Plan Your Trip.\n2. TravelOS queries live Google Flights, Hotels & Maps via SerpApi in real time.\n3. The AI orchestrates the results into a full itinerary with budget breakdown, route map, and day-by-day timeline — all grounded in live data, no hallucinations." },
  { match: /plan.*(trip|journey|travel)/i, reply: "Click \"Plan Your Trip\" in the navbar. Fill in:\n• Origin & Destination\n• Duration (days)\n• Budget (₹)\n• Travel style (Balanced / Relaxed / Adventure / Luxury / Budget)\n• Transport preference (Flight / Train / Self Car)\n• Interests (Beaches, Food, Culture, etc.)\n\nHit \"Architect Journey\" and TravelOS will research live data and build your plan." },
  { match: /explor|destination|where.*go|discover/i, reply: "The Explore Destinations page (home) lets you browse destinations. You can also type \"Help me choose a destination\" in the destination field of the trip builder — TravelOS will suggest options based on your budget and interests." },
  { match: /flight|fly|airline/i, reply: "TravelOS fetches live flight data via SerpApi's google_flights engine — real prices, airlines, durations, stops, and booking links. You can view all returned flights in the \"Flights & Transit\" tab of your Dashboard after planning a trip.\n\nFor current prices, use the live Flights tab — I don't want to guess at fares." },
  { match: /hotel|stay|accommodation|resort/i, reply: "TravelOS fetches live hotel data via SerpApi's google_hotels engine — real rates, guest ratings, amenities, and photos. View them in the \"Hotels & Stays\" tab of your Dashboard.\n\nFor current prices, use the live Hotels tab — rates change in real time." },
  { match: /map|route|direction|gps|navigation/i, reply: "TravelOS uses SerpApi's google_maps engine to find attractions with exact GPS coordinates. The Route Map tab shows an interactive Leaflet map with your day's stops. Each activity card also has a \"Live GPS Directions\" button that opens Google Maps navigation." },
  { match: /budget|cost|price|money|rupee|₹|optimize/i, reply: "The Budget Optimizer tab shows a full breakdown: flights, hotels, food, activities, local transit, and taxes. If your plan exceeds your budget, click \"Auto-Optimize\" — TravelOS will automatically rebalance hotel tiers, switch transport modes, and adjust dining to bring the total under your ceiling." },
  { match: /replan|what.if|delay|change|simulator/i, reply: "The \"AI Replanner & What-If\" tab lets you simulate scenarios like:\n• Flight delayed by X hours\n• Add an extra day\n• Make a day more relaxed\n• Add nightlife\n• Reduce budget\n\nType your scenario in plain English and TravelOS will rebuild the affected parts of your itinerary." },
  { match: /itinerary|schedule|day|timeline|activity/i, reply: "The Smart Itinerary tab shows a day-by-day travel journal. Each day has:\n• Geographically clustered stops (Haversine math)\n• Transit cards showing how to get between stops (walk/auto/cab)\n• Live GPS navigation links\n• Time slots, entry costs, and AI selection reasons" },
  { match: /zero.hallucin|hallucin|grounded|live data|serpapi/i, reply: "Zero-Hallucination means TravelOS never invents travel facts. Every flight price, hotel rate, and attraction comes directly from live SerpApi queries (Google Flights, Hotels, Maps). The AI acts as an orchestrator and filter — not a source of made-up data.\n\nClick the \"Zero-Hallucination Proof\" badge in the navbar to inspect the live queries." },
  { match: /showcase/i, reply: "The Showcase page presents the TravelOS design system and the main feature screens. Access it from the navbar." },
  { match: /what.*(can you do|you do|features|capabilities)/i, reply: "I can help you:\n• Understand how TravelOS works\n• Navigate to any feature (flights, hotels, itinerary, budget, map)\n• Explain the Zero-Hallucination architecture\n• Guide you through planning a trip\n• Explain the What-If replanner\n\nFor live travel data (prices, availability), use the relevant TravelOS feature — I won't guess at real-time information." },
  { match: /start|begin|how.*start/i, reply: "To get started: click \"Plan Your Trip\" in the navbar (or the \"Start Planning\" button). Enter your trip details and hit \"Architect Journey\". TravelOS will research live data and build your full plan in seconds." },
  { match: /dashboard|tab|overview/i, reply: "After planning, the Dashboard has 8 tabs:\n1. Overview — KPIs and journey outline\n2. Smart Itinerary — day-by-day route journal\n3. Route Map — interactive Leaflet map\n4. Flights & Transit — live flight cards\n5. Hotels & Stays — live hotel cards\n6. Budget Optimizer — cost breakdown\n7. AI Reasoning & Reviews — why each option was selected\n8. AI Replanner & What-If — scenario simulator" },
  { match: /supabase|save|saved|persist/i, reply: "TravelOS uses Supabase (PostgreSQL) to save your trip plans. Your generated trips are stored and can be retrieved by ID." },
  { match: /dark|light|theme/i, reply: "Use the theme toggle button in the navbar (sun/moon icon) to switch between dark and light mode." },
  { match: /hi|hello|hey|howdy/i, reply: "Hi there! 👋 I'm TravelOS AI. I can help you navigate the platform, understand its features, or guide you through planning a trip. What would you like to know?" },
  { match: /thank/i, reply: "You're welcome! Let me know if you need anything else. Happy travels! ✈️" },
];

function getRuleBasedReply(message) {
  const msg = message.trim();
  for (const { match, reply } of RESPONSES) {
    if (match.test(msg)) return reply;
  }
  return "I'm focused on helping with TravelOS and travel planning. Try asking about:\n• How TravelOS works\n• Planning a trip\n• Live flights or hotels\n• The budget optimizer\n• The What-If replanner\n• Zero-Hallucination architecture";
}

router.post('/assistant/chat', (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'message is required' });
    }
    const reply = getRuleBasedReply(message);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, reply: 'Something went wrong. Please try again.' });
  }
});

export default router;
