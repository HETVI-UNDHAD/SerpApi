import React from 'react';

export default function TravelBackdrop({ isDark }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {isDark ? (
        <div className="absolute inset-0 bg-[#090D16]">
          {/* Subtle atmospheric ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-indigo-600/12 via-cyan-500/6 to-transparent blur-3xl" />
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-purple-600/8 blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-cyan-600/8 blur-3xl" />
          {/* Precision subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#F8FAFC]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-cyan-100/60 via-indigo-50/40 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>
      )}
    </div>
  );
}

