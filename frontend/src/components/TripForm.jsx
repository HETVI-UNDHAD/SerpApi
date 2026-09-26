import { useState } from 'react'
import { Leaf, Mountain, Utensils, Landmark, ShoppingBag, Camera, HeartHandshake } from 'lucide-react'

const INTERESTS = [
  { id: 'nature',      label: 'Nature',      icon: Leaf },
  { id: 'adventure',   label: 'Adventure',   icon: Mountain },
  { id: 'food',        label: 'Food',        icon: Utensils },
  { id: 'culture',     label: 'Culture',     icon: Landmark },
  { id: 'shopping',    label: 'Shopping',    icon: ShoppingBag },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'relaxation',  label: 'Relaxation',  icon: HeartHandshake },
]

const INITIAL = {
  origin: '',
  budget: '',
  days: '',
  travelers: '',
  travelDate: '',
  interests: [],
}

export default function TripForm() {
  const [form, setForm] = useState(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function toggleInterest(id) {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('TripWise AI — Trip Request:', form)
    setSubmitted(true)
  }

  function handleReset() {
    setForm(INITIAL)
    setSubmitted(false)
  }

  return (
    <section id="plan" className="py-20 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-2xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">
            Plan Your Trip
          </h2>
          <p className="text-slate-500 text-base">
            Fill in your travel details and let TripWise AI do the rest.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10">

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Trip details captured!</h3>
              <p className="text-slate-500 text-sm mb-1">Check your browser console to see the collected values.</p>
              <p className="text-slate-400 text-xs mb-6">(API integration coming in the next phase)</p>
              <button
                onClick={handleReset}
                className="text-brand-600 font-semibold text-sm hover:underline"
              >
                ← Plan another trip
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Origin */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Starting Location
                </label>
                <input
                  type="text"
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, India"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>

              {/* Budget + Days row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Budget (₹ INR)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    min="0"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    name="days"
                    value={form.days}
                    onChange={handleChange}
                    placeholder="e.g. 7"
                    min="1"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Travelers + Date row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    name="travelers"
                    value={form.travelers}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="1"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Travel Month / Date
                  </label>
                  <input
                    type="month"
                    name="travelDate"
                    value={form.travelDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Interests <span className="text-slate-400 font-normal">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ id, label, icon: Icon }) => {
                    const active = form.interests.includes(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleInterest(id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150
                          ${active
                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-brand-400 hover:text-brand-600'
                          }`}
                      >
                        <Icon className="w-4 h-4" /> {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-base py-4 rounded-2xl shadow-lg transition-all duration-200 mt-2"
              >
                Generate My Itinerary
              </button>

            </form>
          )}
        </div>
      </div>
    </section>
  )
}
