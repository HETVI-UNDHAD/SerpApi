import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import AnywhereInIndiaModal from '../components/AnywhereInIndiaModal';
import SerpApiGroundingModal from '../components/SerpApiGroundingModal';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  Sparkles, ArrowRight, MapPin, Calendar, IndianRupee,
  Plane, Building, Route, RefreshCw, Brain, ShieldCheck,
  Star, ChevronRight, ChevronLeft, Compass, CheckCircle2, Loader2,
  Car, Mountain, Palmtree, Landmark, UtensilsCrossed,
  Zap, Clock, Heart, Search, Navigation, Globe, Sun, Sliders,
  Eye, Award, ArrowUpRight
} from 'lucide-react';

const destinationResearchCache = new Map();
const destinationImageCache = new Map();

// Curated high-resolution imagery tailored by category & keyword
const THEMATIC_PLACE_IMAGES = {
  waterfall: [
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&auto=format&fit=crop&q=85'
  ],
  fort: [
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1609137144821-39e24f7e504c?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1585131061730-a9cb4cf8fa32?w=900&auto=format&fit=crop&q=85'
  ],
  cave: [
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=900&auto=format&fit=crop&q=85'
  ],
  museum: [
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&auto=format&fit=crop&q=85'
  ],
  church: [
    'https://images.unsplash.com/photo-1548625361-19597286a11e?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=900&auto=format&fit=crop&q=85'
  ],
  temple: [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=900&auto=format&fit=crop&q=85'
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=85'
  ],
  nature: [
    'https://images.unsplash.com/photo-1511497584788-87676104235f?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&auto=format&fit=crop&q=85'
  ],
  market: [
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=85'
  ],
  defaultPool: [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=900&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=900&auto=format&fit=crop&q=85'
  ]
};

function hashPlaceString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getThematicPlaceFallback(title = '', category = '', destination = '') {
  const text = `${title} ${category} ${destination}`.toLowerCase();
  if (text.includes('waterfall') || text.includes('falls')) return THEMATIC_PLACE_IMAGES.waterfall[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.waterfall.length];
  if (text.includes('fort') || text.includes('palace') || text.includes('citadel')) return THEMATIC_PLACE_IMAGES.fort[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.fort.length];
  if (text.includes('cave') || text.includes('cavern')) return THEMATIC_PLACE_IMAGES.cave[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.cave.length];
  if (text.includes('museum') || text.includes('gallery')) return THEMATIC_PLACE_IMAGES.museum[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.museum.length];
  if (text.includes('church') || text.includes('cathedral') || text.includes('basilica')) return THEMATIC_PLACE_IMAGES.church[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.church.length];
  if (text.includes('temple') || text.includes('mandir') || text.includes('ashram')) return THEMATIC_PLACE_IMAGES.temple[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.temple.length];
  if (text.includes('beach') || text.includes('coast') || text.includes('bay')) return THEMATIC_PLACE_IMAGES.beach[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.beach.length];
  if (text.includes('park') || text.includes('sanctuary') || text.includes('forest') || text.includes('lake')) return THEMATIC_PLACE_IMAGES.nature[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.nature.length];
  if (text.includes('market') || text.includes('bazaar') || text.includes('food')) return THEMATIC_PLACE_IMAGES.market[Math.abs(hashPlaceString(title)) % THEMATIC_PLACE_IMAGES.market.length];
  return THEMATIC_PLACE_IMAGES.defaultPool[Math.abs(hashPlaceString(title || 'attraction')) % THEMATIC_PLACE_IMAGES.defaultPool.length];
}

