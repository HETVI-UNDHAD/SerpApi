import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

/**
 * TravelOS AI Agent Logo
 * A refined modern brand mark featuring a compass + subtle intelligence sparkle mark.
 * Designed to feel like a premium travel assistant first.
 */
export default function AiAgentLogo({
  size = 'md', // 'sm' | 'md' | 'lg'
  showBadge = true,
  onClick = null,
  isDark = true,
  className = ''
}) {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 group select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Icon Mark: Deep Indigo gradient with compass + intelligence node */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-all duration-300 flex-shrink-0`}>
        <Compass className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
        {/* Subtle AI sparkle node badge */}
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white dark:border-slate-900 flex items-center justify-center">
          <Sparkles className="w-1.5 h-1.5 text-slate-950" />
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight font-serif ${textSizes[size]} ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Travel<span className="text-blue-600">OS</span>
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
            AI
          </span>
        </div>
        {showBadge && (
          <span className="text-[9px] uppercase tracking-[0.16em] font-medium text-slate-400 -mt-0.5">
            Travel Assistant
          </span>
        )}
      </div>
    </div>
  );
}
