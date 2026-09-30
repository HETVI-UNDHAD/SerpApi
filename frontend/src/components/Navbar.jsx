import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import AiAgentLogo from './AiAgentLogo';
import SerpApiGroundingModal from './SerpApiGroundingModal';
import {
  Sun,
  Moon,
  Menu,
  ArrowRight,
  Plus,
  PanelLeft,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const {
    activeScreen,
    setActiveScreen,
    activeTab,
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
  const isDashboard = activeScreen === 'dashboard' && currentTrip;
  const [groundingOpen, setGroundingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleNavigate(screen) {
    setActiveScreen(screen);
  }

  // Determine current readable title for breadcrumb
  const screenTitleMap = {
    'landing': 'Explore Destinations',
    'builder': 'Trip Planner',
    'research': 'Live AI Research Center',
    'dashboard': currentTrip ? `Trip to ${currentTrip.destination}` : 'Master Itinerary',
    'design-showcase': 'Design Showcase'
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? isDark
              ? 'bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
              : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
            : isDark
            ? 'bg-[#090D16] border-b border-slate-800'
            : 'bg-white border-b border-slate-200'
        }`}
      >
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* ── LEFT: SIDEBAR TOGGLE & BRAND BREADCRUMB ── */}
          <div className="flex items-center gap-3.5 sm:gap-4 flex-shrink-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Open sidebar menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Quick Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:flex p-2 rounded-xl border transition-colors ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={sidebarCollapsed ? 'Expand Left Sidebar' : 'Collapse Left Sidebar'}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* Brand Logo */}
            <AiAgentLogo
              onClick={() => handleNavigate('landing')}
              isDark={isDark}
              size="sm"
            />

            {/* Breadcrumb Separator & Context */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {screenTitleMap[activeScreen] || 'TravelOS AI'}
              </span>
              {currentTrip && activeScreen === 'dashboard' && (
                <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <MapPin className="w-2.5 h-2.5" />
                  {currentTrip.destination}
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT: LIVE TRUST INDICATOR, THEME TOGGLE & PRIMARY ACTION ── */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Live Data Trust Indicator */}
            <button
              onClick={() => setGroundingOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              title="Click to view live SerpApi data provenance"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Live data</span>
              <span className="text-[10px] opacity-75 font-normal">SerpApi</span>
            </button>

            {/* Clean Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Primary Action Button */}
            {currentTrip ? (
              <button
                onClick={resetTrip}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-transform hover:scale-105 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Trip</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('builder')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-transform hover:scale-105 shadow-sm"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Live Data Provenance Inspector Modal */}
      <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />
    </>
  );
}
