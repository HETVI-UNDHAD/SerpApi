import React from 'react';

export default function TravelBackdrop({ isDark }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500" aria-hidden="true">
      {isDark ? (
        <div className="absolute inset-0 bg-[#070B14]">
          {/* Subtle atmospheric ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-blue-900/15 via-indigo-900/8 to-transparent blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-indigo-950/20 blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-[420px] h-[420px] bg-sky-950/20 blur-3xl" />
          {/* Precision subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#FAF8F5]">
          {/* Warm ivory atmosphere */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-amber-100/40 via-blue-50/30 to-transparent blur-3xl" />
          <div className="absolute top-1/4 -right-32 w-80 h-80 bg-orange-100/30 blur-3xl" />
          {/* Subtle micro grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
      )}
    </div>
  );
}
