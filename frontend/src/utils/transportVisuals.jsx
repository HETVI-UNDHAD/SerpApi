import React from 'react';
import {
  Plane,
  Train,
  Car,
  Bus,
  Footprints,
  Compass,
  Home,
  Building
} from 'lucide-react';

/**
 * Returns human-readable label, emoji, and Lucide Icon for any transportation mode
 */
export function getTransportVisual(mode = 'flight') {
  const m = String(mode || '').toLowerCase().replace(/[^a-z]/g, '');

  if (m.includes('train') || m.includes('rail')) {
    return {
      mode: 'train',
      label: 'Train / Express Rail',
      shortLabel: 'Train',
      emoji: '🚆',
      icon: Train,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    };
  }

  if (m.includes('car') || m.includes('drive') || m.includes('road') || m.includes('cab') || m.includes('taxi')) {
    return {
      mode: 'car',
      label: 'Self-Drive / Car / Taxi',
      shortLabel: 'Car / Road',
      emoji: '🚗',
      icon: Car,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    };
  }

  if (m.includes('bus')) {
    return {
      mode: 'bus',
      label: 'Express Bus',
      shortLabel: 'Bus',
      emoji: '🚌',
      icon: Bus,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    };
  }

  if (m.includes('walk') || m.includes('foot')) {
    return {
      mode: 'walking',
      label: 'Walking',
      shortLabel: 'Walking',
      emoji: '🚶',
      icon: Footprints,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30'
    };
  }

  // Default is flight
  return {
    mode: 'flight',
    label: 'Flight',
    shortLabel: 'Flight',
    emoji: '✈️',
    icon: Plane,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  };
}

/**
 * Returns a small inline component with correct icon and label
 */
export function TransportBadge({ mode, className = '', showLabel = true }) {
  const visual = getTransportVisual(mode);
  const Icon = visual.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${visual.bgColor} ${visual.color} border ${visual.borderColor} ${className}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {showLabel && <span>{visual.shortLabel}</span>}
    </span>
  );
}
