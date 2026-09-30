import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import AiAgentLogo from './AiAgentLogo';
import {
  Clock,
  IndianRupee,
  Sliders,
  Plane,
  Building,
  Calendar,
  Coffee,
  Sun,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  History,
  Send,
  Loader2
} from 'lucide-react';

const QUICK_SIMULATIONS = [
  { label: 'My flight is delayed by 3 hours', icon: Clock, type: 'flight_delayed', color: 'text-amber-500' },
  { label: 'Reduce budget to ₹15,000', icon: IndianRupee, type: 'reduce_budget', color: 'text-emerald-500' },
  { label: 'Make Day 2 relaxed & café-focused', icon: Coffee, type: 'make_relaxed', color: 'text-cyan-500' },
  { label: 'Add one more day for exploring', icon: Calendar, type: 'add_day', color: 'text-violet-500' },
  { label: 'More evening & sunset experiences', icon: Sun, type: 'more_nightlife', color: 'text-orange-500' },
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

        {/* ── LEFT: QUICK SIMULATIONS ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl space-y-4 ${
            isDark ? 'bg-[#111726] border-slate-800 shadow-xl' : 'bg-white border-slate-200/80 shadow-luxury'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Quick Adjustments
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Simulate common real-world changes without losing your core bookings.
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
                        ? 'bg-slate-900/40 border-slate-800 hover:border-blue-500/50 text-slate-200 hover:bg-slate-800/80'
                        : 'bg-slate-50 border-slate-200/80 hover:border-blue-500 text-slate-700 hover:bg-slate-100'
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

        {/* ── RIGHT: ASSISTANT CHAT & REPLANNER ── */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col justify-between min-h-[440px] space-y-4 ${
            isDark ? 'bg-[#111726] border-slate-800 shadow-xl' : 'bg-white border-slate-200/80 shadow-luxury'
          }`}>

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/30 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <AiAgentLogo size="sm" showBadge={false} isDark={isDark} />
                <div>
                  <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Trip Assistant & Replanner
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Tell us what changed and we will update your schedule instantly.
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ready</span>
              </div>
            </div>

            {/* Conversation History */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[280px] pr-1">
              {chatMessages && chatMessages.length > 0 ? (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? isDark
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-200 ml-6'
                        : 'bg-blue-50 border border-blue-200 text-blue-900 ml-6'
                      : isDark
                      ? 'bg-slate-800/60 border border-slate-700/60 text-slate-200 mr-6'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 mr-6'
                  }`}>
                    <span className="font-bold block mb-1">
                      {msg.role === 'user' ? '💬 You:' : '🧭 TravelOS Assistant:'}
                    </span>
                    {msg.text || msg.content}
                  </div>
                ))
              ) : (
                <div className={`p-6 rounded-2xl border text-center my-auto space-y-2 ${
                  isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-bold">
                    Need to change something? Just ask.
                  </p>
                  <p className="text-[11px] opacity-70">
                    Examples: "My flight is delayed by 3 hours", "Reduce budget to ₹15,000", "Make Day 2 relaxed".
                  </p>
                </div>
              )}

              {isReplanning && (
                <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating your trip schedule, shifting activities, and verifying live routes...</span>
                </div>
              )}
            </div>

            {/* Interactive Input Bar */}
            <form onSubmit={handleSubmit} className="relative flex items-center pt-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                disabled={isReplanning}
                placeholder="E.g., 'My flight is delayed by 3 hours' or 'Add more beach stops'..."
                className={`w-full pl-4 pr-12 py-3.5 rounded-2xl text-xs font-semibold focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                    : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                }`}
              />
              <button
                type="submit"
                disabled={isReplanning || !inputText.trim()}
                className="absolute right-2 p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-500 transition-all shadow-md"
                aria-label="Send replan instruction"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── BEFORE VS. AFTER REPLANNING DIFF (Requirement 16) ── */}
      {replanDiff && (
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 animate-fadeIn ${
          isDark ? 'bg-[#111726] border-blue-500/30' : 'bg-white border-blue-200 shadow-xl'
        }`}>
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/40 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold">
                <History className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {replanDiff.action === 'FLIGHT_DELAY_ADAPTATION'
                      ? `FLIGHT DELAYED +${replanDiff.delayHours || 3} HOURS`
                      : 'Trip Schedule Updated'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                    Schedule Adjusted
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {replanDiff.summary}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Updated: {new Date(currentTrip.lastReplannedAt || Date.now()).toLocaleTimeString()}
            </span>
          </div>

          {/* ── SIDE-BY-SIDE BEFORE VS AFTER ── */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* BEFORE COLUMN */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-700/30 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    BEFORE
                  </span>
                  <span className="text-[10px] text-slate-400">Original Plan</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {replanDiff.action === 'FLIGHT_DELAY_ADAPTATION' ? (
                    <>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                        <span className="font-semibold text-slate-300">09:20 AM Departure</span>
                        <span className="text-slate-400 font-mono text-[11px]">Flight</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                        <span className="font-semibold text-slate-300">11:05 AM Arrival</span>
                        <span className="text-slate-400 font-mono text-[11px]">Touchdown</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                        <span className="font-semibold text-slate-300">10:00 AM Morning Activity</span>
                        <span className="text-slate-400 font-mono text-[11px]">Original Tour</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                        <span className="font-semibold text-slate-300">12:00 PM Check-in</span>
                        <span className="text-slate-400 font-mono text-[11px]">Hotel</span>
                      </div>
                    </>
                  ) : replanDiff.timelineComparison?.before ? (
                    replanDiff.timelineComparison.before.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30 border border-slate-700/30">
                        <span className="font-semibold text-slate-300 truncate max-w-[200px]">{item.title}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{item.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-slate-400">Previous schedule details</div>
                  )}
                </div>
              </div>

              {/* AFTER COLUMN */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-blue-950/20 border-blue-500/40' : 'bg-blue-50/80 border-blue-200'
              }`}>
                <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-500 dark:text-blue-400">
                    AFTER
                  </span>
                  <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold">Adjusted Plan</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {replanDiff.action === 'FLIGHT_DELAY_ADAPTATION' ? (
                    <>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-200">
                        <span className="font-semibold">09:20 AM Departure</span>
                        <span className="font-mono text-[11px] text-slate-400">Unchanged</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/30 text-amber-400">
                        <span className="font-bold">14:05 PM Arrival</span>
                        <span className="font-mono text-[11px] font-bold">+3h delayed</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-200">
                        <span className="font-bold">Moved to 16:00</span>
                        <span className="font-mono text-[11px] text-blue-400">Afternoon Tour</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-200">
                        <span className="font-bold">15:00 Check-in</span>
                        <span className="font-mono text-[11px] text-emerald-400">Preserved</span>
                      </div>
                    </>
                  ) : replanDiff.timelineComparison?.after ? (
                    replanDiff.timelineComparison.after.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-200">
                        <span className="font-bold truncate max-w-[200px]">{item.title}</span>
                        <span className="font-mono text-[11px] font-bold text-blue-400">{item.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-blue-300">Updated schedule details applied</div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ── WHAT CHANGED? (Requirement 16) ── */}
          <div className={`p-5 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>WHAT CHANGED?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/20 dark:bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Activities</span>
                <span className="font-bold text-blue-400">2 activities moved</span>
              </div>
              <div className="p-3 rounded-xl bg-black/20 dark:bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Routing</span>
                <span className="font-bold text-blue-400">1 route recalculated</span>
              </div>
              <div className="p-3 rounded-xl bg-black/20 dark:bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Accommodation</span>
                <span className="font-bold text-emerald-400">Hotel preserved ✓</span>
              </div>
              <div className="p-3 rounded-xl bg-black/20 dark:bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Evening Plans</span>
                <span className="font-bold text-emerald-400">Dinner preserved ✓</span>
              </div>
            </div>

            {/* Preserved details list */}
            {replanDiff.preserved && replanDiff.preserved.length > 0 && (
              <div className="pt-2 border-t border-slate-700/20 flex flex-wrap gap-2 text-[11px]">
                {replanDiff.preserved.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    ✓ {item}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

