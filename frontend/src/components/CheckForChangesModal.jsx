import React from 'react';
import { useTrip } from '../context/TripContext';
import {
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Building,
  Plane,
  ArrowRight
} from 'lucide-react';

export default function CheckForChangesModal() {
  const {
    liveChangesModalOpen,
    setLiveChangesModalOpen,
    liveChangesReport,
    runWhatIf,
    optimizeTripBudget,
    theme
  } = useTrip();

  const isDark = theme === 'dark';

  if (!liveChangesModalOpen || !liveChangesReport) return null;

  const isPriceChanged = liveChangesReport.status === 'price_changed';
  const hotelUpdate = liveChangesReport.hotelUpdate || {};
  const flightUpdate = liveChangesReport.flightUpdate || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative transition-colors duration-300 ${
        isDark ? 'bg-[#0f1422] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={() => setLiveChangesModalOpen(false)}
          className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-wider mb-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Live SerpApi Status Monitor</span>
        </div>

        <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Trip Price & Schedule Verification
        </h3>

        <p className={`text-xs mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {liveChangesReport.summary}
        </p>

        {/* Change Comparison Card */}
        {isPriceChanged && (
          <div className={`p-4 rounded-2xl border space-y-3 mb-6 ${
            isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-slate-300 font-bold' : 'text-slate-700 font-bold'}>{hotelUpdate.hotelName}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
                Rate Changed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/20">
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] opacity-60 block">Previous</span>
                <span className="text-xs font-bold">
                  ₹{hotelUpdate.previousRate?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border border-amber-500/40 ${isDark ? 'bg-slate-900/60' : 'bg-white'}`}>
                <span className="text-[10px] text-amber-500 font-bold block">Current Live</span>
                <span className="text-xs font-black text-amber-500">
                  ₹{hotelUpdate.currentRate?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] text-emerald-500 font-bold block">Alternative</span>
                <span className="text-xs font-black text-emerald-500">
                  ₹{(hotelUpdate.alternativeOption?.pricePerNight || hotelUpdate.previousRate)?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => setLiveChangesModalOpen(false)}
            className={`w-full py-3 rounded-xl text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            Keep Current
          </button>

          {isPriceChanged && hotelUpdate.alternativeOption && (
            <button
              onClick={() => {
                setLiveChangesModalOpen(false);
                runWhatIf(`Switch hotel to ${hotelUpdate.alternativeOption.name}`);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              Use Alternative
            </button>
          )}

          <button
            onClick={() => {
              setLiveChangesModalOpen(false);
              optimizeTripBudget();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black shadow-md transition-all"
          >
            Replan Trip
          </button>
        </div>
      </div>
    </div>
  );
}
