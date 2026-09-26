export default function HeroSection({ onPlanClick }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-blue-500">

      {/* Background decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />

      {/* Floating emoji landmarks */}
      <div className="absolute top-32 left-[8%] text-4xl opacity-20 rotate-[-15deg] select-none">🗼</div>
      <div className="absolute top-48 right-[10%] text-4xl opacity-20 rotate-[10deg] select-none">🏔️</div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
          <span>🌍</span> SerpApi India Hackathon 2026
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
          Plan Smarter.<br />
          <span className="text-blue-200">Travel Better.</span>
        </h1>

        <p className="text-blue-100 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          TripWise AI uses live travel search data to discover destinations,
          compare flights and hotels, and build a personalized itinerary — just for you.
        </p>

        <button
          onClick={onPlanClick}
          className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Plan My Trip
        </button>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { value: 'Live', label: 'Search Data' },
            { value: 'AI', label: 'Itinerary' },
            { value: '100%', label: 'Personalized' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-blue-200 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
