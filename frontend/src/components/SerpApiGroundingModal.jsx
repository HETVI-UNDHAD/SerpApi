import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  X,
  Plane,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Code2,
  Clock,
  TrendingDown,
  Layers,
  ArrowRight,
  Route,
  Camera,
  Search
} from 'lucide-react';

export default function SerpApiGroundingModal({ isOpen, onClose }) {
  const { currentTrip, theme } = useTrip();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('differentiation'); // 'differentiation' | 'engines'

  if (!isOpen) return null;

  const engines = [
    {
      engine: 'google_flights',
      label: 'Google Flights Engine',
      icon: Plane,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/25',
      params: ['engine: "google_flights"', 'departure_id: "AMD"', 'arrival_id: "GOI"', 'outbound_date: "2026-10-10"', 'currency: "INR"'],
      desc: 'Retrieves real-time ticket prices, carrier schedules (IndiGo, Air India), departure/arrival times, stops, carbon emissions, and direct booking links.'
    },
    {
      engine: 'google_hotels',
      label: 'Google Hotels Engine',
      icon: Building,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/25',
      params: ['engine: "google_hotels"', 'q: "hotels in Goa India"', 'check_in_date: "2026-10-10"', 'check_out_date: "2026-10-13"', 'currency: "INR"'],
      desc: 'Retrieves live room rates per night, verified guest reviews, star ratings, and amenities to balance against the user’s hard budget ceiling.'
    },
    {
      engine: 'google_maps',
      label: 'Google Maps Places Engine',
      icon: MapPin,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      params: ['engine: "google_maps"', 'q: "top attractions in Goa"', 'gl: "in"', 'hl: "en"'],
      desc: 'Returns exact GPS latitude & longitude coordinates for attractions, feeding the Haversine clustering engine to eliminate criss-crossing.'
    },
    {
      engine: 'google_maps_directions',
      label: 'Google Maps Directions Engine',
      icon: Route,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/25',
      params: ['engine: "google_maps_directions"', 'start_addr: "Ahmedabad"', 'end_addr: "Goa"', 'travel_mode: 3'],
      desc: 'Calculates real transit and driving route distances, duration seconds, and corridors between origins, hubs, and destinations.'
    },
    {
      engine: 'google_images',
      label: 'Google Images Engine',
      icon: Camera,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/25',
      params: ['engine: "google_images"', 'q: "Goa landscape scenic 4k"', 'safe: "active"'],
      desc: 'Surfaces authentic photographic imagery for destinations, hotels, and attractions without synthetic stock placeholders.'
    },
    {
      engine: 'google (Organic Search)',
      label: 'Google Organic Events & Sentiment',
      icon: Calendar,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/25',
      params: ['engine: "google"', 'q: "upcoming events festivals in Goa this month"', 'gl: "in"', 'hl: "en"'],
      desc: 'Surfaces live local cultural festivals, pop-up markets, music gigs, and forum traveler sentiment grounded directly in SerpApi web search.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          isDark
            ? 'bg-[#101626] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-20 ${
          isDark ? 'bg-[#101626]/95 border-slate-800 backdrop-blur-xl' : 'bg-white/95 border-slate-200 backdrop-blur-xl'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">SerpApi Grounding & Technical Differentiation</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Judges' Showcase
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                100% Live SerpApi Search Architecture with Deterministic Constraints & Dynamic Replanning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className={`px-6 pt-4 border-b flex items-center gap-4 ${
          isDark ? 'border-slate-800 bg-[#0c1220]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={() => setActiveTab('differentiation')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'differentiation'
                ? 'border-cyan-400 text-cyan-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Differentiation Matrix
          </button>
          <button
            onClick={() => setActiveTab('engines')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'engines'
                ? 'border-cyan-400 text-cyan-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            SerpApi Engines & Heavy Lifting
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">

          {/* TAB 1: RADICAL DIFFERENTIATION MATRIX */}
          {activeTab === 'differentiation' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed">
                <strong>Core Architecture:</strong> TravelOS AI combines live SerpApi travel search with deterministic constraint validation, Haversine geospatial optimization, and dynamic replanning. Unlike generic LLM chat planners, all hotel prices, flight windows, and geographic coordinates originate from live search queries.
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className={isDark ? 'bg-[#0B0F19] text-slate-300 border-b border-slate-800' : 'bg-slate-100 text-slate-700'}>
                    <tr>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Dimension</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Standard AI Travel Apps</th>
                      <th className="p-3.5 font-black uppercase tracking-wider text-cyan-400">TravelOS AI (Our System)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    <tr className={isDark ? 'bg-[#111726]/30' : 'bg-white'}>
                      <td className="p-3.5 font-bold text-white">Data Recency</td>
                      <td className="p-3.5 text-slate-400">Static training cutoffs, fictitious room rates, cached itineraries.</td>
                      <td className="p-3.5 text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Live SerpApi queries for real Google Flights fares and Google Hotels rates.</span>
                      </td>
                    </tr>
                    <tr className={isDark ? 'bg-[#111726]/10' : 'bg-slate-50'}>
                      <td className="p-3.5 font-bold text-white">Geospatial Routing</td>
                      <td className="p-3.5 text-slate-400">Generic attraction lists that cause criss-crossing across town.</td>
                      <td className="p-3.5 text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Haversine nearest-neighbor clustering with turn-by-turn corridors & commute buffers.</span>
                      </td>
                    </tr>
                    <tr className={isDark ? 'bg-[#111726]/30' : 'bg-white'}>
                      <td className="p-3.5 font-bold text-white">Budget Discipline</td>
                      <td className="p-3.5 text-slate-400">Unverified estimates that silently blow past user budget.</td>
                      <td className="p-3.5 text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Mathematical ledger: Flight + Hotel + Food + Activities + Buffer with Auto-Optimizer.</span>
                      </td>
                    </tr>
                    <tr className={isDark ? 'bg-[#111726]/10' : 'bg-slate-50'}>
                      <td className="p-3.5 font-bold text-white">Dynamic Replanning</td>
                      <td className="p-3.5 text-slate-400">Regenerates entire plan from scratch, discarding existing bookings.</td>
                      <td className="p-3.5 text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Preserves hotels & reservations while shifting only affected morning/afternoon stops.</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3 Strategic Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl border border-slate-800 bg-[#0B0F19] space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Engine 01</span>
                  <h5 className="font-bold text-white text-xs">Deterministic Budget Engine</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Strict mathematical ledger with multi-tier rebalancing across transport and stays to satisfy hard budget ceilings.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-800 bg-[#0B0F19] space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Engine 02</span>
                  <h5 className="font-bold text-white text-xs">Dynamic Replanning Engine</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Adapts to real-world flight delays and schedule shocks with structured Before vs After comparisons and preserved constraints.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-800 bg-[#0B0F19] space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Engine 03</span>
                  <h5 className="font-bold text-white text-xs">Geospatial Optimizer</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Pins exact GPS coordinates via Google Maps and sequences attractions to minimize daily transit distances and fatigue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERPAPI ENGINES & HEAVY LIFTING */}
          {activeTab === 'engines' && (
            <div className="space-y-4">
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Our platform relies directly on SerpApi's multi-engine infrastructure. Below are the verified engines powering live decision-making in TravelOS AI:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {engines.map(eng => {
                  const Icon = eng.icon;
                  return (
                    <div
                      key={eng.engine}
                      className={`p-5 rounded-2xl border space-y-3 ${
                        isDark ? 'bg-[#0B0F19] border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${eng.bg}`}>
                            <Icon className={`w-4 h-4 ${eng.color}`} />
                          </div>
                          <div>
                            <h5 className="font-black text-sm text-white">{eng.label}</h5>
                            <span className="font-mono text-[10px] text-slate-400">{eng.engine}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {eng.desc}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block mb-1">
                          Key API Parameters Used:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {eng.params.map((param, pIdx) => (
                            <code
                              key={pIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700/50"
                            >
                              {param}
                            </code>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? 'bg-[#0B0F19] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <span>Built for SerpApi Track 03: Travel & Local Discovery</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
