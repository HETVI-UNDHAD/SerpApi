import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  Sparkles, ArrowRight, MapPin, Calendar, IndianRupee,
  Plane, Building, Route, RefreshCw, Brain, ShieldCheck,
  Star, ChevronRight, Compass, CheckCircle2
} from 'lucide-react';

const HERO_DESTINATIONS = [
  {
    name: 'Goa', country: 'India', tag: 'Tropical Beaches & Coastal Sun',
    quote: 'Turquoise ocean water, white sand beaches and warm golden sunlight.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Bali', country: 'Indonesia', tag: 'Emerald Temples & Ocean Terraces',
    quote: 'Ancient sea shrines, tropical jungle retreats and dramatic evening skies.',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Kerala', country: 'India', tag: 'Quiet Backwaters & Golden Mornings',
    quote: 'Traditional houseboats drifting through coconut palm reflections at dawn.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Manali', country: 'Himalayas', tag: 'Alpine Peaks & Pine Forest Air',
    quote: 'Snow-capped mountain panoramas, cool pine breezes and mountain trails.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&auto=format&fit=crop&q=90'
  },
  {
    name: 'Paris', country: 'France', tag: 'Haute Culture & Golden Boulevards',
    quote: 'Eiffel Tower sunsets, historic cobblestone cafés and iconic river walks.',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&auto=format&fit=crop&q=90'
  }
];

