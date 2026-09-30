import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import AiAgentLogo from './AiAgentLogo';
import {
  Compass,
  Calendar,
  Plane,
  Building,
  IndianRupee,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export default function Footer() {
  const { setActiveScreen, setActiveTab, currentTrip, theme } = useTrip();
  const isDark = theme === 'dark';
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  function handleNavigate(screen, tab = null) {
    setActiveScreen(screen);
    if (tab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer
      className={`border-t transition-colors font-sans ${
        isDark ? 'bg-[#060911] border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* ── TOP SECTION ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Brand & Description */}
          <div className="md:col-span-4 space-y-3">
            <AiAgentLogo isDark={isDark} size="md" />
            <p className="text-sm font-medium text-slate-400 max-w-sm">
              Plan smarter with live travel data.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Live SerpApi Verified Grounding</span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="md:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            {/* Planner Tools */}
            <div className="space-y-3">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
                Planner
              </span>
              <ul className="space-y-2 font-medium">
                <li>
                  <button
                    onClick={() => handleNavigate('landing')}
                    className="hover:text-blue-500 transition-colors"
                  >
                    Explore
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('builder')}
                    className="hover:text-blue-500 transition-colors"
                  >
                    Trip Planner
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('dashboard', 'flights')}
                    className="hover:text-blue-500 transition-colors"
                  >
                    Flights
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('dashboard', 'hotels')}
                    className="hover:text-blue-500 transition-colors"
                  >
                    Hotels
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('dashboard', 'budget')}
                    className="hover:text-blue-500 transition-colors"
                  >
                    Budget Optimizer
                  </button>
                </li>
              </ul>
            </div>

            {/* Technology & Trust */}
            <div className="space-y-3 sm:col-span-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
                Technology
              </span>
              <ul className="space-y-2 font-medium text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Powered by SerpApi</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>React</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Express</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Supabase</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons & External Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] block">
              Connect
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`p-2 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href="https://github.com/HETVI-UNDHAD/SerpApi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className={`p-2 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`p-2 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Zero-hallucination real-time travel intelligence.
            </p>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>© 2026 TravelOS AI</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-blue-500 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="hover:text-blue-500 transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Simple Privacy Policy Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-[#0E1526] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-bold text-lg">Privacy Policy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TravelOS AI values your privacy. We do not sell or store personal travel data beyond saving your explicit itinerary requests in your authenticated Supabase session. Live flight, hotel, and attraction queries are processed directly through SerpApi.
            </p>
            <button
              onClick={() => setPrivacyOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Simple Terms of Service Modal */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-[#0E1526] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-bold text-lg">Terms of Service</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TravelOS AI provides travel optimization based on real-time live data queries via SerpApi (Google Flights, Google Hotels, and Google Maps). Fares, room availability, and attraction opening hours are verified live at time of planning but remain subject to partner confirmation upon booking.
            </p>
            <button
              onClick={() => setTermsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
