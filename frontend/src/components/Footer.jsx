import React from 'react';
import { Compass, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#061522]/72 backdrop-blur-xl py-12 px-4 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">
            TravelOS AI
          </span>
          <span className="text-slate-500">•</span>
          <span>SerpApi India Hackathon 2026 — Track 03</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span>Grounded live on Google Flights, Google Hotels, and Google Maps engines.</span>
        </div>

        <div className="text-[11px] text-slate-500">
          Built with React, Express, SerpApi & Supabase.
        </div>
      </div>
    </footer>
  );
}
