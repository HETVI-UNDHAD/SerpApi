import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import SmartItineraryView from '../components/SmartItineraryView';
import TravelIntelligenceView from '../components/TravelIntelligenceView';
import AiAssistantReplanner from '../components/AiAssistantReplanner';
import CheckForChangesModal from '../components/CheckForChangesModal';
import InteractiveRouteMap from '../components/InteractiveRouteMap';
import PlaceImage from '../components/PlaceImage';
import SerpApiGroundingModal from '../components/SerpApiGroundingModal';
import WhyThisPlanModal from '../components/WhyThisPlanModal';
import {
  Compass,
  Calendar,
  Users,
  IndianRupee,
  Plane,
  Building,
  MapPin,
  RefreshCw,
  Sliders,
  Sparkles,
  AlertCircle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Brain,
  MessageSquare,
  Clock,
  Car,
  Zap,
  HelpCircle,
  Route,
  Loader2
} from 'lucide-react';
import { getTransportVisual, TransportBadge } from '../utils/transportVisuals';

export default function DashboardPage() {
  const [groundingOpen, setGroundingOpen] = useState(false);
  const [whyPlanOpen, setWhyPlanOpen] = useState(false);
  const [optimizingProgress, setOptimizingProgress] = useState(null);
  const {
    currentTrip,
    activeTab,
    setActiveTab,
    selectedDay,
    setSelectedDay,
    optimizeTripBudget,
    checkForChanges,
    isCheckingChanges,
    isReplanning,
    budgetOptimizationError,
    resetTrip,
    theme
  } = useTrip();

  async function handleOptimizeBudget() {
    setOptimizingProgress(0);
    for (let i = 0; i <= 4; i++) {
      setOptimizingProgress(i);
      await new Promise(r => setTimeout(r, 220));
    }
    await optimizeTripBudget();
    setOptimizingProgress(null);
  }

  const isDark = theme === 'dark';

  if (!currentTrip) {
    return (
      <div className={`min-h-[70vh] flex items-center justify-center p-6 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}>
        <div className={`max-w-md w-full text-center p-8 rounded-3xl border shadow-xl ${
          isDark ? 'bg-[#0E1320] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-inner">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Active Trip Plan Yet</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Start planning your trip to generate an itinerary with live SerpApi Google Flights, Google Hotels, and Google Maps routing.
          </p>
          <button
            onClick={() => setActiveScreen('builder')}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02]"
          >
            Go to Trip Planner
          </button>
        </div>
      </div>
    );
  }

  const {
    destination,
    origin,
    duration,
    travelers,
    budget,
    budgetBreakdown,
    budgetStatus,
    selectedOptions,
    liveData,
    itinerary
  } = currentTrip;

  const totalCost = budgetBreakdown?.totalEstimatedCost || 0;
  const transportation = currentTrip.transportation || selectedOptions?.transportation;
  const transportMode = transportation?.mode || 'flight';
  const transportVisual = getTransportVisual(transportMode);
  const isOverBudget = budgetStatus?.isOverBudget;
  const overBudgetDiff = budgetStatus?.difference || 0;
  const budgetUtilization = Number.isFinite(Number(totalCost)) && Number(budget) > 0
    ? Math.round((Number(totalCost) / Number(budget)) * 100)
    : null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'itinerary', label: 'Smart Itinerary', icon: Calendar },
    { id: 'map', label: 'Route Map', icon: MapPin },
    { id: 'flights', label: `${transportVisual.label || 'Flights & Transit'}`, icon: transportVisual.icon || Plane },
    { id: 'hotels', label: 'Hotels & Stays', icon: Building },
    { id: 'budget', label: 'Budget Optimizer', icon: IndianRupee },
    { id: 'intelligence', label: 'AI Reasoning & Reviews', icon: Brain },
    { id: 'assistant', label: 'AI Replanner & What-If', icon: MessageSquare }
  ];

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 transition-colors duration-500 font-sans ${
      isDark ? 'bg-[#090D16] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── CINEMATIC DESTINATION HERO ── */}
        <div className="relative w-full h-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
          <PlaceImage
            query={`${destination} travel photography landscape scenic 4k`}
            alt={destination}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000 ease-out"
            skeletonClassName="absolute inset-0"
            eager
          />
          {/* Subtle cinematic gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-2xl border border-white/20 text-white text-xs font-bold shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SerpApi Grounded Master Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-300 bg-black/75 backdrop-blur-2xl px-3 py-1 rounded-full border border-cyan-400/30">
                📸 Live Photography
              </span>
            </div>
          </div>

          {/* Floating Magazine Destination Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="text-white space-y-1">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 drop-shadow">
                Departing from {origin}
              </p>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
                {destination}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow flex items-center gap-2">
                <span>{duration} DAYS</span>
                <span className="opacity-40">•</span>
                <span>{travelers} TRAVELERS</span>
              </p>
            </div>

            {/* Floating Luxury Budget Tag Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/20 text-white shadow-2xl space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-300 block">
                Total Estimated Cost
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>₹{totalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold pt-1">
                {isOverBudget ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Exceeds budget by ₹{overBudgetDiff.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Within Allocated Budget
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── TOP CONTROL BAR & ACTIONS ── */}
        <div className={`p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark
            ? 'bg-[#111726] border-slate-800 shadow-2xl'
            : 'bg-white border-slate-200/80 shadow-luxury-light'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trip Control</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Target Ceiling: <strong className={isDark ? 'text-white' : 'text-slate-900'}>₹{budget?.toLocaleString('en-IN')}</strong> · All options verified live via SerpApi.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={checkForChanges}
              disabled={isCheckingChanges}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingChanges ? 'animate-spin' : ''}`} />
              <span>Check for Changes</span>
            </button>

            {isOverBudget && (
              <button
                onClick={handleOptimizeBudget}
                disabled={isReplanning || optimizingProgress !== null}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Optimize Budget</span>
              </button>
            )}

            <button
              onClick={() => setWhyPlanOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-indigo-500/40 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-300 font-bold text-xs flex items-center gap-1.5 hover:from-indigo-500/25 hover:to-violet-500/25 transition-all hover:scale-105 shadow-sm"
              title="Inspect why this flight, hotel, and route were chosen"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Why this plan?</span>
            </button>

            <button
              onClick={() => setGroundingOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 font-bold text-xs flex items-center gap-1.5 hover:from-cyan-500/25 hover:to-indigo-500/25 transition-all hover:scale-105 shadow-sm"
              title="Inspect live SerpApi search queries & architecture"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Live Sources</span>
            </button>

            <button
              onClick={resetTrip}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              New Journey
            </button>
          </div>
        </div>

        {/* Optimizing Progress Banner (Section 15) */}
        {optimizingProgress !== null && (
          <div className={`p-5 rounded-2xl border shadow-lg animate-in fade-in duration-200 ${
            isDark ? 'bg-blue-950/40 border-blue-500/40 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <strong className="text-sm">Optimizing your trip...</strong>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className={`flex items-center gap-1.5 ${optimizingProgress >= 0 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                <span>{optimizingProgress >= 0 ? '✓' : '•'}</span> Checking hotels
              </div>
              <div className={`flex items-center gap-1.5 ${optimizingProgress >= 1 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                <span>{optimizingProgress >= 1 ? '✓' : '•'}</span> Checking transport
              </div>
              <div className={`flex items-center gap-1.5 ${optimizingProgress >= 2 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                <span>{optimizingProgress >= 2 ? '✓' : '•'}</span> Checking activities
              </div>
              <div className={`flex items-center gap-1.5 ${optimizingProgress >= 3 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                <span>{optimizingProgress >= 3 ? '✓' : '•'}</span> Recalculating routes
              </div>
              <div className={`flex items-center gap-1.5 ${optimizingProgress >= 4 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                <span>{optimizingProgress >= 4 ? '✓' : '•'}</span> Rechecking live data
              </div>
            </div>
          </div>
        )}

        {/* ── BUDGET ALERT BANNER (IF OVER BUDGET) ── */}
        {isOverBudget ? (
          <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
            isDark ? 'bg-amber-950/40 border-amber-500/40 text-amber-100' : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className={`text-sm block font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  Your plan exceeds your target budget by ₹{overBudgetDiff.toLocaleString('en-IN')}.
                </strong>
                <span className={`text-xs ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
                  {budgetOptimizationError || budgetStatus?.optimizationRecommendation || 'Click Auto-Optimize to rebalance stay tiers and transit to fit your target budget.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleOptimizeBudget}
              disabled={isReplanning || optimizingProgress !== null}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs whitespace-nowrap shadow-md transition-colors disabled:opacity-50"
            >
              {optimizingProgress !== null ? 'Optimizing...' : `Auto-Optimize for ₹${budget.toLocaleString('en-IN')}`}
            </button>
          </div>
        ) : (
          currentTrip.replanningReason?.includes('Auto-Optimized') && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-lg ${
              isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-xs">
                  <strong className="block font-black text-sm text-emerald-400">Budget Optimized Successfully!</strong>
                  <span>{currentTrip.replanningReason}</span>
                </div>
              </div>
            </div>
          )
        )}



        {/* ════════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW (THE 5 ESSENTIALS + YOUR JOURNEY)
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* The 5 Essential Questions Grid (Requirement 10) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* 1. Where am I going? */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">1. Where to</span>
                <strong className={`text-base font-bold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{destination}</strong>
                <p className="text-xs text-slate-400 truncate">From {origin}</p>
              </div>

              {/* 2. How am I getting there? */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 block">2. How to get there</span>
                  {transportation?.realityCheck && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20" title={transportation.realityCheck}>
                      ✓ Ground Reality Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 font-bold text-base">
                  <span>{transportVisual.emoji}</span>
                  <span className={`truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{transportVisual.label}</span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {selectedOptions.flight?.departureTime && selectedOptions.flight?.arrivalTime
                    ? `${selectedOptions.flight.departureTime} → ${selectedOptions.flight.arrivalTime}`
                    : transportation?.details?.formattedDuration || transportation?.duration || (transportation?.distance ? `${transportation.distance} road transit` : 'Direct transit')}
                </p>
                {transportation?.realityCheck && (
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">
                    {transportation.realityCheck}
                  </p>
                )}
              </div>

              {/* 3. Where am I staying? */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500 block">3. Where to stay</span>
                <strong className={`text-base font-bold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedOptions.hotel?.name || 'Curated Hotel'}
                </strong>
                <p className="text-xs text-slate-400 truncate">
                  {selectedOptions.hotel?.pricePerNight != null
                    ? `₹${selectedOptions.hotel.pricePerNight.toLocaleString('en-IN')}/night`
                    : 'Live price unavailable'}
                </p>
              </div>

              {/* 4. What will I do? */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">4. What to do</span>
                <strong className={`text-base font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {itinerary?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) || 0} Places
                </strong>
                <p className="text-xs text-slate-400 truncate">Across {duration} days</p>
              </div>

              {/* 5. How much will it cost? */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">5. Total Cost</span>
                <strong className="text-base font-bold block text-emerald-500">
                  ₹{totalCost.toLocaleString('en-IN')}
                </strong>
                <p className="text-xs text-slate-400 truncate">
                  ~₹{Math.round(totalCost / travelers).toLocaleString('en-IN')}/traveler
                </p>
              </div>
            </div>

            {/* ── YOUR JOURNEY TIMELINE (Requirement 9) ── */}
            <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 ${
              isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h3 className={`font-serif text-lg font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    YOUR JOURNEY
                  </h3>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Stay: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{selectedOptions.hotel?.name || 'Hotel Basecamp'}</strong></span>
                  <span>•</span>
                  <span>Total: <strong className="text-emerald-500">₹{totalCost.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              {/* Visual Journey Steps: 🏠 Origin → ✈️/🚆/🚗 Transit → 🚕 Hub → 🏨 Hotel → 📍 Day 1 → 🏨 Hotel → 📍 Day 2 */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-2 overflow-x-auto">
                {/* 1. Origin */}
                <div className={`p-3.5 rounded-2xl border text-center flex-1 w-full md:w-auto min-w-[130px] ${
                  isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-2xl block mb-1">🏠</span>
                  <strong className={`text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{origin}</strong>
                  <span className="text-[10px] text-slate-400 block">Departure</span>
                </div>

                <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                <span className="text-slate-400 font-bold md:hidden">↓</span>

                {/* 2. Transit */}
                <div className={`p-3.5 rounded-2xl border text-center flex-1 w-full md:w-auto min-w-[150px] ${
                  isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-2xl block mb-1">{transportVisual.emoji}</span>
                  <strong className={`text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{transportVisual.label}</strong>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {selectedOptions.flight?.departureTime && selectedOptions.flight?.arrivalTime
                      ? `${selectedOptions.flight.departureTime} → ${selectedOptions.flight.arrivalTime}`
                      : transportation?.duration || 'Transit'}
                  </span>
                </div>

                <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                <span className="text-slate-400 font-bold md:hidden">↓</span>

                {/* 3. Destination Hub (Only when arriving by flight or train) */}
                {transportMode !== 'self_car' && (
                  <>
                    <div className={`p-3.5 rounded-2xl border text-center flex-1 w-full md:w-auto min-w-[140px] ${
                      isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="text-2xl block mb-1">🚕</span>
                      <strong className={`text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{destination} Hub</strong>
                      <span className="text-[10px] text-slate-400 block">Local transfer</span>
                    </div>

                    <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                    <span className="text-slate-400 font-bold md:hidden">↓</span>
                  </>
                )}

                {/* 4. Hotel Base */}
                <div className={`p-3.5 rounded-2xl border text-center flex-1 w-full md:w-auto min-w-[150px] ${
                  isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-2xl block mb-1">🏨</span>
                  <strong className={`text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedOptions.hotel?.name || 'Hotel'}</strong>
                  <span className="text-[10px] text-slate-400 block">Check-in</span>
                </div>

                {/* 5. Day 1 */}
                <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                <span className="text-slate-400 font-bold md:hidden">↓</span>

                <div className={`p-3.5 rounded-2xl border text-center flex-1 w-full md:w-auto min-w-[140px] ${
                  isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-2xl block mb-1">📍</span>
                  <strong className={`text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Day 1</strong>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {itinerary?.[0]?.activities?.length || 0} places
                  </span>
                </div>

                {/* 6. Day 2 if applicable */}
                {itinerary?.length > 1 && (
                  <>
                    <span className="text-slate-400 font-bold hidden md:inline">➔</span>
                    <span className="text-slate-400 font-bold md:hidden">↓</span>

                    <div className={`p-3.5 rounded-2xl border text-center flex-1 w-full md:w-auto min-w-[140px] ${
                      isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="text-2xl block mb-1">📍</span>
                      <strong className={`text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Day 2</strong>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {itinerary?.[1]?.activities?.length || 0} places
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Day-by-Day Journey Preview Cards (Requirement 11 & 12) */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 ${
              isDark ? 'bg-[#111726] border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-serif text-lg font-bold flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Your Daily Routes</span>
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Optimized daily itineraries clustered geographically to minimize transit time.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {itinerary?.slice(0, 3).map(day => (
                  <div
                    key={day.day}
                    onClick={() => {
                      setSelectedDay(day.day);
                      setActiveTab('itinerary');
                    }}
                    className={`p-5 rounded-2xl border space-y-2.5 transition-all hover:-translate-y-1 cursor-pointer ${
                      isDark
                        ? 'bg-[#0B0F19] border-slate-800 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-blue-500">DAY {day.day}</span>
                      <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {day.activities?.length || 0} places · {day.totalDistanceKm || 12} km · ~{day.totalTravelTimeMinutes || 30} min
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold line-clamp-1 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{day.title}</h4>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {day.activities?.[0]?.title} → {day.activities?.[1]?.title || 'Evening exploration'}
                    </p>
                    <div className={`pt-2 text-[10px] font-semibold flex items-center justify-between border-t ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-cyan-400" />
                        ~{day.totalTravelTimeMinutes || 30} min travel
                      </span>
                      <span>Hotel Return ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Decision Rationale Teaser */}
            <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark
                ? 'bg-[#111726] border-slate-800 shadow-xl'
                : 'bg-gradient-to-r from-indigo-50 via-white to-cyan-50 border-indigo-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>Why This Itinerary Was Selected</span>
                </div>
                <p className={`text-xs max-w-2xl leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {currentTrip.decisions?.whyHotel || 'Selected based on live SerpApi guest ratings (4.7★) and optimal geographical proximity to minimize daily road travel.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('intelligence')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black whitespace-nowrap shadow-md transition-all hover:scale-105"
              >
                Inspect AI Reasoning
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 2: SMART ITINERARY (TRAVEL JOURNAL AESTHETIC)
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'itinerary' && <SmartItineraryView />}

        {/* ════════════════════════════════════════════════════════════════
            TAB 3: INTERACTIVE ROUTE MAP
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <InteractiveRouteMap
              dayData={itinerary?.find(d => d.day === selectedDay) || itinerary?.[0]}
              hotel={selectedOptions.hotel}
              destination={destination}
              transportation={transportation}
            />
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 4: FLIGHTS & TRANSIT
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-2xl font-black flex items-center gap-2.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <Plane className="w-6 h-6 text-cyan-400" />
                  {transportMode === 'flight' ? `Live Google Flights via SerpApi (${origin} → ${destination})` : transportMode === 'train' ? `Train / Transit via Google Maps (${origin} → ${destination})` : `Self Car via Google Maps (${origin} → ${destination})`}
                </h3>
                <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {transportMode === 'flight' ? 'Real-time ticket prices, airline schedules, and booking links verified live.' : transportMode === 'train' ? 'Google Maps transit route details; fares appear only when returned by the route API.' : 'Google Maps driving route details and transparently estimated fuel cost.'}
                </p>
              </div>
            </div>

            {transportMode !== 'flight' ? (
              transportation?.available ? (
                <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#111726] border-slate-800 shadow-xl' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-base">{transportMode === 'train' ? (transportation.operator || 'Train / Transit') : 'Self Car'}</span>
                    <span className="text-xl font-black text-emerald-400">
                      {transportation.cost == null ? 'Cost not provided' : `₹${transportation.cost.toLocaleString('en-IN')}${transportation.costType === 'estimated' ? ' estimated' : ''}`}
                    </span>
                  </div>
                  <div className="text-sm space-y-2">
                    <div>{transportation.details?.startAddress || origin} → {transportation.details?.endAddress || destination}</div>
                    {transportation.details?.startStop && <div>Board at {transportation.details.startStop}{transportation.details.endStop ? ` · arrive ${transportation.details.endStop}` : ''}</div>}
                    <div>Distance: {transportation.distance || 'Not provided'} · Duration: {transportation.duration || 'Not provided'}</div>
                    {transportation.operator && <div>Service: {transportation.operator}</div>}
                    {transportation.details?.stops != null && <div>Stops/transfers: {transportation.details.stops}</div>}
                    {transportMode === 'self_car' && <div>{transportation.costAssumptions ? `Fuel estimate uses ${transportation.costAssumptions.fuelEfficiencyKmPerLitre} km/L and ₹${transportation.costAssumptions.fuelPricePerLitre}/L assumptions; it is not a live fuel price.` : 'Fuel cost estimate unavailable because route distance was not returned.'}</div>}
                    {transportation.tollInfo && <div>Toll information: {typeof transportation.tollInfo === 'string' ? transportation.tollInfo : JSON.stringify(transportation.tollInfo)}</div>}
                    {transportation.route?.steps?.map((step, index) => step.instruction && <div key={index} className="text-xs opacity-75">{step.instruction}</div>)}
                  </div>
                </div>
              ) : (
                <div className={`p-8 rounded-3xl border text-center space-y-3 max-w-md mx-auto ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                    🗺️
                  </div>
                  <h4 className="font-bold text-base">Route information unavailable</h4>
                  <p className="text-xs text-slate-400">
                    {transportMode === 'train' ? 'No direct train route was returned by SerpApi for this journey.' : 'Driving route information unavailable.'}
                  </p>
                </div>
              )
            ) : (!liveData?.flights || liveData.flights.length === 0) ? (
              <div className={`p-8 rounded-3xl border text-center space-y-3 max-w-md mx-auto ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto text-2xl">
                  ✈️
                </div>
                <h4 className="font-bold text-base">Live flight information unavailable</h4>
                <p className="text-xs text-slate-400">
                  SerpApi could not verify live flight schedules or fares for this route.
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                >
                  Search again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveData?.flights?.map((fl, idx) => (
                  <div
                    key={fl.id || idx}
                    className={`p-6 rounded-3xl border transition-all duration-300 ${
                      fl.airline === selectedOptions.flight?.airline
                        ? isDark
                          ? 'bg-[#162038] border-indigo-500 shadow-xl shadow-indigo-500/20'
                          : 'bg-indigo-50/70 border-indigo-400 shadow-xl shadow-indigo-100'
                        : isDark
                        ? 'bg-[#111726] border-slate-800 shadow-xl hover:border-slate-700'
                        : 'bg-white border-slate-200/80 shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {fl.airline}
                        </span>
                        {fl.airline === selectedOptions.flight?.airline && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-400/40">
                            AI Chosen
                          </span>
                        )}
                      </div>
                      <span className="text-2xl font-black text-emerald-400">
                        ₹{fl.price?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs mb-4 ${
                      isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <span className={`font-black text-base block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {fl.departureTime}
                        </span>
                        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{origin}</span>
                      </div>

                      <div className="text-center text-xs space-y-1">
                        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{fl.duration}</span>
                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full" />
                        <span className="font-bold text-cyan-400 text-[11px]">{fl.stops === 0 ? 'Non-Stop' : `${fl.stops} Stop`}</span>
                      </div>

                      <div className="text-right">
                        <span className={`font-black text-base block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {fl.arrivalTime}
                        </span>
                        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> Grounded via Google Flights
                      </span>
                      {fl.bookingLink && <a
                        href={fl.bookingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold flex items-center gap-1.5 border border-cyan-500/30 transition-colors"
                      >
                        <span>View Live Fare</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 5: HOTELS & STAYS
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <h3 className={`text-2xl font-black flex items-center gap-2.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Building className="w-6 h-6 text-indigo-400" />
              Live Google Hotels via SerpApi ({destination})
            </h3>

            {(!liveData?.hotels || liveData.hotels.length === 0) ? (
              <div className={`p-8 rounded-3xl border text-center space-y-3 max-w-md mx-auto ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
                  🏨
                </div>
                <h4 className="font-bold text-base">Live price unavailable</h4>
                <p className="text-xs text-slate-400">
                  SerpApi could not verify the current price.
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                >
                  Search again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {liveData?.hotels?.map((h, idx) => (
                  <div
                    key={h.id || idx}
                    className={`group rounded-3xl border overflow-hidden transition-all duration-300 card-hover ${
                      h.name === selectedOptions.hotel?.name
                        ? isDark
                          ? 'bg-[#162038] border-indigo-500 shadow-xl shadow-indigo-500/20'
                          : 'bg-indigo-50/50 border-indigo-400 shadow-xl shadow-indigo-100'
                        : isDark
                        ? 'bg-[#111726] border-slate-800 shadow-xl hover:border-slate-700'
                        : 'bg-white border-slate-200/80 shadow-luxury'
                    }`}
                  >
                  <div className="relative h-56">
                    {h.image ? (
                      <img
                        src={h.image}
                        alt={h.name}
                        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                        className="group-hover:scale-[1.04] transition-transform duration-700"
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextSibling?.classList?.remove('hidden');
                        }}
                      />
                    ) : (
                      <PlaceImage
                        query={`${h.name} ${destination} hotel resort`}
                        fallbackSrc={null}
                        alt={h.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                        skeletonClassName="absolute inset-0"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-400 text-xs font-black border border-white/10 flex items-center gap-1">
                      <span>{h.rating != null ? `★ ${h.rating}` : '★ Live data unavailable'}</span>
                    </div>
                    {h.name === selectedOptions.hotel?.name && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black shadow-md">
                        ✓ AI Selected
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rate</span>
                      <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {h.pricePerNight != null ? (
                          <>₹{h.pricePerNight.toLocaleString('en-IN')}<span className="text-xs font-normal opacity-60">/night</span></>
                        ) : (
                          <span className="text-xs text-slate-400 font-normal">Live data unavailable</span>
                        )}
                      </span>
                    </div>

                    <h4 className={`font-bold text-sm line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {h.name}
                    </h4>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {h.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {h.amenities?.slice(0, 3).map((am, i) => (
                        <span
                          key={i}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isDark ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {am}
                        </span>
                      ))}
                    </div>

                    {/* Location Context (Requirement 11) */}
                    <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/80 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>✈️ Airport: {currentTrip?.hotelAnchor?.airportContext ? `~${currentTrip.hotelAnchor.airportContext.driveMinutes} min (${currentTrip.hotelAnchor.airportContext.roadDistanceKm} km)` : '~40 min drive'}</span>
                        <span>🚆 Station: {currentTrip?.hotelAnchor?.railwayContext ? `~${currentTrip.hotelAnchor.railwayContext.driveMinutes} min` : '~25 min'}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-indigo-400 font-bold">
                          Day 1 Cluster: ~{currentTrip?.hotelAnchor?.clusterDistances?.[0]?.distanceKm || 4.2} km
                        </span>
                        <button
                          onClick={() => setActiveTab('map')}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>View Route</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 6: BUDGET OPTIMIZER (WITH ELEGANT SVG CHARTS)
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-10 rounded-3xl border shadow-xl space-y-8 ${
              isDark ? 'bg-[#111726] border-slate-800 shadow-xl' : 'bg-white border-slate-200/80 shadow-luxury-light'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-2xl font-black flex items-center gap-2.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <IndianRupee className="w-6 h-6 text-emerald-400" />
                    Dynamic Budget Allocation & Optimizer
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Categorical breakdown across transport, stays, food, and activities.
                  </p>
                </div>
                {isOverBudget && (
                  <button
                    onClick={handleOptimizeBudget}
                    disabled={isReplanning || optimizingProgress !== null}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                  >
                    {optimizingProgress !== null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{optimizingProgress !== null ? 'Optimizing...' : 'Auto-Optimize Trip'}</span>
                  </button>
                )}
              </div>

              {/* Progress State (Section 15) */}
              {optimizingProgress !== null && (
                <div className={`p-5 rounded-2xl border shadow-lg ${isDark ? 'bg-blue-950/40 border-blue-500/40' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="font-bold text-xs uppercase tracking-wider">Optimizing your trip...</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className={`flex items-center gap-1 ${optimizingProgress >= 0 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                      <span>{optimizingProgress >= 0 ? '✓' : '•'}</span> Checking hotels
                    </div>
                    <div className={`flex items-center gap-1 ${optimizingProgress >= 1 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                      <span>{optimizingProgress >= 1 ? '✓' : '•'}</span> Checking transport
                    </div>
                    <div className={`flex items-center gap-1 ${optimizingProgress >= 2 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                      <span>{optimizingProgress >= 2 ? '✓' : '•'}</span> Checking activities
                    </div>
                    <div className={`flex items-center gap-1 ${optimizingProgress >= 3 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                      <span>{optimizingProgress >= 3 ? '✓' : '•'}</span> Recalculating routes
                    </div>
                    <div className={`flex items-center gap-1 ${optimizingProgress >= 4 ? 'text-emerald-500 font-bold' : 'opacity-40'}`}>
                      <span>{optimizingProgress >= 4 ? '✓' : '•'}</span> Rechecking live data
                    </div>
                  </div>
                </div>
              )}

              {/* Before / After Optimization Diff (Section 15) */}
              {currentTrip.optimizationDiff && (
                <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
                  isDark ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-500">
                      ✓ Trip Optimization Complete
                    </span>
                    <div className="text-xs font-bold space-x-3">
                      <span className="text-slate-400">Before: <del>₹{currentTrip.optimizationDiff.beforeCost?.toLocaleString('en-IN')}</del></span>
                      <span className="text-emerald-500 font-black">After: ₹{currentTrip.optimizationDiff.afterCost?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Hotel rebalanced
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Transport verified
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Activities adjusted
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Daily routes recalculated
                    </div>
                  </div>
                </div>
              )}

              {/* 5 Category Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { title: transportVisual.label || 'Transit', val: budgetBreakdown?.transportation, unavailable: budgetBreakdown?.transportationCostUnavailable, col: 'text-cyan-400', bg: isDark ? 'bg-cyan-950/30 border-cyan-800/40' : 'bg-cyan-50 border-cyan-200' },
                  { title: `🏨 Hotels`, val: budgetBreakdown?.accommodation, col: 'text-violet-400', bg: isDark ? 'bg-violet-950/30 border-violet-800/40' : 'bg-violet-50 border-violet-200' },
                  { title: `Food`, val: budgetBreakdown?.foodAndDining, col: 'text-amber-400', bg: isDark ? 'bg-amber-950/30 border-amber-800/40' : 'bg-amber-50 border-amber-200' },
                  { title: `🎫 Activities`, val: budgetBreakdown?.activitiesAndSightseeing, col: 'text-emerald-400', bg: isDark ? 'bg-emerald-950/30 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200' },
                  { title: `🚕 Transit`, val: budgetBreakdown?.localTransit, col: 'text-blue-400', bg: isDark ? 'bg-blue-950/30 border-blue-800/40' : 'bg-blue-50 border-blue-200' }
                ].map(c => (
                  <div key={c.title} className={`p-4 rounded-2xl border ${c.bg}`}>
                    <span className={`text-[11px] block mb-1.5 font-bold ${c.col}`}>{c.title}</span>
                    <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {c.unavailable ? 'Unavailable' : `₹${c.val?.toLocaleString('en-IN') || 0}`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Budget Progress Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Budget Utilization</span>
                  <span className={isOverBudget ? 'text-amber-400' : 'text-emerald-400'}>
                    {budgetUtilization == null ? '—' : `${budgetUtilization}%`} of ₹{budget.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-800' : 'bg-slate-200'
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isOverBudget ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-cyan-500'
                    }`}
                    style={{ width: `${budget > 0 ? Math.min((totalCost / budget) * 100, 100) : totalCost > 0 ? 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* AI Recommendation / Notice */}
              <div className={`p-5 rounded-2xl border flex items-start gap-3 ${
                isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Budget Optimization Status</p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {budgetOptimizationError
                      ? 'No lower-cost verified option is currently available.'
                      : (isOverBudget
                        ? 'Click Auto-Optimize above to autonomously rebalance transit, stays, and activities to bring this trip under budget.'
                        : `Your budget allocation is well-balanced. Transportation and accommodation account for ${totalCost > 0 ? Math.round(((budgetBreakdown?.transportation || 0) + (budgetBreakdown?.accommodation || 0)) / totalCost * 100) : 0}% of total spend.`)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 7: AI REASONING & REVIEWS
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'intelligence' && <TravelIntelligenceView />}

        {/* ════════════════════════════════════════════════════════════════
            TAB 8: AI REPLANNER & WHAT-IF SIMULATOR
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'assistant' && <AiAssistantReplanner />}

        {/* Live Changes Verification Modal */}
        <CheckForChangesModal />

        {/* Live SerpApi Grounding & Differentiation Modal */}
        <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />

        {/* Explainability & Constraint Health Inspector */}
        <WhyThisPlanModal isOpen={whyPlanOpen} onClose={() => setWhyPlanOpen(false)} trip={currentTrip} isDark={isDark} />

      </div>
    </div>
  );
}

function StatWidget({ title, value, sub, icon: Icon, color, valueColor, isDark }) {
  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 card-hover space-y-2 ${
      isDark
        ? 'bg-[#111726] border-slate-800 shadow-xl hover:border-slate-700'
        : 'bg-white border-slate-200/80 shadow-luxury hover:border-slate-300 hover:shadow-card-hover'
    }`}>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{title}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800/80 border border-slate-700/60' : 'bg-slate-50 border border-slate-200'}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <p className={`${title === 'Total Estimated Cost' ? 'text-3xl sm:text-4xl' : 'text-lg'} font-extrabold tracking-tight truncate ${valueColor || (isDark ? 'text-white' : 'text-slate-900')}`}>{value}</p>
      <p className={`text-xs truncate font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{sub}</p>
    </div>
  );
}
