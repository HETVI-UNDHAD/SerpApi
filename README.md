# TravelOS AI

### Dynamic AI Travel Decision & Replanning Agent

> *"Don't just plan your trip. Let AI research, decide, optimize and replan it."*

Built for the **SerpApi India Hackathon 2026 — Track 03: Travel & Local Discovery**.

---

## What is TravelOS AI?

Traditional travel apps are either static itinerary templates or simple chatbot wrappers that hallucinate prices, hotels, and travel times.

**TravelOS AI** is an autonomous AI travel decision agent that:

1. **Researches Live Data** — Queries SerpApi engines (`google_flights`, `google_hotels`, `google_maps`, `google`) for real-time fares, availability, ratings, and GPS coordinates.
2. **Zero-Hallucination Guarantee** — All pricing, schedules, reviews, and travel distances are grounded in verified live search results.
3. **Route Optimization** — Clusters places geographically using Haversine formulas to eliminate criss-crossing and minimize daily transit times.
4. **Dynamic Budget Optimizer** — Compares flights, stays, food, activities, and local transit. Flags over-budget itineraries and generates cheaper alternatives.
5. **Interactive Route Maps** — Visualizes hotel bases, numbered stop waypoints, and color-coded routes on interactive maps.
6. **Continuous Replanning** — Adapts to flight delays, budget cuts, extra days, or pacing changes without discarding existing choices.
7. **Trip Monitor** — Re-verifies live SerpApi rates and notifies travelers of price drops or schedule changes.

---

## Product Flow

```
DISCOVER  →  SEARCH  →  COMPARE  →  OPTIMIZE  →  PLAN  →  MAP  →  REPLAN
```

---

## Demo Script (3 minutes)

1. **Landing Page** — Open `http://localhost:3000`. Review the product flow pipeline and demo presets (`Ahmedabad → Goa`, `Delhi → Kerala`, `Mumbai → Jaipur`, `Bangalore → Manali`).

2. **Trip Builder** — Click **Plan My Trip** or select a preset. Leave destination blank to trigger **AI Destination Discovery**, which compares live estimated costs and interest matches.

3. **Research Center** — Click **Generate My Trip**. Watch the live checklist execute real SerpApi queries across flights, hotels, places, reviews, and route clustering.

4. **Trip Dashboard** — Review the top bar: Total Estimated Cost, Budget Status, and Quick Action buttons.

5. **Smart Itinerary & Route Map** — Switch between Day 1, Day 2, Day 3. Each stop includes a selection rationale, transit time, and an interactive numbered map pin.

6. **Travel Intelligence** — Navigate to the **AI Reasoning & Reviews** tab. Review hotel and flight selection reasoning, verified review themes, and alternative stays evaluated by SerpApi.

7. **Budget Optimizer** — If the trip exceeds budget, click **Optimize for Budget** or inspect the itemized breakdown.

8. **What-If Simulator** — Go to **AI Replanner & What-If**. Click *"Make Day 2 relaxed"* or type *"My flight is delayed by 4 hours"*. The agent updates the timeline and route in real-time.

9. **Check for Changes** — Click **Check for Changes** in the header to re-query live SerpApi data and verify current fares.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Leaflet, Lucide Icons |
| Backend | Node.js, Express.js |
| Live Search | SerpApi (`google_flights`, `google_hotels`, `google_maps`, `google`) |
| AI Orchestration | Gemini API / OpenAI API with deterministic algorithmic fallback |
| Database | Supabase (PostgreSQL) with in-memory caching fallback |

---

## Project Structure

```
SerpApi/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── tripRoutes.js        # REST API endpoints
│   │   ├── services/
│   │   │   ├── serpapiService.js    # Live Google Flights, Hotels, Maps, Reviews
│   │   │   ├── aiAgentService.js    # Route clustering, budget optimizer, replanner
│   │   │   └── supabaseService.js   # Supabase client with in-memory cache
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InteractiveRouteMap.jsx
│   │   │   ├── SmartItineraryView.jsx
│   │   │   ├── TravelIntelligenceView.jsx
│   │   │   ├── AiAssistantReplanner.jsx
│   │   │   ├── CheckForChangesModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── TripContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── TripBuilderPage.jsx
│   │   │   ├── ResearchCenterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.local
│   └── package.json
└── README.md
```

---

## Environment Setup

**Backend** — Create `backend/.env`:

```env
PORT=5000
SERPAPI_KEY=your_serpapi_key_here
AI_PROVIDER=gemini
AI_API_KEY=your_ai_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

**Frontend** — Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=
```

---

## Running the Application

**Backend**

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:5000` — Health check: `http://localhost:5000/api/health`

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/trips` | Generate full route-aware trip |
| POST | `/api/destinations/discover` | AI Destination Discovery |
| POST | `/api/flights/search` | Google Flights query |
| POST | `/api/hotels/search` | Google Hotels query |
| POST | `/api/places/search` | Google Maps attractions with GPS |
| POST | `/api/reviews/search` | Traveler sentiment analysis |
| POST | `/api/trips/:id/optimize` | Budget optimization |
| POST | `/api/trips/:id/what-if` | What-If simulator |
| POST | `/api/trips/:id/replan` | Conversational replanner |
| POST | `/api/trips/:id/check-changes` | Live fare re-verification |

---

## Hackathon Submission Notes

- **SerpApi as Core Dependency** — All factual data (flights, hotel rates, places, GPS coordinates) is retrieved live via SerpApi and never hallucinated.
- **Dynamic for Any Input** — Works for any origin, destination, dates, budget, and travel preferences.