function DestinationPlaceImage({ place, destination = '' }) {
  const title = place?.title || 'Attraction';
  const category = place?.category || '';
  const fallback = getThematicPlaceFallback(title, category, destination);

  const normalizeImageUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    const url = value.trim().startsWith('//') ? `https:${value.trim()}` : value.trim();
    return /^https?:\/\//i.test(url) ? url : '';
  };

  const initialUrl = normalizeImageUrl(place?.thumbnail);
  const cacheKey = `${title} ${destination}`.trim();
  const cachedUrl = destinationImageCache.get(cacheKey);

  const [src, setSrc] = useState(cachedUrl || initialUrl || fallback);
  const [triedLive, setTriedLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (cachedUrl) { setSrc(cachedUrl); return; }
    if (initialUrl) { setSrc(initialUrl); return; }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${baseUrl}/api/images/search?q=${encodeURIComponent(`${title} ${destination}`)}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.success && data.imageUrl) {
          destinationImageCache.set(cacheKey, data.imageUrl);
          setSrc(data.imageUrl);
        } else {
          setSrc(fallback);
        }
      })
      .catch(() => { if (isMounted) setSrc(fallback); });

    return () => { isMounted = false; };
  }, [title, destination, initialUrl, cachedUrl]);

  const handleError = () => {
    if (!triedLive) {
      setTriedLive(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      fetch(`${baseUrl}/api/images/search?q=${encodeURIComponent(`${title} ${destination}`)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.imageUrl && data.imageUrl !== src) {
            destinationImageCache.set(cacheKey, data.imageUrl);
            setSrc(data.imageUrl);
          } else {
            setSrc(fallback);
          }
        })
        .catch(() => setSrc(fallback));
    } else {
      setSrc(fallback);
    }
  };

  return (
    <div className="relative w-full h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
      <img
        src={src}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
}

// Cinematic high-resolution vistas for the editorial hero
const HERO_DESTINATIONS = [
  {
    name: 'Goa',
    region: 'Konkan Coastline',
    tag: 'Coastal Heritage & Golden Shores',
    headline: 'Endless Horizons & Golden Coastlines',
    quote: 'Sun-drenched palms, Portuguese architecture and serene Arabian Sea tides.',
    bestTime: 'Nov – Mar',
    flightTime: '1h 45m from BOM',
    avgBudget: '₹18,000 – ₹28,000',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Kerala',
    region: 'Malabar Coast',
    tag: 'Emerald Lagoons & Spice Valleys',
    headline: 'Tranquil Waters & Verdant Highlands',
    quote: 'Traditional houseboats navigating palm-lined backwaters and misty Munnar tea hills.',
    bestTime: 'Sep – Mar',
    flightTime: '2h 10m from DEL',
    avgBudget: '₹22,000 – ₹34,000',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Jaipur',
    region: 'Rajasthan',
    tag: 'Royal Citadels & Artisan Bazaars',
    headline: 'Timeless Palaces & Royal Roads',
    quote: 'Amber Fort ramparts glowing at dusk, ornate facades and rich Rajasthani heritage.',
    bestTime: 'Oct – Mar',
    flightTime: '1h 15m from DEL',
    avgBudget: '₹16,000 – ₹26,000',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Manali',
    region: 'Himachal Himalayas',
    tag: 'Alpine Peaks & Pine River Valleys',
    headline: 'Majestic Glaciers & Alpine Passes',
    quote: 'Crisp pine air, snow-dusted Himalayan horizons and roaring mountain streams.',
    bestTime: 'Apr – Jun & Dec – Feb',
    flightTime: '1h 20m to KUU',
    avgBudget: '₹24,000 – ₹36,000',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Ladakh',
    region: 'High Himalayas',
    tag: 'High Altitude Desert & Monasteries',
    headline: 'The Roof of the World',
    quote: 'Cobalt skies over Pangong Tso, ancient cliffside gompas and thrilling mountain passes.',
    bestTime: 'May – Sep',
    flightTime: '1h 30m to IXL',
    avgBudget: '₹32,000 – ₹48,000',
    img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1920&auto=format&fit=crop&q=90'
  }
];

// Curated travel inspiration categories
const EXPERIENCES = [
  { id: 'beaches', name: 'Coastal & Shores', count: '28 Destinations', icon: Palmtree, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', dest: 'Goa' },
  { id: 'road-trips', name: 'Scenic Drives', count: '16 Routes', icon: Car, img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80', dest: 'Manali' },
  { id: 'nature', name: 'Valleys & Wildlife', count: '22 Reserves', icon: Mountain, img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&auto=format&fit=crop&q=80', dest: 'Kerala' },
  { id: 'culture', name: 'Heritage & Palaces', count: '34 Citadels', icon: Landmark, img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80', dest: 'Jaipur' },
  { id: 'food', name: 'Culinary Trails', count: '40 Bazaars', icon: UtensilsCrossed, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', dest: 'Goa' }
];

// Iconic Road Trips & Multi-day Routes
const FEATURED_ROAD_TRIPS = [
  {
    id: 'rt-goa',
    title: 'The Konkan Coastline & Portuguese Heritage',
    destination: 'Goa',
    origin: 'Ahmedabad',
    days: 3,
    distance: '140 km local',
    budget: 20000,
    travelers: 2,
    badge: 'Coastal Scenic Trail',
    rating: 4.94,
    reviews: '1,420',
    waypoints: ['Ahmedabad Airport', 'Panaji Latin Quarter', 'Chapora Fort Ramparts', 'Baga & Anjuna Coast'],
    highlights: 'Historic Portuguese churches, golden sand coves, coastal spice farm tastings and sunset bastion views.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=90',
    tags: ['Beaches', 'Food', 'Nightlife']
  },
  {
    id: 'rt-jaipur',
    title: 'The Royal Highway & Rajput Citadels',
    destination: 'Jaipur',
    origin: 'Delhi',
    days: 4,
    distance: '280 km',
    budget: 24000,
    travelers: 2,
    badge: 'Royal Heritage Trail',
    rating: 4.90,
    reviews: '980',
    waypoints: ['Delhi NCR', 'Neemrana Fort', 'Amber Citadel', 'City Palace & Hawa Mahal'],
    highlights: 'Sunrise photography at Hawa Mahal, hilltop elephant pathways, hand-block printing and royal Rajasthani dining.',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&auto=format&fit=crop&q=90',
    tags: ['Culture', 'History', 'Shopping']
  },
  {
    id: 'rt-kerala',
    title: 'Emerald Backwaters & Mountain Spice Highway',
    destination: 'Kerala',
    origin: 'Bangalore',
    days: 5,
    distance: '190 km',
    budget: 32000,
    travelers: 2,
    badge: 'Tropical Waterways',
    rating: 4.96,
    reviews: '2,110',
    waypoints: ['Fort Kochi', 'Alleppey Lagoon Pier', 'Kumarakom Bird Sanctuary', 'Munnar Tea Slopes'],
    highlights: 'Private houseboat drifting through palm lagoons, organic cardamom trails and evening Kathakali performances.',
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
    rating: 4.92,
    reviews: '1,840',
    waypoints: ['Chandigarh Bypass', 'Mandi Valley', 'Kullu Riverbanks', 'Solang Pass & Old Manali'],
    highlights: 'Atal Tunnel engineering marvel, Jogini waterfall hike, paragliding over Solang, and cedar forest cafés.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop&q=90',
    tags: ['Adventure', 'Nature', 'Photography']
  }
];

// Trending Destinations with rich editorial metadata
const TRENDING_DESTINATIONS = [
  {
    name: 'Udaipur',
    state: 'Rajasthan',
    vibe: 'City of Lakes & Marble Palaces',
    tag: 'Romantic Escape',
    rating: 4.95,
    priceEst: '₹22,000',
    days: 3,
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    vibe: 'Sacred Ghats & Ganga Aarti',
    tag: 'Spiritual Heritage',
    rating: 4.88,
    priceEst: '₹14,000',
    days: 3,
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'Rishikesh',
    state: 'Uttarakhand',
    vibe: 'Ganges Rafting & Himalayan Yoga',
    tag: 'Adventure & Zen',
    rating: 4.91,
    priceEst: '₹16,000',
    days: 3,
    img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=85'
  },
  {
    name: 'Hampi',
    state: 'Karnataka',
    vibe: 'Vijayanagara Ruins & Boulder Landscapes',
    tag: 'Ancient Architecture',
    rating: 4.93,
    priceEst: '₹15,000',
    days: 3,
    img: 'https://images.unsplash.com/photo-1600100397608-f010f4439c04?w=800&auto=format&fit=crop&q=85'
  }
];

export default function LandingPage() {
  const { formData, setFormData, generateTrip, setActiveScreen, theme } = useTrip();
  const isDark = theme === 'dark';

  const [heroIdx, setHeroIdx] = useState(0);
  const [showAnywhereModal, setShowAnywhereModal] = useState(false);
  const [journey, setJourney] = useState(null);
  const [journeyPlaces, setJourneyPlaces] = useState([]);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState(false);
  const [groundingOpen, setGroundingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOrigin, setSearchOrigin] = useState(formData.origin || 'Ahmedabad');

  // Auto cycle hero every 7 seconds
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_DESTINATIONS.length), 7000);
    return () => clearInterval(t);
  }, []);

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

  async function loadJourneyPlaces(dest) {
    setJourneyLoading(true);
    setJourneyError(false);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/places/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: dest, interests: [], limit: 12 })
      });
      if (!response.ok) throw new Error('Destination research failed');
      const data = await response.json();
      if (!data.success || !Array.isArray(data.places) || !data.places.length) throw new Error('No places found');
      destinationResearchCache.set(dest, data.places);
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
      origin: journey.origin || searchOrigin || 'Ahmedabad',
      destination: journey.destination,
      originCoords: null,
      destinationCoords: null,
      duration: journey.days,
      travelers: journey.travelers,
      budget: journey.budget,
      dates: { outbound: '', return: '' },
      interests: journey.tags || ['Beaches', 'Food'],
      travelStyle: 'Balanced',
      transportPreference: formData.transportPreference || 'Flight',
      accommodationPreference: 'Hotel'
    };
    setFormData(data);
    generateTrip(data);
  }

  function handleHeroQuickPlan(destinationName) {
    const targetDest = destinationName || HERO_DESTINATIONS[heroIdx].name;
    setFormData(prev => ({
      ...prev,
      origin: searchOrigin || prev.origin,
      destination: targetDest
    }));
    setActiveScreen('builder');
  }

  const currentHero = HERO_DESTINATIONS[heroIdx];

  // If viewing a detailed destination guide
  if (journey) {
    return (
      <section className={`min-h-screen px-4 py-10 sm:px-6 lg:px-8 max-w-7xl mx-auto ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        <button
          onClick={() => { setJourney(null); setJourneyError(false); }}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline transition-all"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to All Discoveries
        </button>

        {/* Hero Banner for selected destination */}
        <div className="relative h-80 sm:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <img src={journey.img} alt={journey.destination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/95 via-[#070B14]/40 to-transparent" />
          <div className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 text-white max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow">
                {journey.badge}
              </span>
              <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {journey.rating} ({journey.reviews} reviews)
              </span>
            </div>
            <h1 className="editorial-serif text-3xl sm:text-5xl font-bold leading-tight text-white">
              {journey.title}
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {journey.highlights}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="editorial-serif text-2xl sm:text-3xl font-bold">Key Attractions in {journey.destination}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Grounded live via SerpApi Google Places engine with exact ratings and addresses.
            </p>
          </div>
          <button
            onClick={planSelectedJourney}
            className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary for {journey.destination}</span>
          </button>
        </div>

        {/* Places Grid */}
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
                className="group rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <DestinationPlaceImage place={place} destination={journey?.destination || ''} />
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base leading-snug">{place.title}</h3>
                    {place.rating != null && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/50">
                        ★ {place.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                  {place.address && (
                    <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
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
    <div className={`min-h-screen font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>

      {/* ══════════════════════════════════════════════════════════════════
          1. CINEMATIC EDITORIAL HERO WITH ASYMMETRIC COMPOSITION
         ══════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between overflow-hidden">
        {/* Full-bleed crossfade photography */}
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
                className="w-full h-full object-cover scale-100 transition-transform duration-[8000ms] ease-out"
                style={{ transform: i === heroIdx ? 'scale(1.06)' : 'scale(1.0)' }}
              />
            </div>
          ))}
          {/* Subtle multi-stop gradient for readable editorial typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/40 to-[#070B14]/70" />
        </div>

        {/* Top Destination Pill & Slide Navigation */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide">{currentHero.name}</span>
            <span className="text-white/40">•</span>
            <span className="text-amber-300 font-medium text-[11px]">{currentHero.tag}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHeroIdx((heroIdx - 1 + HERO_DESTINATIONS.length) % HERO_DESTINATIONS.length)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Previous destination"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-1.5">
              {HERO_DESTINATIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIdx(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === heroIdx ? 'w-7 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setHeroIdx((heroIdx + 1) % HERO_DESTINATIONS.length)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Next destination"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Editorial Headlines & Interactive Search Bar */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 py-10 flex flex-col items-center justify-center">
          
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 mb-4 shadow-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Real Google Flights, Hotels & Maps · Zero AI Hallucination</span>
          </div>

          <h1 className="editorial-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-lg">
            Travel somewhere<br />
            <span className="italic font-serif font-normal text-amber-200">you'll never forget.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
            Tell us where your heart wants to wander. TravelOS AI searches live flights, hotels, and places to architect your optimal journey.
          </p>

          {/* ── INTELLIGENT DISCOVERY SEARCH BAR ── */}
          <div className="mt-8 w-full max-w-3xl rounded-2xl bg-white/95 dark:bg-[#0E1526]/95 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl p-3 sm:p-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* Origin input */}
              <div className="sm:col-span-4 relative">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Leaving From
                </label>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <Plane className="w-4 h-4 text-blue-500 shrink-0" />
                  <input
                    type="text"
                    value={searchOrigin}
                    onChange={e => setSearchOrigin(e.target.value)}
                    placeholder="e.g. Ahmedabad, Delhi"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Destination input */}
              <div className="sm:col-span-5 relative">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Destination or Idea
                </label>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`e.g. ${currentHero.name}, Beaches, Mountains`}
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="sm:col-span-3">
                <label className="hidden sm:block text-[10px] font-black uppercase tracking-wider text-transparent mb-1">
                  Action
                </label>
                <button
                  onClick={() => handleHeroQuickPlan(searchQuery.trim() || currentHero.name)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plan Trip</span>
                </button>
              </div>

            </div>

            {/* Quick destination suggestion tags */}
            <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Popular:</span>
                {['Goa', 'Kerala', 'Manali', 'Jaipur', 'Ladakh'].map(dest => (
                  <button
                    key={dest}
                    onClick={() => {
                      setSearchQuery(dest);
                      handleHeroQuickPlan(dest);
                    }}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {dest}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAnywhereModal(true)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Help me choose a destination</span>
              </button>
            </div>
          </div>

        </div>

        {/* Hero Bottom Bar: Destination Metadata Snapshot */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 w-full hidden md:flex items-center justify-between text-xs text-white/80 border-t border-white/10 pt-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">Best Season</span>
              <span className="font-bold text-white">{currentHero.bestTime}</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">Flight Transit</span>
              <span className="font-bold text-white">{currentHero.flightTime}</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">Estimated Budget</span>
              <span className="font-bold text-amber-300">{currentHero.avgBudget}</span>
            </div>
          </div>

          <button
            onClick={() => handleHeroQuickPlan(currentHero.name)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-amber-300 transition-colors"
          >
            <span>Explore {currentHero.name} Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. BROWSE BY CURATED TRAVEL COLLECTIONS & THEMES
         ══════════════════════════════════════════════════════════════════ */}
      <section className="pt-20 pb-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
              Curated Collections
            </span>
            <h2 className="editorial-serif text-3xl sm:text-4xl font-bold mt-2 tracking-tight">
              What Kind of Escape Inspires You?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Select an experience to discover handpicked itineraries grounded with live flight & hotel data.
            </p>
          </div>

          <button
            onClick={() => setShowAnywhereModal(true)}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline self-start md:self-auto"
          >
            <span>Explore all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {EXPERIENCES.map(exp => {
            const Icon = exp.icon;
            return (
              <div
                key={exp.id}
                onClick={() => {
                  const matchTrip = FEATURED_ROAD_TRIPS.find(t => t.destination.toLowerCase() === exp.dest.toLowerCase()) || FEATURED_ROAD_TRIPS[0];
                  handlePreset(matchTrip);
                }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="h-48 w-full relative">
                  <img
                    src={exp.img}
                    alt={exp.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/90 via-[#070B14]/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-sm leading-tight text-white">{exp.name}</h3>
                    <p className="text-[10px] text-slate-300 mt-0.5">{exp.count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. FEATURED ROAD TRIPS & SCENIC ITINERARIES
         ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50/80 dark:bg-[#0A101E] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                Iconic Journeys
              </span>
              <h2 className="editorial-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
                Featured Drives & Multi-Day Itineraries
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                Explore signature journeys with waypoint clustering, live Google Maps turn-by-turn guidance, and verified ticket pricing.
              </p>
            </div>

            <button
              onClick={() => setActiveScreen('builder')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Build Custom Route</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          {/* Road Trips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_ROAD_TRIPS.map(trip => (
              <div
                key={trip.id}
                onClick={() => handlePreset(trip)}
                className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-[#0E1526] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* Image container */}
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

                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs font-black shadow">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{trip.rating}</span>
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-0.5">
                      {trip.days} DAYS • {trip.distance}
                    </span>
                    <h3 className="editorial-serif text-lg font-bold leading-snug text-white group-hover:text-amber-200 transition-colors">
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
                      className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 group-hover:bg-blue-700 transition-colors shadow"
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
          4. TRENDING DESTINATIONS WITH LIVE TRAVEL INTELLIGENCE
         ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
              Trending Destinations
            </span>
            <h2 className="editorial-serif text-3xl sm:text-4xl font-bold tracking-tight mt-2">
              Popular Escapes for This Season
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-rated Indian destinations with verified flight routes and hotel availability.
            </p>
          </div>

          <button
            onClick={() => setActiveScreen('builder')}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Plan for custom location</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRENDING_DESTINATIONS.map(dest => (
            <div
              key={dest.name}
              onClick={() => handleHeroQuickPlan(dest.name)}
              className="group rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0E1526] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                  {dest.tag}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">{dest.state}</span>
                  <h3 className="editorial-serif text-xl font-bold">{dest.name}</h3>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{dest.vibe}</p>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-1 block">
                    From {dest.priceEst} <span className="text-[10px] font-normal text-slate-400">/ {dest.days}D</span>
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. LIVE-GROUNDED OFFICIAL PROVENANCE & ZERO HALLUCINATION
         ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="rounded-3xl bg-gradient-to-br from-[#0B1428] via-[#0E1A36] to-[#070D1C] text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Verification Standard</span>
            </div>

            <h2 className="editorial-serif text-3xl sm:text-5xl font-bold leading-tight">
              Real Search Data. Real Prices.<br />
              <span className="text-amber-200">Zero AI Hallucination.</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Unlike generic AI chatbots that invent non-existent flight routes, closed hotels, and fictitious pricing, TravelOS verifies every recommendation through live SerpApi engines connecting directly to Google Flights, Google Hotels, and Google Maps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/15">
              <div>
                <div className="text-lg font-bold text-amber-200 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-400" />
                  <span>Google Flights</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Live airline ticket pricing, real seat availability, and IRCTC superfast train backups.
                </p>
              </div>

              <div>
                <div className="text-lg font-bold text-amber-200 flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-400" />
                  <span>Google Hotels</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Live nightly room rates, verified guest reviews, location rankings, and direct bookings.
                </p>
              </div>

              <div>
                <div className="text-lg font-bold text-amber-200 flex items-center gap-2">
                  <Route className="w-4 h-4 text-emerald-400" />
                  <span>Google Maps</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Exact GPS coordinates, Haversine clustering to avoid backtracking, and turn-by-turn routes.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => setGroundingOpen(true)}
                className="px-6 py-3 rounded-full bg-white text-[#0B1428] font-black text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Inspect Live SerpApi Grounding Proof</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Discovery Modal */}
      <AnywhereInIndiaModal
        isOpen={showAnywhereModal}
        onClose={() => setShowAnywhereModal(false)}
        initialOrigin={searchOrigin || 'Ahmedabad'}
        initialBudget={formData?.budget || 20000}
        initialDuration={formData?.duration || 3}
        initialInterest="Beaches"
        onSelectDestination={cand => {
          setFormData(prev => ({
            ...prev,
            destination: cand.name,
            budget: cand.budget || prev.budget,
            duration: cand.duration || prev.duration,
            destinationLocation: {
              name: cand.name,
              city: cand.city,
              district: '',
              state: cand.state,
              country: cand.country,
              latitude: null,
              longitude: null,
              formattedAddress: `${cand.name}, ${cand.state}, India`,
              source: 'anywhere_in_india_discovery'
            }
          }));
          setActiveScreen('builder');
        }}
      />

      {/* Grounding Proof Modal */}
      <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />
    </div>
  );
}
