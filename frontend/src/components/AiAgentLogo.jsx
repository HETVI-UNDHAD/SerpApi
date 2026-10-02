import React, { useState } from 'react';

/**
 * TravelOSAI Official Brand Mark
 * Displays the custom TravelOSAI logo asset with crisp aspect ratio and elegant fallbacks.
 */
export default function AiAgentLogo({
  size = 'md', // 'sm' | 'md' | 'lg'
  onClick = null,
  isDark = true,
  collapsed = false,
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

  // Height configurations
  const heightClasses = {
    sm: 'h-7 max-w-[140px]',
    md: 'h-8 sm:h-9 max-w-[170px]',
    lg: 'h-10 sm:h-12 max-w-[210px]'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {!imgError ? (
        <div className="relative flex items-center">
          <img
            src="/assets/travelosai-logo.png"
            alt="TravelOSAI — Your AI Travel Agent"
            onError={() => {
              // Try fallback paths before error state
              const target = event?.target;
              if (target && target.src && !target.src.includes('logo.png')) {
                target.src = '/logo.png';
              } else {
                setImgError(true);
              }
            }}
            className={`${heightClasses[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
            style={{ filter: isDark ? 'none' : 'contrast(1.05)' }}
          />
        </div>
      ) : (
        /* Graceful Fallback if image asset is unavailable */
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white font-black text-xs flex items-center justify-center shadow-md">
            TO
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <span className={`font-black tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Travel<span className="text-blue-600 dark:text-blue-400">OS</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                AI
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
