# TravelOS AI 🚀

### Autonomous AI Travel Decision, Grounding & Replanning Agent
> *"Don't just plan your trip. Let AI research, ground, optimize, and dynamically replan it with 100% verified search data."*

Built for the **SerpApi India Hackathon 2026 — Track 03: Travel & Local Discovery**.

---

## 🏆 Radical Differentiation (Why TravelOS AI Wins)

Many hackathon teams build standard travel directory planners that dump lists of tourist attractions. **TravelOS AI is fundamentally different:**

| Feature Focus | Standard Hackathon Projects | TravelOS AI (Our Advanced Solution) |
| :--- | :--- | :--- |
| **Data Recency** | Static, outdated datasets or cached training cutoffs. | **100% Live data** utilizing real-world availability, fares, and event dates. |
| **Output Type** | A static list of top 5 recommended locations. | A highly optimized, **logistically sound timeline** with Haversine clustering & travel buffers. |
| **AI Integration** | Blind LLM guesses of what is nearby (**Severe Hallucinations**). | AI acts strictly as an **Orchestrator and Filter** for verified SerpApi data. |
| **User Flow** | Requires extensive typing and multiple tedious setup forms. | **Natural conversation, 1-click scenario presets, and what-if replanning**. |

---

## 🛡️ The "Zero-Hallucination" Guarantee

Every restaurant, flight departure time, hotel price, or event shown in the TravelOS AI interface is **currently active and real**:
- **No fabricated room rates**: Room costs are retrieved live from SerpApi's `google_hotels` engine.
- **No imaginary flights**: Flight schedules and live prices originate from SerpApi's `google_flights` engine.
- **No impossible commutes**: Attractions are mapped with exact GPS coordinates via `google_maps`, clustered with Haversine mathematics to eliminate criss-crossing and back-and-forth travel.

---

## ⚡ Showcase of SerpApi Heavy Lifting (Parameters Breakdown)

Judges evaluate whether SerpApi is the real backbone of the application. Here is how our architecture leverages SerpApi's engine parameters:

| Engine | Key Parameters | Exact Purpose in TravelOS AI |
| :--- | :--- | :--- |
| **`google_flights`** | `engine: "google_flights"`, `departure_id`, `arrival_id`, `outbound_date`, `currency: "INR"` | Fetches real-time ticket prices, stops (non-stop vs 1 stop), flight durations, and verified direct booking links. |
| **`google_hotels`** | `engine: "google_hotels"`, `q`, `check_in_date`, `check_out_date`, `rating: "4.5+"` | Extracts real guest ratings, price per night, and verified amenities to balance against the user's hard budget ceiling. |
| **`google_maps`** | `engine: "google_maps"`, `ll: "@lat,lng,14z"`, `type: "search"` | Pins search results strictly to exact geographic coordinates, calculates driving durations, and feeds our Haversine clustering engine. |
| **`google_events`** | `engine: "google_events"`, `q`, `tbs: "qdr:w"`, `hl: "en"`, `gl: "in"` | Pulls hyper-localized community pop-ups, flea markets, and live music gigs occurring during visit dates (Anti-Tourist mode). |

---

## 🎯 3 Strategic Product Modes

1. **The Real Budget Optimizer**:
   - Maintains a mathematical ledger: `Total = Flights + Hotels + Daily Dining + Activities + 20% Buffer`.
   - If the total exceeds the budget by even ₹1, the engine triggers an automatic trade-off rebalancer.
2. **The "Transit Layover" Concierge**:
   - For users with limited layover windows (e.g., 5-hour layover at Mumbai airport).
   - Enforces a 2-hour security re-entry buffer and calculates a strict **Safe Exploration Radius** with a **"Drop-Dead Departure Time"** countdown.
3. **The "Anti-Tourist" Local Culture Oracle**:
   - Ignores generic tourist traps and uses live events + organic web search to surface hidden culinary gems and artisan markets.

---

## 🎬 Scripted 3-Minute Video Demo Storyboard