const FEATURES = [
  { icon: Plane, color: 'text-cyan-500', bg: 'from-cyan-500/15 to-cyan-500/5', border: 'border-cyan-500/20', glow: 'shadow-glow-cyan', title: 'Live Flight Search', desc: 'Real fares from Google Flights via SerpApi. Never estimates or hallucinated tickets.' },
  { icon: Building, color: 'text-violet-500', bg: 'from-violet-500/15 to-violet-500/5', border: 'border-violet-500/20', glow: '', title: 'Hotel Comparison', desc: 'Live rates, amenities, and guest reviews. AI chooses the ideal stay for your budget.' },
  { icon: Route, color: 'text-emerald-500', bg: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/20', glow: '', title: 'Route Optimization', desc: 'Attractions clustered with Haversine math to eliminate daily criss-crossing.' },
  { icon: Brain, color: 'text-indigo-500', bg: 'from-indigo-500/15 to-indigo-500/5', border: 'border-indigo-500/20', glow: 'shadow-glow-indigo', title: 'AI Decision Engine', desc: 'Transparent intelligence explaining why each hotel, flight, and place was picked.' },
  { icon: RefreshCw, color: 'text-amber-500', bg: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/20', glow: '', title: 'Dynamic Replanning', desc: 'Flight delayed? Budget cut? AI recalculates routes and times in real-time.' },
  { icon: ShieldCheck, color: 'text-rose-500', bg: 'from-rose-500/15 to-rose-500/5', border: 'border-rose-500/20', glow: '', title: 'Zero Hallucination', desc: 'Every price, departure time, and map coordinate is grounded in live search engines.' },
];

const QUICK_TRIPS = [
  {
    from: 'Ahmedabad', to: 'Goa', days: 3, budget: 20000, travelers: 2,
    interests: ['Beaches', 'Food', 'Nightlife'], style: 'Balanced',
    badge: 'Beaches', rating: 4.9, reviews: '1.4k',
    subtitle: 'Golden sands, Portuguese villas, beach shacks & ocean sunset cruises.',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=90',
    tags: ['Beaches', 'Nightlife', 'Food']
  },
  {
    from: 'Delhi', to: 'Kerala', days: 5, budget: 32000, travelers: 2,
    interests: ['Nature', 'Relaxation', 'Food'], style: 'Relaxed',
    badge: 'Backwaters', rating: 4.95, reviews: '2.1k',
    subtitle: 'Alleppey private houseboats, spice plantations & Ayurvedic wellness.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop&q=90',
    tags: ['Nature', 'Relaxation', 'Food']
  },
  {
    from: 'Mumbai', to: 'Jaipur', days: 4, budget: 24000, travelers: 2,
    interests: ['Culture', 'History', 'Shopping'], style: 'Balanced',
    badge: 'Heritage', rating: 4.88, reviews: '980',
    subtitle: 'Amber Fort courtyard views, Hawa Mahal architecture & royal bazaars.',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&auto=format&fit=crop&q=90',
    tags: ['Culture', 'History', 'Shopping']
  },
  {
    from: 'Bangalore', to: 'Manali', days: 6, budget: 38000, travelers: 2,
    interests: ['Adventure', 'Nature', 'Photography'], style: 'Adventure',
    badge: 'Alpine', rating: 4.92, reviews: '1.8k',
    subtitle: 'Solang Valley mountain passes, pine forest trails & glacial rivers.',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop&q=90',
    tags: ['Adventure', 'Nature', 'Photography']
  },
];

export default function LandingPage() {
  const { setFormData, generateTrip, setActiveScreen, theme } = useTrip();
  const isDark = theme === 'dark';
  const [heroIdx, setHeroIdx] = useState(0);
  const [mapsReady, setMapsReady] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(20000);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_DESTINATIONS.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(() => {});
  }, []);

  function handleQuickSearch(e) {
    e.preventDefault();
    const data = {
      origin: from || 'Ahmedabad', destination: to || '',
      originCoords: null, destinationCoords: null,
      duration: days, travelers: 2, budget,
      dates: { outbound: '', return: '' },
      interests: ['Beaches', 'Food', 'Culture'],
      travelStyle: 'Balanced', transportPreference: 'Flight', accommodationPreference: 'Hotel'
    };
    setFormData(data);
    if (!to) { setActiveScreen('builder'); return; }
    generateTrip(data);
  }

  function handlePreset(p) {
    const data = {
      origin: p.from, destination: p.to,
      originCoords: null, destinationCoords: null,
      duration: p.days, travelers: p.travelers, budget: p.budget,
      dates: { outbound: '', return: '' },
      interests: p.interests, travelStyle: p.style,
      transportPreference: 'Flight', accommodationPreference: 'Hotel'
    };
    setFormData(data);
    generateTrip(data);
  }

  const hero = HERO_DESTINATIONS[heroIdx];

  return (
    <div
      className={`relative min-h-screen overflow-hidden font-sans transition-colors duration-500 ${isDark ? 'text-white' : 'text-[#123f52]'}`}
      style={{
        backgroundImage: `linear-gradient(${isDark ? 'rgba(3, 18, 28, 0.68)' : 'rgba(226, 247, 246, 0.62)'}, ${isDark ? 'rgba(3, 18, 28, 0.82)' : 'rgba(226, 247, 246, 0.72)'}), url(${hero.img})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >

      {/* ══════════════════════════════════════════
          CINEMATIC HERO
      ══════════════════════════════════════════ */}
      <div className="relative min-h-[96vh] flex flex-col overflow-hidden bg-black/10">

        {/* Full-bleed background crossfade */}
        <div className="absolute inset-0 z-0">
          {HERO_DESTINATIONS.map((d, i) => (
            <div key={d.name} className="absolute inset-0 transition-opacity duration-1500 ease-in-out"
              style={{ opacity: i === heroIdx ? 1 : 0 }}>
              <img src={d.img} alt={d.name}
                className="w-full h-full object-cover scale-[1.04] transition-transform duration-[8000ms] ease-out"
                style={{ transform: i === heroIdx ? 'scale(1.0)' : 'scale(1.04)' }}
              />
            </div>
          ))}
          {/* Cinematic gradient veil */}
          <div className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-b from-[#032b34]/72 via-[#07545b]/35 to-[#042d38]/95'
              : 'bg-gradient-to-b from-[#032b34]/72 via-[#07545b]/35 to-[#042d38]/95'
          }`} />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* 3D Floating Airplane */}
        <div className="absolute top-28 right-6 lg:right-20 z-10 hidden pointer-events-none floating-3d">
          <svg viewBox="0 0 260 200" className="w-52 lg:w-72 h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)] -rotate-6">
            <defs>
              <linearGradient id="fg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#e2e8f0" />
                <stop offset="80%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="fg2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.3" />
              </linearGradient>
              <filter id="planeShadow">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.4"/>
              </filter>
            </defs>
            <path d="M 30 115 Q 115 104 175 62 L 228 68 Q 192 96 150 118 L 182 165 L 145 156 L 108 124 L 62 126 L 42 144 L 24 138 L 38 120 Z"
              fill="url(#fg1)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" filter="url(#planeShadow)" />
            <path d="M 125 108 L 200 72 L 164 118 Z" fill="url(#fg2)" />
            <circle cx="220" cy="70" r="3.5" fill="#22d3ee" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <div className="w-40 h-3 mx-auto rounded-full bg-black/30 blur-lg mt-1" />
        </div>

        {/* 3D Floating Location Pin */}
        <div className="absolute top-52 left-6 lg:left-16 z-10 hidden pointer-events-none floating-3d-delayed">
          <div className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-2xl border border-white/25 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SerpApi Grounded · Zero Hallucination</span>
          </div>
        </div>

        {/* Destination indicator top */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#061827]/80 backdrop-blur-2xl border border-white/30 text-white text-sm font-bold shadow-xl">
            <MapPin className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white whitespace-nowrap">{hero.name}, {hero.country}</span>
            <span className="text-white/60">•</span>
            <span className="text-white text-xs font-bold whitespace-nowrap">{hero.tag}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/70 text-xs">
            {HERO_DESTINATIONS.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)}
                className={`transition-all duration-300 rounded-full ${i === heroIdx ? 'w-6 h-2 bg-cyan-400' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>

        {/* Hero Title */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 flex-1 flex flex-col items-center justify-center py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-[11px] font-bold uppercase tracking-widest mb-6 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen Autonomous Travel Intelligence</span>
          </div>
          <h1 className="editorial-display text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.92] text-white drop-shadow-2xl mb-5">
            Where will<br />
            <span className="text-[#d7ff70]">you go?</span>
          </h1>
          <p className="text-base sm:text-xl font-medium text-white/75 max-w-xl mx-auto leading-relaxed">
            Discover meaningful places, compare live options, and make your next escape feel effortless.
          </p>

          {/* Floating destination badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl reference-glass text-white floating-3d-fast">
            <MapPin className="w-4 h-4 text-[#ef6b76]" />
            <div className="text-left">
              <div className="text-xs font-black">{hero.name}</div>
              <div className="text-[10px] text-white/70">{hero.tag}</div>
            </div>
          </div>
        </div>

        {/* ── FLOATING GLASS SEARCH PANEL ── */}
        <div className="relative z-20 max-w-5xl mx-auto w-full px-4 pb-0 -mb-14">
          <form onSubmit={handleQuickSearch}
            className="p-5 sm:p-6 rounded-[30px] reference-glass transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>From</label>
                {mapsReady ? (
                  <LocationAutocomplete value={from} onChange={v => setFrom(v)} placeholder="Origin city" icon={MapPin} iconColor="text-slate-400" />
                ) : (
                  <SearchInput isDark={isDark} icon={<MapPin className="w-4 h-4 text-slate-400" />} value={from} onChange={e => setFrom(e.target.value)} placeholder="Origin city" />
                )}
              </div>
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To</label>
                {mapsReady ? (
                  <LocationAutocomplete value={to} onChange={v => setTo(v)} placeholder="Destination (or leave empty)" icon={MapPin} iconColor="text-cyan-500" />
                ) : (
                  <SearchInput isDark={isDark} icon={<MapPin className="w-4 h-4 text-cyan-500" />} value={to} onChange={e => setTo(e.target.value)} placeholder="Destination (or leave empty)" />
                )}
              </div>
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Days</label>
                <SearchInput isDark={isDark} icon={<Calendar className="w-4 h-4 text-slate-400" />} type="number" min="1" max="14" value={days} onChange={e => setDays(+e.target.value)} />
              </div>
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Budget ₹</label>
                <SearchInput isDark={isDark} icon={<IndianRupee className="w-4 h-4 text-emerald-500" />} type="number" step="1000" min="5000" value={budget} onChange={e => setBudget(+e.target.value)} />
              </div>
              <button type="submit"
                className="w-full py-3.5 px-5 rounded-2xl editorial-teal font-bold text-xs flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
                <Sparkles className="w-4 h-4" />
                <span>Plan Trip</span>
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 px-1 pt-2.5 border-t border-white/10">
              <button type="button" onClick={() => setActiveScreen('builder')}
                className="text-xs font-semibold flex items-center gap-1.5 text-[#247e88] hover:text-[#123f52] transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-[#ef6b76]" />
                More options & travel preferences
              </button>
              <span className="text-[10px] font-medium text-[#174f62]/55">
                Powered by SerpApi Live Google Engines
              </span>
            </div>
          </form>
        </div>
        <div className="h-16" />
      </div>

      {/* ══════════════════════════════════════════
          POPULAR JOURNEYS — LARGE PHOTO CARDS
      ══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}>Editorial Curations</span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Popular Journeys
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              One-click dynamic journeys researched live across India and beyond.
            </p>
          </div>
          <button onClick={() => setActiveScreen('builder')}
            className={`text-xs font-bold flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all ${
              isDark ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}>
            <span>Custom Journey</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_TRIPS.map((p) => (
            <div key={p.to} onClick={() => handlePreset(p)}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-400 card-hover gradient-border ${
                  isDark
                    ? 'bg-[#071d2c]/72 border border-white/15 shadow-luxury-dark hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.7)]'
                    : 'bg-white/78 border border-white/70 shadow-luxury hover:shadow-card-hover'
                }`}>
              {/* Large destination image — 16:9 ratio */}
              <div className="relative overflow-hidden" style={{ paddingBottom: '62%' }}>
                <img src={p.img} alt={p.to}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                  {p.badge}
                </div>

                {/* Rating */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-[11px] font-black shadow-md">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{p.rating}</span>
                </div>

                {/* Route on image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/65 mb-0.5">
                    <span>{p.from}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                    <span className="text-white font-bold">{p.to}</span>
                  </div>
                  <h3 className="text-xl font-black">{p.to}</h3>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-3">
                <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {p.subtitle}
                </p>

                {/* Interest tags */}
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span key={tag} className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isDark ? 'bg-white/5 text-slate-300 border border-white/8' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>{tag}</span>
                  ))}
                </div>

                <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/8' : 'border-slate-100'}`}>
                  <div>
                    <span className={`text-[10px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Est. Total</span>
                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      ₹{p.budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                      {p.days} Days
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PRODUCT FLOW PIPELINE
      ══════════════════════════════════════════ */}
      <div className={`py-20 px-4 sm:px-6 border-y backdrop-blur-[2px] ${
        isDark ? 'bg-[#061522]/65 border-white/10' : 'bg-white/28 border-white/55'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>The Architecture</span>
            <h2 className={`text-3xl sm:text-4xl font-black mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Not just an itinerary template
            </h2>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              TravelOS AI is an autonomous decision agent that researches, compares, clusters, and continuously replans.
            </p>
          </div>

          {/* Pipeline */}
          <div className="flex items-center justify-center gap-0 mb-16 overflow-x-auto pb-4">
            {['DISCOVER','SEARCH','COMPARE','OPTIMIZE','PLAN','MAP','REPLAN'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2 px-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black shadow-sm border ${
                    isDark
                      ? 'bg-gradient-to-tr from-cyan-500/10 to-indigo-500/20 border-indigo-500/30 text-indigo-300'
                      : 'bg-white border-indigo-200 text-indigo-600 shadow-luxury'
                  }`}>{i + 1}</div>
                  <span className={`text-[10px] font-bold tracking-widest whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className={`w-6 sm:w-10 h-0.5 flex-shrink-0 ${isDark ? 'bg-white/8' : 'bg-slate-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title}
                className={`p-6 rounded-3xl border transition-all duration-300 card-hover gradient-border ${
                  isDark
                    ? 'bg-[#071d2c]/72 border-white/12 hover:border-white/25'
                    : 'bg-white/78 border-white/70 hover:border-white shadow-luxury'
                }`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.bg} border ${f.border} flex items-center justify-center mb-4 ${f.glow}`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className={`font-black text-base mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
        {[
          { val: 'Live', label: 'SerpApi Grounded', sub: 'Google Flights, Hotels & Maps' },
          { val: '7', label: 'AI Sub-Engines', sub: 'Search, Compare, Cluster & Replan' },
          { val: '∞', label: 'Destinations', sub: 'India & International Cities' },
          { val: '0', label: 'Hallucinations', sub: 'All pricing grounded in live queries' },
        ].map(s => (
          <div key={s.label} className={`p-6 rounded-3xl border transition-all card-hover ${
            isDark ? 'bg-[#071d2c]/68 border-white/12' : 'bg-white/75 border-white/70 shadow-luxury'
          }`}>
            <div className="text-3xl sm:text-4xl font-black text-gradient-cyan-indigo mb-1">{s.val}</div>
            <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{s.label}</div>
            <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-28 text-center">
        <div className={`p-10 sm:p-14 rounded-3xl relative overflow-hidden border shadow-2xl ${
          isDark
            ? 'bg-[#061522]/72 border-white/15'
            : 'bg-white/78 border-white/70 shadow-luxury'
        }`}>
          {/* Decorative orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-md ai-glow">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Ready to travel smarter?
            </h2>
            <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Enter any origin, destination, budget and travel pace. Watch TravelOS AI research and optimize your trip live.
            </p>
            <div className="pt-2">
              <button onClick={() => setActiveScreen('builder')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-500/30 inline-flex items-center gap-2.5 transition-all hover:scale-105 hover:shadow-indigo-500/50">
                <Compass className="w-4 h-4" />
                <span>Build My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function SearchInput({ isDark, icon, type = 'text', value, onChange, placeholder, min, max, step }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        min={min} max={max} step={step}
        className={`w-full pl-9 pr-3 py-3 rounded-2xl text-xs font-semibold focus:outline-none transition-colors ${
          'bg-white/75 border border-[#b7d8d7] text-[#123f52] placeholder-[#56808a] focus:border-[#199fa8] shadow-sm'
        }`}
      />
    </div>
  );
}
