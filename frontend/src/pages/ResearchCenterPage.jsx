import React from 'react';
import { useTrip } from '../context/TripContext';
import {
  Sparkles, Plane, Building, MapPin, MessageSquare,
  Calculator, Sliders, CheckCircle2, Loader2, Circle,
  Compass, ShieldCheck, Heart, Calendar, Route, Zap, Clock
} from 'lucide-react';

const ICONS = {
  TRANSPORT: Plane,
  HOTEL: Building,
  PLACES: MapPin,
  REVIEWS: Heart,
  EVENTS: Calendar,
  ROUTING: Route,
  BUDGET: Calculator,
  VALIDATION: ShieldCheck
};

function formatElapsed(ms) {
  if (ms == null) return null;
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function renderStatusBadge(status) {
  switch (status) {
    case 'LIVE':
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">LIVE</span>;
    case 'ESTIMATED':
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30">ESTIMATED</span>;
    case 'INFERRED':
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">INFERRED</span>;
    case 'FALLBACK':
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">FALLBACK</span>;
    case 'FAILED':
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40">FAILED</span>;
    case 'UNAVAILABLE':
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-500/20 text-slate-500 border border-slate-500/30">UNAVAILABLE</span>;
    case 'IN_PROGRESS':
    case 'in-progress':
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 animate-pulse">SEARCHING</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400">QUEUED</span>;
  }
}

export default function ResearchCenterPage() {
  const { researchSteps, formData, theme } = useTrip();
  const isDark = theme === 'dark';

  const completedCount = researchSteps.filter(s =>
    ['LIVE', 'ESTIMATED', 'INFERRED', 'FALLBACK', 'FAILED', 'UNAVAILABLE', 'done'].includes(s.status)
  ).length;
  const inProgressCount = researchSteps.filter(s =>
    ['IN_PROGRESS', 'in-progress'].includes(s.status)
  ).length;
  const progress = Math.max(12, Math.round(((completedCount + (inProgressCount * 0.5)) / researchSteps.length) * 100));

  const destQuery = formData?.destination || 'Destination';

  return (
    <div className={`relative min-h-[90vh] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden transition-colors duration-400 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-30 ${
          isDark ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500' : 'bg-gradient-to-tr from-blue-300 via-indigo-200 to-amber-200'
        }`} />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 my-8">

        {/* ── 3D HOLOGRAPHIC GLOWING AI CORE ── */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          <div className="absolute w-36 h-36 orbital-ring pointer-events-none" />
          <div className="absolute w-28 h-28 orbital-ring-reverse pointer-events-none" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 blur-xl opacity-70 animate-pulse" />
          
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50">
            <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '16s' }} />
          </div>
        </div>

        {/* Title & Stage Counter */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Live Research Pipeline · {completedCount} / {researchSteps.length} Completed
          </span>
          <h1 className="editorial-serif text-3xl sm:text-4xl font-bold mt-3">
            Researching {destQuery}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Connecting to live SerpApi engines for flight fares, hotel rankings, GPS routing, and deterministic budget optimization.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-lg mx-auto bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── 8 LIVE PIPELINE STAGES ── */}
        <div className={`rounded-3xl border p-4 sm:p-6 text-left shadow-xl ${
          isDark ? 'bg-[#0E1526]/90 border-slate-800' : 'bg-white/95 border-slate-200/80 shadow-slate-200/50'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {researchSteps.map(step => {
              const StepIcon = ICONS[step.key] || Compass;
              const isSearching = step.status === 'IN_PROGRESS' || step.status === 'in-progress';
              const isDone = ['LIVE', 'ESTIMATED', 'INFERRED', 'FALLBACK', 'FAILED', 'UNAVAILABLE', 'done'].includes(step.status);

              return (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isSearching
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500/60 shadow-sm'
                      : isDone
                      ? isDark
                        ? 'bg-slate-900/60 border-slate-800'
                        : 'bg-slate-50/80 border-slate-200/60'
                      : isDark
                      ? 'bg-slate-900/30 border-slate-800/40 opacity-60'
                      : 'bg-slate-50/40 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-2.5 truncate">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : isSearching
                        ? 'bg-blue-500/20 text-blue-500 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold leading-tight truncate">{step.title}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{step.detail}</p>
                      {step.result_count > 0 && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          ✓ {step.result_count} verified results
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1">
                    {renderStatusBadge(step.status)}
                    {step.duration_ms != null && (
                      <span className="text-[9px] text-slate-400 font-medium">
                        {formatElapsed(step.duration_ms)}
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
