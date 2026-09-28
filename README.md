# TravelOS AI 🚀

### Constraint-Aware Autonomous Travel Decision & Dynamic Replanning Engine
> *"TravelOS grounds travel decisions in live search data and combines AI orchestration with deterministic constraint validation, geospatial optimization, and dynamic replanning."*

Built for the **SerpApi India Hackathon 2026 — Track 03: Travel & Local Discovery**.

---

## 🧭 The Problem & Our Solution

Most travel tools produce flat lists of tourist attractions or use generic LLMs that guess locations and hallucinate hotel prices and flight schedules. 

A real trip is governed by **hard physical constraints**:
- Strict budget ceilings where exceeding by ₹1 requires compromise.
- Strict flight arrival times and airport transit buffers.
- Fixed geographical distances that dictate whether an itinerary causes exhausting city criss-crossing.
- Inevitable disruptions (flight delays, bad weather, price spikes).

**TravelOS AI** separates concerns cleanly:
1. **Live Grounded Data**: 100% of flights, room rates, attractions, images, and cultural events are fetched live via **SerpApi**.
2. **Deterministic Computation**: All arithmetic, budget ledgers, Haversine distances, nearest-neighbor sequencing, and time buffers are calculated by deterministic code (never left to LLM guesswork).
3. **AI Orchestration**: Google Gemini interprets natural language requests, extracts traveler intent, and generates structured decision rationales.
4. **Dynamic Replanning Engine**: When conditions change (e.g. a 3-hour flight delay), the system adapts schedules, shifts affected morning visits to the afternoon, and preserves confirmed hotel bookings and dinner reservations with a full **Before vs. After** diff.

---

## 🏗️ System Architecture

```
                      USER / TRAVELER
                            ↓
               REACT FRONTEND (Vite + Tailwind)
                            ↓
             EXPRESS REST API (Node.js • Port 5000)
                            ↓
                   TRAVEL ORCHESTRATOR
  ┌────────────────────────────────────────────────────────┐
  │                                                        │
  │  ├── AI SERVICE (Gemini API + Deterministic Fallback)  │
  │                                                        │
  │  ├── 100% LIVE SERPAPI SEARCH BACKBONE                │
  │  │   ├── Flights (engine: "google_flights")            │
  │  │   ├── Hotels (engine: "google_hotels")              │
  │  │   ├── Places & GPS (engine: "google_maps")          │
  │  │   ├── Inter-city Corridors (google_maps_directions) │
  │  │   ├── Visual Grounding (google_images)              │
  │  │   └── Local Events & Reviews (google organic)       │
  │                                                        │
  │  ├── CONSTRAINT ENGINE (Hard Bounds & Soft Trade-offs) │
  │  │   ├── Budget Ceiling Enforcement                    │
  │  │   ├── Transfer & Airport Time Buffers               │
  │  │   └── Smallest Required Relaxation Advice           │
  │                                                        │
  │  ├── GEOSPATIAL ENGINE                                 │
  │  │   ├── Haversine Distance Calculation                │
  │  │   └── Nearest-Neighbor Attraction Sequencing        │
  │                                                        │
  │  ├── BUDGET OPTIMIZATION ENGINE                        │
  │  │   └── Multi-Tier Rebalancing (Transit/Stay/Dining)  │
  │                                                        │
  │  └── DYNAMIC REPLANNING ENGINE (Hero Feature)          │
  │      ├── Delay Shock Parsing                           │
  │      ├── Timeline Recalibration                        │
  │      └── Structured Before vs. After Diff              │
  │                                                        │
  └────────────────────────────────────────────────────────┘
                            ↓
          SUPABASE (PostgreSQL + In-Memory Fallback)
```

---

## ⚡ SerpApi Heavy Lifting: Multi-Engine Integration

SerpApi is the sole data backbone of TravelOS AI. Every live entity in the system is retrieved through SerpApi endpoints:

