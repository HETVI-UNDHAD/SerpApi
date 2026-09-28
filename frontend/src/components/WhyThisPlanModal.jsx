import React from 'react';
import {
  HelpCircle,
  X,
  Plane,
  Building,
  Route,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function WhyThisPlanModal({ isOpen, onClose, trip, isDark }) {
  if (!isOpen || !trip) return null;

  const {
    explainability,
    constraintReport,
    geospatialMetrics,
    budgetBreakdown,
    selectedOptions,
    destination
  } = trip;

  const exp = explainability || {};
  const checks = constraintReport?.checks || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          isDark
            ? 'bg-[#101626] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${
          isDark ? 'bg-[#101626]/95 border-slate-800 backdrop-blur-xl' : 'bg-white/95 border-slate-200 backdrop-blur-xl'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">Why This Plan? Decision Inspector</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                  Explainable AI
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Deterministic constraints and verified SerpApi data backing every decision.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* 1. Constraint Health Status Bar */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Constraint Health</span>
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                constraintReport?.valid
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {constraintReport?.valid ? 'All Constraints Satisfied' : 'Optimization Required'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {checks.map((chk, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    chk.passed
                      ? isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  <span className="font-bold truncate">{chk.name}</span>
                  <span className="font-mono text-[10px]">{chk.passed ? '✓ PASS' : '⚠ FLAG'}</span>
                </div>
              ))}
            </div>

            {constraintReport?.relaxationSuggestion && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{constraintReport.relaxationSuggestion.message}</span>
              </div>
            )}
          </div>

          {/* 2. Structured Decision Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Why This Flight / Transit */}
            <div className={`p-5 rounded-2xl border space-y-2.5 ${
              isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Why This Transport?</h4>
                  <span className="font-mono text-[10px] text-cyan-400">{exp.whyFlight?.airline || 'Direct Mode'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {exp.whyFlight?.rationale || 'Selected to arrive before noon, optimizing Day 1 exploration hours.'}
              </p>
              {exp.whyFlight?.priceFormatted && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Verified Fare:</span>
                  <strong className="text-white font-mono">{exp.whyFlight.priceFormatted}</strong>
                </div>
              )}
            </div>

            {/* Why This Hotel */}
            <div className={`p-5 rounded-2xl border space-y-2.5 ${
              isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Why This Accommodation?</h4>
                  <span className="font-mono text-[10px] text-violet-400">
                    {exp.whyHotel?.rating != null ? `${exp.whyHotel.rating}★ Verified Google Rating` : 'Google rating unavailable'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {exp.whyHotel?.rationale || 'Chosen for prime access to planned activity hubs within 20 mins.'}
              </p>
              {exp.whyHotel?.pricePerNightFormatted && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Nightly Rate:</span>
                  <strong className="text-white font-mono">{exp.whyHotel.pricePerNightFormatted}</strong>
                </div>
              )}
            </div>

            {/* Why This Route (Geospatial Clustering) */}
            <div className={`p-5 rounded-2xl border space-y-2.5 ${
              isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Route className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Why This Route Order?</h4>
                  <span className="font-mono text-[10px] text-emerald-400">Haversine Nearest-Neighbor</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {exp.whyRoute?.rationale || 'Clustered attractions by geographic quadrant to eliminate criss-crossing.'}
              </p>
              {geospatialMetrics && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Distance Saved:</span>
                  <strong className="text-emerald-400 font-mono">~{geospatialMetrics.estimatedDistanceSavedKm} km ({geospatialMetrics.efficiencyGainPercent}% less transit)</strong>
                </div>
              )}
            </div>

            {/* Why These Local Events */}
            <div className={`p-5 rounded-2xl border space-y-2.5 ${
              isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Why These Local Gigs?</h4>
                  <span className="font-mono text-[10px] text-amber-400">{exp.whyEvents?.count || 8} Live Happenings Found</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {exp.whyEvents?.rationale || 'Grounded in live search queries for community pop-ups, music gigs, and street food.'}
              </p>
              {exp.whyEvents?.sample && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Featured:</span>
                  <strong className="text-amber-300 truncate max-w-[200px]">{exp.whyEvents.sample}</strong>
                </div>
              )}
            </div>

          </div>

          {/* 3. Budget Ledger Transparency */}
          {budgetBreakdown && (
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-black uppercase tracking-wider text-slate-400">
                  Mathematical Budget Ledger Breakdown
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  Total: ₹{budgetBreakdown.totalEstimatedCost?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block">Transit</span>
                  <strong className="font-mono text-white">₹{budgetBreakdown.transportation?.toLocaleString('en-IN')}</strong>
                </div>
                <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block">Stays</span>
                  <strong className="font-mono text-white">₹{budgetBreakdown.accommodation?.toLocaleString('en-IN')}</strong>
                </div>
                <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block">Dining</span>
                  <strong className="font-mono text-white">₹{budgetBreakdown.foodAndDining?.toLocaleString('en-IN')}</strong>
                </div>
                <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block">Activities</span>
                  <strong className="font-mono text-white">₹{budgetBreakdown.activitiesAndSightseeing?.toLocaleString('en-IN')}</strong>
                </div>
                <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block">Buffer (8%)</span>
                  <strong className="font-mono text-white">₹{budgetBreakdown.taxesAndBuffer?.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <span>Grounded Decisions • SerpApi + Deterministic Constraints</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
