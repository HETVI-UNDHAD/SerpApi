import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import LocationInput from '../components/LocationInput';
import AnywhereInIndiaModal from '../components/AnywhereInIndiaModal';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  MapPin, Calendar, Users, IndianRupee, Sparkles,
  ArrowRight, CheckCircle2, X, Loader2, ChevronRight,
  Compass, Heart, ShieldCheck, Umbrella, Utensils, Landmark, Castle, Mountain,
  Leaf, ShoppingBag, Music2, UsersRound, Camera, HeartHandshake, Plane, Train,
  Car, Sparkle, HelpCircle, Check, AlertCircle
} from 'lucide-react';

const INTERESTS = [
  { id: 'Beaches', icon: Umbrella, desc: 'Coastlines & Sunsets' },
  { id: 'Food', icon: Utensils, desc: 'Street food & Fine dining' },
  { id: 'Culture', icon: Landmark, desc: 'Traditions & Arts' },
  { id: 'History', icon: Castle, desc: 'Forts & Monuments' },
  { id: 'Adventure', icon: Mountain, desc: 'Trekking & Sports' },
  { id: 'Nature', icon: Leaf, desc: 'Forests & Sanctuaries' },
  { id: 'Shopping', icon: ShoppingBag, desc: 'Bazaars & Artisans' },
  { id: 'Nightlife', icon: Music2, desc: 'Clubs & Lounges' },
  { id: 'Photography', icon: Camera, desc: 'Scenic viewpoints' },
  { id: 'Relaxation', icon: HeartHandshake, desc: 'Spas & Quiet stays' },
];

const STYLES = [
  { id: 'Balanced', label: 'Balanced Pace', desc: 'Mix of sights & free time' },
  { id: 'Relaxed', label: 'Slow & Leisurely', desc: 'Unrushed mornings & coffee' },
  { id: 'Adventure', label: 'Action Packed', desc: 'Full days with maximum stops' },
  { id: 'Luxury', label: 'Luxury & Fine Living', desc: 'Premier stays & chauffeur' },
  { id: 'Budget', label: 'Smart Backpacker', desc: 'Cost-optimized local transit' }
];

const STAYS = [
  { id: 'Hotel', label: 'Star Hotel', desc: 'Verified amenities & central location' },
  { id: 'Boutique Resort', label: 'Boutique Resort', desc: 'Unique character & scenic views' },
  { id: 'Hostel / Co-living', label: 'Hostel / Co-living', desc: 'Social vibe & budget friendly' },
  { id: 'Homestay', label: 'Heritage Homestay', desc: 'Authentic local hospitality' }
];

const TRANSITS = [
  { id: 'Flight', label: 'Flight (Fastest)', icon: Plane },
  { id: 'Train / Express Rail', label: 'Express Rail / Vande Bharat', icon: Train },
  { id: 'Self-Drive / Taxi', label: 'Road Trip / Private Cab', icon: Car }
];

