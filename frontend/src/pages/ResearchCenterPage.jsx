import React from 'react';
import { useTrip } from '../context/TripContext';
import {
  Sparkles, Plane, Building, MapPin, MessageSquare,
  Calculator, Sliders, CheckCircle2, Loader2, Circle,
  Compass, ShieldCheck, Heart, Calendar, Route, Zap
} from 'lucide-react';

const ICONS = {
  1: Plane,
  2: Building,
  3: MapPin,
  4: Zap,
  5: Route,
  6: ShieldCheck,
  7: Compass,
  8: Calendar
};

function formatElapsed(ms) {
  if (ms == null) return null;
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function renderStatusBadge(status) {
  switch (status) {
    case 'LIVE':
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LIVE</span>;
    case 'ESTIMATED':
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">ESTIMATED</span>;
    case 'INFERRED':
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">INFERRED</span>;
    case 'FALLBACK':
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">FALLBACK</span>;
    case 'FAILED':
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">FAILED</span>;
    case 'UNAVAILABLE':
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-500/20 text-slate-400 border border-slate-500/30">UNAVAILABLE</span>;
    case 'IN_PROGRESS':
    case 'in-progress':
      return <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">SEARCHING</span>;
    default:
      return null;
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

  const destQuery = formData?.destination || 'Goa';

  return (
    <div className={`relative min-h-[92vh] flex items-center justify-center p-4 overflow-hidden transition-colors duration-400 font-sans ${
      isDark ? 'bg-[#080A0F]/28 text-slate-100' : 'bg-white/10 text-slate-900'
    }`}>

      {/* Atmospheric Blurred Destination Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={`https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=80`}
          alt="Destination background"
          className="w-full h-full object-cover blur-2xl opacity-20 scale-110"
        />
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-t from-[#080A0F] via-[#080A0F]/90 to-[#080A0F]/80'
            : 'bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8]/90 to-[#FAFAF8]/80'
        }`} />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-6">

        {/* ── 3D HOLOGRAPHIC GLOWING AI ORB & ORBITAL RINGS ── */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          {/* Outer Orbital Ring 1 */}
          <div className="absolute w-40 h-40 orbital-ring pointer-events-none" />

          {/* Outer Orbital Ring 2 (reverse spin) */}
          <div className="absolute w-32 h-32 orbital-ring-reverse pointer-events-none" />

          {/* Tiny Floating Travel Particle Badges on Orbit */}
          <div className="absolute top-1 right-2 p-1.5 rounded-full bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/50 animate-bounce text-[9px] font-bold">
            <Plane className="w-4 h-4" />
          </div>
          <div className="absolute bottom-2 left-2 p-1.5 rounded-full bg-violet-500 text-white shadow-lg shadow-violet-500/50 animate-pulse text-[9px] font-bold">
            <MapPin className="w-4 h-4" />
          </div>

          {/* Glowing Ambient Core Light */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-600 blur-2xl opacity-60 animate-pulse" />

          {/* Central Iridescent Orb */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-violet-600 p-[2px] shadow-2xl shadow-indigo-500/40">
            <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-white/30 blur-md pointer-events-none" />
              <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
              <span className="text-[9px] font-black tracking-widest text-violet-300 mt-1 uppercase">
                AI CORE
              </span>
            </div>
          </div>
        </div>

        {/* Header & Route Summary */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Engine Grounding</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            TravelOS AI is researching your journey…
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span>{formData.origin || 'Origin'}</span>
            <span className="mx-2 text-cyan-500">→</span>
            <span className="font-bold text-cyan-400">{formData.destination || 'Best destination'}</span>
            <span className="mx-2 opacity-40">•</span>
            <span>{formData.duration} Days</span>
            <span className="mx-2 opacity-40">•</span>
            <span>₹{Number(formData.budget).toLocaleString('en-IN')} Budget</span>
          </p>
        </div>

        {/* Progress bar & Percent */}
        <div className="space-y-2 max-w-sm mx-auto">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Real-Time Pipeline</span>
            <span className="font-bold text-cyan-400">{progress}%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden p-0.5 border ${
            isDark ? 'bg-slate-900 border-white/10' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── VERTICAL TIMELINE OF 8 REAL RESEARCH STAGES ── */}
        <div className={`p-5 rounded-3xl border text-left space-y-3 shadow-xl ${
          isDark
            ? 'glass-panel-dark border-white/10'
            : 'glass-panel-light border-slate-200/80 shadow-luxury-light'
        }`}>
          {researchSteps.map((step) => {
            const Icon = ICONS[step.id] || Sparkles;
            const isDone = ['LIVE', 'ESTIMATED', 'INFERRED', 'done'].includes(step.status);
            const isFallbackOrFailed = ['FALLBACK', 'FAILED'].includes(step.status);
            const isUnavailable = step.status === 'UNAVAILABLE';
            const isActive = step.status === 'IN_PROGRESS' || step.status === 'in-progress';
            const isPending = !step.status || step.status === 'pending';
            const elapsed = formatElapsed(step.duration_ms);

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-300 ${
                  isDone
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : isFallbackOrFailed
                    ? isDark
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                    : isUnavailable
                    ? isDark
                      ? 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                    : isActive
                    ? isDark
                      ? 'bg-indigo-500/15 border-indigo-500/30 text-white shadow-md'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-md'
                    : isDark
                    ? 'bg-white/2 border-white/5 text-slate-500'
                    : 'bg-slate-50 border-slate-200/60 text-slate-400'
                }`}
              >
                {/* Timeline Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isFallbackOrFailed
                    ? 'bg-amber-500/20 text-amber-400'
                    : isUnavailable
                    ? 'bg-slate-500/20 text-slate-400'
                    : isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : isDark
                    ? 'bg-white/5 text-slate-500'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold truncate">
                      {step.title}
                    </p>
                    {elapsed && (
                      <span className="text-[10px] font-mono text-cyan-400/90 flex-shrink-0">
                        {elapsed}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {renderStatusBadge(step.status)}
                    <p className={`text-[10px] truncate ${
                      isDone
                        ? isDark ? 'text-emerald-400/70' : 'text-emerald-700/70'
                        : isFallbackOrFailed
                        ? isDark ? 'text-amber-300/80' : 'text-amber-800/80'
                        : isActive
                        ? isDark ? 'text-cyan-300' : 'text-indigo-600 font-semibold'
                        : isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {step.detail}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isFallbackOrFailed && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50" />}
                  {isUnavailable && <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />}
                  {isActive && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                  {isPending && <Circle className="w-3.5 h-3.5 opacity-30" />}
                </div>
              </div>
            );
          })}
        </div>

        <p className={`text-[10px] tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Live SerpApi queries to Google Flights · Google Hotels · Google Maps
        </p>

      </div>
    </div>
  );
}