| Engine | Key Parameters | Exact Role in TravelOS AI |
| :--- | :--- | :--- |
| **`google_flights`** | `departure_id`, `arrival_id`, `outbound_date`, `currency: "INR"` | Live ticket prices, carrier schedules (IndiGo, Air India), layovers, flight durations, carbon footprint, and direct booking links. |
| **`google_hotels`** | `q`, `check_in_date`, `check_out_date`, `adults`, `currency: "INR"` | Live room rates per night, verified guest ratings, review counts, and amenities matched against user budget constraints. |
| **`google_maps`** | `q`, `gl: "in"`, `hl: "en"` | Live destination points of interest with exact **GPS latitude & longitude coordinates**, ratings, and opening hours. |
| **`google_maps_directions`** | `start_addr`, `end_addr`, `travel_mode` | Inter-city transit routes, driving distances (meters), and duration (seconds). |
| **`google_images`** | `q`, `safe: "active"` | Authentic high-resolution destination photography without synthetic stock placeholders. |
| **`google` (Organic)** | `q: "events festivals in [city]"`, `gl: "in"` | Real-time cultural pop-ups, music gigs, weekend markets, and traveler sentiment intelligence. |

---

## 🎯 Core Technical Features

### 1. Hard vs. Soft Constraint Model
- **Hard Constraints (Non-Negotiable)**: Total budget ceiling, duration dates, airport arrival buffers, transit feasibility.
- **Soft Constraints (Trade-Offs)**: Hotel star rating, activity preferences, daily travel pacing.
- **Smallest Required Relaxation**: If an impossible budget is supplied, the engine calculates the exact minimum relaxation required (e.g. *"Your ₹20,000 budget requires ₹1,250 additional buffer to preserve your current preferences"*).

### 2. Multi-Tier Autonomous Budget Optimizer
- Calculates a transparent mathematical ledger: `Transport + Accommodation + Dining + Activities + 8% Buffer`.
- If a plan is over budget, one-click **Auto-Optimize** executes a structured rebalancing sequence:
  1. Switches to verified lower-cost stay tiers in live hotel search results.
  2. Rebalances transport modes (e.g. Superfast AC Express Sleeper vs peak flight fares).
  3. Calibrates dining and local transit to authentic regional culinary thalis and auto-rickshaws.
  4. Preserves free scenic viewpoints and cultural walks.

### 3. Haversine Geospatial Optimization & Physical Journey Modeling
- **Physical Journey Architecture**: Models the complete real-world transit chain: `Origin Residence → Departure Airport/Station → Flight/Train → Destination Airport/Station → Hotel Basecamp → Daily Activity Loops → Hotel Return → Departure Airport/Station → Home`.
- **Hotel as Geographic Anchor**: Every day starts and returns to the selected hotel basecamp. Every activity displays exact distance and travel time from the hotel, distance from the previous stop, and estimated visit duration.
- **Context-Aware Day-by-Day Route Map**: Includes day-by-day route selector `[ Day 1 ] [ Day 2 ] [ Day 3 ] [ Full Trip ]`, visual map legend, and click-to-focus waypoint interaction.
- **Honest Distance Labeling**: Transparently distinguishes between Live Road Routes, Estimated Road Distance (~1.3× network circuity factor), and Straight-line Geographic Distance (Haversine formula). Never mislabels straight-line distance as road distance.

### 4. Dynamic Replanning Engine & Impact Analysis (Hero Feature)
When an unexpected real-world disruption occurs (e.g. user types *"My flight is delayed by 3 hours"*):
- Parses the delay duration accurately (3 hours vs 4 hours).
- Pushes flight arrival, airport-to-hotel transfer, and check-in windows forward.
- Shifts affected morning sightseeing tours into open afternoon slots without canceling them.
- **Preserves** confirmed hotel bookings, budget ceilings, and evening dinner reservations.
- Recalculates affected road routes, driving durations, and day route summaries.
- Produces a structured **Impact Analysis Panel** & **Before vs. After Diff** in the UI.

