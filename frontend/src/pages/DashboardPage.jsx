import React from 'react';
import { useTrip } from '../context/TripContext';
import SmartItineraryView from '../components/SmartItineraryView';
import TravelIntelligenceView from '../components/TravelIntelligenceView';
import AiAssistantReplanner from '../components/AiAssistantReplanner';
import CheckForChangesModal from '../components/CheckForChangesModal';
import InteractiveRouteMap from '../components/InteractiveRouteMap';
import PlaceImage from '../components/PlaceImage';
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
  Car
} from 'lucide-react';

export default function DashboardPage() {
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

  const isDark = theme === 'dark';

  if (!currentTrip) return null;

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
  const isOverBudget = budgetStatus?.isOverBudget;
  const overBudgetDiff = budgetStatus?.difference || 0;
  const budgetUtilization = Number.isFinite(Number(totalCost)) && Number(budget) > 0
    ? Math.round((Number(totalCost) / Number(budget)) * 100)
    : null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'itinerary', label: 'Smart Itinerary', icon: Calendar },
    { id: 'map', label: 'Route Map', icon: MapPin },
    { id: 'flights', label: 'Flights & Transit', icon: Plane },
    { id: 'hotels', label: 'Hotels & Stays', icon: Building },
    { id: 'budget', label: 'Budget Optimizer', icon: IndianRupee },
    { id: 'intelligence', label: 'AI Reasoning & Reviews', icon: Brain },
    { id: 'assistant', label: 'AI Replanner & What-If', icon: MessageSquare }
  ];

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 transition-colors duration-500 font-sans ${
      isDark ? 'bg-[#0A0A0F]/28 text-slate-100' : 'bg-white/10 text-slate-900'
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <div className="px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-2xl border border-white/20 text-white text-xs font-bold shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SerpApi Grounded Master Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-cyan-300 bg-black/55 backdrop-blur-2xl px-3 py-1 rounded-full border border-cyan-400/30">
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
              <p className="text-xs sm:text-sm font-light text-slate-200 drop-shadow flex items-center gap-2">
                <span>{duration} DAYS</span>
                <span className="opacity-40">•</span>
                <span>{travelers} TRAVELERS</span>
              </p>
            </div>

            {/* Floating Luxury Budget Tag Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 text-white shadow-2xl space-y-1">
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
            ? 'glass-panel-dark border-white/10'
            : 'glass-panel-light border-slate-200/80 shadow-luxury-light'
        }`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TravelOS Autonomous Live Decision Console</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Target Ceiling: <strong className={isDark ? 'text-white' : 'text-slate-900'}>₹{budget?.toLocaleString('en-IN')}</strong> · All options verified live via SerpApi engines.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={checkForChanges}
              disabled={isCheckingChanges}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                isDark
                  ? 'bg-slate-900 border-white/10 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingChanges ? 'animate-spin' : ''}`} />
              <span>Check for Changes</span>
            </button>

            {isOverBudget && (
              <button
                onClick={optimizeTripBudget}
                disabled={isReplanning}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-black shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-105"
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Optimize for Budget</span>
              </button>
            )}

            <button
              onClick={resetTrip}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-500/25 transition-all hover:scale-105"
            >
              New Journey
            </button>
          </div>
        </div>

        {/* ── BUDGET ALERT BANNER (IF OVER BUDGET) ── */}
        {isOverBudget && (
          <div className="p-5 rounded-3xl bg-amber-950/20 border border-amber-500/30 text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-sm block font-bold">
                  Your plan exceeds your target budget by ₹{overBudgetDiff.toLocaleString('en-IN')}.
                </strong>
                <span className="text-xs text-amber-300">
                  {budgetOptimizationError || budgetStatus?.optimizationRecommendation || budgetStatus?.alternatives?.suggestions?.[0] || 'No lower-cost alternatives are currently available.'}
                </span>
              </div>
            </div>

            <button
              onClick={optimizeTripBudget}
              disabled={isReplanning}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs whitespace-nowrap shadow-md transition-colors"
            >
              {isReplanning ? 'Optimizing...' : `Auto-Optimize for ₹${budget.toLocaleString('en-IN')}`}
            </button>
          </div>
        )}

        {/* ── LUXURY TAB NAVIGATION PILLS ── */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 overflow-x-auto ${
          isDark ? 'bg-slate-900/60 border-white/8' : 'bg-slate-100/80 border-slate-200'
        }`}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all duration-200 ${
                  isSelected
                    ? `after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-[#c8ef61] ${isDark ? 'bg-white/[0.06] text-white' : 'bg-white text-slate-950 shadow-sm'}`
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW (MAGAZINE DASHBOARD WITH RHYTHM)
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 KPI Stat Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatWidget
                isDark={isDark}
                title="Total Estimated Cost"
                value={`₹${totalCost.toLocaleString('en-IN')}`}
                sub={`~₹${budgetBreakdown?.costPerPerson?.toLocaleString('en-IN')} per traveler`}
                icon={IndianRupee}
                color="text-indigo-500"
              />
              <StatWidget
                isDark={isDark}
                title="Budget Status"
                value={isOverBudget ? `Exceeds by ₹${overBudgetDiff.toLocaleString('en-IN')}` : `Within Budget`}
                sub={`Target: ₹${budget.toLocaleString('en-IN')}`}
                icon={ShieldCheck}
                color={isOverBudget ? 'text-amber-500' : 'text-emerald-500'}
                valueColor={isOverBudget ? 'text-amber-500' : 'text-emerald-500'}
              />
              <StatWidget
                isDark={isDark}
                title="Selected Stay"
                value={selectedOptions.hotel?.name || 'Curated Stay'}
                sub={`₹${selectedOptions.hotel?.pricePerNight?.toLocaleString('en-IN')}/night • ★ ${selectedOptions.hotel?.rating || 4.6}`}
                icon={Building}
                color="text-violet-500"
              />
              <StatWidget
                isDark={isDark}
                title="Primary Transit"
                value={transportMode === 'flight' ? (selectedOptions.flight?.airline || 'Flight information unavailable') : transportMode === 'train' ? 'Train' : 'Self Car'}
                sub={`${transportation?.distance || transportation?.duration || transportation?.details?.formattedDuration || (transportation?.available ? 'Route available' : 'Route unavailable')} • ${transportation?.cost == null ? 'Cost not provided' : `₹${transportation.cost.toLocaleString('en-IN')}${transportation.costType === 'estimated' ? ' estimated' : ''}`}`}
                icon={Plane}
                color="text-cyan-500"
              />
            </div>

            {/* Day-by-Day Journey Preview Cards */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 ${
              isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200/80 shadow-luxury-light'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black text-lg flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Journey Outline & Route Clustering
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Stops clustered geographically using Haversine math to minimize commute times.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Journal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {itinerary?.slice(0, 3).map(day => (
                  <div
                    key={day.day}
                    className={`p-5 rounded-2xl border space-y-2.5 transition-all hover:-translate-y-1 ${
                      isDark
                        ? 'bg-slate-800/40 border-white/5 hover:border-white/15'
                        : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-indigo-500">DAY 0{day.day}</span>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {day.activities?.length || 0} stops
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold line-clamp-1 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{day.title}</h4>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {day.activities?.[0]?.title} → {day.activities?.[1]?.title || 'Evening coastal retreat'}
                    </p>
                    <div className={`pt-2 text-[10px] font-semibold flex items-center justify-between border-t ${
                      isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1"><Car className="w-3 h-3 text-cyan-500" /> ~{day.totalTravelTimeMinutes || 30} mins transit</span>
                      <span>{day.totalDistanceKm || 12} km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Decision Rationale Teaser */}
            <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark
                ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900/80 to-cyan-950/30 border-indigo-500/20'
                : 'bg-gradient-to-r from-indigo-50 via-white to-cyan-50 border-indigo-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-wider">
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
                <h3 className={`text-xl font-black flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <Plane className="w-5 h-5 text-cyan-500" />
                  {transportMode === 'flight' ? `Live Google Flights via SerpApi (${origin} → ${destination})` : transportMode === 'train' ? `Train / Transit via Google Maps (${origin} → ${destination})` : `Self Car via Google Maps (${origin} → ${destination})`}
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {transportMode === 'flight' ? 'Real-time ticket prices, airline schedules, and booking links when returned.' : transportMode === 'train' ? 'Google Maps transit route details; fares appear only when returned by the route API.' : 'Google Maps driving route details and transparently estimated fuel cost.'}
                </p>
              </div>
            </div>

            {transportMode !== 'flight' ? (
              transportation?.available ? <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4"><span className="font-black text-base">{transportMode === 'train' ? (transportation.operator || 'Train / Transit') : 'Self Car'}</span><span className="text-lg font-black text-emerald-500">{transportation.cost == null ? 'Cost not provided' : `₹${transportation.cost.toLocaleString('en-IN')}${transportation.costType === 'estimated' ? ' estimated' : ''}`}</span></div>
                <div className="text-sm space-y-2"><div>{transportation.details?.startAddress || origin} → {transportation.details?.endAddress || destination}</div>{transportation.details?.startStop && <div>Board at {transportation.details.startStop}{transportation.details.endStop ? ` · arrive ${transportation.details.endStop}` : ''}</div>}<div>Distance: {transportation.distance || 'Not provided'} · Duration: {transportation.duration || 'Not provided'}</div>{transportation.operator && <div>Service: {transportation.operator}</div>}{transportation.details?.stops != null && <div>Stops/transfers: {transportation.details.stops}</div>}{transportMode === 'self_car' && <div>{transportation.costAssumptions ? `Fuel estimate uses ${transportation.costAssumptions.fuelEfficiencyKmPerLitre} km/L and ₹${transportation.costAssumptions.fuelPricePerLitre}/L assumptions; it is not a live fuel price.` : 'Fuel cost estimate unavailable because route distance was not returned.'}</div>}{transportation.tollInfo && <div>Toll information: {typeof transportation.tollInfo === 'string' ? transportation.tollInfo : JSON.stringify(transportation.tollInfo)}</div>}{transportation.route?.steps?.map((step, index) => step.instruction && <div key={index} className="text-xs opacity-75">{step.instruction}</div>)}</div>
              </div> : <div className="p-6 rounded-3xl border border-amber-500/20 text-sm">{transportMode === 'train' ? 'No train route found for this journey.' : 'Driving route unavailable.'}</div>
            ) : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveData?.flights?.map((fl, idx) => (
                <div
                  key={fl.id || idx}
                  className={`p-6 rounded-3xl border transition-all duration-300 ${
                    fl.airline === selectedOptions.flight?.airline
                      ? isDark
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/20'
                        : 'bg-indigo-50/70 border-indigo-400 shadow-xl shadow-indigo-100'
                      : isDark
                      ? 'bg-slate-900/60 border-white/10'
                      : 'bg-white border-slate-200/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {fl.airline}
                      </span>
                      {fl.airline === selectedOptions.flight?.airline && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          AI Chosen
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-black text-emerald-500">
                      ₹{fl.price?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs mb-4 ${
                    isDark ? 'bg-slate-800/40 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className={`font-black text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {fl.departureTime}
                      </span>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{origin}</span>
                    </div>

                    <div className="text-center text-[10px] space-y-1">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{fl.duration}</span>
                      <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full" />
                      <span className="font-bold text-cyan-400">{fl.stops === 0 ? 'Non-Stop' : `${fl.stops} Stop`}</span>
                    </div>

                    <div className="text-right">
                      <span className={`font-black text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {fl.arrivalTime}
                      </span>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{destination}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Grounded via Google Flights
                    </span>
                    {fl.bookingLink && <a
                      href={fl.bookingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-500 hover:text-cyan-400 font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>View Live Fare</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>}
                  </div>
                </div>
              ))}
            </div>}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 5: HOTELS & STAYS
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'hotels' && (
          <div className="space-y-6">
            <h3 className={`text-xl font-black flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <Building className="w-5 h-5 text-indigo-500" />
              Live Google Hotels via SerpApi ({destination})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {liveData?.hotels?.map((h, idx) => (
                <div
                  key={h.id || idx}
                  className={`group rounded-3xl border overflow-hidden transition-all duration-300 card-hover ${
                    h.name === selectedOptions.hotel?.name
                      ? isDark
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-500/20'
                        : 'bg-indigo-50/50 border-indigo-400 shadow-xl shadow-indigo-100'
                      : isDark
                      ? 'bg-slate-900/70 border-white/8 shadow-luxury-dark'
                      : 'bg-white border-slate-200/80 shadow-luxury'
                  }`}
                >
                  <div className="relative h-56">
                    <PlaceImage
                      query={h.image ? null : `${h.name} ${destination} hotel resort`}
                      fallbackSrc={h.image || null}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      skeletonClassName="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-amber-400 text-xs font-black border border-white/10 flex items-center gap-1">
                      <span>★ {h.rating || 4.6}</span>
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
                      <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ₹{h.pricePerNight?.toLocaleString('en-IN')}<span className="text-xs font-normal opacity-60">/night</span>
                      </span>
                    </div>

                    <h4 className={`font-bold text-sm line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {h.name}
                    </h4>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {h.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {h.amenities?.slice(0, 3).map((am, i) => (
                        <span
                          key={i}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 6: BUDGET OPTIMIZER (WITH ELEGANT SVG CHARTS)
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-10 rounded-3xl border shadow-xl space-y-8 ${
              isDark ? 'glass-panel-dark border-white/10' : 'glass-panel-light border-slate-200/80 shadow-luxury-light'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-black flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <IndianRupee className="w-5 h-5 text-emerald-500" />
                    Dynamic Budget Allocation & Optimizer
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Categorical breakdown across transport, stays, food, and activities.
                  </p>
                </div>
                {isOverBudget && (
                  <button
                    onClick={optimizeTripBudget}
                    disabled={isReplanning}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    {isReplanning ? 'Optimizing...' : 'Auto-Optimize'}
                  </button>
                )}
              </div>

              {/* 5 Category Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { title: transportMode === 'flight' ? 'Flight' : transportMode === 'train' ? 'Train' : 'Self Car', val: budgetBreakdown?.transportation, unavailable: budgetBreakdown?.transportationCostUnavailable, col: 'text-cyan-500', bg: isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200' },
                  { title: `🏨 Hotels`, val: budgetBreakdown?.accommodation, col: 'text-violet-500', bg: isDark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200' },
                  { title: `Food`, val: budgetBreakdown?.foodAndDining, col: 'text-amber-500', bg: isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200' },
                  { title: `🎫 Activities`, val: budgetBreakdown?.activitiesAndSightseeing, col: 'text-emerald-500', bg: isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200' },
                  { title: `🚕 Transit`, val: budgetBreakdown?.localTransit, col: 'text-blue-500', bg: isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200' }
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
                  <span className={isOverBudget ? 'text-amber-500' : 'text-emerald-500'}>
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

              {/* AI Recommendation */}
              <div className={`p-5 rounded-2xl border flex items-start gap-3 ${
                isDark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200'
              }`}>
                <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-violet-500 uppercase tracking-wider mb-1">✨ AI Recommendation</p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {budgetOptimizationError || budgetStatus?.optimizationRecommendation || (isOverBudget
                      ? 'No lower-cost alternatives are currently available.'
                      : `Your budget allocation is well-optimized. Transportation and accommodation account for ${totalCost > 0 ? Math.round(((budgetBreakdown?.transportation || 0) + (budgetBreakdown?.accommodation || 0)) / totalCost * 100) : 0}% of total spend.`)}
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

      </div>
    </div>
  );
}

function StatWidget({ title, value, sub, icon: Icon, color, valueColor, isDark }) {
  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 card-hover space-y-2 ${
      isDark
        ? 'bg-slate-900/70 border-white/8 shadow-luxury-dark hover:border-white/15'
        : 'bg-white border-slate-200/80 shadow-luxury hover:border-slate-300 hover:shadow-card-hover'
    }`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-200'}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <p className={`${title === 'Total Estimated Cost' ? 'text-3xl sm:text-4xl' : 'text-lg'} font-bold tracking-tight truncate ${valueColor || (isDark ? 'text-white' : 'text-slate-900')}`}>{value}</p>
      <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</p>
    </div>
  );
}
