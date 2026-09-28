import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import {
  Compass,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  Globe
} from 'lucide-react';
import SerpApiGroundingModal from './SerpApiGroundingModal';

export default function Navbar() {
  const { activeScreen, setActiveScreen, currentTrip, theme, toggleTheme } = useTrip();
  const isDark = theme === 'dark';
  const isLanding = activeScreen === 'landing';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groundingOpen, setGroundingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleNavigate(screen) {
    setActiveScreen(screen);
    setMobileOpen(false);
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          VISIT THE USA STYLE GLOBAL EDITORIAL HEADER
         ══════════════════════════════════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#090D16]/95 backdrop-blur-xl border-b border-slate-800 shadow-xl'
            : 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : isDark
          ? 'bg-[#090D16] border-b border-slate-800'
          : 'bg-white border-b border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto h-[68px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* ── LEFT: EDITORIAL BRAND LOGO ── */}
          <button
            onClick={() => handleNavigate('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-black text-lg tracking-tight font-serif ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Travel<span className="text-blue-600">OS</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Global
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-400">
                Official AI Travel Portal
              </p>
            </div>
          </button>

          {/* ── CENTER: VISITTHEUSA EDITORIAL NAVIGATION TABS ── */}
          <nav className="hidden lg:flex items-center gap-1 font-sans">
            <TopNavBtn
              active={activeScreen === 'landing'}
              onClick={() => handleNavigate('landing')}
              isDark={isDark}
            >
              Explore Destinations
            </TopNavBtn>

            <TopNavBtn
              active={activeScreen === 'builder'}
              onClick={() => handleNavigate('builder')}
              isDark={isDark}
            >
              Plan Your Trip
            </TopNavBtn>

            <TopNavBtn
              active={activeScreen === 'design-showcase'}
              onClick={() => handleNavigate('design-showcase')}
              isDark={isDark}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Showcase</span>
            </TopNavBtn>

            {currentTrip && (
              <button
                onClick={() => handleNavigate('dashboard')}
                className={`ml-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeScreen === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : isDark
                    ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-blue-400 hover:text-white'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentTrip.destination}</span>
                <span className="text-[10px] font-normal opacity-80">({currentTrip.duration || 3}D)</span>
              </button>
            )}
          </nav>

          {/* ── RIGHT CONTROLS: GROUNDING PROOF, THEME & CTA ── */}
          <div className="flex items-center gap-3">
            {/* Live SerpApi Grounded Badge */}
            <button
              onClick={() => setGroundingOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 hover:border-blue-300"
              title="Inspect live SerpApi search engines & technical architecture"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span className="hidden sm:inline">SerpApi Grounded</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                LIVE
              </span>
            </button>

            {/* Premium Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`relative flex items-center p-1 rounded-full border transition-all duration-300 ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300 shadow-sm'
              }`}
              style={{ width: 52, height: 28 }}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isDark ? 'translate-x-[24px] bg-blue-600 text-white' : 'translate-x-0.5 bg-blue-600 text-white'
              }`}>
                {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </div>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavigate('builder')}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-xl border ${
                isDark ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'
              }`}
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── MOBILE SLIDE-DOWN DRAWER ── */}
        {mobileOpen && (
          <div className={`lg:hidden border-t px-6 py-6 space-y-4 shadow-2xl ${
            isDark ? 'bg-[#0D121F] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="space-y-2">
              <button
                onClick={() => handleNavigate('landing')}
                className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100/50 flex items-center gap-3"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Explore Destinations</span>
              </button>

              <button
                onClick={() => handleNavigate('builder')}
                className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100/50 flex items-center gap-3"
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Plan Your Trip</span>
              </button>

              <button
                onClick={() => handleNavigate('design-showcase')}
                className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm hover:bg-slate-100/50 flex items-center gap-3"
              >
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>Showcase</span>
              </button>

              {currentTrip && (
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm bg-blue-50 text-blue-700 flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Active Plan: {currentTrip.destination}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => handleNavigate('builder')}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider text-center block shadow-md"
            >
              Start Planning Trip
            </button>
          </div>
        )}
      </header>

      {/* Grounding & Differentiation Modal */}
      <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />
    </>
  );
}

function TopNavBtn({ children, active, onClick, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 rounded-full ${
        active
          ? isDark
            ? 'bg-slate-800 text-white'
            : 'bg-slate-100 text-slate-900 font-extrabold'
          : isDark
          ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
      }`}
    >
      {children}
    </button>
  );
}
