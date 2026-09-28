import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import LocationAutocomplete from '../components/LocationAutocomplete';
import PlaceImage from '../components/PlaceImage';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  MapPin, Calendar, Users, IndianRupee, Sparkles,
  ArrowRight, CheckCircle2, X, Loader2, ChevronRight,
  Compass, Heart, ShieldCheck, Umbrella, Utensils, Landmark, Castle, Mountain,
  Leaf, ShoppingBag, Music2, UsersRound, Camera, HeartHandshake
} from 'lucide-react';

const INTERESTS = [
  { id: 'Beaches', icon: Umbrella }, { id: 'Food', icon: Utensils },
  { id: 'Culture', icon: Landmark }, { id: 'History', icon: Castle },
  { id: 'Adventure', icon: Mountain }, { id: 'Nature', icon: Leaf },
  { id: 'Shopping', icon: ShoppingBag }, { id: 'Nightlife', icon: Music2 },
  { id: 'Family', icon: UsersRound }, { id: 'Photography', icon: Camera },
  { id: 'Relaxation', icon: HeartHandshake },
];

const STYLES = ['Budget', 'Balanced', 'Luxury', 'Adventure', 'Relaxed', 'Family', 'Backpacking'];
const STAYS = ['Hotel', 'Boutique Resort', 'Hostel / Co-living', 'Homestay'];
const TRANSITS = ['Flight', 'Train / Express Rail', 'Self-Drive / Taxi'];

