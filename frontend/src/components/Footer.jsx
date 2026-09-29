import React, { useState } from 'react';
import { Compass, Sparkles, ShieldCheck, Plane, Building, MapPin, ArrowRight, Zap } from 'lucide-react';

const NAV_COLS = [
  {
    heading: 'Travel Experiences',
    links: [
      'Beach & Coastal Escapes',
      'Mountain & Adventure',
      'Heritage & Culture',
      'Luxury Retreats',
      'Budget Backpacking',
      'Family Journeys',
    ],
  },
  {
    heading: 'Trip Tools',
    links: [
      'AI Trip Architect',
      'Budget Optimizer',
      'Flight Intelligence',
      'Hotel Discovery',
      'Route Clustering',
      'What-If Replanner',
    ],
  },
  {
    heading: 'Travel Inspiration',
    links: [
      'India Destinations',
      'Southeast Asia',
      'Europe Highlights',
      'Hidden Gems',
      'Weekend Getaways',
      'Layover Concierge',
    ],
  },
];

const LIVE_ENGINES = [
  { icon: Plane,    label: 'Google Flights' },
  { icon: Building, label: 'Google Hotels' },
  { icon: MapPin,   label: 'Google Maps'   },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  function handleJoin(e) {
    e.preventDefault();
    if (email.trim()) setJoined(true);
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07]" style={{ background: 'linear-gradient(180deg,#06101e 0%,#040d1a 100%)' }}>

      {/* ── subtle radial glow ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{ position:'absolute', top:'-10%', left:'50%', transform:'translateX(-50%)', width:'70%', height:'340px', background:'radial-gradient(ellipse at center, rgba(56,100,220,0.07) 0%, transparent 70%)', borderRadius:'50%' }} />
        {/* dot-grid route pattern */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)', backgroundSize:'28px 28px' }} />
        {/* decorative dashed route arc */}
        <svg className="absolute bottom-0 right-0 opacity-[0.04]" width="420" height="220" viewBox="0 0 420 220" fill="none" aria-hidden="true">
          <path d="M20 200 Q120 20 260 80 T420 40" stroke="white" strokeWidth="1.5" strokeDasharray="6 8" fill="none"/>
          <circle cx="20"  cy="200" r="4" fill="white"/>
          <circle cx="420" cy="40"  r="4" fill="white"/>
          <polygon points="415,36 425,40 415,44" fill="white"/>
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          MAIN GRID
         ══════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">

          {/* ── BRAND COLUMN ── */}
          <div className="md:col-span-4 space-y-5">

            {/* Logo + name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background:'linear-gradient(135deg,#1e3a8a,#4f46e5)', boxShadow:'0 0 18px rgba(79,70,229,0.35)' }}>
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight">TravelOS AI</span>
                <span className="block text-[9px] font-bold tracking-[0.18em] text-indigo-400 uppercase mt-0.5">
                  AI-Powered Travel Intelligence
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Autonomous AI travel planning grounded 100% in live search data. No hallucinations — every flight, hotel, and route is verified in real time via SerpApi.
            </p>

            {/* Live status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.07]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Live · SerpApi Verified</span>
            </div>

            {/* Live engine status */}
            <div className="space-y-2 pt-1">
              <p className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase">Live Travel Engine</p>
              <div className="flex flex-col gap-1.5">
                {LIVE_ENGINES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <Icon className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hackathon badge */}
            <div className="pt-1">
              <div className="inline-block px-3 py-2 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06]">
                <p className="text-[9px] font-black tracking-[0.15em] text-indigo-400 uppercase">SerpApi India Hackathon 2026</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Track 03 · Travel &amp; Local Discovery</p>
              </div>
            </div>
          </div>

          {/* ── NAV COLUMNS ── */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {NAV_COLS.map(col => (
              <div key={col.heading}>
                <p className="text-[9px] font-black tracking-[0.2em] text-indigo-400 uppercase mb-4">
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a
                        href="#"
                        className="group flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors duration-200"
                        onClick={e => e.preventDefault()}
                      >
                        <ArrowRight className="w-2.5 h-2.5 text-indigo-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                        <span>{link}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── NEWSLETTER ── */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] text-indigo-400 uppercase mb-1">Travel Intelligence</p>
              <h4 className="text-sm font-black text-white leading-snug">
                Stay ahead of every journey.
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Get curated routes, travel ideas &amp; live travel intelligence.
              </p>
            </div>

            {joined ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07]">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs font-bold text-emerald-400">You're in! Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleJoin} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500/60 transition-all"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background:'linear-gradient(135deg,#4f46e5,#06b6d4)', boxShadow:'0 4px 18px rgba(79,70,229,0.3)' }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>JOIN</span>
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-600 leading-relaxed">
              No spam. Unsubscribe anytime. Built for travelers who demand live data.
            </p>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-[10px] text-slate-600 order-2 sm:order-1">
            © {new Date().getFullYear()} TravelOS AI · Built with React, Express, SerpApi &amp; Supabase.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 order-1 sm:order-2">
            {['Privacy Policy', 'Terms of Service'].map(label => (
              <a
                key={label}
                href="#"
                onClick={e => e.preventDefault()}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">Live Engine Active</span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
