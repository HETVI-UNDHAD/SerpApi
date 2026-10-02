import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import SerpApiGroundingModal from './SerpApiGroundingModal';
import {
  Sun,
  Moon,
  Menu,
  ArrowRight,
  Plus,
  PanelLeft,
  MapPin,
  ChevronRight,
  Sparkles,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const {
    activeScreen,
    setActiveScreen,
    currentTrip,
    theme,
    toggleTheme,
    resetTrip,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useTrip();

  const isDark = theme === 'dark';
  const [groundingOpen, setGroundingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setScrolled(scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  function handleNavigate(screen) {
    setActiveScreen(screen);
  }

  const screenTitleMap = {
    'landing': 'Explore Destinations',
    'builder': 'Trip Architect',
    'research': 'Live AI Research Center',
    'dashboard': currentTrip ? `Journey to ${currentTrip.destination}` : 'Master Itinerary',
    'design-showcase': 'Design Showcase'
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 font-sans ${
          scrolled
            ? isDark
              ? 'bg-[#070B14]/92 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
              : 'bg-[#FAF8F5]/92 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
            : isDark
            ? 'bg-[#070B14] border-b border-slate-800'
            : 'bg-[#FAF8F5] border-b border-slate-200'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* ── LEFT: SIDEBAR TOGGLE & BREADCRUMBS (NO DUPLICATE LOGO) ── */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Open sidebar menu"
              title="Open Travel Command Center"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Quick Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:flex p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={sidebarCollapsed ? 'Expand Travel Command Center' : 'Collapse Travel Command Center'}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-semibold hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Workspace
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <span className={`font-bold text-sm sm:text-xs ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {screenTitleMap[activeScreen] || 'TravelOSAI'}
              </span>

              {currentTrip && activeScreen === 'dashboard' && (
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <MapPin className="w-2.5 h-2.5" />
                  {currentTrip.destination}
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT: GENUINE LIVE-DATA STATUS, THEME SWITCH & ACTION ── */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Live Data Trust Indicator */}
            <button
              onClick={() => setGroundingOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              title="Click to view live SerpApi verification proof"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Live Grounded</span>
              <span className="text-[10px] font-normal opacity-80">SerpApi</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className={`p-2 rounded-xl border transition-all hover:scale-105 ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            {currentTrip ? (
              <button
                onClick={resetTrip}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Journey</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('builder')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Planning</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Live Data Grounding Modal */}
      <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />
    </>
  );
}
