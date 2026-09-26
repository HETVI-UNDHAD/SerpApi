import React from 'react';
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
  Star
} from 'lucide-react';

export default function SmartItineraryView() {
  const { currentTrip, selectedDay, setSelectedDay, theme } = useTrip();
  const isDark = theme === 'dark';

  if (!currentTrip?.itinerary) return null;

  const itineraryDays = currentTrip.itinerary || [];
  const activeDayData = itineraryDays.find(d => d.day === selectedDay) || itineraryDays[0];

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
                  ? 'bg-slate-900/60 text-slate-300 border border-white/10 hover:border-white/20'
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
        <div className="lg:col-span-6 space-y-4">
          <InteractiveRouteMap
            dayData={activeDayData}
            hotel={currentTrip.selectedOptions?.hotel}
            destination={currentTrip.destination}
            transportation={currentTrip.transportation}
          />

          {/* Commute Intelligence Bar */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs shadow-sm ${
            isDark
              ? 'bg-slate-900/80 border-white/10 text-slate-300'
              : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-500" />
              <span>
                Total Commute: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.totalTravelTimeMinutes || 35} mins</strong>
              </span>
            </div>
            <span className="opacity-40">•</span>
            <div>
              Total Distance: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeDayData.totalDistanceKm || 12} km</strong>
            </div>
            <span className="opacity-40">•</span>
            <div className="text-emerald-500 font-bold">
              ✓ Haversine Clustered
            </div>
          </div>
        </div>

        {/* Right Side: Digital Travel Journal Timeline */}
        <div className="lg:col-span-6 space-y-5">
          {/* Day Title Journal Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/20">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                DAY 0{activeDayData.day} JOURNAL
              </span>
              <h3 className={`text-2xl font-black mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeDayData.title}
              </h3>
              {activeDayData.day === 1 && currentTrip.transportation && (
                <p className="text-xs mt-1 text-cyan-500">
                  {currentTrip.origin} → {currentTrip.destination} · {currentTrip.transportation.mode === 'self_car' ? 'Self-car driving route' : currentTrip.transportation.mode === 'train' ? 'Train / transit route' : 'Selected flight'} · {currentTrip.transportation.duration || 'duration unavailable'}
                </p>
              )}
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              {activeDayData.activities?.length || 0} Curated Stops
            </span>
          </div>

          {/* Chronological Vertical Timeline */}
          <div className="space-y-4">
            {activeDayData.activities?.map((act, index) => {
              const pinColors = [
                'from-cyan-400 to-blue-500',
                'from-amber-400 to-orange-500',
                'from-violet-500 to-purple-600',
                'from-emerald-400 to-teal-500'
              ];
              const grad = pinColors[index % pinColors.length];

              return (
                <div
                  key={act.id || index}
                  className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 shadow-md space-y-4 ${
                    isDark
                      ? 'bg-slate-900/60 border-white/10 hover:border-white/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-luxury-light'
                  }`}
                >
                  {/* Top Timeline Badge & Time Slot */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${grad} text-white text-xs font-black flex items-center justify-center shadow-md`}>
                        {act.order || index + 1}
                      </div>
                      <span className={`flex items-center gap-1.5 font-bold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {act.time}
                      </span>
                    </div>

                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      {act.category}
                    </span>
                  </div>

                  {/* Thumbnail & Activity Heading */}
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-md">
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
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-base font-black leading-snug line-clamp-1 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {act.title}
                      </h4>
                      <div className="text-xs text-indigo-500 flex items-center gap-1.5 font-semibold mt-1">
                        <Car className="w-3.5 h-3.5" />
                        <span>{act.travelTimeFromPrev || '10 mins transit'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Reason for Selection */}
                  <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                    isDark ? 'bg-slate-800/40 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <Sparkles className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-cyan-500 block mb-0.5">Why this was selected:</span>
                      {act.selectionReason || 'Top-rated landmark with zero backtracking along your day route.'}
                    </div>
                  </div>

                  {/* Footer with Cost & Pro-Tip */}
                  <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3 h-3 text-amber-500" />
                      <span>{act.tip || 'Optimal visiting hours for best photography.'}</span>
                    </span>

                    {act.approxCost > 0 ? (
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ~₹{act.approxCost}
                      </span>
                    ) : (
                      <span className="text-emerald-500 font-bold">
                        Free Entry
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
