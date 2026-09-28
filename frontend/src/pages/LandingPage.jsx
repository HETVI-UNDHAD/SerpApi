import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  Sparkles, ArrowRight, MapPin, Calendar, IndianRupee,
  Plane, Building, Route, RefreshCw, Brain, ShieldCheck,
  Star, ChevronRight, Compass, CheckCircle2, Loader2,
  Car, Mountain, Palmtree, Landmark, UtensilsCrossed,
  Zap, Clock, Heart, Search, Navigation
} from 'lucide-react';
import SerpApiGroundingModal from '../components/SerpApiGroundingModal';

const destinationResearchCache = new Map();
const PLACE_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80';

function DestinationPlaceImage({ imageUrl, alt }) {
  const normalizeImageUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    const url = value.trim().startsWith('//') ? `https:${value.trim()}` : value.trim();
    return /^https?:\/\//i.test(url) ? url : '';
  };
  const liveUrl = normalizeImageUrl(imageUrl);
  const [src, setSrc] = useState(liveUrl || PLACE_IMAGE_FALLBACK);

  useEffect(() => setSrc(liveUrl || PLACE_IMAGE_FALLBACK), [liveUrl]);

  if (!src) {
    return <div role="img" aria-label={alt} className="w-full h-48 bg-slate-200 dark:bg-slate-800" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setSrc(current => current === PLACE_IMAGE_FALLBACK ? '' : PLACE_IMAGE_FALLBACK)}
    />
  );
}

// Cinematic high-resolution vistas in the style of VisitTheUSA
const HERO_DESTINATIONS = [
  {
    name: 'Goa',
    country: 'India',
    tag: 'Coastal Escapes & Golden Beaches',
    headline: 'Endless Horizons & Golden Coastlines',
    quote: 'Turquoise ocean water, sun-drenched beaches and historic Portuguese coastal heritage.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Kerala',
    country: 'India',
    tag: 'Tropical Waterways & Mist-Covered Hills',
    headline: 'Serene Waters & Verdant Valleys',
    quote: 'Traditional houseboats drifting through emerald lagoons, spice plantations and quiet mornings.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Jaipur',
    country: 'Rajasthan',
    tag: 'Royal Fortresses & Historic Grandeur',
    headline: 'Timeless Palaces & Royal Roads',
    quote: 'Amber Fort ramparts, Hawa Mahal architecture and vibrant artisan bazaars.',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Manali',
    country: 'Himalayas',
    tag: 'Alpine Peaks & Scenic Mountain Passes',
    headline: 'Majestic Peaks & Alpine Passes',
    quote: 'Snow-capped mountain panoramas, fragrant pine trails and rushing glacial rivers.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'California',
    country: 'USA',
    tag: 'Iconic Pacific Coast & Redwoods',
    headline: 'The Great Pacific Highway',
    quote: 'Sweeping ocean cliffs along Big Sur, legendary coastal drives and golden sunsets.',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=90'
  }
];

