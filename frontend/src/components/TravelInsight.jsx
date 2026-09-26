// TravelInsight — UI placeholder for future AI integration.
// Connect real LLM output here in a later step.

const INSIGHT_ITEMS = [
  { label: 'Travel style',  value: 'Nature + Food',  icon: '•' },
  { label: 'Trip pace',     value: 'Balanced',        icon: '⚖️' },
  { label: 'Best season',   value: 'Oct – Feb',       icon: '🌤️' },
  { label: 'Budget range',  value: '₹15,000',         icon: '💰' },
]

export default function TravelInsight() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-navy-900">
      <div className="max-w-5xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">
                AI Travel Intelligence
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Your trip,<br />
              <span className="text-gradient">understood.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-6">
              TripWise AI will analyze your preferences and generate personalized
              travel insights — from ideal destinations to day-by-day itineraries.
            </p>
            <div className="inline-flex items-center gap-2 text-amber-400/70 text-sm font-medium">
              <span>🔮</span>
              <span>AI itinerary generation coming soon</span>
            </div>
          </div>

          {/* Right — insight card */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-bold text-sm">Trip Intelligence</span>
              <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full font-semibold">
                Preview
              </span>
            </div>

            <div className="space-y-3">
              {INSIGHT_ITEMS.map(({ label, value, icon }) => (
                <div key={label}
                  className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="text-white/50 text-sm">{label}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* Placeholder AI output area */}
            <div className="mt-6 bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400 text-sm">✨</span>
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">
                  AI Recommendation
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-white/10 rounded-full w-full" />
                <div className="h-2.5 bg-white/10 rounded-full w-4/5" />
                <div className="h-2.5 bg-white/10 rounded-full w-3/5" />
              </div>
              <p className="text-white/20 text-xs mt-3 text-center">
                AI insights will appear here
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
