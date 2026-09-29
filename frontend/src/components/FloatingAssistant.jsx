import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Compass, Sparkles } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const SUGGESTIONS = [
  'How does TravelOS work?',
  'Plan a trip',
  'Explore destinations',
  'Live flights & hotels',
  'What can you do?',
];

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm TravelOS AI 👋\nI can help you explore TravelOS, plan a trip, understand our live travel features, and find your way around the platform.",
  id: 'welcome',
};

export default function FloatingAssistant() {
  const { setActiveScreen, theme } = useTrip();
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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
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
        // Don't close if clicking the toggle button (handled by its own onClick)
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

    // Build conversation history (exclude welcome)
    const history = [...messages.filter(m => m.id !== 'welcome'), userMsg]
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${API_BASE}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, conversation: history.slice(0, -1) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't get a response. Please try again.",
        id: Date.now() + 1,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        id: Date.now() + 1,
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">

      {/* ── CHAT PANEL ── */}
      {open && (
        <div
          ref={panelRef}
          className="pointer-events-auto flex flex-col rounded-[20px] overflow-hidden shadow-2xl"
          style={{
            width: 'min(360px, calc(100vw - 20px))',
            height: 'min(500px, 70vh)',
            border: isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(15,23,42,0.1)',
            background: isDark ? '#0d1424' : '#ffffff',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1d4ed8 100%)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-sm leading-none">TravelOS AI</p>
                <p className="text-blue-200 text-[10px] mt-0.5 leading-none">Travel Intelligence Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300 font-semibold">Online</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close TravelOS AI"
                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ scrollbarWidth: 'thin' }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap"
                  style={msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #1d4ed8, #3730a3)',
                    color: '#ffffff',
                    borderBottomRightRadius: 4,
                  } : {
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
                    borderBottomLeftRadius: 4,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggestion chips — only after welcome, before any user message */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all hover:scale-[1.02]"
                    style={{
                      background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff',
                      border: isDark ? '1px solid rgba(59,130,246,0.3)' : '1px solid #bfdbfe',
                      color: isDark ? '#93c5fd' : '#1d4ed8',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div
                  className="px-3.5 py-2.5 rounded-2xl flex items-center gap-1"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
                    borderBottomLeftRadius: 4,
                  }}
                >
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-blue-400"
                      style={{ animation: `assistantDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 px-3 py-3 flex items-end gap-2"
            style={{
              borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
              background: isDark ? '#0a1020' : '#f8fafc',
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask TravelOS AI..."
              rows={1}
              className="flex-1 resize-none text-xs rounded-xl px-3 py-2 outline-none transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                color: isDark ? '#e2e8f0' : '#1e293b',
                maxHeight: 80,
                lineHeight: '1.5',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #3730a3)' }}
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* ── FLOATING TOGGLE BUTTON ── */}
      <button
        data-assistant-toggle
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close TravelOS AI' : 'Open TravelOS AI'}
        className="pointer-events-auto w-[54px] h-[54px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1d4ed8 100%)',
          boxShadow: open
            ? '0 0 0 3px rgba(59,130,246,0.35), 0 8px 24px rgba(29,78,216,0.5)'
            : '0 4px 20px rgba(29,78,216,0.45), 0 1px 4px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          /* Custom TravelOS AI icon: compass + sparkle */
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <circle cx="13" cy="13" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
            <line x1="13" y1="4" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="19" x2="13" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4" y1="13" x2="7" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="19" y1="13" x2="22" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="13,8 14.5,12 13,11 11.5,12" fill="white" opacity="0.9" />
            <polygon points="13,18 11.5,14 13,15 14.5,14" fill="rgba(255,255,255,0.5)" />
            <circle cx="13" cy="13" r="1.5" fill="white" />
            <circle cx="20" cy="6" r="1" fill="rgba(147,197,253,0.9)" />
            <circle cx="22" cy="9" r="0.6" fill="rgba(147,197,253,0.6)" />
            <circle cx="18" cy="5" r="0.5" fill="rgba(147,197,253,0.5)" />
          </svg>
        )}
      </button>

      {/* Dot animation keyframes */}
      <style>{`
        @keyframes assistantDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