export default function TripBuilderPage() {
  const {
    formData, setFormData, generateTrip,
    setActiveScreen, theme
  } = useTrip();

  const isDark = theme === 'dark';
  const [mapsReady, setMapsReady] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [isParsingPrompt, setIsParsingPrompt] = useState(false);
  const [parseError, setParseError] = useState('');

  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(() => {});
  }, []);

  function handleOriginSelect(loc) {
    setFormData(p => ({
      ...p,
      origin: loc.formattedAddress || loc.name,
      originLocation: loc,
      originCoords: loc.latitude && loc.longitude ? { lat: loc.latitude, lng: loc.longitude } : p.originCoords
    }));
  }

  function handleDestSelect(loc) {
    setFormData(p => ({
      ...p,
      destination: loc.formattedAddress || loc.name,
      destinationLocation: loc,
      destinationCoords: loc.latitude && loc.longitude ? { lat: loc.latitude, lng: loc.longitude } : p.destinationCoords
    }));
  }

  function toggleInterest(id) {
    setFormData(p => {
      const has = p.interests.includes(id);
      return { ...p, interests: has ? p.interests.filter(i => i !== id) : [...p.interests, id] };
    });
  }

  async function handleParsePrompt() {
    if (!promptText.trim()) return;
    setIsParsingPrompt(true);
    setParseError('');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/trips/parse-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await res.json();
      if (data.success && data.parsed) {
        setFormData(p => ({
          ...p,
          origin: data.parsed.origin || p.origin,
          destination: data.parsed.destination || p.destination,
          duration: data.parsed.duration || p.duration,
          travelers: data.parsed.travelers || p.travelers,
          budget: data.parsed.budget || p.budget,
          travelStyle: data.parsed.travelStyle || p.travelStyle,
          interests: data.parsed.interests?.length ? data.parsed.interests : p.interests
        }));
        setPromptText('');
      } else {
        setParseError('Could not understand prompt details. Please adjust form manually.');
      }
    } catch {
      setParseError('Failed to parse prompt. Please check backend connection.');
    } finally {
      setIsParsingPrompt(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.destination?.trim()) {
      setDiscoveryOpen(true);
      return;
    }
    generateTrip();
  }

  const perPersonPerDay = formData.budget && formData.duration && formData.travelers
    ? Math.round(Number(formData.budget) / (Number(formData.duration) * Number(formData.travelers)))
    : null;

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-6xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <button
              onClick={() => setActiveScreen('landing')}
              className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5 hover:underline"
            >
              ← Back to Explore
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                Trip Architect
              </span>
              <span className="text-xs text-slate-400">· Live SerpApi Grounded</span>
            </div>
            <h1 className="editorial-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Design Your Master Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Customize dates, budget, rhythm, and passions. Our AI verifies real flights, hotels, and attractions via Google engines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDiscoveryOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100/50 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Help Me Choose a Destination</span>
          </button>
        </div>

        {/* ── NATURAL LANGUAGE PROMPT BAR (OPTIONAL QUICK FILL) ── */}
        <div className={`mb-8 p-4 sm:p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-[#0E1526] border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Fast Architect: Describe your trip in plain English</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleParsePrompt())}
              placeholder="e.g. 4 days relaxing beach trip to Goa from Ahmedabad under ₹25,000 for 2 people with seafood"
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={handleParsePrompt}
              disabled={isParsingPrompt || !promptText.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
            >
              {isParsingPrompt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Auto-Fill</span>
            </button>
          </div>
          {parseError && (
            <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {parseError}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── LEFT: FORM SECTIONS ── */}
            <div className="lg:col-span-8 space-y-6">

              {/* 1. Origins & Destinations */}
              <div className={`p-6 rounded-3xl border transition-all ${
                isDark ? 'bg-[#0E1526] border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h2 className="editorial-serif text-xl font-bold">Route & Locations</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <LocationInput
                      label="Departure City (Origin)"
                      value={formData.origin}
                      onChange={v => setFormData(p => ({ ...p, origin: v }))}
                      onSelectLocation={handleOriginSelect}
                      placeholder="e.g. Ahmedabad, Mumbai, Delhi"
                    />
                  </div>

                  <div>
                    <LocationInput
                      label="Destination"
                      value={formData.destination}
                      onChange={v => setFormData(p => ({ ...p, destination: v }))}
                      onSelectLocation={handleDestSelect}
                      placeholder="e.g. Goa, Manali, Kerala"
                      isDestination={true}
                      onOpenDiscovery={() => setDiscoveryOpen(true)}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Duration, Travelers, Budget */}
              <div className={`p-6 rounded-3xl border transition-all ${
                isDark ? 'bg-[#0E1526] border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h2 className="editorial-serif text-xl font-bold">Timeline, Party & Budget</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Duration (Days)
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-2xl">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={formData.duration}
                        onChange={e => setFormData(p => ({ ...p, duration: Number(e.target.value) || 1 }))}
                        className="w-full bg-transparent text-sm font-bold focus:outline-none"
                      />
                      <span className="text-xs text-slate-400 font-medium">Days</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Travelers
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-2xl">
                      <Users className="w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.travelers}
                        onChange={e => setFormData(p => ({ ...p, travelers: Number(e.target.value) || 1 }))}
                        className="w-full bg-transparent text-sm font-bold focus:outline-none"
                      />
                      <span className="text-xs text-slate-400 font-medium">Pax</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Total Budget (₹)
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-3 rounded-2xl">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                      <input
                        type="number"
                        min="5000"
                        step="1000"
                        value={formData.budget}
                        onChange={e => setFormData(p => ({ ...p, budget: Number(e.target.value) || 5000 }))}
                        className="w-full bg-transparent text-sm font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {perPersonPerDay && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Target Spending Power:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ≈ ₹{perPersonPerDay.toLocaleString('en-IN')} / person / day
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Rhythm & Travel Style */}
              <div className={`p-6 rounded-3xl border transition-all ${
                isDark ? 'bg-[#0E1526] border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h2 className="editorial-serif text-xl font-bold">Rhythm & Travel Style</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {STYLES.map(s => {
                    const active = formData.travelStyle === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setFormData(p => ({ ...p, travelStyle: s.id }))}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          active
                            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 shadow-sm'
                            : isDark
                            ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{s.label}</span>
                          {active && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Passions & Thematic Interests */}
              <div className={`p-6 rounded-3xl border transition-all ${
                isDark ? 'bg-[#0E1526] border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center">
                      4
                    </span>
                    <h2 className="editorial-serif text-xl font-bold">Passions & Themes</h2>
                  </div>
                  <span className="text-xs text-slate-400">Select all that apply</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {INTERESTS.map(({ id, icon: Icon, desc }) => {
                    const active = formData.interests.includes(id);
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => toggleInterest(id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 scale-[1.02]'
                            : isDark
                            ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-2 ${active ? 'text-white' : 'text-blue-500'}`} />
                        <span className="font-bold text-xs block leading-tight">{id}</span>
                        <span className={`text-[10px] block mt-0.5 truncate ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Stay & Transit Preferences */}
              <div className={`p-6 rounded-3xl border transition-all ${
                isDark ? 'bg-[#0E1526] border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center justify-center">
                    5
                  </span>
                  <h2 className="editorial-serif text-xl font-bold">Lodging & Transit</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Accommodation Type
                    </label>
                    <select
                      value={formData.accommodationPreference}
                      onChange={e => setFormData(p => ({ ...p, accommodationPreference: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-2xl text-xs font-bold border focus:outline-none transition-colors ${
                        isDark
                          ? 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                    >
                      {STAYS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Primary Transit Mode
                    </label>
                    <select
                      value={formData.transportPreference}
                      onChange={e => setFormData(p => ({ ...p, transportPreference: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-2xl text-xs font-bold border focus:outline-none transition-colors ${
                        isDark
                          ? 'bg-slate-900 border-slate-800 text-white focus:border-blue-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                      }`}
                    >
                      {TRANSITS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT: STICKY JOURNEY BLUEPRINT & SUBMIT ── */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-5">
                
                {/* Blueprint Card */}
                <div className={`p-6 rounded-3xl border shadow-xl ${
                  isDark ? 'bg-[#0E1526] border-slate-800' : 'bg-white border-slate-200/80'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-400">
                      Journey Blueprint
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400">Origin:</span>
                      <span className="font-bold">{formData.origin || 'Not set'}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400">Destination:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {formData.destination || 'AI Selection'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-bold">{formData.duration} Days</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400">Travelers:</span>
                      <span className="font-bold">{formData.travelers} Pax</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400">Total Budget:</span>
                      <span className="font-bold text-emerald-500">
                        ₹{Number(formData.budget).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400">Pace / Style:</span>
                      <span className="font-bold">{formData.travelStyle}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Transit:</span>
                      <span className="font-bold">{formData.transportPreference}</span>
                    </div>
                  </div>

                  {formData.interests.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Themes ({formData.interests.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.interests.map(i => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Master Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Queries live SerpApi Google Flights, Hotels, Places & Directions.
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Destination Discovery Modal */}
      <AnywhereInIndiaModal
        isOpen={discoveryOpen}
        onClose={() => setDiscoveryOpen(false)}
        initialOrigin={formData.origin || 'Ahmedabad'}
        initialBudget={formData.budget || 20000}
        initialDuration={formData.duration || 3}
        initialInterest={formData.interests[0] || 'Beaches'}
        onSelectDestination={cand => {
          setFormData(prev => ({
            ...prev,
            destination: cand.name,
            budget: cand.budget || prev.budget,
            duration: cand.duration || prev.duration,
            destinationLocation: {
              name: cand.name,
              city: cand.city,
              district: '',
              state: cand.state,
              country: cand.country,
              latitude: null,
              longitude: null,
              formattedAddress: `${cand.name}, ${cand.state}, India`,
              source: 'anywhere_in_india_discovery'
            }
          }));
          setDiscoveryOpen(false);
        }}
      />
    </div>
  );
}
