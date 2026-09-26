import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import {
  Sparkles,
  Sun,
  Moon,
  Plane,
  Building,
  MapPin,
  Calendar,
  IndianRupee,
  Route,
  Brain,
  Sliders,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  Coffee,
  Clock,
  Send,
  ArrowRight,
  ShieldCheck,
  Star,
  Compass,
  Layers,
  Eye,
  ChevronRight,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';

const DESTINATION_PHOTOS = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=85',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=85',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&auto=format&fit=crop&q=85',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=85',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=85',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=85',
  switzerland: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&auto=format&fit=crop&q=85'
};

const SCREENS = [
  { id: '1-landing', name: '1. Landing Page', subtitle: 'Hero, 3D Plane & Quick Search' },
  { id: '2-discovery', name: '2. Destination Discovery', subtitle: 'Interest Match & Live Cost Cards' },
  { id: '3-research', name: '3. AI Research Center', subtitle: 'Holographic Orb & 6 Stages' },
  { id: '4-dashboard', name: '4. Master Dashboard', subtitle: 'Hero Header, KPIs & Summary' },
  { id: '5-map', name: '5. 3D Route Map', subtitle: 'Numbered Pins & Optimal Waypoints' },
  { id: '6-budget', name: '6. Budget Optimizer', subtitle: 'Visual Expense Charts & Savings' },
  { id: '7-reasoning', name: '7. AI Decision Intelligence', subtitle: 'Grounded Review Sentiment & Why Cards' },
  { id: '8-replanner', name: '8. What-If Replanner', subtitle: 'Conversational Chat & Simulation Triggers' }
];

