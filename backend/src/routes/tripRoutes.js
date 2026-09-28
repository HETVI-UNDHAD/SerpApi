import express from 'express';
import {
  searchFlights,
  searchHotels,
  searchPlaces,
  searchReviews,
  searchEvents,
  discoverDestinations,
  searchImage
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

// 1. Initialize or Generate a Trip
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

export default router;
