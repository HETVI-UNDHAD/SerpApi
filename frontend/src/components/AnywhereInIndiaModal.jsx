import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Clock, IndianRupee, X, Check, Loader2, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import PlaceImage from './PlaceImage';

export default function AnywhereInIndiaModal({
  isOpen,
  onClose,
  initialOrigin = 'Rajkot',
  initialBudget = 8000,
  initialDuration = 3,
  initialInterest = 'Mountains',
  onSelectDestination
}) {
  const [origin, setOrigin] = useState(initialOrigin);
  const [budget, setBudget] = useState(initialBudget);
  const [duration, setDuration] = useState(initialDuration);
  const [interest, setInterest] = useState(initialInterest);
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);

  const INTERESTS = [
    { id: 'Mountains', label: '⛰️ Mountains' },
    { id: 'Beaches', label: '🏖️ Beaches' },
    { id: 'Heritage', label: '🏰 Heritage & Forts' },
    { id: 'Nature', label: '🌲 Nature & Wildlife' },
    { id: 'Food', label: '🍛 Culinary & Street Food' },
    { id: 'Spiritual', label: '🛕 Spiritual & Temples' }
  ];

  useEffect(() => {
    if (isOpen) {
      setOrigin(initialOrigin || 'Rajkot');
      setBudget(initialBudget || 8000);
      setDuration(initialDuration || 3);
      setInterest(initialInterest || 'Mountains');
      discover(initialOrigin || 'Rajkot', initialBudget || 8000, initialDuration || 3, initialInterest || 'Mountains');
    }
  }, [isOpen]);

  async function discover(o, b, d, i) {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/destinations/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: o,
          budget: Number(b),
          duration: Number(d),
          interests: [i]
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.destinations)) {
        setDestinations(data.destinations);
      } else {
        throw new Error(data.error || 'Failed to discover destinations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-[var(--border)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Where should we go?</span>
              <span className="font-bold text-slate-400">•</span>
              <span className="font-bold">Anywhere in India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">
              Curated Destination Candidates
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Grounded on live distances, verified transit routes, and budget availability.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-[var(--border)]">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              From Origin
            </label>
            <input
              type="text"
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              placeholder="e.g. Rajkot"
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Max Budget
            </label>
            <div className="flex items-center px-3 py-1.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-semibold">
              <span className="text-[var(--text-muted)] mr-1">₹</span>
              <input
                type="number"
                step="1000"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full bg-transparent text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Trip Duration
            </label>
            <div className="flex items-center px-3 py-1.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-semibold">
              <input
                type="number"
                min="1"
                max="14"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-transparent text-[var(--text-primary)] focus:outline-none"
              />
              <span className="text-[var(--text-muted)] ml-1">Days</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Interest
            </label>
            <select
              value={interest}
              onChange={e => setInterest(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
            >
              {INTERESTS.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Re-discover button */}
        <div className="flex justify-between items-center py-3">
          <div className="text-xs text-[var(--text-secondary)]">
            Showing verified candidates matching <span className="font-semibold text-[var(--text-primary)]">{interest}</span> under <span className="font-semibold text-[var(--text-primary)]">₹{Number(budget).toLocaleString('en-IN')}</span> from <span className="font-semibold text-[var(--text-primary)]">{origin}</span>
          </div>
          <button
            onClick={() => discover(origin, budget, duration, interest)}
            disabled={loading}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Refresh Candidates</span>
          </button>
        </div>

        {/* Candidates List */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-[var(--text-secondary)]">
              Discovering destinations in India with live transit & stay data...
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500 text-sm">
            {error}
          </div>
        ) : destinations.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-secondary)] text-sm">
            No matching verified destinations found. Try expanding your budget or changing interest.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {destinations.map(dest => {
              const liveStatus = dest.liveDataStatus || 'LIVE';
              return (
                <div
                  key={dest.id || dest.name}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] hover:border-blue-500/50 hover:shadow-lg transition-all"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                    <PlaceImage
                      query={`${dest.name} ${dest.state || 'India'} landmark`}
                      fallbackSrc={dest.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Live data status tag */}
                    <div className="absolute top-3 left-3">
                      {liveStatus === 'LIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-sm shadow">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          LIVE
                        </span>
                      ) : liveStatus === 'ESTIMATED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/90 text-white backdrop-blur-sm shadow">
                          ESTIMATED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-600/90 text-white backdrop-blur-sm shadow">
                          UNAVAILABLE
                        </span>
                      )}
                    </div>

                    {/* Name + State */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-serif text-xl font-bold leading-tight">{dest.name}</h3>
                      <p className="text-xs text-white/80">{dest.state ? `${dest.state}, India` : 'India'}</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Why it matches */}
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                        <strong className="text-[var(--text-primary)]">Why it matches: </strong>
                        {dest.whyItMatches || dest.whyRecommended || dest.tagline || 'Scenic travel destination with great seasonal weather.'}
                      </p>

                      {/* Travel Details Chips */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                          <div>
                            <span className="text-[10px] text-[var(--text-muted)] block leading-none">Est. Cost</span>
                            <span className="font-bold text-[var(--text-primary)]">
                              ₹{Number(dest.estimatedCost || budget * 0.85).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <div>
                            <span className="text-[10px] text-[var(--text-muted)] block leading-none">Travel Time</span>
                            <span className="font-bold text-[var(--text-primary)] truncate block max-w-[120px]">
                              {dest.travelTime || '3-5h transit'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        onSelectDestination({
                          name: dest.name,
                          city: dest.city || dest.name,
                          state: dest.state || '',
                          country: 'India',
                          budget: dest.estimatedCost || budget,
                          duration: duration
                        });
                        onClose();
                      }}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Plan Trip to {dest.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