### 5. "Why This Plan?" Explainability Inspector
Every flight, hotel, and route decision can be inspected with real data:
- **Why this flight?**: Price, departure window, arrival timing.
- **Why this hotel?**: Nightly rate, verified rating, proximity to planned daily activity clusters and airport.
- **Why this route?**: Haversine clustering, km saved vs unoptimized sequence, commute reduction.
- **Why these events?**: Live cultural pop-ups retrieved from SerpApi matching visit dates.

---

## 🎬 3-Minute Hackathon Demo Script

| Time | Stage | Action / Voiceover |
| :--- | :--- | :--- |
| **0:00 - 0:25** | **The Problem** | *"Travel planning is not just listing places. Real trips have hard constraints: budgets, flight timings, distances, and unexpected disruptions. LLM chat tools hallucinate rates, and static guides cause choice paralysis."* |
| **0:25 - 0:50** | **The Solution** | *"TravelOS AI grounds travel decisions in live SerpApi search data and combines AI orchestration with deterministic constraints and dynamic replanning."* |
| **0:50 - 1:20** | **Trip Architect** | Enter prompt: *"3 days in Goa from Ahmedabad under ₹20,000 for 2 people, prefer beaches and local food"*. Show extracted constraints. Click **Architect Journey**. Watch live parallel queries to Google Flights, Google Hotels, and Google Maps. |
| **1:20 - 1:45** | **Master Plan** | Review live Indigo flight fare, 4.5★ hotel card, and Haversine-clustered route map with commute corridors and distance savings. |
| **1:45 - 2:05** | **Budget Optimizer** | Point out the over-budget alert (₹37,169 > ₹20,000). Click **Auto-Optimize**. Watch the system rebalance stay and transport tiers to achieve ₹14,854 (saving ₹22,315). |
| **2:05 - 2:40** | **Hero Replanning** | In the AI Replanner, type: *"My flight is delayed by 3 hours"*. The system recalibrates Day 1: shifts arrival to 12:00 PM, reschedules morning tour to the afternoon, and preserves the hotel booking and sunset dinner with a clear **Before vs After Diff**. |
| **2:40 - 2:55** | **Explainability** | Open **"Why This Plan?" Inspector**. Inspect verified metrics for why the flight, hotel, route, and budget were selected. |
| **2:55 - 3:00** | **Conclusion** | *"TravelOS AI doesn't just generate text. It continuously makes, optimizes, and explains travel decisions under real-world constraints."* |

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Vanilla CSS + Tailwind CSS, Leaflet Maps, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Live Search Data** | **SerpApi** (`google_flights`, `google_hotels`, `google_maps`, `google_maps_directions`, `google_images`, `google`) |
| **AI Orchestration** | Google Gemini API (`@google/generative-ai`) with deterministic NLP fallback |
| **Geospatial & Math** | Haversine distance clustering, Nearest-Neighbor routing, deterministic budget ledger |
| **Database** | Supabase (PostgreSQL) with resilient in-memory Map cache |

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js 18+ installed
- SerpApi API Key ([serpapi.com](https://serpapi.com))

### 1. Clone the Repository
```bash
git clone https://github.com/HETVI-UNDHAD/SerpApi.git
cd SerpApi
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure `backend/.env`:
```env
PORT=5000
SERPAPI_KEY=your_serpapi_key_here
AI_API_KEY=your_gemini_api_key_here # Optional: deterministic fallback enabled if empty
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```
Start backend:
```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Vite application running at http://localhost:3000
```

---

## 🧪 Automated Testing & Benchmark Evaluation

TravelOS AI includes an automated test suite verifying constraint validation, budget optimization, delay replanning, and SerpApi normalization.

Run tests:
```bash
cd backend
npm test
```

Benchmark output:
```
======================================================
🧪 TravelOS AI — Automated Test Suite & Benchmark
======================================================
--- Suite 1: Natural Language Travel Requirement Parsing ---
  ✓ PASS: Extracts origin "Ahmedabad"
  ✓ PASS: Extracts destination "Goa"
  ✓ PASS: Extracts duration "3 days"
  ✓ PASS: Extracts budget "₹20,000"
  ✓ PASS: Extracts travelers "2 pax"
  ✓ PASS: Extracts interest "Beaches"
--- Suite 2: Constraint Engine Validation & Relaxation ---
  ✓ PASS: Hard budget ceiling configured
  ✓ PASS: Hard duration constraint configured
  ✓ PASS: Correctly flags over-budget plan as invalid
  ✓ PASS: Provides smallest required relaxation suggestion
  ✓ PASS: Calculates exact ₹4,500 relaxation required
  ✓ PASS: Validates feasible budget plan as valid
--- Suite 3: Geospatial Distance & Optimization Metrics ---
  ✓ PASS: Computes total route distance
  ✓ PASS: Computes estimated distance saved by clustering
  ✓ PASS: Computes efficiency gain percentage
--- Suite 4: End-to-End Trip Generation (Hackathon Benchmark) ---
  ✓ PASS: Generated unique trip ID
  ✓ PASS: Destination verified as Goa
  ✓ PASS: Itinerary generated with 3 days
  ✓ PASS: Geospatial metrics attached
  ✓ PASS: Constraint report attached
  ✓ PASS: Explainability engine output attached
  ✓ PASS: Live local events retrieved via SerpApi
--- Suite 5: Autonomous Budget Optimizer ---
  ✓ PASS: Budget optimizer reduced or maintained total cost
  ✓ PASS: Optimizer provided actionable explanation
--- Suite 6: Dynamic Replanning Engine (Flight Delay Shock) ---
  ✓ PASS: Generated structured replanDiff
  ✓ PASS: Accurately parsed 3-hour delay
  ✓ PASS: Identified preserved constraints (hotel, dinner)
  ✓ PASS: Identified adapted schedules (arrival, check-in, morning tours)
  ✓ PASS: Includes before timeline
  ✓ PASS: Includes after timeline
======================================================
📊 Benchmark Summary: 30 Passed, 0 Failed
======================================================
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Data Provider / Engine | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/trips/parse-prompt` | Gemini AI / Deterministic NLP | Converts natural language travel requests into structured constraints |
| `POST` | `/api/trips` | SerpApi (`google_flights`, `google_hotels`, `google_maps`, `google`) | Full end-to-end trip research, optimization & itinerary assembly |
| `POST` | `/api/trips/:id/optimize` | Deterministic Multi-Tier Engine | Rebalances transport & accommodation to fit hard budget ceilings |
| `POST` | `/api/trips/:id/what-if` | Dynamic Replanning Engine | Adapts schedule for delays, budget cuts, and pace changes with Before/After diff |
| `POST` | `/api/trips/:id/replan` | Dynamic Replanning Engine | Conversational replanning alias |
| `POST` | `/api/trips/:id/check-changes`| SerpApi live monitor | Verifies price fluctuations and flight schedules |
| `POST` | `/api/destinations/discover` | SerpApi (`google_maps`, `google`) | Compares candidate destinations by live cost & interest match |
| `GET` | `/api/images/search` | SerpApi (`google_images`) | Live photographic visual grounding for places and stays |
| `GET` | `/api/health` | System monitor | Checks SerpApi key & Supabase connectivity status |

---

## 🏆 Hackathon Evaluation Summary

- **SerpApi Depth**: Direct integration with **6 distinct SerpApi engines** (`google_flights`, `google_hotels`, `google_maps`, `google_maps_directions`, `google_images`, `google`).
- **Real Engineering Differentiation**:
  - Deterministic constraint validation (no hallucinated budgets).
  - True Haversine geospatial optimization with computed distance savings.
  - Hero dynamic replanning engine with structured Before vs After comparisons.
  - Explainable AI inspector exposing the exact data justifying each decision.
- **Reliability**: Resilient fallbacks ensuring the system remains responsive even under extreme network latency or missing AI keys.
- **Presentation-Ready**: 3-minute high-tempo demo story supported end-to-end.