export default function TripBuilderPage() {
  const {
    formData, setFormData, generateTrip,
    runDestinationDiscovery, destinationsDiscovery,
    isDiscovering, setActiveScreen, theme
  } = useTrip();

  const isDark = theme === 'dark';
  const [mapsReady, setMapsReady] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('3 days in Goa from Ahmedabad under ₹20,000 for 2 people, prefer beaches and local food');
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    loadGoogleMaps().then(() => setMapsReady(true)).catch(() => {});
  }, []);

  async function handleParsePrompt() {
    if (!promptInput.trim()) return;
    setIsParsing(true);
    try {
      const res = await fetch('http://localhost:5000/api/trips/parse-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput })
      });
      const data = await res.json();
      if (data.success && data.parsed) {
        const p = data.parsed;
        setFormData(prev => ({
          ...prev,
          origin: p.origin || prev.origin,
          destination: p.destination || prev.destination,
          duration: p.duration || prev.duration,
          budget: p.budget || prev.budget,
          travelers: p.travelers || prev.travelers,
          interests: p.interests?.length ? p.interests : prev.interests,
          transportPreference: p.transportPreference || prev.transportPreference,
          travelStyle: p.travelStyle || prev.travelStyle
        }));
      }
    } catch (err) {
      console.warn('[Parse error]:', err);
    } finally {
      setIsParsing(false);
    }
  }

  function handleOriginChange(v, place) {
    setFormData(p => ({ ...p, origin: v, originCoords: place ? { lat: place.lat, lng: place.lng } : p.originCoords }));
  }
  function handleDestChange(v, place) {
    setFormData(p => ({ ...p, destination: v, destinationCoords: place ? { lat: place.lat, lng: place.lng } : p.destinationCoords }));
  }
  function toggleInterest(id) {
    setFormData(p => {
      const has = p.interests.includes(id);
      return { ...p, interests: has ? p.interests.filter(i => i !== id) : [...p.interests, id] };
    });
  }
  async function openDiscovery() {
    setDiscoveryOpen(true);
    await runDestinationDiscovery({ origin: formData.origin, budget: formData.budget, duration: formData.duration, interests: formData.interests });
  }
  function selectDest(dest) {
    setFormData(p => ({ ...p, destination: dest.name }));
    setDiscoveryOpen(false);
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.destination?.trim()) { openDiscovery(); return; }
    generateTrip();
  }

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 transition-colors duration-400 font-sans backdrop-blur-[2px] ${
      isDark ? 'bg-[#080A0F]/28 text-slate-100' : 'bg-white/10 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto">

        {/* Editorial Header */}
        <div className="mb-10">
          <button
            onClick={() => setActiveScreen('landing')}
            className={`text-xs font-semibold mb-3 flex items-center gap-1.5 transition-colors ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            ← Back to Explore
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Trip Architect
            </span>
          </div>
          <h1 className={`editorial-display text-4xl sm:text-6xl font-semibold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Design Your Journey
          </h1>
          <p className={`text-sm mt-1 max-w-xl ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Enter natural language travel requirements or adjust constraints directly. TravelOS AI searches live flights, hotels, and attractions via SerpApi.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── LEFT: Main Configuration Cards ── */}
            <div className="lg:col-span-8 space-y-6">

              {/* Natural Language Constraint Parser */}
              <div className={`p-5 rounded-3xl border shadow-md space-y-3 ${
                isDark ? 'bg-[#111726] border-slate-800' : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                      Natural Language Constraint Parser
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">AI + Deterministic Model</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={e => setPromptInput(e.target.value)}
                    placeholder="e.g. 3 days in Goa from Ahmedabad under ₹20,000 for 2 people, prefer beaches and local food"
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none ${
                      isDark ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleParsePrompt}
                    disabled={isParsing}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs whitespace-nowrap shadow-md hover:scale-105 transition-all"
                  >
                    {isParsing ? 'Parsing...' : 'Extract Constraints'}
                  </button>
                </div>
                {/* Verified Constraint Model Pill Box */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px] font-medium">
                  <div className={`p-2 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-white/5 text-slate-300' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Destination</span>
                    <strong className="text-cyan-400 truncate block">{formData.destination || 'Goa'}</strong>
                  </div>
                  <div className={`p-2 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-white/5 text-slate-300' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Duration</span>
                    <strong className="text-emerald-400">{formData.duration} Days</strong>
                  </div>
                  <div className={`p-2 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-white/5 text-slate-300' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Budget</span>
                    <strong className="text-emerald-400">₹{Number(formData.budget).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className={`p-2 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-white/5 text-slate-300' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Travelers</span>
                    <strong className="text-white">{formData.travelers} Pax</strong>
                  </div>
                  <div className={`p-2 rounded-xl border text-center ${isDark ? 'bg-slate-900/60 border-white/5 text-slate-300' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Interests</span>
                    <strong className="text-cyan-300 truncate block">{formData.interests?.slice(0, 2).join(', ') || 'Beaches'}</strong>
                  </div>
                </div>
              </div>

              {/* Destination & Origin Card */}
              <Card isDark={isDark} title="Where are you traveling?">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field isDark={isDark} label="Departure City (From)">
                    {mapsReady
                      ? <LocationAutocomplete value={formData.origin} onChange={handleOriginChange} placeholder="Origin city" icon={MapPin} iconColor="text-slate-400" required />
                      : <PlainInput isDark={isDark} icon={<MapPin className="w-4 h-4 text-slate-400" />} value={formData.origin} onChange={v => setFormData(p => ({ ...p, origin: v }))} placeholder="Origin city" required />
                    }
                  </Field>

                  <Field isDark={isDark} label={
                    <div className="flex items-center justify-between">
                      <span>Destination (To)</span>
                      <button
                        type="button"
                        onClick={openDiscovery}
                        className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" /> Help me choose
                      </button>
                    </div>
                  }>
                    {mapsReady
                      ? <LocationAutocomplete value={formData.destination} onChange={handleDestChange} placeholder="Destination (or click 'Help me choose')" icon={MapPin} iconColor="text-cyan-500" />
                      : <PlainInput isDark={isDark} icon={<MapPin className="w-4 h-4 text-cyan-500" />} value={formData.destination} onChange={v => setFormData(p => ({ ...p, destination: v }))} placeholder="Destination (or leave empty)" />
                    }
                  </Field>
                </div>
              </Card>

              {/* Trip Dimensions: Days, Travelers, Budget */}
              <Card isDark={isDark} title="Duration, Travelers & Budget">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field isDark={isDark} label="Trip Days">
                    <NumInput isDark={isDark} icon={<Calendar className="w-4 h-4 text-slate-400" />} value={formData.duration} min={1} max={14}
                      onChange={v => setFormData(p => ({ ...p, duration: v }))} />
                  </Field>

                  <Field isDark={isDark} label="Travelers">
                    <NumInput isDark={isDark} icon={<Users className="w-4 h-4 text-slate-400" />} value={formData.travelers} min={1} max={10}
                      onChange={v => setFormData(p => ({ ...p, travelers: v }))} />
                  </Field>

                  <Field isDark={isDark} label="Allocated Budget (₹)">
                    <NumInput isDark={isDark} icon={<IndianRupee className="w-4 h-4 text-emerald-500" />} value={formData.budget} min={5000} step={1000}
                      onChange={v => setFormData(p => ({ ...p, budget: v }))} />
                  </Field>
                </div>
              </Card>

              {/* Travel Style */}
              <Card isDark={isDark} title="Travel Rhythm & Style">
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <Pill key={s} isDark={isDark} active={formData.travelStyle === s} onClick={() => setFormData(p => ({ ...p, travelStyle: s }))}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </Card>

              {/* Interests (Luxury Tags) */}
              <Card isDark={isDark} title="Interests & Passions">
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ id, icon: Icon }) => (
                    <Pill key={id} isDark={isDark} active={formData.interests.includes(id)} onClick={() => toggleInterest(id)}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{id}</span>
                    </Pill>
                  ))}
                </div>
              </Card>

              {/* Preferences */}
              <Card isDark={isDark} title="Accommodation & Transit Preferences">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field isDark={isDark} label="Preferred Stay">
                    <select
                      value={formData.accommodationPreference}
                      onChange={e => setFormData(p => ({ ...p, accommodationPreference: e.target.value }))}
                      className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                        isDark
                          ? 'bg-white/[0.04] border border-white/10 text-white focus:border-[#c8ef61]'
                          : 'bg-white border border-slate-200 text-slate-900 focus:border-teal-500 shadow-sm'
                      }`}
                    >
                      {STAYS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>

                  <Field isDark={isDark} label="Primary Transit">
                    <select
                      value={formData.transportPreference}
                      onChange={e => setFormData(p => ({ ...p, transportPreference: e.target.value }))}
                      className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                        isDark
                          ? 'bg-white/[0.04] border border-white/10 text-white focus:border-[#c8ef61]'
                          : 'bg-white border border-slate-200 text-slate-900 focus:border-teal-500 shadow-sm'
                      }`}
                    >
                      {TRANSITS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
              </Card>

            </div>

            {/* ── RIGHT: Summary & Submit Action ── */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-5">
                <div className={`p-6 sm:p-7 rounded-2xl border shadow-xl ${
                  isDark ? 'bg-[#151c19]/90 border-white/10 shadow-luxury-dark' : 'bg-white/90 border-slate-200/80 shadow-luxury-light'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-sm font-black uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Journey Blueprint
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <SummaryRow isDark={isDark} label="Origin" value={formData.origin || '—'} />
                    <SummaryRow isDark={isDark} label="Destination" value={formData.destination || 'AI Suggested'} highlight={!formData.destination} />
                    <SummaryRow isDark={isDark} label="Duration" value={`${formData.duration} days`} />
                    <SummaryRow isDark={isDark} label="Travelers" value={`${formData.travelers} pax`} />
                    <SummaryRow isDark={isDark} label="Budget" value={`₹${Number(formData.budget).toLocaleString('en-IN')}`} green />
                    <SummaryRow isDark={isDark} label="Pace & Style" value={formData.travelStyle} />
                  </div>

                  {formData.interests.length > 0 && (
                    <div className={`mt-5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Selected Themes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.interests.map(i => (
                          <span
                            key={i}
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                              isDark
                                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}
                          >
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#D92638] hover:bg-[#B91C2C] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Master Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* AI Discovery Trigger */}
                <button
                  type="button"
                  onClick={openDiscovery}
                  className={`w-full py-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Discover Inspiring Destinations</span>
                </button>

                <p className={`text-[10px] text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Live data via SerpApi · Google Flights · Hotels · Maps
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* ── AI DESTINATION DISCOVERY SCREEN (EDITORIAL DRAWER) ── */}
      {discoveryOpen && (
        <div className="fixed inset-0 z-50 bg-black/68 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
          <div className={`border rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 relative transition-colors duration-300 ${
            isDark ? 'bg-slate-950 border-white/20' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setDiscoveryOpen(false)}
              className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                AI Discovery Engine
              </span>
              <h2 className={`text-2xl sm:text-3xl font-black mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recommended Destinations from {formData.origin || 'your origin'}
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Ranked by interest match and live estimated fares within ₹{Number(formData.budget).toLocaleString('en-IN')}.
              </p>
            </div>

            {isDiscovering ? (
              <div className="py-20 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
                <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Analyzing flight corridors & verified hotel rates...
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                {destinationsDiscovery.map(dest => (
                  <div
                    key={dest.name}
                    onClick={() => selectDest(dest)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-lg ${
                      isDark
                        ? 'bg-slate-900/60 border-white/10 hover:border-cyan-400/40'
                        : 'bg-slate-50 border-slate-200/80 hover:border-indigo-400/50'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-md">
                      <PlaceImage
                        query={`${dest.name} travel photography landscape`}
                        fallbackSrc={dest.coverImage || null}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        skeletonClassName="absolute inset-0"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {dest.name}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {dest.interestMatch || '95%'} Match
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {dest.tagline || 'Scenic viewpoints, cultural landmarks and coastal breezes.'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-black text-emerald-400">
                          {dest.estimatedCostFormatted || `~₹${(formData.budget * 0.9).toLocaleString('en-IN')}`}
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {formData.duration} Days Plan
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-indigo-600/15 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Sub-components ──

function Card({ title, isDark, children }) {
  return (
    <div className={`p-6 sm:p-7 rounded-2xl border transition-colors ${
      isDark ? 'bg-[#151c19]/90 border-white/10 shadow-luxury-dark' : 'bg-white/90 border-slate-200/80 shadow-luxury-light'
    }`}>
      <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${
        isDark ? 'text-slate-200' : 'text-slate-700'
      }`}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, isDark, children }) {
  return (
    <div>
      <label className={`block text-xs font-bold mb-1.5 ${
        isDark ? 'text-slate-100' : 'text-slate-800'
      }`}>
        {typeof label === 'string' ? label : label}
      </label>
      {children}
    </div>
  );
}

function Pill({ active, onClick, isDark, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
        active
          ? 'bg-[#0C2340] text-white shadow-sm border border-[#0C2340] dark:bg-blue-600 dark:border-blue-500'
          : isDark
          ? 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/25 hover:text-white'
          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/70 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

function PlainInput({ icon, value, onChange, placeholder, required, isDark }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input
        type="text"
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
          isDark
            ? 'bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
            : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 shadow-sm'
        }`}
      />
    </div>
  );
}

function NumInput({ icon, value, onChange, min, max, step = 1, isDark }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseInt(e.target.value, 10) || min)}
        className={`w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
          isDark
            ? 'bg-slate-900 border border-slate-700 text-white focus:border-blue-500'
            : 'bg-white border border-slate-200 text-slate-900 focus:border-blue-600 shadow-sm'
        }`}
      />
    </div>
  );
}

function SummaryRow({ label, value, highlight, green, isDark }) {
  return (
    <div className="flex items-center justify-between">
      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{label}</span>
      <span className={`font-bold ${
        highlight
          ? 'text-amber-500'
          : green
          ? 'text-emerald-500'
          : isDark
          ? 'text-white'
          : 'text-slate-950'
      }`}>
        {value}
      </span>
    </div>
  );
}
