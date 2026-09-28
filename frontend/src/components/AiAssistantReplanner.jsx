import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import {
  Sparkles,
  Send,
  Loader2,
  RefreshCw,
  Clock,
  IndianRupee,
  Sliders,
  Plane,
  Building,
  Calendar,
  Coffee,
  Sun,
  ShieldCheck,
  Brain,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  History
} from 'lucide-react';

const QUICK_SIMULATIONS = [
  { label: 'My flight is delayed by 3 hours', icon: Clock, type: 'flight_delayed', color: 'text-amber-500' },
  { label: 'Reduce budget to ₹15,000', icon: IndianRupee, type: 'reduce_budget', color: 'text-emerald-500' },
  { label: 'Make Day 2 relaxed & café-focused', icon: Coffee, type: 'make_relaxed', color: 'text-cyan-500' },
  { label: 'Add one more day for coastal exploring', icon: Calendar, type: 'add_day', color: 'text-violet-500' },
  { label: 'More nightlife & sunset beach clubs', icon: Sun, type: 'more_nightlife', color: 'text-orange-500' },
  { label: 'Avoid flights (Use express rail/cab)', icon: Plane, type: 'avoid_flights', color: 'text-blue-500' }
];

export default function AiAssistantReplanner() {
  const { currentTrip, runWhatIf, isReplanning, chatMessages, theme } = useTrip();
  const isDark = theme === 'dark';
  const [inputText, setInputText] = useState('');

  const replanDiff = currentTrip?.replanDiff;

  function handleSubmit(e) {
    e.preventDefault();
    if (!inputText.trim() || isReplanning) return;
    const text = inputText;
    setInputText('');
    runWhatIf(text);
  }

  function handleQuickClick(sim) {
    if (isReplanning) return;
    runWhatIf(sim.label);
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── LEFT: WHAT-IF SCENARIOS ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 ${
            isDark ? 'bg-slate-900/70 border-white/8 shadow-luxury-dark' : 'bg-white border-slate-200/80 shadow-luxury'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ✨ What-If Scenario Presets
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Simulate real-world schedule shocks without discarding current bookings.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {QUICK_SIMULATIONS.map(sim => {
                const Icon = sim.icon;
                return (
                  <button
                    key={sim.label}
                    onClick={() => handleQuickClick(sim)}
                    disabled={isReplanning}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs font-bold flex items-center justify-between border transition-all duration-200 group ${
                      isDark
                        ? 'bg-slate-800/40 border-white/5 hover:border-indigo-400/40 text-slate-200 hover:bg-slate-800/80'
                        : 'bg-slate-50 border-slate-200/80 hover:border-indigo-400 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${sim.color} group-hover:scale-110 transition-transform`} />
                      <span>{sim.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: CONVERSATIONAL REPLANNER CONSOLE ── */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col justify-between min-h-[440px] space-y-4 ${
            isDark ? 'bg-slate-900/70 border-white/8 shadow-luxury-dark' : 'bg-white border-slate-200/80 shadow-luxury'
          }`}>

            {/* Console Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/20">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md ai-glow">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ✨ TravelOS Dynamic Replanning Console
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Adapts schedules & shifts activity clusters while strictly enforcing constraints.
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Orchestrator</span>
              </div>
            </div>

            {/* Conversation History / Result View */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[280px] pr-1">
              {chatMessages && chatMessages.length > 0 ? (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? isDark
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 ml-6'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-900 ml-6'
                      : isDark
                      ? 'bg-slate-800/60 border border-white/8 text-slate-200 mr-6'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 mr-6'
                  }`}>
                    <span className="font-bold block mb-1">
                      {msg.role === 'user' ? '💬 Traveler:' : '⚡ TravelOS Replanner:'}
                    </span>
                    {msg.text || msg.content}
                  </div>
                ))
              ) : (
                <div className={`p-6 rounded-2xl border text-center my-auto space-y-2 ${
                  isDark ? 'bg-slate-800/30 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <MessageSquare className="w-8 h-8 text-cyan-500 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold">
                    Ask anything to adapt your journey on the fly.
                  </p>
                  <p className="text-[11px] opacity-70">
                    Examples: "My flight is delayed by 3 hours", "Reduce budget to ₹15,000", "Make Day 2 relaxed".
                  </p>
                </div>
              )}

              {isReplanning && (
                <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recalculating timeline, shifting affected activities, and validating constraints...</span>
                </div>
              )}
            </div>

            {/* Interactive Chat Input Bar */}
            <form onSubmit={handleSubmit} className="relative flex items-center pt-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={isReplanning}
                placeholder="Type real-world change: 'My flight is delayed by 3 hours'..."
                className={`w-full pl-4 pr-12 py-3.5 rounded-2xl text-xs font-semibold focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
              <button
                type="submit"
                disabled={isReplanning || !inputText.trim()}
                className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 hover:scale-105 transition-all shadow-md"
                aria-label="Send replan instruction"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── HERO COMPONENT: STRUCTURED BEFORE VS. AFTER REPLANNING DIFF ── */}
      {replanDiff && (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 animate-fadeIn ${
          isDark ? 'bg-[#0E1424] border-cyan-500/30' : 'bg-white border-blue-200 shadow-xl'
        }`}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-white">Dynamic Replanning Impact Analysis</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                    {replanDiff.action || 'RECALIBRATION'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {replanDiff.summary}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Updated: {new Date(currentTrip.lastReplannedAt || Date.now()).toLocaleTimeString()}
            </span>
          </div>

          {/* Preserved vs Changed Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* PRESERVED CONSTRAINTS (GREEN) */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/80 border-emerald-200'
            }`}>
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>PRESERVED CONSTRAINTS (NO UNNECESSARY CHANGES)</span>
              </div>
              <ul className="space-y-2 text-xs">
                {replanDiff.preserved?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-emerald-300 font-medium">
                    <span className="font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CHANGED / ADAPTED ITEMS (CYAN/BLUE) */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50/80 border-cyan-200'
            }`}>
              <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-wider">
                <ArrowRight className="w-4 h-4" />
                <span>ADAPTED & RESCHEDULED TIMELINES</span>
              </div>
              <ul className="space-y-2 text-xs">
                {replanDiff.changed?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-cyan-300 font-medium">
                    <span className="font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* TIMELINE COMPARISON: BEFORE VS AFTER (IF AVAILABLE) */}
          {replanDiff.timelineComparison?.before && replanDiff.timelineComparison?.after && (
            <div className="pt-2 space-y-3">
              <h5 className="font-black text-xs uppercase tracking-wider text-slate-300">
                Day 1 Timeline: Before vs. After Arrival Delay
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* BEFORE */}
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Before Change (Original Flight Window)
                  </span>
                  <div className="space-y-2">
                    {replanDiff.timelineComparison.before.map((act, aIdx) => (
                      <div key={aIdx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs flex items-center justify-between">
                        <span className="font-medium text-slate-300 truncate max-w-[200px]">{act.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AFTER */}
                <div className={`p-4 rounded-2xl border space-y-2.5 border-cyan-500/40 ${
                  isDark ? 'bg-cyan-950/15' : 'bg-cyan-50'
                }`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                    After Replan (Adjusted Schedule)
                  </span>
                  <div className="space-y-2">
                    {replanDiff.timelineComparison.after.map((act, aIdx) => (
                      <div key={aIdx} className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs flex items-center justify-between text-cyan-200">
                        <span className="font-bold truncate max-w-[200px]">{act.title}</span>
                        <span className="font-mono text-[10px] font-bold text-cyan-400">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
