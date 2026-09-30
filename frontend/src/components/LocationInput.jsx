import React, { useState, useEffect, useRef } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Loader2, Sparkles, X, ChevronRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Natural location input with SerpApi-backed location verification
 * Never aggressively autocompletes while typing to prevent typing disruptions (e.g. Jetpur -> Jaipur).
 * Confirms exact Indian district, state, country, and coordinates cleanly.
 */
export default function LocationInput({
  value = '',
  onChange,
  verifiedLocation = null,
  placeholder = 'Enter city or destination',
  icon: Icon = MapPin,
  iconColor = 'text-blue-500',
  required = false,
  isDestination = false,
  onSelectAnywhereInIndia = null,
  isDark = true,
  className = ''
}) {
  const [inputValue, setInputValue] = useState(value);
  const [candidates, setCandidates] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [confirmedLocation, setConfirmedLocation] = useState(verifiedLocation);
  const debounceRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    setConfirmedLocation(verifiedLocation);
  }, [verifiedLocation]);

  async function performVerification(queryText) {
    if (!queryText || queryText.trim().length < 2) return;
    if (queryText.trim().toLowerCase().includes('anywhere in india')) return;

    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/locations/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText.trim() })
      });
      const data = await res.json();
      if (data.success && data.candidates?.length > 0) {
        setCandidates(data.candidates);
        setShowPrompt(true);
      } else {
        setCandidates([]);
        setShowPrompt(false);
      }
    } catch (err) {
      console.warn('[Location verification error]:', err);
    } finally {
      setIsVerifying(false);
    }
  }

  function handleInputChange(e) {
    const val = e.target.value;
    setInputValue(val);
    setConfirmedLocation(null);
    setShowPrompt(false);
    onChange(val, null);

    // Debounced automatic verification after user finishes typing
    clearTimeout(debounceRef.current);
    if (val.trim().length >= 3 && !val.toLowerCase().includes('anywhere in india')) {
      debounceRef.current = setTimeout(() => {
        performVerification(val);
      }, 700);
    }
  }

  function handleUseLocation(candidate) {
    setConfirmedLocation(candidate);
    setShowPrompt(false);
    setCandidates([]);
    onChange(candidate.name, candidate);
  }

  function handleDismiss() {
    setShowPrompt(false);
  }

  function handleAnywhereClick() {
    setInputValue('Anywhere in India');
    setConfirmedLocation({
      name: 'Anywhere in India',
      city: 'India',
      district: '',
      state: 'India',
      country: 'India',
      formattedAddress: 'Anywhere in India'
    });
    setShowPrompt(false);
    onChange('Anywhere in India', null);
    if (onSelectAnywhereInIndia) {
      onSelectAnywhereInIndia();
    }
  }

  return (
    <div className={`relative space-y-2 ${className}`}>
      {/* Input container */}
      <div className="relative flex items-center">
        <Icon className={`absolute left-3.5 w-4 h-4 ${iconColor} z-10 pointer-events-none`} />

        <input
          type="text"
          required={required}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => {
            if (inputValue.trim().length >= 3 && !confirmedLocation && candidates.length === 0) {
              performVerification(inputValue);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-10 pr-24 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
            isDark
              ? 'bg-[#111726] border border-slate-700/80 text-white placeholder-slate-500 focus:border-blue-500'
              : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 shadow-sm'
          }`}
        />

        {/* Right side indicators & verify button */}
        <div className="absolute right-2.5 flex items-center gap-1.5 z-10">
          {isVerifying ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : confirmedLocation ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" title={confirmedLocation.formattedAddress}>
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Verified</span>
            </span>
          ) : inputValue && inputValue.length >= 2 ? (
            <button
              type="button"
              onClick={() => performVerification(inputValue)}
              className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
            >
              Verify
            </button>
          ) : null}

          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                setConfirmedLocation(null);
                setShowPrompt(false);
                onChange('', null);
              }}
              className="text-slate-400 hover:text-slate-200 p-0.5"
              aria-label="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* "Anywhere in India" Discover Shortcut (Requirement 6) */}
      {isDestination && !confirmedLocation && (
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[11px] text-slate-400">Not sure where to go?</span>
          <button
            type="button"
            onClick={handleAnywhereClick}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Anywhere in India</span>
          </button>
        </div>
      )}

      {/* Verified Location Confirmation: "Did you mean?" (Requirement 4) */}
      {showPrompt && candidates.length > 0 && (
        <div className={`p-3.5 rounded-2xl border shadow-xl space-y-2.5 animate-fadeIn z-30 ${
          isDark
            ? 'bg-[#0E1526] border-blue-500/40 text-slate-200 shadow-2xl'
            : 'bg-white border-blue-200 text-slate-800 shadow-lg'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Did you mean?</span>
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-200 text-[11px]"
            >
              Change
            </button>
          </div>

          {candidates.slice(0, 3).map((cand, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700/60 hover:border-blue-500/60'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="min-w-0">
                <strong className={`block font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {cand.formattedAddress}
                </strong>
                <span className="text-[11px] text-slate-400 block truncate">
                  {[cand.city, cand.district, cand.state, cand.country].filter(Boolean).join(', ')}
                  {cand.latitude != null && ` • (${cand.latitude.toFixed(2)}, ${cand.longitude.toFixed(2)})`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleUseLocation(cand)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-all hover:scale-105"
              >
                Use this location
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
