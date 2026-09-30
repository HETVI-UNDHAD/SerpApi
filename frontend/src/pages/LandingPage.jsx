import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import AnywhereInIndiaModal from '../components/AnywhereInIndiaModal';
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
const destinationImageCache = new Map();

// Curated high-resolution imagery tailored by attraction category & keywords
const THEMATIC_PLACE_IMAGES = {
  waterfall: [
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80', // Cascading tropical waterfall
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80', // Lush misty falls
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80'  // Forest stream cascade
  ],
  fort: [
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80', // Portuguese coastal bastion & ramparts
    'https://images.unsplash.com/photo-1609137144821-39e24f7e504c?w=800&auto=format&fit=crop&q=80', // Ancient stone fortress wall
    'https://images.unsplash.com/photo-1585131061730-a9cb4cf8fa32?w=800&auto=format&fit=crop&q=80'  // Ocean cliff citadel
  ],
  cave: [
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80', // Ancient rock-cut cave sanctuary
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80'  // Natural stone cavern
  ],
  museum: [
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80', // Cultural heritage & open-air museum
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'  // Traditional statues & artifacts
  ],
  church: [
    'https://images.unsplash.com/photo-1548625361-19597286a11e?w=800&auto=format&fit=crop&q=80', // Historic Portuguese basilica
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80'  // Heritage colonial cathedral
  ],
  temple: [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80', // Carved Indian temple sanctum
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&auto=format&fit=crop&q=80'  // Sacred shrine
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80', // Tropical palm-fringed shoreline
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80', // Goa golden sands
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80'  // Coastal bay vista
  ],
  nature: [
    'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80', // Lush misty forest canopy
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80'  // Mountain nature scenic
  ],
  market: [
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80', // Vibrant spice and flea market
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'  // Local dining & street café
  ],
  defaultPool: [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800&auto=format&fit=crop&q=80'
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
  
  if (text.includes('waterfall') || text.includes('falls') || text.includes('cascade')) {
    const list = THEMATIC_PLACE_IMAGES.waterfall;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('fort') || text.includes('bastion') || text.includes('rampart') || text.includes('citadel') || text.includes('palace') || text.includes('castle')) {
    const list = THEMATIC_PLACE_IMAGES.fort;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('cave') || text.includes('cavern') || text.includes('grotto')) {
    const list = THEMATIC_PLACE_IMAGES.cave;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('museum') || text.includes('foot') || text.includes('art') || text.includes('gallery') || text.includes('heritage') || text.includes('cultural')) {
    const list = THEMATIC_PLACE_IMAGES.museum;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('church') || text.includes('basilica') || text.includes('cathedral') || text.includes('chapel')) {
    const list = THEMATIC_PLACE_IMAGES.church;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('temple') || text.includes('mandir') || text.includes('shrine') || text.includes('ashram')) {
    const list = THEMATIC_PLACE_IMAGES.temple;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('beach') || text.includes('cove') || text.includes('coast') || text.includes('sea') || text.includes('bay')) {
    const list = THEMATIC_PLACE_IMAGES.beach;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('wildlife') || text.includes('sanctuary') || text.includes('park') || text.includes('garden') || text.includes('forest') || text.includes('valley')) {
    const list = THEMATIC_PLACE_IMAGES.nature;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }
  if (text.includes('market') || text.includes('bazaar') || text.includes('flea') || text.includes('food') || text.includes('restaurant')) {
    const list = THEMATIC_PLACE_IMAGES.market;
    return list[Math.abs(hashPlaceString(title)) % list.length];
  }

  // Consistent distinct fallback per attraction title from curated pool
  const pool = THEMATIC_PLACE_IMAGES.defaultPool;
  return pool[Math.abs(hashPlaceString(title || 'attraction')) % pool.length];
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
    if (cachedUrl) {
      setSrc(cachedUrl);
      return;
    }
    if (initialUrl) {
      setSrc(initialUrl);
      return;
    }

    // No valid Google Maps thumbnail provided: Query live SerpApi Google Images
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
      .catch(() => {
        if (isMounted) setSrc(fallback);
      });

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
    <div className="relative w-full h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
      <img
        src={src}
        alt={title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        onError={handleError}
        loading="lazy"
      />
    </div>
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
  const [showAnywhereModal, setShowAnywhereModal] = useState(false);
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
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
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
                <DestinationPlaceImage place={place} destination={journey?.destination || ''} />
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
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-4 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live data · Powered by SerpApi</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-md">
            Travel somewhere<br />
            <span className="italic font-serif font-normal text-amber-200">you'll remember.</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
            Tell us where you want to go. We'll handle the planning.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveScreen('builder')}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Custom Trip Builder
            </button>
            <button
              onClick={() => setShowAnywhereModal(true)}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Anywhere in India</span>
            </button>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BROWSE BY EXPERIENCE (VisitTheUSA circular category selector)
         ══════════════════════════════════════════════════════════════════ */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  const destName = exp.id === 'beaches' ? 'Goa' : exp.id === 'nature' ? 'Kerala' : exp.id === 'culture' ? 'Jaipur' : 'Manali';
                  const matchTrip = FEATURED_ROAD_TRIPS.find(t => t.destination.toLowerCase() === destName.toLowerCase()) || FEATURED_ROAD_TRIPS[0];
                  handlePreset(matchTrip);
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
          LIVE-GROUNDED OFFICIAL PROVENANCE (VisitTheUSA Authority)
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

      {/* Anywhere in India Destination Discovery Modal */}
      <AnywhereInIndiaModal
        isOpen={showAnywhereModal}
        onClose={() => setShowAnywhereModal(false)}
        initialOrigin={formData?.origin || 'Rajkot'}
        initialBudget={formData?.budget || 20000}
        initialDuration={formData?.duration || 3}
        initialInterest="Mountains"
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

      {/* Grounding & Differentiation Modal */}
      <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />
    </div>
  );
}