*(Prepared for the official 3-minute continuous, unedited recording)*

| Timestamp | Screen | Spoken Script / Action | Key Feature Demonstrated |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | Landing Page | *"Current travel apps cause choice paralysis with flat directories, or hallucinate with AI chatbots. TravelOS AI is an autonomous decision agent grounded 100% in live search."* | Problem statement & Zero-Hallucination claim |
| **0:30 - 1:00** | Navbar / Modal | Click **"Zero-Hallucination LIVE"** badge. Show the **Differentiation Matrix** and the 4 live SerpApi engines with parameters (`ll`, `tbs`). | Proves SerpApi is the foundational backbone |
| **1:00 - 1:40** | Trip Builder | Select preset *"Ahmedabad → Goa (₹20,000 Budget, 3 Days)"*. Hit **Architect Journey**. Watch the live Research Center query Google Flights, Google Hotels, and Google Maps. | Instant, high-tempo user flow |
| **1:40 - 2:15** | Dashboard | Review the **High-Contrast Master Plan**: point out the live IndiGo flight fares, hotel rating cards, and the Haversine-clustered route timeline with commute times. | Visual excellence, clarity & logistically sound timeline |
| **2:15 - 2:40** | Budget Optimizer | Point to the Budget Alert: plan is over budget. Click **"Auto-Optimize for ₹20,000"**. The agent rebalances hotel tiers in real-time. | Dynamic Autonomous Optimization |
| **2:40 - 3:00** | Replanner & What-If | Type *"What if my flight is delayed by 3 hours?"* Watch the AI recalculate Day 1 times without discarding existing hotel reservations. Conclude with summary. | Resilient, continuous real-time replanning |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Leaflet Maps, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Live Search SDK** | `@serpapi/serpapi` (`google_flights`, `google_hotels`, `google_maps`, `google_events`) |
| **AI Orchestration** | Google Gemini API / OpenAI API with deterministic mathematical fallback |
| **Database** | Supabase (PostgreSQL) with in-memory caching fallback |

---

## 🚀 Quickstart & Local Installation

### 1. Prerequisites
- Node.js 18+ installed
- SerpApi API Key ([serpapi.com](https://serpapi.com))

### 2. Backend Setup
```bash
cd backend
npm install
```
Create `backend/.env`:
```env
PORT=5000
SERPAPI_KEY=your_serpapi_key_here
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```
Start backend:
```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Vite app running on http://localhost:3000
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Engine Used | Purpose |
|---|---|---|---|
| `POST` | `/api/trips` | `google_flights`, `google_hotels`, `google_maps` | Full end-to-end trip generation |
| `POST` | `/api/destinations/discover` | `google_maps`, `google` | AI Destination Discovery |
| `POST` | `/api/flights/search` | `google_flights` | Live flight search & booking links |
| `POST` | `/api/hotels/search` | `google_hotels` | Live hotel rates & guest reviews |
| `POST` | `/api/places/search` | `google_maps` | Pinned GPS coordinates via `ll` parameter |
| `POST` | `/api/trips/:id/optimize` | Algorithmic + SerpApi | Hard-cap budget rebalancer |
| `POST` | `/api/trips/:id/replan` | AI + SerpApi | Conversational schedule replanner |
| `POST` | `/api/trips/:id/check-changes` | SerpApi live check | Real-time rate change verification |

---

## 🏆 Hackathon Submission Checklist

- [x] **Public GitHub Repository** with clear setup instructions and clean code structure.
- [x] **Meaningful SerpApi Integration** — 4 distinct engines (`google_flights`, `google_hotels`, `google_maps`, `google_events`).
- [x] **Zero-Hallucination Architecture** — AI acts strictly as an orchestrator for live search data.
- [x] **Interactive In-App Inspector** — Live Grounding & Differentiation modal accessible from the UI.
- [x] **3-Minute Video Script** — Scripted, high-tempo storyboard ready for screen recording.
