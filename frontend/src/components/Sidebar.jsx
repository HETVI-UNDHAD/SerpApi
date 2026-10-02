import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import AiAgentLogo from './AiAgentLogo';
import SerpApiGroundingModal from './SerpApiGroundingModal';
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
  ChevronRight,
  ShieldCheck,
  Palmtree,
  Mountain,
  Landmark,
  Waves,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Navigation
} from 'lucide-react';

// Curated compact destination shortcuts for the discovery section
const QUICK_DESTINATIONS = [
  {
    name: 'Goa',
    tag: 'Coastal & Beaches',
    badge: '3D · ₹18k',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=160&auto=format&fit=crop&q=80',
    interests: ['Beaches', 'Food', 'Nightlife']
  },
  {
    name: 'Kerala',
    tag: 'Backwaters & Lagoons',
    badge: '5D · ₹28k',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=160&auto=format&fit=crop&q=80',
    interests: ['Nature', 'Relaxation', 'Food']
  },
  {
    name: 'Manali',
    tag: 'Alpine Peaks & Passes',
    badge: '4D · ₹22k',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=160&auto=format&fit=crop&q=80',
    interests: ['Adventure', 'Nature', 'Photography']
  },
  {
    name: 'Jaipur',
    tag: 'Royal Heritage & Forts',
    badge: '3D · ₹16k',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=160&auto=format&fit=crop&q=80',
    interests: ['Culture', 'History', 'Shopping']
  }
];

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
    setSidebarCollapsed,
    setFormData
  } = useTrip();

  const isDark = theme === 'dark';
  const [groundingOpen, setGroundingOpen] = useState(false);

  const transportation = currentTrip?.transportation || currentTrip?.selectedOptions?.transportation;
  const transportMode = transportation?.mode || 'flight';
  const transportVisual = getTransportVisual(transportMode);

  const planTabs = [
    { id: 'overview', label: 'Overview', icon: Compass, badge: '5 Essentials' },
    { id: 'itinerary', label: 'Smart Itinerary', icon: Calendar, badge: `${currentTrip?.duration || 3}D` },
    { id: 'map', label: 'Route Map', icon: MapPin, badge: 'Interactive' },
    {
      id: 'flights',
      label: transportVisual?.label ? (transportVisual.label.includes('Flight') ? 'Flights & Transit' : transportVisual.label) : 'Flights & Transit',
      icon: transportVisual?.icon || Plane,
      badge: 'Live Rates'
    },
    { id: 'hotels', label: 'Hotels & Stays', icon: Building, badge: 'Verified' },
    { id: 'budget', label: 'Budget Optimizer', icon: IndianRupee, badge: 'Smart' },
    { id: 'intelligence', label: 'AI Reasoning & Reviews', icon: Brain, badge: 'Evidence' },
    { id: 'assistant', label: 'AI Replanner & What-If', icon: MessageSquare, badge: 'Agent' }
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

  function handleQuickDestinationSelect(dest) {
    setFormData(prev => ({
      ...prev,
      destination: dest.name,
      interests: dest.interests || prev.interests
    }));
    setActiveScreen('builder');
    setSidebarOpen(false);
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* ── TOP SCROLLABLE COMMAND CENTER ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-5">

        {/* ── A. BRAND HEADER (ONLY SINGLE LOGO) ── */}
        <div className="flex items-center justify-between px-1.5 py-1">
          {!sidebarCollapsed ? (
            <AiAgentLogo
              onClick={() => handleNavigate('landing')}
              isDark={isDark}
              size="md"
            />
          ) : (
            <button
              onClick={() => handleNavigate('landing')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-black text-xs shadow-md mx-auto"
              title="TravelOSAI Command Center"
            >
              TO
            </button>
          )}

          {/* Desktop Collapse / Expand Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`hidden lg:flex p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={sidebarCollapsed ? 'Expand Command Center' : 'Collapse Command Center'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Mobile Drawer Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── B. PRIMARY NAVIGATION ── */}
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <div className="px-2.5 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Navigation</span>
              <span className="text-[9px] font-bold text-blue-500">v1.0</span>
            </div>
          )}

          {/* Explore */}
          <button
            onClick={() => handleNavigate('landing')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeScreen === 'landing'
                ? isDark
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Explore Destinations"
          >
            <Compass className={`w-4 h-4 shrink-0 ${activeScreen === 'landing' ? 'text-blue-500' : 'text-slate-400'}`} />
            {!sidebarCollapsed && <span>Explore Destinations</span>}
          </button>

          {/* Trip Architect */}
          <button
            onClick={() => handleNavigate('builder')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeScreen === 'builder'
                ? isDark
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Trip Architect & Planner"
          >
            <Sparkles className={`w-4 h-4 shrink-0 ${activeScreen === 'builder' ? 'text-blue-500' : 'text-slate-400'}`} />
            {!sidebarCollapsed && <span>Trip Architect</span>}
          </button>
        </div>

        {/* ── C. DISCOVER DESTINATIONS (COMPACT SHORTCUTS) ── */}
        {!sidebarCollapsed && (
          <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
            <div className="px-2.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
              <span>Discover Escapes</span>
              <span className="text-[9px] text-emerald-500 font-semibold">Live SerpApi</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {QUICK_DESTINATIONS.map(dest => (
                <div
                  key={dest.name}
                  onClick={() => handleQuickDestinationSelect(dest)}
                  className={`group p-2 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all duration-200 ${
                    isDark
                      ? 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-sm'
                  }`}
                  title={`Plan a trip to ${dest.name}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={dest.img}
                      alt={dest.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs leading-none">{dest.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium leading-none">· {dest.badge}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                        {dest.tag}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── D. DYNAMIC TRIP COMMAND CARD (CONTEXT AWARE) ── */}
        <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/60">
          {currentTrip ? (
            /* ACTIVE TRIP PRESENT */
            !sidebarCollapsed ? (
              <div className="space-y-2">
                <div className="px-2.5 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span>Active Workspace</span>
                  <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Grounded
                  </span>
                </div>

                {/* Main Trip Card */}
                <div
                  onClick={() => handleNavigate('dashboard')}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all group ${
                    activeScreen === 'dashboard'
                      ? isDark
                        ? 'bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border-blue-500/40 shadow-md'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm'
                      : isDark
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{currentTrip.destination}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{currentTrip.duration || 3} Days</span>
                    <span>•</span>
                    <span>{currentTrip.travelers || 2} Pax</span>
                    {currentTrip.budget && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{Number(currentTrip.budget).toLocaleString('en-IN')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Plan Details Sub-Tabs */}
                <div className="space-y-0.5 pt-1">
                  {planTabs.map(tab => {
                    const Icon = tab.icon;
                    const isSelected = activeScreen === 'dashboard' && activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                            : isDark
                            ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title={tab.label}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{tab.label}</span>
                        </div>

                        {tab.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : isDark
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-slate-200 text-slate-600'
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
              /* Collapsed Active Trip Button */
              <button
                onClick={() => handleNavigate('dashboard')}
                className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all ${
                  activeScreen === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'
                }`}
                title={`Active Journey: ${currentTrip.destination}`}
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
              </button>
            )
          ) : (
            /* NO ACTIVE TRIP (PREMIUM WELCOMING EMPTY STATE) */
            !sidebarCollapsed && (
              <div className={`p-4 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/50 border-slate-800/80 text-slate-300' : 'bg-white border-slate-200/90 text-slate-700 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Ready to Explore?</span>
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  TravelOSAI architects custom itineraries grounded in live Google Flights, Hotels, and GPS route clusters.
                </p>

                <div className="space-y-1.5">
                  <button
                    onClick={() => handleNavigate('builder')}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Start Planning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleNavigate('landing')}
                    className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold transition-colors ${
                      isDark
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Browse Collections
                  </button>
                </div>
              </div>
            )
          )}
        </div>

      </div>

      {/* ── BOTTOM SECTION: REAL SERPAPI PROVENANCE & CONTROLS ── */}
      <div className={`p-3 border-t shrink-0 ${
        isDark ? 'border-slate-800/80 bg-[#070B14]' : 'border-slate-200 bg-[#FAF8F5]'
      }`}>
        {currentTrip && !sidebarCollapsed && (
          <button
            onClick={resetTrip}
            className="w-full mb-2.5 py-2 px-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 rotate-45" />
            <span>Create New Plan</span>
          </button>
        )}

        <div className="flex items-center justify-between px-1">
          {!sidebarCollapsed ? (
            <button
              onClick={() => setGroundingOpen(true)}
              className="w-full flex items-center justify-between text-left hover:opacity-80 transition-opacity"
              title="Click to inspect live SerpApi queries"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  SerpApi Grounded
                </span>
              </div>
              <span className="text-[10px] text-blue-500 font-bold flex items-center gap-0.5">
                Proof <Zap className="w-3 h-3" />
              </span>
            </button>
          ) : (
            <button
              onClick={() => setGroundingOpen(true)}
              className="mx-auto p-1 text-emerald-400"
              title="SerpApi Live Grounding Proof"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse" />
            </button>
          )}
        </div>
      </div>

      {/* SerpApi Grounding Modal */}
      <SerpApiGroundingModal isOpen={groundingOpen} onClose={() => setGroundingOpen(false)} />
    </div>
  );

  return (
    <>
      {/* ── DESKTOP DOCKED SIDEBAR ── */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64 xl:w-72'
        } ${
          isDark
            ? 'bg-[#070B14] border-slate-800 text-slate-200'
            : 'bg-[#FAF8F5] border-slate-200 text-slate-800'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ── MOBILE DRAWER MODAL ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 transition-transform ${
              isDark ? 'bg-[#070B14] text-white' : 'bg-[#FAF8F5] text-slate-900'
            }`}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
