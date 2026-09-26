import { useEffect, useRef } from 'react'

const BADGES = [
  { icon: '⚡', label: 'Live Data',   delay: '0s',    pos: 'top-[18%] right-[8%]' },
  { icon: '🤖', label: 'AI Planning', delay: '0.4s',  pos: 'top-[52%] right-[2%]' },
  { icon: '•', label: 'Real Places', delay: '0.8s',  pos: 'bottom-[22%] right-[12%]' },
]

const DESTINATIONS = ['Rann of Kutch', 'Coorg', 'Spiti Valley', 'Hampi', 'Pondicherry']

export default function Hero({ onPlanClick }) {
  const tickerRef = useRef(null)

  useEffect(() => {
    const el = tickerRef.current
    if (!el) return
    let i = 0
    const items = DESTINATIONS
    const interval = setInterval(() => {
      i = (i + 1) % items.length
      el.style.opacity = '0'
      el.style.transform = 'translateY(8px)'
      setTimeout(() => {
        el.textContent = items[i]
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden flex items-center">

      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-glow rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left — text */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow" />
              <span className="text-cyan-300 text-xs font-semibold tracking-wide uppercase">
                SerpApi India Hackathon 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Your next journey,<br />
              <span className="text-gradient">planned intelligently.</span>
            </h1>

            {/* Destination ticker */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-white/50 text-sm">Discovering</span>
              <span
                ref={tickerRef}
                className="text-cyan-300 font-semibold text-sm transition-all duration-300"
                style={{ opacity: 1, transform: 'translateY(0)' }}>
                {DESTINATIONS[0]}
              </span>
              <span className="text-white/50 text-sm">and more...</span>
            </div>

            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              Discover destinations, compare real travel options and build a personalized
              journey using live travel data.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button onClick={onPlanClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-navy-900
                  bg-gradient-to-r from-cyan-400 to-teal-500 hover:shadow-glow-cyan
                  hover:scale-105 active:scale-95 transition-all duration-200 text-base">
                Plan My Journey
                <span className="text-lg">→</span>
              </button>
              <a href="#discover"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white
                  glass hover:bg-white/10 active:scale-95 transition-all duration-200 text-base">
                Explore Destinations
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { value: 'Live',  label: 'Search Data' },
                { value: 'AI',    label: 'Powered Planning' },
                { value: '100%',  label: 'Personalized' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative hidden lg:flex items-center justify-center">

            {/* Main visual card */}
            <div className="relative w-[380px] h-[460px] rounded-3xl overflow-hidden shadow-glow-navy">
              {/* CSS travel scene */}
              <div className="absolute inset-0 bg-gradient-to-b from-navy-800 to-navy-950">
                {/* Sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a6e] via-[#0f2035] to-navy-950" />
                {/* Stars */}
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
                    style={{ top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%` }} />
                ))}
                {/* Mountains */}
                <div className="absolute bottom-24 left-0 right-0">
                  <svg viewBox="0 0 380 200" className="w-full" preserveAspectRatio="none">
                    <polygon points="0,200 80,60 160,200" fill="#162d4a" />
                    <polygon points="60,200 160,40 260,200" fill="#0f2035" />
                    <polygon points="140,200 240,70 340,200" fill="#162d4a" />
                    <polygon points="220,200 310,90 380,200" fill="#0f2035" />
                    {/* Snow caps */}
                    <polygon points="80,60 95,90 65,90" fill="rgba(255,255,255,0.15)" />
                    <polygon points="160,40 178,75 142,75" fill="rgba(255,255,255,0.2)" />
                    <polygon points="240,70 256,100 224,100" fill="rgba(255,255,255,0.15)" />
                  </svg>
                </div>
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-teal-900/40 to-transparent" />
                {/* Moon */}
                <div className="absolute top-8 right-12 w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]" />
                {/* Cyan glow horizon */}
                <div className="absolute bottom-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
              </div>

              {/* Overlay info card */}
              <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-bold">Trip Overview</span>
                  <span className="text-cyan-400 text-xs font-semibold">Live</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { v: '3', l: 'Days' },
                    { v: '2', l: 'Travelers' },
                    { v: '₹15k', l: 'Budget' },
                  ].map(({ v, l }) => (
                    <div key={l} className="bg-white/5 rounded-xl py-2">
                      <div className="text-white font-bold text-sm">{v}</div>
                      <div className="text-white/40 text-xs">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            {BADGES.map(({ icon, label, delay, pos }) => (
              <div key={label}
                className={`absolute ${pos} glass px-3 py-2 rounded-xl flex items-center gap-2 animate-float`}
                style={{ animationDelay: delay }}>
                <span className="text-base">{icon}</span>
                <span className="text-white text-xs font-semibold whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  )
}
