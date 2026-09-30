import React from 'react';
import { useTrip } from '../context/TripContext';
import AiAgentLogo from './AiAgentLogo';
import { getTransportVisual } from '../utils/transportVisuals';
import {
  Compass,
  Calendar,
  MapPin,
  Building,
  IndianRupee,
  Brain,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Layers,
  Plane,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeScreen,
    setActiveScreen,
    activeTab,
    setActiveTab,
    currentTrip,
    theme,
    resetTrip,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useTrip();

  const isDark = theme === 'dark';

  // Determine transportation visual icon & label dynamically
  const transportation = currentTrip?.transportation || currentTrip?.selectedOptions?.transportation;
  const transportMode = transportation?.mode || 'flight';
  const transportVisual = getTransportVisual(transportMode);

  // All 8 plan tabs (only shown when currentTrip is available)
  const planTabs = [
    { id: 'overview', label: 'Overview', icon: Compass, badge: '5 Essentials' },
    { id: 'itinerary', label: 'Smart Itinerary', icon: Calendar, badge: `${currentTrip?.duration || 3}D` },
    { id: 'map', label: 'Route Map', icon: MapPin, badge: 'Interactive' },
    {
      id: 'flights',
      label: transportVisual?.label ? (transportVisual.label.includes('Flight') ? 'Flights & Transit' : transportVisual.label) : 'Flight',
      icon: transportVisual?.icon || Plane,
      badge: 'Live Rates'
    },
    { id: 'hotels', label: 'Hotels & Stays', icon: Building, badge: 'Real Stays' },
    { id: 'budget', label: 'Budget Optimizer', icon: IndianRupee, badge: 'Smart' },
    { id: 'intelligence', label: 'AI Reasoning & Reviews', icon: Brain, badge: 'Evidence' },
    { id: 'assistant', label: 'AI Replanner & What-If', icon: MessageSquare, badge: 'AI Agent' }
  ];

  function handleNavigate(screen) {
    setActiveScreen(screen);
    setSidebarOpen(false);
  }

  function handleTabClick(tabId) {
    setActiveTab(tabId);
    if (activeScreen !== 'dashboard') {
      setActiveScreen('dashboard');
    }
    setSidebarOpen(false);
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* ── TOP SECTION: LOGO & HEADER ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/30 py-4 px-3 space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <AiAgentLogo
                onClick={() => handleNavigate('landing')}
                isDark={isDark}
                size="sm"
              />
            </div>
          ) : (
            <button
              onClick={() => handleNavigate('landing')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md"
              title="TravelOS AI Home"
            >
              T
            </button>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`hidden lg:flex p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── SECTION 1: MAIN NAVIGATION (ALWAYS VISIBLE) ── */}
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
          )}

          {/* Explore Button */}
          <button
            onClick={() => handleNavigate('landing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeScreen === 'landing'
                ? isDark
                  ? 'bg-blue-600/15 text-blue-400 font-bold border border-blue-500/20 shadow-sm'
                  : 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-sm'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Explore Destinations"
          >
            <Compass className={`w-4 h-4 flex-shrink-0 ${activeScreen === 'landing' ? 'text-blue-500' : 'text-slate-400'}`} />
            {!sidebarCollapsed && <span>Explore</span>}
          </button>

          {/* Trip Planner Button */}
          <button
            onClick={() => handleNavigate('builder')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
              activeScreen === 'builder'
                ? isDark
                  ? 'bg-blue-600/15 text-blue-400 font-bold border border-blue-500/20 shadow-sm'
                  : 'bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-sm'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Trip Planner"
          >
            <Sparkles className={`w-4 h-4 flex-shrink-0 ${activeScreen === 'builder' ? 'text-blue-500' : 'text-slate-400'}`} />
            {!sidebarCollapsed && <span>Trip Planner</span>}
          </button>
        </div>

        {/* ── SECTION 2: TRIP PLAN CONTROLS (SHOW ONLY WHEN PLAN IS DONE) ── */}
        {currentTrip ? (
          <div className="space-y-3 pt-2 border-t border-slate-200/10">
            {/* View Plan Header Card */}
            {!sidebarCollapsed ? (
              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Current Plan</span>
                  <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ready
                  </span>
                </div>

                {/* View Plan: Destination Button */}
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all group ${
                    activeScreen === 'dashboard'
                      ? isDark
                        ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/40 shadow-md'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm'
                      : isDark
                      ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-blue-500 uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      View Plan: {currentTrip.destination}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{currentTrip.duration || 3} Days</span>
                    <span>•</span>
                    <span>{currentTrip.travelers || 2} Travelers</span>
                    {currentTrip.budget && (
                      <>
                        <span>•</span>
                        <span>₹{Number(currentTrip.budget).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('dashboard')}
                className={`w-full p-2 rounded-xl flex items-center justify-center transition-all ${
                  activeScreen === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title={`View Plan: ${currentTrip.destination}`}
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            {/* Plan Sections / Tabs (Overview, Smart Itinerary, Route Map, Flight, Hotels, Budget, AI Reasoning, AI Replanner) */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Plan Details
                </div>
              )}

              {planTabs.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeScreen === 'dashboard' && activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                      isSelected
                        ? isDark
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20'
                          : 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10'
                        : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={tab.label}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      {!sidebarCollapsed && <span className="truncate">{tab.label}</span>}
                    </div>

                    {!sidebarCollapsed && tab.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isDark
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── WHEN PLAN IS REMAIN TO PLAN (NO PLAN YET) ── */
          /* As requested: All plan tabs and View Plan are hidden; show a friendly prompt */
          !sidebarCollapsed && (
            <div className="pt-2 border-t border-slate-200/10 px-1">
              <div className={`p-3 rounded-2xl border ${
                isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span>No Active Plan</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                  Plan your journey to unlock the itinerary, route map, live flights, hotels, and budget optimizer.
                </p>
                <button
                  onClick={() => handleNavigate('builder')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* ── BOTTOM SECTION: LIVE DATA STATUS & RESET ── */}
      <div className={`p-3 border-t flex-shrink-0 ${
        isDark ? 'border-slate-800/80 bg-[#070B14]' : 'border-slate-200 bg-slate-50/80'
      }`}>
        {currentTrip && !sidebarCollapsed && (
          <button
            onClick={resetTrip}
            className="w-full mb-2 py-2 px-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 rotate-45" />
            <span>Create New Plan</span>
          </button>
        )}

        <div className="flex items-center justify-between px-1">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-400">SerpApi Grounded</span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse" title="SerpApi Grounded" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP FIXED/DOCKED LEFT SIDEBAR ── */}
      <aside
        className={`hidden lg:block flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64 xl:w-72'
        } ${
          isDark
            ? 'bg-[#090D16] border-slate-800/80 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ── MOBILE DRAWER MODAL OVERLAY ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className={`relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 transition-transform ${
              isDark ? 'bg-[#090D16] text-white' : 'bg-white text-slate-900'
            }`}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
