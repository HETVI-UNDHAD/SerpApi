import React from 'react';
import { useTrip } from '../context/TripContext';
import {
  Sparkles, Plane, Building, MapPin, MessageSquare,
  Calculator, Sliders, CheckCircle2, Loader2, Circle,
  Compass, ShieldCheck, Heart
} from 'lucide-react';

const ICONS = { 1: Plane, 2: Building, 3: MapPin, 4: MessageSquare, 5: Calculator, 6: Sliders };

export default function ResearchCenterPage() {
  const { researchSteps, formData, theme } = useTrip();
  const isDark = theme === 'dark';

  const doneCount = researchSteps.filter(s => s.status === 'done').length;
  const progress = Math.max(15, Math.round((doneCount / researchSteps.length) * 100));

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

          {/* Central Iridescent Orb (Reference Image 2 Style) */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-violet-600 p-[2px] shadow-2xl shadow-indigo-500/40">
            <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden">
              {/* Internal light sheen */}
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
            <span>Autonomous Multi-Engine Intelligence</span>
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
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Grounding Live Data</span>
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

        {/* ── VERTICAL TIMELINE OF 6 RESEARCH STAGES ── */}
        <div className={`p-5 rounded-3xl border text-left space-y-3 shadow-xl ${
          isDark
            ? 'glass-panel-dark border-white/10'
            : 'glass-panel-light border-slate-200/80 shadow-luxury-light'
        }`}>
          {researchSteps.map((step, idx) => {
            const Icon = ICONS[step.id] || Sparkles;
            const done = step.status === 'done';
            const active = step.status === 'in-progress';

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-300 ${
                  done
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : active
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
                  done
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : isDark
                    ? 'bg-white/5 text-slate-500'
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">
                    {step.title}
                  </p>
                  <p className={`text-[10px] truncate ${
                    done
                      ? isDark ? 'text-emerald-400/70' : 'text-emerald-700/70'
                      : active
                      ? isDark ? 'text-cyan-300' : 'text-indigo-600 font-semibold'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {step.detail}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {active && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                  {!done && !active && <Circle className="w-3.5 h-3.5 opacity-30" />}
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
