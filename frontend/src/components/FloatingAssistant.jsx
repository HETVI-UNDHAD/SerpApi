import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Compass, Sparkles, MessageSquare, Bot, ArrowUpRight, Loader2, RotateCcw } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const SUGGESTIONS = [
  'How does TravelOS work?',
  'Plan a weekend in Goa',
  'How is SerpApi data verified?',
  'How does the budget optimizer work?',
  'What is the What-If replanner?'
];

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm TravelOS AI, your personal travel intelligence assistant. 👋\n\nI can help you explore destinations, architect itineraries, understand our live Google Flights & Hotels grounding, or test what-if travel simulations.",
  id: 'welcome'
};

export default function FloatingAssistant() {
  const { setActiveScreen, theme, currentTrip } = useTrip();
  const isDark = theme === 'dark';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Escape key closes
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Click outside closes
  useEffect(() => {
    function onPointer(e) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (e.target.closest('[data-assistant-toggle]')) return;
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = [...messages.filter(m => m.id !== 'welcome'), userMsg]
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${API_BASE}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversation: history.slice(0, -1),
          currentTripContext: currentTrip ? {
            destination: currentTrip.destination,
            origin: currentTrip.origin,
            duration: currentTrip.duration,
            budget: currentTrip.budget
          } : null
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't get a response. Please try again.",
        id: Date.now() + 1
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting to the backend right now. Please verify that the TravelOS server is active.",
        id: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, currentTrip]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none font-sans">

      {/* ── CHAT PANEL ── */}
      {open && (
        <div
          ref={panelRef}
          className={`pointer-events-auto flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ${
            isDark
              ? 'bg-[#0E1526] border-slate-800 text-slate-100 shadow-2xl'
              : 'bg-white border-slate-200/80 text-slate-900 shadow-2xl'
          }`}
          style={{
            width: 'min(380px, calc(100vw - 28px))',
            height: 'min(540px, 75vh)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 text-white shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">TravelOS AI Assistant</p>
                <p className="text-blue-100 text-[10px] mt-0.5 leading-none">Travel Intelligence Agent</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Trip Context Banner (if any) */}
          {currentTrip && (
            <div className={`px-4 py-2 text-[11px] font-semibold flex items-center justify-between border-b ${
              isDark ? 'bg-blue-950/40 border-blue-900/40 text-blue-300' : 'bg-blue-50/80 border-blue-100 text-blue-700'
            }`}>
              <span>Active Trip: <strong>{currentTrip.destination}</strong> ({currentTrip.duration}D)</span>
              <button
                onClick={() => { setActiveScreen('dashboard'); setOpen(false); }}
                className="hover:underline flex items-center gap-0.5 text-[10px] font-bold"
              >
                View Plan <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mr-2 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : isDark
                      ? 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Quick suggested prompts if on welcome */}
            {messages.length === 1 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Suggested Prompts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border text-left transition-all hover:scale-[1.02] ${
                        isDark
                          ? 'bg-slate-900 border-slate-800 text-blue-400 hover:border-blue-500/50'
                          : 'bg-blue-50/80 border-blue-200 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className={`px-4 py-3 rounded-2xl flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className={`p-3 border-t flex items-center gap-2 shrink-0 ${
            isDark ? 'border-slate-800 bg-[#0A101E]' : 'border-slate-200 bg-slate-50'
          }`}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask TravelOS AI anything..."
              className={`flex-1 text-xs rounded-xl px-3.5 py-2.5 outline-none border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 shadow-sm'
              }`}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center shrink-0 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── FLOATING TOGGLE LAUNCHER ── */}
      <button
        data-assistant-toggle
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close TravelOS AI' : 'Open TravelOS AI Assistant'}
        className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Compass className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-500" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-indigo-700 flex items-center justify-center animate-pulse">
              <Sparkles className="w-1.5 h-1.5 text-slate-950" />
            </span>
          </div>
        )}
      </button>

    </div>
  );
}
