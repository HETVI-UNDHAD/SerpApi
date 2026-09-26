export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">✦</span>
          <span className="text-xl font-bold text-brand-700">TripWise AI</span>
        </div>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-brand-600 transition-colors">Home</a>
          <a href="#plan" className="hover:text-brand-600 transition-colors">Plan a Trip</a>
          <a href="#" className="hover:text-brand-600 transition-colors">Saved Trips</a>
        </nav>

        {/* Mobile nav indicator */}
        <div className="sm:hidden text-slate-500 text-sm font-medium">Menu</div>
      </div>
    </header>
  )
}
