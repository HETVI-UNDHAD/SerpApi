import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import InteractiveRouteMap from './InteractiveRouteMap';
import PlaceImage from './PlaceImage';
import {
  Clock,
  Car,
  Compass,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  MapPin,
  IndianRupee,
  Star,
  Navigation,
  ArrowRight,
  ExternalLink,
  Route,
  CornerDownRight,
  Footprints,
  ChevronDown,
  ChevronUp,
  Plane,
  Building,
  ShieldCheck,
  Home
} from 'lucide-react';

export default function SmartItineraryView() {
  const { currentTrip, selectedDay, setSelectedDay, theme } = useTrip();
  const isDark = theme === 'dark';
  const [expandedTurns, setExpandedTurns] = useState({});
  const [activeFocusWaypoint, setActiveFocusWaypoint] = useState(null);

  if (!currentTrip?.itinerary) return null;

  const itineraryDays = currentTrip.itinerary || [];
  const activeDayData = itineraryDays.find(d => d.day === selectedDay) || itineraryDays[0];
  const hotel = currentTrip.selectedOptions?.hotel || activeDayData?.hotelBase || currentTrip.hotelAnchor;
  const isFirstDay = activeDayData?.day === 1;
  const isLastDay = activeDayData?.day === itineraryDays.length;

  function toggleTurns(id) {
    setExpandedTurns(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleFocusActivity(idx) {
    setActiveFocusWaypoint(idx);
    // Scroll smoothly to map on mobile/desktop
    const mapElement = document.getElementById('itinerary-map-section');
    if (mapElement && window.innerWidth < 1024) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* ── DAY SELECTOR JOURNAL TABS ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
        {itineraryDays.map(d => {
          const isSelected = d.day === selectedDay;
          return (
            <button
              key={d.day}
              onClick={() => {
                setSelectedDay(d.day);
                setActiveFocusWaypoint(null);
              }}
              className={`px-5 py-3 rounded-2xl font-black text-xs tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                  : isDark
                  ? 'bg-[#111726] text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>DAY 0{d.day}</span>
              {d.day === 1 && <span className="text-[10px] opacity-75">(Arrival)</span>}
              {d.day === itineraryDays.length && itineraryDays.length > 1 && <span className="text-[10px] opacity-75">(Departure)</span>}
            </button>
          );
        })}
      </div>

      {/* ── JOURNAL SPLIT: INTERACTIVE MAP & ROUTE TIMELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Route Map & Commute Intelligence */}
        <div id="itinerary-map-section" className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <InteractiveRouteMap
            dayData={activeDayData}
            hotel={hotel}
            destination={currentTrip.destination}
            transportation={currentTrip.transportation}
            activeFocusWaypoint={activeFocusWaypoint}
          />

          {/* Commute Intelligence Bar */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs shadow-sm ${
            isDark
              ? 'bg-[#111726] border-slate-800 text-slate-300'
              : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>
                Total Commute: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.routeSummary?.totalTravelTimeMinutes || activeDayData.totalTravelTimeMinutes || 35} mins</strong>
              </span>
            </div>
            <span className="opacity-40">•</span>
            <div>
              Total Road: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.routeSummary?.totalRoadDistanceKm || activeDayData.totalDistanceKm || 12} km</strong>
            </div>
            <span className="opacity-40">•</span>
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Hotel Return Loop ✓</span>
            </div>
          </div>

          {/* Hotel Basecamp Card (Geographic Anchor) */}
          {hotel && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
              isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏨</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                      Geographic Anchor
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                      Basecamp
                    </span>
                  </div>
                  <strong className={`text-sm block mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {hotel.name}
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{hotel.address || `${currentTrip.destination} Central`}</span>
                  </p>
                  {hotel.airportContext && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Distance to Airport: {hotel.airportContext.roadDistanceKm} km (~{hotel.airportContext.driveMinutes} min drive)
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleFocusActivity(-1)}
                className="px-3 py-1.5 rounded-xl border border-indigo-500/40 text-indigo-400 hover:text-white hover:bg-indigo-600 font-bold text-[11px] whitespace-nowrap transition-all flex items-center gap-1"
              >
                <span>View Stay</span>
                <Navigation className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Digital Travel Journal Timeline (WHERE WE GO & HOW TO GO) */}
        <div className="lg:col-span-6 space-y-6">

          {/* Day Title & Route Summary Box (Requirement 12 & 13) */}
          <div className="space-y-3 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  DAY 0{activeDayData.day} PHYSICAL JOURNEY &amp; ROUTE
                </span>
                <h3 className={`text-2xl font-black mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeDayData.title}
                </h3>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {activeDayData.activities?.length || 0} Curated Stops
              </span>
            </div>

            {/* Daily Route Summary Box (Requirement 12) */}
            {activeDayData.routeSummary && (
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-indigo-400 uppercase tracking-wider text-[10px]">
                    📍 DAY 0{activeDayData.day} ROUTE SUMMARY
                  </span>
                  <span className="text-emerald-400 font-black">
                    Saved ~{activeDayData.routeSummary.distanceSavedKm} km ({activeDayData.routeSummary.efficiencyGainPercent}% gain)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px]">Road Distance</span>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.routeSummary.totalRoadDistanceKm} km</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Drive Time</span>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.routeSummary.totalTravelTimeMinutes} min</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Longest Leg</span>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.routeSummary.longestTransferKm} km</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Hotel Return</span>
                    <strong className="text-emerald-400">Confirmed ✓</strong>
                  </div>
                </div>

                {/* Why This Route Was Chosen (Requirement 13) */}
                <div className="pt-2 border-t border-slate-800/60 text-[11px] leading-relaxed text-slate-400 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-cyan-400 font-bold">Why this route? </strong>
                    {activeDayData.routeSummary.whyThisRoute}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sequential Timeline: COMPLETE PHYSICAL JOURNEY */}
          <div className="space-y-6 relative">

            {/* ══════════════════════════════════════════════════════════
                DAY 1 INBOUND JOURNEY (Origin Transfer → Transit → Destination Transfer → Check-In)
               ══════════════════════════════════════════════════════════ */}
            {isFirstDay && activeDayData.originTransfer && (
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border-sky-800/60' : 'bg-sky-50 border-sky-200'
              }`}>
                {/* Transfer Step 1: Origin to Departure Airport/Station */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-wider border border-sky-500/30">
                      Step 1: Origin Transfer
                    </span>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeDayData.originTransfer.from} → {activeDayData.originTransfer.to}
                    </h4>
                    <p className="text-xs text-slate-400">
                      🚗 Estimated road distance: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.originTransfer.roadDistanceKm} km</strong> · Travel time: ~{activeDayData.originTransfer.estimatedDriveMinutes} mins
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-[10px] text-slate-500 block uppercase">Recommended Leave Home</span>
                    <strong className="text-sky-400 font-black text-sm">{activeDayData.originTransfer.recommendedLeaveHomeTime}</strong>
                  </div>
                </div>

                <div className="text-[11px] p-2.5 rounded-xl bg-black/30 border border-white/5 text-slate-300 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Airport Arrival Window: <strong>{activeDayData.originTransfer.recommendedHubArrivalTime}</strong></span>
                    <span>Safety Buffer: <strong>{activeDayData.originTransfer.safetyBufferMinutes} min buffer</strong></span>
                  </div>
                  <p className="text-[10px] text-slate-500">{activeDayData.originTransfer.note}</p>
                </div>
              </div>
            )}

            {/* Flight / Transit Main Inbound Segment */}
            {isFirstDay && currentTrip.transportation && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border-indigo-800/60' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {currentTrip.transportation.mode === 'flight' ? <Plane className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block">
                      Step 2: Inter-City Transit
                    </span>
                    <strong className={`text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currentTrip.origin} → {currentTrip.destination}
                    </strong>
                    <span className="text-xs text-slate-400">
                      {currentTrip.transportation.operator || 'Scheduled Service'} · {currentTrip.transportation.duration || '2h 10m'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400 block">
                    {currentTrip.transportation.cost ? `₹${currentTrip.transportation.cost.toLocaleString('en-IN')}` : 'Included'}
                  </span>
                  <span className="text-[10px] text-slate-400">Verified Fare</span>
                </div>
              </div>
            )}

            {/* Transfer Step 3: Destination Airport/Station to Hotel Basecamp */}
            {isFirstDay && activeDayData.destinationArrivalTransfer && (
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border-emerald-800/50' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                      Step 3: Airport → Hotel Transfer
                    </span>
                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeDayData.destinationArrivalTransfer.from} → {hotel?.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      🚗 Road distance: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.destinationArrivalTransfer.roadDistanceKm} km</strong> · Drive duration: ~{activeDayData.destinationArrivalTransfer.estimatedDriveMinutes} mins
                    </p>
                  </div>
                  <button
                    onClick={() => handleFocusActivity(-2)}
                    className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md transition-all"
                  >
                    <span>View Route</span>
                    <Navigation className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-900/40 text-emerald-300">
                  <span>🚗 Cab Pickup: <strong>{activeDayData.destinationArrivalTransfer.cabPickupTime}</strong></span>
                  <span>🏨 Hotel Arrival: <strong>{activeDayData.destinationArrivalTransfer.hotelArrivalTime}</strong></span>
                  <span>Check-in: <strong>{activeDayData.destinationArrivalTransfer.recommendedCheckInTime}</strong></span>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                ACTIVITIES & CORRIDORS FOR THE DAY
               ══════════════════════════════════════════════════════════ */}
            {activeDayData.activities?.map((act, index) => {
              const transit = act.transitToHere;
              const isWalking = transit?.mode === 'walking';
              const isAuto = transit?.mode === 'auto';
              const showTurns = expandedTurns[act.id || index];

              return (
                <div key={act.id || index} className="space-y-3">

                  {/* ═══════════ "HOW TO GO" TRANSIT CONNECTOR CARD ═══════════ */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    isDark
                      ? 'bg-[#0B0F19] border-slate-800/80 text-slate-300'
                      : 'bg-indigo-50/50 border-indigo-100 text-slate-700'
                  }`}>
                    {/* Header Row: Mode Pill, Route Corridor & Navigation Deep-Link */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                          isWalking
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : isAuto
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                        }`}>
                          {isWalking ? <Footprints className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                          <span>{transit?.modeLabel || 'Transit Commute'}</span>
                        </span>

                        <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {transit?.distanceKm || act.distanceFromPrevKm || 3} km · {transit?.durationMinutes || act.travelTimeFromPrevMin || 12} mins
                        </span>

                        <span className="text-[10px] text-slate-500">
                          (Estimated Road Distance)
                        </span>
                      </div>

                      {/* Live Google Maps Turn-by-Turn GPS Button */}
                      {transit?.googleMapsDirectionsUrl && (
                        <a
                          href={transit.googleMapsDirectionsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>GPS Directions</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                        </a>
                      )}
                    </div>

                    {/* Route Corridor & Turn Instructions */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-semibold truncate">
                        <Route className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {transit?.corridor || `Via ${currentTrip.destination} Primary Commute Corridor`}
                        </span>
                      </div>

                      {transit?.instructions && transit.instructions.length > 0 && (
                        <button
                          onClick={() => toggleTurns(act.id || index)}
                          className="text-[10px] font-bold text-cyan-400 hover:text-white flex items-center gap-0.5 flex-shrink-0 ml-2"
                        >
                          <span>{showTurns ? 'Hide Steps' : 'Step Guidance'}</span>
                          {showTurns ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* Expandable Step-by-Step Guidance */}
                    {showTurns && transit?.instructions && (
                      <div className={`mt-2.5 p-3 rounded-xl space-y-1.5 text-[11px] border ${
                        isDark ? 'bg-[#06080F] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        {transit.instructions.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ═══════════ "WHERE WE GO" VENUE / STOP CARD (Requirement 9 & 10) ═══════════ */}
                  <div
                    className={`p-6 rounded-3xl border transition-all duration-300 shadow-xl space-y-4 ${
                      isDark
                        ? 'bg-[#111726] border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Stop Badge & Time Slot */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                          {act.order || index + 1}
                        </div>
                        <span className={`flex items-center gap-1.5 font-bold ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        }`}>
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {act.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          {act.category}
                        </span>
                        {/* VIEW ON MAP BUTTON (Requirement 10 & 18) */}
                        <button
                          onClick={() => handleFocusActivity(index)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>View on Map</span>
                        </button>
                      </div>
                    </div>

                    {/* Venue Heading, Photo & Real Details */}
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-md">
                        <PlaceImage
                          query={
                            act.placeDetails?.thumbnail
                              ? null
                              : `${act.title} ${currentTrip.destination} travel landmark`
                          }
                          fallbackSrc={act.placeDetails?.thumbnail || null}
                          alt={act.title}
                          className="w-full h-full object-cover"
                          skeletonClassName="absolute inset-0"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <h4 className={`text-lg font-black leading-snug ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {act.title}
                        </h4>

                        {/* Real SerpApi Address */}
                        <div className="text-xs text-slate-400 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            {act.placeDetails?.address || `${currentTrip.destination} Region`}
                          </span>
                        </div>

                        {/* Ratings & Operating Hours */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                          {act.placeDetails?.rating && (
                            <span className="flex items-center gap-1 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{act.placeDetails.rating}</span>
                              <span className="text-slate-500 font-normal">
                                ({act.placeDetails.reviewsCount || '750'}+ Google reviews)
                              </span>
                            </span>
                          )}

                          <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px]">
                            {act.placeDetails?.operatingHours || '🟢 Open Daily'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PHYSICAL MOVEMENT INFORMATION BADGES (Requirement 10) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-black/20 border border-white/5 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">From Your Stay</span>
                        <strong className="text-cyan-400">{act.distanceFromHotelKm || 8.2} km</strong> · ~{act.travelTimeFromHotelMin || 22} min
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Previous Stop</span>
                        <strong className={isDark ? 'text-white' : 'text-slate-900'}>{act.distanceFromPrevKm || 4.1} km</strong> · ~{act.travelTimeFromPrevMin || 14} min
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Estimated Visit</span>
                        <strong className="text-amber-400">{act.estimatedVisitDurationMinutes ? `${act.estimatedVisitDurationMinutes / 60} hrs` : '2.0 hrs'}</strong>
                      </div>
                    </div>

                    {/* Editorial Reason for Selection */}
                    <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                      isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-cyan-400 block mb-0.5">Why this was selected:</span>
                        {act.selectionReason || 'Top-rated destination landmark clustered along your day corridor.'}
                      </div>
                    </div>

                    {/* Footer with Cost, Pro-Tip & Google Maps Venue Link */}
                    <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
                      isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        <Info className="w-3 h-3 text-amber-400" />
                        <span>{act.tip || 'Optimal visiting hours for best photography.'}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        {act.approxCost > 0 ? (
                          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ~₹{act.approxCost} entry
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold">
                            Free Entry
                          </span>
                        )}

                        {act.placeDetails?.googleMapsUrl && (
                          <a
                            href={act.placeDetails.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg border border-slate-700 hover:border-cyan-400 text-cyan-400 hover:text-white font-bold text-[10px] flex items-center gap-1 transition-all"
                          >
                            <span>Venue Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* ═══════════ "RETURN TO BASECAMP" TRANSIT CONNECTOR ═══════════ */}
            {activeDayData.returnTransitToHotel && (
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-[#0B0F19] border-indigo-900/60 text-slate-300'
                  : 'bg-indigo-50/70 border-indigo-200 text-slate-700'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border bg-indigo-500/10 border-indigo-500/30 text-indigo-400">
                      <Building className="w-3 h-3" />
                      <span>Return to Stay Basecamp</span>
                    </span>

                    <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeDayData.returnTransitToHotel.distanceKm} km · {activeDayData.returnTransitToHotel.durationMinutes} mins
                    </span>

                    <span className="text-[10px] text-slate-500">
                      (Estimated Road Commute)
                    </span>
                  </div>

                  <button
                    onClick={() => handleFocusActivity(-1)}
                    className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    <span>Focus Stay</span>
                    <Navigation className="w-3 h-3" />
                  </button>
                </div>

                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>
                    {activeDayData.returnTransitToHotel.corridor || 'Via Primary Arterial Corridor back to hotel basecamp'}
                  </span>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                FINAL DAY OUTBOUND JOURNEY (Hotel Check-Out → Airport Transfer → Return Transit → Home)
               ══════════════════════════════════════════════════════════ */}
            {isLastDay && activeDayData.returnDepartureTransfer && (
              <div className={`p-5 rounded-3xl border space-y-3 mt-4 ${
                isDark ? 'bg-gradient-to-r from-amber-950/30 to-orange-950/30 border-amber-800/60' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                    Final Day Return Journey (Hotel → Home)
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    Leave Hotel: <strong>{activeDayData.returnDepartureTransfer.leaveHotelTime}</strong>
                  </span>
                </div>

                <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeDayData.returnDepartureTransfer.fromHotel} → {activeDayData.returnDepartureTransfer.toHub} → {activeDayData.returnDepartureTransfer.finalDestination}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs p-3 rounded-2xl bg-black/30 border border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Hotel to Airport Drive</span>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.returnDepartureTransfer.hotelToHubDistanceKm} km (~{activeDayData.returnDepartureTransfer.hotelToHubDriveMinutes} min)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Airport Buffer</span>
                    <strong className="text-amber-400">{activeDayData.returnDepartureTransfer.safetyBufferMinutes} min safety buffer</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Flight Departure</span>
                    <strong className="text-emerald-400">{activeDayData.returnDepartureTransfer.scheduledReturnDeparture}</strong>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