// VisitTheUSA Signature Travel Experiences
const EXPERIENCES = [
  { id: 'road-trips', name: 'Scenic Road Trips', icon: Car, count: '14 Routes', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=80' },
  { id: 'beaches', name: 'Coastal & Beaches', icon: Palmtree, count: '28 Shores', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80' },
  { id: 'nature', name: 'National Parks & Nature', icon: Mountain, count: '19 Reserves', img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=500&auto=format&fit=crop&q=80' },
  { id: 'culture', name: 'Heritage & Culture', icon: Landmark, count: '35 Monuments', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&auto=format&fit=crop&q=80' },
  { id: 'food', name: 'Food & Culinary Trails', icon: UtensilsCrossed, count: '42 Markets', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80' }
];

// Featured Road Trips in the style of VisitTheUSA's Road Trips portal
const FEATURED_ROAD_TRIPS = [
  {
    id: 'rt-goa',
    title: 'The Pacific Coastline & Konkan Route',
    destination: 'Goa',
    origin: 'Ahmedabad',
    days: 3,
    distance: '140 km',
    budget: 20000,
    travelers: 2,
    badge: 'Coastal Scenic Drive',
    rating: 4.92,
    reviews: '1,420',
    waypoints: ['Ahmedabad', 'Mumbai Transit', 'Ratnagiri Shore', 'Panaji Old Goa'],
    highlights: 'Baga beach shacks, Chapora Fort sunset, Portuguese Latin Quarter, spice farms.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=90',
    tags: ['Beaches', 'Nightlife', 'Food']
  },
  {
    id: 'rt-jaipur',
    title: 'The Royal Highway & Golden Forts',
    destination: 'Jaipur',
    origin: 'Delhi',
    days: 4,
    distance: '280 km',
    budget: 24000,
    travelers: 2,
    badge: 'Royal Heritage Trail',
    rating: 4.88,
    reviews: '980',
    waypoints: ['Delhi NCR', 'Neemrana Fort', 'Amber Fort Courtyard', 'City Palace Jaipur'],
    highlights: 'Hawa Mahal sunrise photography, Jal Mahal lakeside views, Johari Bazaar gems.',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&auto=format&fit=crop&q=90',
    tags: ['Culture', 'History', 'Shopping']
  },
  {
    id: 'rt-kerala',
    title: 'Emerald Lagoons & Mountain Spice Highway',
    destination: 'Kerala',
    origin: 'Bangalore',
    days: 5,
    distance: '190 km',
    budget: 32000,
    travelers: 2,
    badge: 'Tropical Waterways',
    rating: 4.95,
    reviews: '2,110',
    waypoints: ['Kochi Fort', 'Alleppey Backwaters', 'Kumarakom Bird Sanctuary', 'Munnar Hills'],
    highlights: 'Private houseboat cruise, Kathakali dance rituals, organic cardamom plantations.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop&q=90',
    tags: ['Nature', 'Relaxation', 'Food']
  },
  {
    id: 'rt-manali',
    title: 'High Alpine Passes & Pine Valley Drive',
    destination: 'Manali',
    origin: 'Delhi',
    days: 6,
    distance: '320 km',
    budget: 38000,
    travelers: 2,
    badge: 'Alpine Mountain Trail',
    rating: 4.91,
    reviews: '1,840',
    waypoints: ['Chandigarh Bypass', 'Mandi Valley', 'Kullu Riverbanks', 'Solang Snow Pass'],
    highlights: 'Atal Tunnel engineering, Jogini waterfall hike, paragliding over Solang, Old Manali cafés.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop&q=90',
    tags: ['Adventure', 'Nature', 'Photography']
  }
];

export default function LandingPage() {
  const { formData, setFormData, generateTrip, setActiveScreen, theme } = useTrip();
  const isDark = theme === 'dark';
  const [heroIdx, setHeroIdx] = useState(0);
  const [mapsReady, setMapsReady] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(20000);
  const [journey, setJourney] = useState(null);
  const [journeyPlaces, setJourneyPlaces] = useState([]);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [groundingOpen, setGroundingOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_DESTINATIONS.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(() => {});
  }, []);

  function handleQuickSearch(e) {
    e.preventDefault();
    const data = {
      origin: from || 'Ahmedabad',
      destination: to || 'Goa',
      originCoords: null,
      destinationCoords: null,
      duration: days,
      travelers: 2,
      budget,
      dates: { outbound: '', return: '' },
      interests: ['Scenic Drives', 'Food', 'Culture'],
      travelStyle: 'Balanced',
      transportPreference: formData.transportPreference || 'Flight',
      accommodationPreference: 'Hotel'
    };
    setFormData(data);
    generateTrip(data);
  }

  function handlePreset(p) {
    setJourney(p);
    setJourneyPlaces([]);
    setJourneyError(false);
    const cached = destinationResearchCache.get(p.destination);
    if (cached) {
      setJourneyPlaces(cached);
      setJourneyLoading(false);
      return;
    }
    loadJourneyPlaces(p.destination);
  }

  async function loadJourneyPlaces(destination) {
    setJourneyLoading(true);
    setJourneyError(false);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/places/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, interests: [], limit: 12 })
      });
      if (!response.ok) throw new Error('Destination research failed');
      const data = await response.json();
      if (!data.success || !Array.isArray(data.places) || !data.places.length) throw new Error('No live places found');
      destinationResearchCache.set(destination, data.places);
      setJourneyPlaces(data.places);
    } catch {
      setJourneyError(true);
    } finally {
      setJourneyLoading(false);
    }
  }

  function planSelectedJourney() {
    if (!journey) return;
    const data = {
      origin: journey.origin,
      destination: journey.destination,
      originCoords: null,
      destinationCoords: null,
      duration: journey.days,
      travelers: journey.travelers,
      budget: journey.budget,
      dates: { outbound: '', return: '' },
      interests: journey.tags,
      travelStyle: 'Balanced',
      transportPreference: formData.transportPreference || 'Flight',
      accommodationPreference: 'Hotel'
    };
    setFormData(data);
    generateTrip(data);
  }

  const hero = HERO_DESTINATIONS[heroIdx];

  // If viewing a detailed destination guide
  if (journey) {
    return (
      <section className={`min-h-screen px-4 py-10 sm:px-6 max-w-7xl mx-auto ${isDark ? 'text-white' : 'text-[#0C2340]'}`}>
        <button
          onClick={() => { setJourney(null); setJourneyError(false); }}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to All Journeys
        </button>

        {/* Hero banner for selected destination */}
        <div className="relative h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
          <img src={journey.img} alt={journey.destination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/90 via-[#0C2340]/30 to-transparent" />
          <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 text-white max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow">
              {journey.badge}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-3 leading-tight">
              {journey.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed font-sans">
              {journey.highlights}
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="font-serif text-2xl font-bold">Stops & Key Attractions in {journey.destination}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Live ratings, hours, and addresses verified via SerpApi Google Maps.
            </p>
          </div>
          <button
            onClick={planSelectedJourney}
            className="px-8 py-3.5 rounded-full bg-[#D92638] hover:bg-[#B91C2C] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/25 transition-transform hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Grounded Itinerary</span>
          </button>
        </div>

        {/* Places grid */}
        {journeyLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="font-bold text-sm text-slate-600 dark:text-slate-300">
              Querying live Google Places for {journey.destination}...
            </p>
          </div>
        ) : journeyError ? (
          <div className="py-16 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-sm mb-4">Unable to retrieve live destination places right now.</p>
            <button onClick={() => loadJourneyPlaces(journey.destination)} className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold">
              Retry Search
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pb-20">
            {journeyPlaces.map(place => (
              <article
                key={place.id}
                className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <DestinationPlaceImage imageUrl={place.thumbnail} alt={place.title} />
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base leading-snug">{place.title}</h3>
                    {place.rating != null && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        ★ {place.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {place.description}
                  </p>
                  {place.address && (
                    <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                      <span className="truncate">{place.address}</span>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-[#070B14] text-white' : 'bg-[#FFFFFF] text-[#0C2340]'}`}>

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION — VISIT THE USA EDITORIAL CINEMA
         ══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-between overflow-hidden">
        {/* Full-bleed background crossfade images */}
        <div className="absolute inset-0 z-0">
          {HERO_DESTINATIONS.map((d, i) => (
            <div
              key={d.name}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === heroIdx ? 1 : 0 }}
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-full object-cover scale-100 transition-transform duration-[7000ms] ease-out"
                style={{ transform: i === heroIdx ? 'scale(1.05)' : 'scale(1.0)' }}
              />
            </div>
          ))}
          {/* Editorial dark gradient overlay so text remains razor-sharp */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C2340]/60 via-[#0C2340]/30 to-[#0C2340]/85" />
        </div>

        {/* Top Destination Pill & Navigation Dots */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">{hero.name}, {hero.country}</span>
            <span className="text-white/40">•</span>
            <span className="text-amber-200 text-[11px] font-bold">{hero.tag}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {HERO_DESTINATIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === heroIdx ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Editorial Headline */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 py-12 flex flex-col items-center justify-center">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/90 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-5">
            TRAVELOS AI • PLAN. OPTIMIZE. REPLAN.
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-md">
            Physical Journeys.<br />
            <span className="italic font-serif font-normal text-amber-200">Autonomous Decisions.</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
            AI travel decisions grounded in live Flights, Hotels, Maps &amp; Events.
            Live data • Budget constraints • Route optimization • Dynamic replanning.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveScreen('builder')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              BUILD MY JOURNEY
            </button>
            <button
              onClick={() => {
                const howItWorks = document.querySelector('section:nth-of-type(2)');
                howItWorks?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              SEE HOW IT WORKS
            </button>
          </div>
        </div>

        {/* ── FLOATING SEARCH & PLANNER CONSOLE (VisitTheUSA signature bar) ── */}
        <div className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 -mb-12">
          <form
            onSubmit={handleQuickSearch}
            className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(12,35,64,0.3)] transition-all"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              {/* Origin */}
              <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Starting Point
                </label>
                {mapsReady ? (
                  <LocationAutocomplete
                    value={from}
                    onChange={v => setFrom(v)}
                    placeholder="Origin (e.g. Ahmedabad)"
                    icon={MapPin}
                    iconColor="text-slate-400"
                  />
                ) : (
                  <input
                    type="text"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    placeholder="Origin (e.g. Ahmedabad)"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                )}
              </div>

              {/* Destination */}
              <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">
                  Destination
                </label>
                {mapsReady ? (
                  <LocationAutocomplete
                    value={to}
                    onChange={v => setTo(v)}
                    placeholder="Where to? (e.g. Goa)"
                    icon={MapPin}
                    iconColor="text-blue-600"
                  />
                ) : (
                  <input
                    type="text"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    placeholder="Where to? (e.g. Goa)"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                )}
              </div>

              {/* Days */}
              <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Duration (Days)
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={e => setDays(+e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <label className="block text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                  Target Budget
                </label>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <input
                    type="number"
                    step="1000"
                    min="5000"
                    value={budget}
                    onChange={e => setBudget(+e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl sm:rounded-full bg-[#D92638] hover:bg-[#B91C2C] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform hover:scale-[1.02]"
              >
                <Search className="w-4 h-4" />
                <span>Search & Plan</span>
              </button>
            </div>

            {/* Quick helper line */}
            <div className="flex items-center justify-between pt-3 px-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Live Grounded on Google Flights, Google Hotels & Google Maps</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveScreen('builder')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Advanced Preferences ➔
              </button>
            </div>
          </form>
        </div>

        <div className="h-10" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BROWSE BY EXPERIENCE (VisitTheUSA circular category selector)
         ══════════════════════════════════════════════════════════════════ */}
      <section className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            Curated Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 tracking-tight">
            What Kind of Journey Inspires You?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Select an experience to explore handpicked routes grounded with live travel options.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {EXPERIENCES.map(exp => {
            const Icon = exp.icon;
            return (
              <div
                key={exp.id}
                onClick={() => {
                  setTo(exp.id === 'beaches' ? 'Goa' : exp.id === 'nature' ? 'Kerala' : exp.id === 'culture' ? 'Jaipur' : 'Manali');
                  const targetCard = FEATURED_ROAD_TRIPS[0];
                  handlePreset(targetCard);
                }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="h-44 w-full relative">
                  <img
                    src={exp.img}
                    alt={exp.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C2340]/90 via-[#0C2340]/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-sm leading-tight">{exp.name}</h3>
                    <p className="text-[10px] text-white/70 mt-0.5">{exp.count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURED ROAD TRIPS & SCENIC ITINERARIES (VisitTheUSA Star!)
         ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 dark:bg-[#0A101D] border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D92638] px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                Iconic Road Trips
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mt-3">
                Featured Drives & Multi-Day Itineraries
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                Explore legendary routes with real-time waypoint distances, turn-by-turn guidance, and live IRCTC/Flight alternatives.
              </p>
            </div>

            <button
              onClick={() => setActiveScreen('builder')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <span>Build Custom Route</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Road Trips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_ROAD_TRIPS.map(trip => (
              <div
                key={trip.id}
                onClick={() => handlePreset(trip)}
                className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* 16:9 Image container with badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={trip.img}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top tags */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                    {trip.badge}
                  </div>

                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-xs font-black shadow">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{trip.rating}</span>
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-0.5">
                      {trip.days} DAYS • {trip.distance}
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-snug text-white group-hover:text-amber-200 transition-colors">
                      {trip.title}
                    </h3>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Waypoints sequence ribbon */}
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
                      <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{trip.waypoints.join(' ➔ ')}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                      {trip.highlights}
                    </p>
                  </div>

                  {/* Footer with budget & CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] block text-slate-400 font-semibold uppercase">Est. Budget</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{trip.budget.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      className="px-4 py-2 rounded-full bg-[#0C2340] dark:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 group-hover:bg-[#D92638] transition-colors shadow"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          ZERO-HALLUCINATION OFFICIAL GROUNDING (VisitTheUSA Authority)
         ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0C2340] to-[#123157] text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Verification Standard</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
              Real Search Data. Real Prices.<br />
              <span className="text-amber-200">Zero AI Hallucination.</span>
            </h2>

            <p className="mt-4 text-base text-white/80 leading-relaxed font-sans">
              Unlike generic AI tools that invent flight numbers, closed hotels, and made-up ticket prices, TravelOS verifies every single option through live SerpApi engines connecting directly to Google Flights, Google Hotels, and Google Maps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/15">
              <div>
                <div className="text-2xl font-bold text-amber-200 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-400" />
                  <span>Google Flights</span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Live airline ticket pricing, real seat availability, and IRCTC superfast train backups.
                </p>
              </div>

              <div>
                <div className="text-2xl font-bold text-amber-200 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-400" />
                  <span>Google Hotels</span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Live nightly room rates, verified guest reviews, location rankings, and direct bookings.
                </p>
              </div>

              <div>
                <div className="text-2xl font-bold text-amber-200 flex items-center gap-2">
                  <Route className="w-5 h-5 text-emerald-400" />
                  <span>Google Maps</span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  Exact GPS coordinates, Haversine clustering to stop backtracking, and turn-by-turn routes.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => setGroundingOpen(true)}
                className="px-6 py-3 rounded-full bg-white text-[#0C2340] font-black text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Inspect Live SerpApi Verification Proof</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          OFFICIAL TRAVEL PORTAL FOOTER (VisitTheUSA.com style)
         ══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0C2340] text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight">
                  Travel<span className="text-blue-400">OS</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The official autonomous travel portal powered by live SerpApi Google Engines. Experience real itineraries crafted with precision and zero hallucination.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>SerpApi Certified Live Integration</span>
              </div>
            </div>

            {/* Column 2: Experiences */}
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-200 mb-4">
                Travel Experiences
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li><button onClick={() => { setTo('Goa'); setActiveScreen('builder'); }} className="hover:text-white transition-colors">Coastal Drives & Beaches</button></li>
                <li><button onClick={() => { setTo('Manali'); setActiveScreen('builder'); }} className="hover:text-white transition-colors">Alpine Mountain Passes</button></li>
                <li><button onClick={() => { setTo('Jaipur'); setActiveScreen('builder'); }} className="hover:text-white transition-colors">Royal Forts & Palaces</button></li>
                <li><button onClick={() => { setTo('Kerala'); setActiveScreen('builder'); }} className="hover:text-white transition-colors">Emerald Backwaters & Lagoons</button></li>
              </ul>
            </div>

            {/* Column 3: Trip Tools */}
            <div>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-200 mb-4">
                Trip Tools
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li><button onClick={() => setActiveScreen('builder')} className="hover:text-white transition-colors">Custom Journey Builder</button></li>
                <li><button onClick={() => setGroundingOpen(true)} className="hover:text-white transition-colors">Zero-Hallucination Audit</button></li>
                <li><button onClick={() => setActiveScreen('design-showcase')} className="hover:text-white transition-colors">Design Showcase</button></li>
                <li><button onClick={() => setActiveScreen('landing')} className="hover:text-white transition-colors">Popular Road Trips</button></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Live updates */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-200">
                Travel Inspiration
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive curated scenic routes, flight fare alerts, and zero-hallucination travel intelligence.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-[#D92638] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#B91C2C] transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} TravelOS Official Portal. All live flight and hotel data verified by SerpApi.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Live Engine Status</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Grounding & Differentiation Modal */}
      <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />
    </div>
  );
}