export default function DesignShowcasePage() {
  const { theme, setTheme } = useTrip();
  const [activeScreen, setActiveScreen] = useState('all'); // 'all' or screen id
  const [simQuery, setSimQuery] = useState('');
  const [activeSim, setActiveSim] = useState('My flight is delayed by 4 hours');
  const [selectedDestination, setSelectedDestination] = useState('bali');

  const isDark = theme === 'dark';

  // Theme styling tokens
  const themeStyles = {
    pageBg: isDark ? 'bg-[#080A0F]/28 text-slate-100' : 'bg-white/10 text-slate-900',
    cardBg: isDark
      ? 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl'
      : 'bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/60',
    innerCardBg: isDark
      ? 'bg-slate-800/50 border border-white/5'
      : 'bg-slate-50 border border-slate-200/60',
    subtext: isDark ? 'text-slate-400' : 'text-slate-500',
    heading: isDark ? 'text-white' : 'text-slate-950',
    navBg: isDark
      ? 'bg-[#080A0F]/85 backdrop-blur-2xl border-b border-white/10'
      : 'bg-[#FAFAF8]/90 backdrop-blur-2xl border-b border-slate-200/80',
    badgeDark: isDark ? 'bg-white/10 text-white border-white/10' : 'bg-slate-100 text-slate-800 border-slate-200',
    glowGradient: isDark
      ? 'from-cyan-500/20 via-indigo-500/20 to-violet-500/20'
      : 'from-cyan-500/10 via-indigo-500/10 to-violet-500/10',
    inputBg: isDark
      ? 'bg-white/10 border-white/15 text-white placeholder-white/30'
      : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400',
    statCardBg: isDark
      ? 'bg-slate-900/80 border-slate-800'
      : 'bg-white border-slate-200/80 shadow-sm'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white ${themeStyles.pageBg}`}>

      {/* ── TOP SHOWCASE CONTROL BAR ── */}
      <div className={`sticky top-0 z-50 ${themeStyles.navBg} py-3 px-4 shadow-sm`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-black text-base tracking-tight ${themeStyles.heading}`}>
                  Travel<span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">OS</span> AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/15 text-violet-400 border border-violet-500/30">
                  Design System Showcase
                </span>
              </div>
              <p className={`text-[11px] ${themeStyles.subtext}`}>
                Glassmorphism + 3D Travel Aesthetic · Light & Dark High-Fidelity Presentation
              </p>
            </div>
          </div>

          {/* Theme & Screen View Filters */}
          <div className="flex items-center gap-3">
            {/* Screen Selector */}
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <button
                onClick={() => setActiveScreen('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeScreen === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : `${themeStyles.subtext} hover:${themeStyles.heading}`
                }`}
              >
                All 8 Screens
              </button>
              {SCREENS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveScreen(s.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    activeScreen === s.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : `${themeStyles.subtext} hover:${themeStyles.heading}`
                  }`}
                >
                  {s.name.split('.')[0]}
                </button>
              ))}
            </div>

            {/* LIGHT / DARK MODE TOGGLE */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-500/15 border border-slate-500/20 shadow-inner">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  !isDark
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isDark
                    ? 'bg-slate-900 text-cyan-300 shadow-md border border-white/10 scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">

        {/* ── DESIGN SPECIFICATION BANNER ── */}
        <div className={`relative p-8 rounded-3xl overflow-hidden ${themeStyles.cardBg}`}>
          <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-br ${themeStyles.glowGradient} blur-3xl pointer-events-none`} />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  Executive Design Presentation
                </span>
                <span className={`text-xs ${themeStyles.subtext}`}>• Currently viewing: <strong>{isDark ? 'Dark Mode (Obsidian)' : 'Light Mode (Pure Porcelain)'}</strong></span>
              </div>
              <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${themeStyles.heading}`}>
                Next-Generation Autonomous <br />
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  AI Travel Decision Engine
                </span>
              </h1>
              <p className={`text-sm md:text-base leading-relaxed ${themeStyles.subtext}`}>
                A curated high-fidelity presentation of <strong>TravelOS AI</strong> showcasing glassmorphic surfaces, dimensional 3D travel assets, live SerpApi data grounding, interactive route waypoints, dynamic budget optimization, and conversational what-if replanning.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className={`p-4 rounded-2xl ${themeStyles.innerCardBg} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    3D
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${themeStyles.heading}`}>3D Spatial Depth</p>
                    <p className={`text-[10px] ${themeStyles.subtext}`}>Floating planes, perspective pins & map elevation</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>

              <div className={`p-4 rounded-2xl ${themeStyles.innerCardBg} flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ₹
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${themeStyles.heading}`}>Zero Hallucination</p>
                    <p className={`text-[10px] ${themeStyles.subtext}`}>SerpApi live Google Flights, Hotels & Maps rates</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 1: LANDING PAGE ("YOUR AI TRAVEL AGENT" + 3D PLANE)
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '1-landing') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 01"
              title="Landing Page & Hero Decision Engine"
              subtitle="Hero section with 'Your AI Travel Agent', 3D soaring jet, high-res destination visual, and frosted glass search console."
              themeStyles={themeStyles}
            />

            <div className={`relative min-h-[580px] rounded-3xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-slate-200'} shadow-2xl flex flex-col justify-between p-6 md:p-12`}>
              {/* Destination Background Photo */}
              <div className="absolute inset-0 z-0">
                <img
                  src={DESTINATION_PHOTOS.goa}
                  alt="Goa Beach"
                  className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#0a0a0f] via-slate-950/70 to-black/60' : 'bg-gradient-to-t from-[#f8fafc] via-white/80 to-white/40'}`} />
              </div>

              {/* 3D Floating Airplane Asset */}
              <div className="absolute top-12 right-12 z-10 hidden md:block pointer-events-none animate-bounce duration-1000">
                <div className="relative group">
                  <div className="w-40 h-28 relative transform rotate-12 -translate-y-2">
                    <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]">
                      <path
                        d="M 20 80 Q 90 75 140 45 L 180 50 Q 150 70 120 85 L 140 120 L 115 115 L 85 90 L 50 92 L 35 105 L 20 100 L 30 85 Z"
                        fill="url(#planeGrad)"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <defs>
                        <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="60%" stopColor="#cbd5e1" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  {/* Floating shadow */}
                  <div className="w-24 h-4 mx-auto rounded-full bg-black/40 blur-md transform translate-y-4" />
                </div>
              </div>

              {/* Top Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-black/60 border-white/20 text-white' : 'bg-white/80 border-slate-300 text-slate-800'} backdrop-blur-xl border text-xs font-semibold shadow-lg`}>
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Goa, India</span>
                  <span className="opacity-40">•</span>
                  <span className="text-[11px] text-cyan-400 font-bold">Golden Beaches & Nightlife</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className={`text-xs font-bold ${themeStyles.subtext}`}>Live SerpApi Flights & Hotels</span>
                </div>
              </div>

              {/* Hero Typography */}
              <div className="relative z-10 max-w-2xl my-auto py-8">
                <h2 className={`text-4xl md:text-6xl font-black tracking-tight leading-none mb-3 ${themeStyles.heading}`}>
                  Your AI <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    Travel Agent
                  </span>
                </h2>
                <p className={`text-sm md:text-base leading-relaxed ${themeStyles.subtext}`}>
                  Real flights, hotel rates, and attraction coordinates queried live. AI analyzes, optimizes, and replans your journey in real time.
                </p>
              </div>

              {/* Glowing Glass Search Console Card */}
              <div className={`relative z-10 p-5 rounded-2xl ${themeStyles.cardBg} border ${isDark ? 'border-white/20 shadow-2xl' : 'border-slate-300 shadow-xl'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${themeStyles.subtext}`}>From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        readOnly
                        value="Ahmedabad (AMD)"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-semibold ${themeStyles.inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${themeStyles.subtext}`}>To</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                      <input
                        readOnly
                        value="Goa (GOI)"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-semibold ${themeStyles.inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${themeStyles.subtext}`}>Days</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        readOnly
                        value="3 Days"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-semibold ${themeStyles.inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${themeStyles.subtext}`}>Budget ₹</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        readOnly
                        value="₹20,000"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-semibold ${themeStyles.inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Sparkles className="w-4 h-4" />
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 2: DESTINATION DISCOVERY SCREEN
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '2-discovery') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 02"
              title="AI Destination Discovery & Matching"
              subtitle="When traveler destination is flexible, AI compares high-resolution destinations with interest match % and estimated live budgets."
              themeStyles={themeStyles}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Bali, Indonesia', match: 98, cost: 38500, tag: 'Tropical & Culture', img: DESTINATION_PHOTOS.bali, interests: ['Beaches', 'Temples', 'Yoga'] },
                { name: 'Kerala Backwaters', match: 95, cost: 24000, tag: 'Nature & Serenity', img: DESTINATION_PHOTOS.kerala, interests: ['Houseboat', 'Ayurveda', 'Food'] },
                { name: 'Swiss Alps', match: 91, cost: 68000, tag: 'Mountains & Snow', img: DESTINATION_PHOTOS.switzerland, interests: ['Scenic Rail', 'Skiing', 'Lakes'] },
                { name: 'Jaipur, Rajasthan', match: 89, cost: 18500, tag: 'Royal Heritage', img: DESTINATION_PHOTOS.jaipur, interests: ['Palaces', 'Bazaars', 'Forts'] }
              ].map((dest, i) => (
                <div
                  key={dest.name}
                  onClick={() => setSelectedDestination(dest.name.toLowerCase().split(' ')[0])}
                  className={`group rounded-3xl overflow-hidden cursor-pointer ${themeStyles.cardBg} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={dest.img}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-black shadow-lg backdrop-blur-md">
                      {dest.match}% Match
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-xs font-semibold text-cyan-300">{dest.tag}</p>
                      <h4 className="text-base font-bold">{dest.name}</h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${themeStyles.subtext}`}>Est. Trip Cost</span>
                      <span className={`text-sm font-black ${themeStyles.heading}`}>₹{dest.cost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {dest.interests.map(t => (
                        <span key={t} className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <button className="w-full py-2 rounded-xl bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                      <span>Select Destination</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 3: AI RESEARCH CENTER (HOLOGRAPHIC ORB + 6 STAGES)
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '3-research') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 03"
              title="AI Research Center"
              subtitle="Real-time multi-engine SerpApi execution with holographic orb, live progress counter, and verified search stages."
              themeStyles={themeStyles}
            />

            <div className={`p-8 md:p-12 rounded-3xl ${themeStyles.cardBg} border ${isDark ? 'border-white/10' : 'border-slate-200'} text-center max-w-3xl mx-auto shadow-2xl`}>
              {/* 3D Holographic AI Core Orb */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-500 animate-spin blur-xl opacity-60" style={{ animationDuration: '6s' }} />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl border-2 border-white/40">
                  <div className="w-20 h-20 rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white">
                    <Brain className="w-7 h-7 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-violet-300 mt-1">AI CORE</span>
                  </div>
                </div>
              </div>

              <h3 className={`text-2xl font-black mb-1 ${themeStyles.heading}`}>
                Researching Real-Time SerpApi Data
              </h3>
              <p className={`text-xs ${themeStyles.subtext} mb-6`}>
                Grounding flights, hotels, map coordinates, and verified guest sentiment without hallucination.
              </p>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-500/20 mb-8 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 rounded-full w-4/5 transition-all duration-500" />
              </div>

              {/* 6 Research Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {[
                  { id: 1, title: 'Google Flights Search', detail: 'Live fares via SerpApi engine', status: 'done', icon: Plane },
                  { id: 2, title: 'Google Hotels Comparison', detail: 'Verified pricing & amenities', status: 'done', icon: Building },
                  { id: 3, title: 'Google Maps Places & GPS', detail: 'Real coordinates & hours', status: 'done', icon: MapPin },
                  { id: 4, title: 'Guest Review Sentiment', detail: 'Extracted pros & pain points', status: 'done', icon: ThumbsUp },
                  { id: 5, title: 'Haversine Route Clustering', detail: 'Minimizing criss-cross transit', status: 'active', icon: Route },
                  { id: 6, title: 'Dynamic Budget Optimizer', detail: 'Balancing stay, food & travel', status: 'pending', icon: IndianRupee }
                ].map(stage => {
                  const Icon = stage.icon;
                  return (
                    <div
                      key={stage.id}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        stage.status === 'done'
                          ? isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : stage.status === 'active'
                          ? isDark ? 'bg-indigo-500/15 border-indigo-500/30 text-white' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                          : isDark ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stage.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : stage.status === 'active' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{stage.title}</p>
                        <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stage.detail}</p>
                      </div>
                      {stage.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {stage.status === 'active' && <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 4: MASTER TRIP DASHBOARD
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '4-dashboard') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 04"
              title="Master Trip Dashboard"
              subtitle="Full journey control room with panoramic destination header, live budget status, flight & stay selection."
              themeStyles={themeStyles}
            />

            <div className="space-y-6">
              {/* Destination Hero Panoramic Card */}
              <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={DESTINATION_PHOTOS.paris}
                  alt="Paris"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                    Live SerpApi Verification
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Voyage Master Plan</span>
                  <h3 className="text-3xl md:text-5xl font-black">Paris, France</h3>
                  <p className="text-xs md:text-sm text-slate-300">
                    4 Days · 2 Travelers · Ahmedabad (AMD) → Paris (CDG) · ₹84,500 Total Estimate
                  </p>
                </div>
              </div>

              {/* 4 KPI Top Stat Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Estimated Cost"
                  value="₹84,500"
                  subtext="~₹42,250 per traveler"
                  themeStyles={themeStyles}
                  icon={IndianRupee}
                  color="text-indigo-400"
                />
                <StatCard
                  title="Budget Status"
                  value="Within Budget"
                  subtext="₹5,500 remaining cushion"
                  themeStyles={themeStyles}
                  icon={ShieldCheck}
                  color="text-emerald-400"
                  valueColor="text-emerald-400"
                />
                <StatCard
                  title="Recommended Hotel"
                  value="Hôtel Saint-Germain"
                  subtext="₹8,200/night · ★ 4.7 (SerpApi)"
                  themeStyles={themeStyles}
                  icon={Building}
                  color="text-violet-400"
                />
                <StatCard
                  title="Roundtrip Transit"
                  value="Air France Direct"
                  subtext="₹52,000 · 8h 45m duration"
                  themeStyles={themeStyles}
                  icon={Plane}
                  color="text-cyan-400"
                />
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 5: INTERACTIVE 3D ROUTE MAP & WAYPOINTS
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '5-map') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 05"
              title="Interactive 3D Route Map & Waypoints"
              subtitle="Clustered attractions connected with polyline routes, hotel basecamp anchor, and glossy numbered 3D pins (1..N)."
              themeStyles={themeStyles}
            />

            <div className={`p-6 md:p-8 rounded-3xl ${themeStyles.cardBg} border ${isDark ? 'border-white/10' : 'border-slate-200'} shadow-2xl space-y-6`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-base font-bold ${themeStyles.heading}`}>Day 2: Historical Core & Eiffel Cluster</h4>
                    <p className={`text-xs ${themeStyles.subtext}`}>3 Stops · Total Transit: 32 mins · 8.4 km · Zero Criss-Crossing</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Haversine Proximity Grouped
                  </span>
                </div>
              </div>

              {/* 3D Map Canvas Simulation */}
              <div className="relative h-96 rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
                {/* Stylized dark map grid pattern */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* SVG Connected Polyline Route */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 120 280 Q 220 240 340 180 T 560 140 T 780 220"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                    className="animate-pulse"
                  />
                  {/* Glowing glow underlay */}
                  <path
                    d="M 120 280 Q 220 240 340 180 T 560 140 T 780 220"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="12"
                    strokeOpacity="0.25"
                  />
                </svg>

                {/* Hotel Basecamp Pin */}
                <div className="absolute top-[260px] left-[100px] flex flex-col items-center">
                  <div className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold shadow-lg mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3" /> Hotel Hub
                  </div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center shadow-lg animate-ping absolute" />
                  <div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center shadow-lg relative z-10">
                    <Building className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* 3D Numbered Pin 1: Louvre Museum */}
                <Map3DPin
                  top="160px"
                  left="320px"
                  num="1"
                  title="Louvre Museum"
                  time="09:30 AM"
                  tag="90 mins visit"
                  color="from-cyan-400 to-blue-500"
                />

                {/* 3D Numbered Pin 2: Tuileries Garden */}
                <Map3DPin
                  top="120px"
                  left="540px"
                  num="2"
                  title="Tuileries Garden"
                  time="12:00 PM"
                  tag="Lunch & Walk"
                  color="from-amber-400 to-orange-500"
                />

                {/* 3D Numbered Pin 3: Eiffel Tower */}
                <Map3DPin
                  top="200px"
                  left="760px"
                  num="3"
                  title="Eiffel Tower Summit"
                  time="04:30 PM"
                  tag="Sunset Views"
                  color="from-violet-500 to-purple-600"
                />

                {/* Floating Map Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Interactive 3D Perspective</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 6: DYNAMIC BUDGET OPTIMIZER & CHARTS
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '6-budget') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 06"
              title="Dynamic Budget Optimizer & Expense Breakdown"
              subtitle="Mathematical cost breakdown across flights, stays, food, and sightseeing with one-click budget optimization."
              themeStyles={themeStyles}
            />

            <div className={`p-6 md:p-8 rounded-3xl ${themeStyles.cardBg} border ${isDark ? 'border-white/10' : 'border-slate-200'} shadow-2xl`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Ring Chart Breakdown */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6">
                  <div className="relative w-52 h-52">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Flights: 60% */}
                      <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="12" fill="none" strokeDasharray="150 100" />
                      {/* Hotels: 25% */}
                      <circle cx="50" cy="50" r="40" stroke="#8b5cf6" strokeWidth="12" fill="none" strokeDasharray="62 188" strokeDashoffset="-150" />
                      {/* Activities/Food: 15% */}
                      <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="38 212" strokeDashoffset="-212" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${themeStyles.subtext}`}>Allocated</span>
                      <span className={`text-2xl font-black ${themeStyles.heading}`}>₹84,500</span>
                      <span className="text-[10px] text-emerald-400 font-bold">100% Grounded</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Flights (60%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> Stays (25%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Food & Sight (15%)</span>
                  </div>
                </div>

                {/* Itemized Table & Auto-Optimize Action */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-base font-bold ${themeStyles.heading}`}>Itemized Expense Allocation</h4>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                      Within Target Ceiling
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { category: 'Return Flights (2 Pax)', amount: '₹51,000', detail: 'Air France via Google Flights', status: 'Booked' },
                      { category: 'Boutique Hotel (3 Nights)', amount: '₹24,600', detail: 'Hôtel Saint-Germain via Google Hotels', status: 'Lowest rate' },
                      { category: 'Sightseeing & Admissions', amount: '₹5,400', detail: 'Louvre, Eiffel Summit, River Cruise', status: 'Included' },
                      { category: 'Local Metro & Dining', amount: '₹3,500', detail: 'Estimated transit & meals', status: 'Buffer' }
                    ].map(row => (
                      <div key={row.category} className={`p-3.5 rounded-2xl flex items-center justify-between ${themeStyles.innerCardBg}`}>
                        <div>
                          <p className={`text-xs font-bold ${themeStyles.heading}`}>{row.category}</p>
                          <p className={`text-[10px] ${themeStyles.subtext}`}>{row.detail}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-black ${themeStyles.heading}`}>{row.amount}</p>
                          <span className="text-[9px] text-emerald-400 font-bold uppercase">{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className={`text-xs font-semibold ${themeStyles.heading}`}>Want to shave ₹12,000 off this plan?</span>
                    </div>
                    <button className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-all">
                      Auto-Optimize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 7: AI DECISION REASONING & VERIFIED REVIEWS
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '7-reasoning') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 07"
              title="AI Decision Reasoning & Review Intelligence"
              subtitle="Full transparency: AI reveals why each flight and hotel was picked over alternatives based on live SerpApi reviews."
              themeStyles={themeStyles}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotel Reasoning Card */}
              <div className={`p-6 rounded-3xl ${themeStyles.cardBg} border ${isDark ? 'border-white/10' : 'border-slate-200'} shadow-xl space-y-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${themeStyles.heading}`}>Why This Hotel Was Selected</h4>
                      <p className={`text-[10px] ${themeStyles.subtext}`}>Ranked #1 of 14 SerpApi Hotel Options</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
                    AI Chosen
                  </span>
                </div>

                <p className={`text-xs leading-relaxed p-3.5 rounded-2xl ${themeStyles.innerCardBg} ${themeStyles.subtext}`}>
                  "Selected Hôtel Saint-Germain due to its exceptional proximity (under 1.2 km) to your Day 2 and Day 3 stops, coupled with a 4.7★ guest score across 1,240 verified Google reviews. It avoids a 45-minute daily commute that cheaper peripheral stays require."
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>89% positive sentiment for walkability & cleanliness</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Popular location; free cancellation confirmed via SerpApi</span>
                  </div>
                </div>
              </div>

              {/* Flight Reasoning Card */}
              <div className={`p-6 rounded-3xl ${themeStyles.cardBg} border ${isDark ? 'border-white/10' : 'border-slate-200'} shadow-xl space-y-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${themeStyles.heading}`}>Why This Flight Was Selected</h4>
                      <p className={`text-[10px] ${themeStyles.subtext}`}>Ranked #1 for Value & Optimal Arrival</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    AI Chosen
                  </span>
                </div>

                <p className={`text-xs leading-relaxed p-3.5 rounded-2xl ${themeStyles.innerCardBg} ${themeStyles.subtext}`}>
                  "Selected Air France Direct over a ₹4,000 cheaper 1-stop carrier. The 1-stop option entailed a 6-hour layover in Doha that would consume your entire Day 1 afternoon. This flight lands at 08:30 AM, granting you a full additional exploration day."
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Guarantees 7 additional waking hours in destination</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cyan-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Includes 23kg check-in baggage per traveler</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 8: AI REPLANNER & WHAT-IF SIMULATOR
           ════════════════════════════════════════════════════════════════ */}
        {(activeScreen === 'all' || activeScreen === '8-replanner') && (
          <section className="space-y-6">
            <SectionHeader
              step="Screen 08"
              title="AI Replanner & What-If Simulator"
              subtitle="Simulate real-world disruptions (flight delays, budget cuts, pace shifts) and watch the agent recalculate routes on the fly."
              themeStyles={themeStyles}
            />

            <div className={`p-6 md:p-8 rounded-3xl ${themeStyles.cardBg} border ${isDark ? 'border-white/10' : 'border-slate-200'} shadow-2xl`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: What-If Buttons */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <h4 className={`text-sm font-bold ${themeStyles.heading}`}>What-If Scenario Triggers</h4>
                  </div>
                  <p className={`text-xs ${themeStyles.subtext}`}>
                    Click any simulation scenario to instantly re-cluster stops and adjust budget allocations:
                  </p>

                  <div className="space-y-2 pt-2">
                    {[
                      { text: 'My flight is delayed by 4 hours', icon: Clock, color: 'text-amber-400' },
                      { text: 'Reduce total budget to ₹65,000', icon: IndianRupee, color: 'text-emerald-400' },
                      { text: 'Make Day 2 relaxed & café-focused', icon: Coffee, color: 'text-cyan-400' },
                      { text: 'Add 1 more day for Versailles Palace', icon: Calendar, color: 'text-violet-400' }
                    ].map(btn => {
                      const Icon = btn.icon;
                      const isSelected = activeSim === btn.text;
                      return (
                        <button
                          key={btn.text}
                          onClick={() => setActiveSim(btn.text)}
                          className={`w-full p-3 rounded-2xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg scale-[1.02]'
                              : `${themeStyles.innerCardBg} ${themeStyles.heading} hover:border-indigo-400/40`
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : btn.color}`} />
                            <span>{btn.text}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Dynamic Conversational Replanner Result */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-400" />
                      <h4 className={`text-sm font-bold ${themeStyles.heading}`}>AI Replanning Agent Output</h4>
                    </div>

                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'} space-y-3`}>
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Active Simulation: "{activeSim}"</span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {activeSim.includes('delayed')
                          ? '⚡ Handled smoothly: Shifted Louvre Museum from Day 1 morning to Day 2 afternoon. Transferred Day 1 evening activity to a relaxed Seine River cruise right by your hotel so you don\'t lose a day.'
                          : activeSim.includes('budget')
                          ? '⚡ Budget trimmed by ₹19,500: Replaced boutique hotel with a highly-rated modern design aparthotel in Le Marais, maintaining 4.6★ rating while preserving all scheduled activities.'
                          : '⚡ Timeline adapted: Inserted 3-hour buffer between stops, reserved prime outdoor seating at Café de Flore, and eliminated fast-paced transit legs.'}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-emerald-400 font-bold">
                        <span>✓ Route Re-Clustered</span>
                        <span>✓ Zero Dropped Bookings</span>
                        <span>✓ Cost Balanced</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Chat Console Bar */}
                  <div className="pt-2">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!simQuery.trim()) return;
                        setActiveSim(simQuery);
                        setSimQuery('');
                      }}
                      className="relative flex items-center"
                    >
                      <input
                        type="text"
                        value={simQuery}
                        onChange={(e) => setSimQuery(e.target.value)}
                        placeholder="Type any constraint (e.g. 'It is raining on Day 2', 'Swap to train')..."
                        className={`w-full pl-4 pr-12 py-3 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${themeStyles.inputBg}`}
                      />
                      <button
                        type="submit"
                        className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SPECIAL SECTION: EDITORIAL VISUAL IDENTITY SHOWCASE
           ════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6 pt-6 border-t border-slate-200/20">
          <SectionHeader
            step="Design Aesthetic Masterclasses"
            title="Awwwards & Luxury Travel Magazine Directions"
            subtitle="Side-by-side design studies combining aerial ocean clarity with high-altitude twilight AI core intelligence."
            themeStyles={themeStyles}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direction 1: Ocean Reef Editorial (Image 1 Reference) */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden space-y-4 ${
              isDark ? 'bg-gradient-to-br from-teal-950/40 via-slate-900 to-cyan-950/30 border-cyan-500/30' : 'bg-gradient-to-br from-teal-50 via-white to-cyan-50 border-cyan-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  Direction A: Ocean Turquoise Editorial
                </span>
                <span className={`text-xs ${themeStyles.subtext}`}>Aerial Reef & Cliff Depth</span>
              </div>

              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl border border-white/20 group">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=85"
                  alt="Ocean Aerial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                {/* Big Bold Editorial Number '02' & Quote */}
                <div className="absolute top-6 left-6 text-white space-y-1">
                  <div className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-white/90">
                    02
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Indonesia
                  </h4>
                  <p className="text-xs text-white/80 italic font-serif max-w-[240px]">
                    "Travel is the only thing you buy that makes you richer."
                  </p>
                </div>

                {/* Floating Glassmorphic Details Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 text-white shadow-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">Raja Ampat</span>
                      <strong className="text-sm font-bold">West Papua Terraces</strong>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 font-black text-xs">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>4.95 (1.4k)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <div className="w-6 h-6 rounded-full bg-cyan-400 border border-white text-[9px] font-bold flex items-center justify-center text-slate-950">JD</div>
                      <div className="w-6 h-6 rounded-full bg-indigo-500 border border-white text-[9px] font-bold flex items-center justify-center text-white">MK</div>
                      <div className="w-6 h-6 rounded-full bg-violet-500 border border-white text-[9px] font-bold flex items-center justify-center text-white">+84</div>
                    </div>

                    <button className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-black shadow-md hover:bg-slate-100 transition-colors">
                      Start Journey →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Direction 2: Twilight Airplane Window & AI Holographic Core (Image 2 Reference) */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden space-y-4 ${
              isDark ? 'bg-gradient-to-br from-violet-950/40 via-slate-900 to-indigo-950/30 border-violet-500/30' : 'bg-gradient-to-br from-purple-50 via-white to-indigo-50 border-purple-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                  Direction B: Twilight AI Wing & Core
                </span>
                <span className={`text-xs ${themeStyles.subtext}`}>High-Altitude Flight Perspective</span>
              </div>

              <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl border border-white/20 group">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85"
                  alt="Twilight Wing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-950/40 to-black/30" />

                {/* Centered Iridescent AI Holographic Core with Voice Wave */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 p-[2px] shadow-2xl shadow-violet-500/50 animate-pulse">
                    <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>
                  <div className="mt-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold shadow-lg flex items-center gap-1.5">
                    <span>Explore Higher · TravelOS AI</span>
                  </div>
                </div>

                {/* Floating Glassmorphic Overwater Villa Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 text-white shadow-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">★ 4.98 SerpApi Rating</span>
                      <strong className="text-sm font-bold">Sea Pearl Resort & Spa</strong>
                    </div>
                    <span className="text-base font-black text-emerald-400">$140<span className="text-[10px] font-normal text-white/60">/night</span></span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-[11px] text-white/70">Verified Google Flights + Hotels</span>
                    <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-black text-xs shadow-md hover:scale-105 transition-transform">
                      Inspect Stay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── SUBCOMPONENTS ──

function SectionHeader({ step, title, subtitle, themeStyles }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          {step}
        </span>
      </div>
      <h3 className={`text-2xl font-black ${themeStyles.heading}`}>{title}</h3>
      <p className={`text-xs md:text-sm ${themeStyles.subtext}`}>{subtitle}</p>
    </div>
  );
}

function StatCard({ title, value, subtext, themeStyles, icon: Icon, color, valueColor }) {
  return (
    <div className={`p-5 rounded-2xl ${themeStyles.statCardBg} border space-y-1.5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs ${themeStyles.subtext}`}>{title}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className={`text-xl font-extrabold ${valueColor || themeStyles.heading} truncate`}>{value}</p>
      <p className={`text-[11px] ${themeStyles.subtext} truncate`}>{subtext}</p>
    </div>
  );
}

function Map3DPin({ top, left, num, title, time, tag, color }) {
  return (
    <div
      className="absolute flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-110"
      style={{ top, left }}
    >
      <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold shadow-2xl mb-1 flex items-center gap-1.5 whitespace-nowrap">
        <span>{title}</span>
        <span className="text-cyan-400">• {time}</span>
      </div>
      {/* 3D Shiny Pin Marker */}
      <div className="relative">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${color} border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs`}>
          {num}
        </div>
        <div className="w-2.5 h-1.5 mx-auto bg-black/50 blur-[2px] rounded-full transform translate-y-1" />
      </div>
    </div>
  );
}
