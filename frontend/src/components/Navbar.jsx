import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { Sparkles, Compass, Sun, Moon, Menu } from 'lucide-react';

export default function Navbar() {
  const { activeScreen, setActiveScreen, currentTrip, theme, toggleTheme } = useTrip();
  const isDark = theme === 'dark';
  const isLanding = activeScreen === 'landing';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${isLanding ? 'absolute' : 'sticky'} top-0 z-50 w-full px-3 sm:px-5 transition-all duration-500 ${
      isLanding
        ? scrolled
          ? 'bg-[#101513]/82 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(1,12,18,0.24)]'
          : 'bg-transparent border-b border-transparent'
        : scrolled
          ? isDark
            ? 'bg-[#0A0A0F]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-luxury-dark'
            : 'bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-luxury'
          : 'bg-transparent border-b border-transparent'
    }`}>
      <div className={`max-w-6xl mx-auto mt-3 h-[58px] px-3 sm:px-5 flex items-center justify-between rounded-2xl border transition-all duration-300 ${
        isLanding
          ? 'bg-[#111815]/68 border-white/15 shadow-[0_12px_35px_rgba(1,12,18,0.25)] backdrop-blur-xl'
          : isDark
            ? 'bg-slate-950/75 border-white/10 backdrop-blur-xl'
            : 'bg-white/80 border-slate-200/80 backdrop-blur-xl shadow-sm'
      }`}>

        {/* Brand */}
        <button
          onClick={() => setActiveScreen('landing')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-xl bg-[#c8ef61] text-[#182117] border border-white/20 shadow-sm flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-300">
            <Compass className="w-5 h-5" />
            <div className="absolute inset-0 rounded-xl bg-white/20 blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-1.5">
              <span className={`font-black text-[15px] tracking-tight ${isLanding || isDark ? 'text-white' : 'text-slate-900'}`}>
              Travel<span className="text-[#c8ef61]">OS</span>
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
              isDark ? 'bg-[#c8ef61]/10 border-[#c8ef61]/25 text-[#d8f79a]' : 'bg-lime-50 border-lime-200 text-lime-800'
            }`}>AI</span>
          </div>
        </button>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavBtn isDark={isDark || isLanding} active={activeScreen === 'landing'} onClick={() => setActiveScreen('landing')}>
            Explore
          </NavBtn>
          <NavBtn isDark={isDark || isLanding} active={activeScreen === 'builder'} onClick={() => setActiveScreen('builder')}>
            Plan Trip
          </NavBtn>
          <NavBtn isDark={isDark || isLanding} active={activeScreen === 'design-showcase'} onClick={() => setActiveScreen('design-showcase')}>
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-gradient-indigo-violet font-bold">Showcase</span>
          </NavBtn>
          {currentTrip && (
            <NavBtn isDark={isDark || isLanding} active={activeScreen === 'dashboard'} onClick={() => setActiveScreen('dashboard')}>
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTrip.destination}</span>
            </NavBtn>
          )}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          <button className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`} aria-label="Open menu">
            <Menu className="w-4 h-4" />
          </button>

          {/* Premium Pill Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`relative flex items-center gap-1 p-1 rounded-full border transition-all duration-500 ${
              isDark
                ? 'bg-slate-800/80 border-white/10 shadow-luxury-dark'
                : 'bg-slate-100 border-slate-200 shadow-luxury'
            }`}
            style={{ width: 58, height: 32 }}
          >
            {/* Track */}
            <div className={`absolute inset-1 rounded-full transition-all duration-500 ${
              isDark ? 'bg-slate-700' : 'bg-white'
            }`} />
            {/* Sliding Thumb */}
            <div className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-md z-10 ${
              isDark
                ? 'translate-x-[28px] bg-[#1a9fa8] text-white'
                : 'translate-x-1 bg-[#ef6b76] text-white'
            }`}>
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </div>
            {/* Labels */}
            <Sun className={`absolute left-2 w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-60 text-slate-500'}`} />
            <Moon className={`absolute right-2 w-3 h-3 transition-opacity duration-300 ${isDark ? 'opacity-60 text-slate-400' : 'opacity-0'}`} />
          </button>

          <button
            onClick={() => setActiveScreen('builder')}
            className="px-4 py-2.5 rounded-xl bg-[#c8ef61] border border-lime-200/50 text-[#182117] shadow-sm text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Plan Trip
          </button>
        </div>
      </div>
    </header>
  );
}

function NavBtn({ children, active, onClick, isDark }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
        active
          ? `after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[#c8ef61] ${isDark ? 'text-white' : 'text-slate-950'}`
          : isDark
          ? 'text-slate-400 hover:text-white hover:bg-white/5'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
      }`}
    >
      {children}
    </button>
  );
}
