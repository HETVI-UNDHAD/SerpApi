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
          ? 'bg-[#071f3d]/78 backdrop-blur-xl border-b border-[#7eb7e8]/18 shadow-[0_10px_30px_rgba(1,12,32,0.28)]'
          : 'bg-transparent border-b border-transparent'
        : scrolled
          ? isDark
            ? 'bg-[#0A0A0F]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-luxury-dark'
            : 'bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-luxury'
          : 'bg-transparent border-b border-transparent'
    }`}>
      <div className={`max-w-6xl mx-auto mt-3 h-[62px] px-3 sm:px-4 flex items-center justify-between rounded-full border transition-all duration-500 ${
        isLanding
          ? 'bg-[#071f3d]/48 border-[#8fc4ee]/20 shadow-[0_12px_35px_rgba(1,12,32,0.3)] backdrop-blur-xl'
          : isDark
            ? 'bg-slate-950/75 border-white/10 backdrop-blur-xl'
            : 'bg-white/80 border-slate-200/80 backdrop-blur-xl shadow-sm'
      }`}>

        {/* Brand */}
        <button
          onClick={() => setActiveScreen('landing')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-full bg-[#173f70] text-[#c6e7ff] border border-[#80b9e8]/35 shadow-[0_8px_20px_rgba(2,18,48,0.32)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5" />
            <div className="absolute inset-0 rounded-xl bg-white/20 blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-1.5">
              <span className={`font-black text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Travel<span className="text-[#9acbfa]">OS</span>
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
              isDark ? 'bg-[#9acbfa]/10 border-[#9acbfa]/30 text-[#b9dcff]' : 'bg-sky-50 border-sky-200 text-sky-700'
            }`}>AI</span>
          </div>
        </button>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavBtn isDark={isDark} active={activeScreen === 'landing'} onClick={() => setActiveScreen('landing')}>
            Explore
          </NavBtn>
          <NavBtn isDark={isDark} active={activeScreen === 'builder'} onClick={() => setActiveScreen('builder')}>
            Plan Trip
          </NavBtn>
          <NavBtn isDark={isDark} active={activeScreen === 'design-showcase'} onClick={() => setActiveScreen('design-showcase')}>
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-gradient-indigo-violet font-bold">Showcase</span>
          </NavBtn>
          {currentTrip && (
            <NavBtn isDark={isDark} active={activeScreen === 'dashboard'} onClick={() => setActiveScreen('dashboard')}>
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
            className="px-4 py-2.5 rounded-full bg-[#173f70] border border-[#80b9e8]/30 text-[#d5edff] shadow-[0_8px_20px_rgba(2,18,48,0.3)] text-xs font-bold transition-all hover:scale-[1.03] hover:bg-[#24558e]"
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
      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
        active
          ? isDark
            ? 'bg-white/10 text-white border border-white/15 shadow-sm'
            : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
          : isDark
          ? 'text-slate-400 hover:text-white hover:bg-white/5'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
      }`}
    >
      {children}
    </button>
  );
}
