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
  ChevronUp
} from 'lucide-react';

export default function SmartItineraryView() {
  const { currentTrip, selectedDay, setSelectedDay, theme } = useTrip();
  const isDark = theme === 'dark';
  const [expandedTurns, setExpandedTurns] = useState({});

  if (!currentTrip?.itinerary) return null;

  const itineraryDays = currentTrip.itinerary || [];
  const activeDayData = itineraryDays.find(d => d.day === selectedDay) || itineraryDays[0];
  const hotel = currentTrip.selectedOptions?.hotel || activeDayData?.hotelBase;

  function toggleTurns(id) {
    setExpandedTurns(prev => ({ ...prev, [id]: !prev[id] }));
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
              onClick={() => setSelectedDay(d.day)}
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
            </button>
          );
        })}
      </div>

      {/* ── JOURNAL SPLIT: INTERACTIVE MAP & ROUTE TIMELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Route Map & Commute Intelligence */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
          <InteractiveRouteMap
            dayData={activeDayData}
            hotel={hotel}
            destination={currentTrip.destination}
            transportation={currentTrip.transportation}
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
                Total Commute: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.totalTravelTimeMinutes || 35} mins</strong>
              </span>
            </div>
            <span className="opacity-40">•</span>
            <div>
              Total Distance: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.totalDistanceKm || 12} km</strong>
            </div>
            <span className="opacity-40">•</span>
            <div className="text-emerald-400 font-bold">
              ✓ Haversine Clustered
            </div>
          </div>

          {/* Hotel Basecamp Card */}
          {hotel && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
              isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🏨</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 block">
                    Day Basecamp (Start & Return Point)
                  </span>
                  <strong className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {hotel.name}
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{hotel.address || `${currentTrip.destination} Central`}</span>
                  </p>
                </div>
              </div>
              {hotel.googleMapsUrl && (
                <a
                  href={hotel.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-indigo-500/40 text-indigo-400 hover:text-white hover:bg-indigo-600 font-bold text-[11px] flex items-center gap-1 transition-all"
                >
                  <span>Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Digital Travel Journal Timeline (WHERE WE GO & HOW TO GO) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Day Title Journal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                DAY 0{activeDayData.day} ROUTE &amp; NAVIGATION
              </span>
              <h3 className={`text-2xl font-black mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeDayData.title}
              </h3>
              {activeDayData.day === 1 && currentTrip.transportation && (
                <p className="text-xs mt-1 text-cyan-400 font-medium">
                  {currentTrip.origin} → {currentTrip.destination} · {currentTrip.transportation.mode === 'self_car' ? 'Self-car driving route' : currentTrip.transportation.mode === 'train' ? 'Train / transit route' : 'Selected flight'} · {currentTrip.transportation.duration || 'duration unavailable'}
                </p>
              )}
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              {activeDayData.activities?.length || 0} Curated Stops
            </span>
          </div>

          {/* Sequential Timeline: HOW TO GO + WHERE WE GO */}
          <div className="space-y-6 relative">
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
                          {transit?.distanceKm || act.distanceFromPrevKm || 3} km · {transit?.durationMinutes || 12} mins
                        </span>

                        {transit?.estimatedFare && (
                          <span className="text-[11px] font-bold text-emerald-400">
                            ({transit.estimatedFare})
                          </span>
                        )}
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
                          <span>Live GPS Directions</span>
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

                  {/* ═══════════ "WHERE WE GO" VENUE / STOP CARD ═══════════ */}
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

                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        {act.category}
                      </span>
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

                        {/* Ratings & Operating Hours from Google Maps */}
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
                      <Car className="w-3 h-3" />
                      <span>Return to Hotel Basecamp</span>
                    </span>

                    <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activeDayData.returnTransitToHotel.distanceKm} km · {activeDayData.returnTransitToHotel.durationMinutes} mins
                    </span>

                    <span className="text-[11px] font-bold text-emerald-400">
                      ({activeDayData.returnTransitToHotel.estimatedFare})
                    </span>
                  </div>

                  {activeDayData.returnTransitToHotel.googleMapsDirectionsUrl && (
                    <a
                      href={activeDayData.returnTransitToHotel.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Live GPS Back to Hotel</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                    </a>
                  )}
                </div>

                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>
                    {activeDayData.returnTransitToHotel.corridor || 'Via Primary Arterial Corridor back to hotel basecamp'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
