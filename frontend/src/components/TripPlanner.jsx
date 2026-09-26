import { useState } from 'react'
import { submitTripPreferences, fetchDestinations } from '../services/api'
import DestinationResults from './DestinationResults'
import { Leaf, Mountain, Utensils, Landmark, ShoppingBag, Camera, HeartHandshake } from 'lucide-react'

const INTERESTS = [
  { id: 'Nature',      icon: Leaf },
  { id: 'Adventure',   icon: Mountain },
  { id: 'Food',        icon: Utensils },
  { id: 'Culture',     icon: Landmark },
  { id: 'Shopping',    icon: ShoppingBag },
  { id: 'Photography', icon: Camera },
  { id: 'Relaxation',  icon: HeartHandshake },
]

const INITIAL = {
  origin: '',
  budget: '',
  days: '',
  travelers: '',
  travel_date: '',
  interests: [],
}

function inputCls(err) {
  return `w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400
    border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400
    ${err ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'}`
}

export default function TripPlanner() {
  const [form, setForm]         = useState(INITIAL)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState('')

  const [confirmedPrefs, setConfirmedPrefs] = useState(null)
  const [destStatus, setDestStatus]         = useState(null)
  const [destinations, setDestinations]     = useState([])
  const [queryUsed, setQueryUsed]           = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function toggleInterest(id) {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id],
    }))
    setErrors(prev => ({ ...prev, interests: '' }))
  }

  function validate() {
    const e = {}
    if (!form.origin.trim())                 e.origin      = 'Required'
    if (!form.budget || Number(form.budget) < 1) e.budget  = 'Min ₹1'
    if (!form.days   || Number(form.days)   < 1) e.days    = 'Min 1 day'
    if (!form.travelers || Number(form.travelers) < 1) e.travelers = 'Min 1'
    if (!form.travel_date)                   e.travel_date = 'Required'
    if (form.interests.length === 0)         e.interests   = 'Select at least one interest'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    const ve = validate()
    if (Object.keys(ve).length > 0) { setErrors(ve); return }

    const payload = {
      origin:      form.origin.trim(),
      budget:      Number(form.budget),
      days:        Number(form.days),
      travelers:   Number(form.travelers),
      travel_date: form.travel_date,
      interests:   form.interests,
    }

    setLoading(true)
    try {
      await submitTripPreferences(payload)
      setConfirmedPrefs(payload)
      setDestStatus('loading')
      const destData = await fetchDestinations(payload)
      if (!destData.destinations?.length) {
        setDestStatus('empty')
      } else {
        setDestinations(destData.destinations)
        setQueryUsed(destData.query_used || '')
        setDestStatus('success')
      }
    } catch (err) {
      if (confirmedPrefs) setDestStatus('error')
      else setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChangePreferences() {
    setConfirmedPrefs(null)
    setDestStatus(null)
    setDestinations([])
    setQueryUsed('')
    setApiError('')
  }

  if (confirmedPrefs && destStatus) {
    return (
      <DestinationResults
        status={destStatus}
        destinations={destinations}
        queryUsed={queryUsed}
        preferences={confirmedPrefs}
        onChangePreferences={handleChangePreferences}
      />
    )
  }

  return (
    <section id="plan" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-200 mb-4">
            TRIP PLANNER
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-navy-900 mb-4">
            Where are you going next?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Tell us a little about your journey and we'll help you discover the right trip.
          </p>
        </div>

        {/* Planner card */}
        <div className="bg-white rounded-3xl shadow-card-hover border border-slate-100 overflow-hidden">

          {/* Card header bar */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center">
                <span className="text-cyan-400 text-sm">🗺️</span>
              </div>
              <span className="text-white font-bold">Plan Your Journey</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow" />
              <span className="text-cyan-400 text-xs font-semibold">Powered by live travel data</span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} noValidate className="space-y-8">

              {apiError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4">
                  <span className="text-lg mt-0.5">⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* Row 1: Origin full width */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  FROM
                </label>
                <input type="text" name="origin" value={form.origin}
                  onChange={handleChange} placeholder="Ahmedabad"
                  className={inputCls(errors.origin)} />
                {errors.origin && <p className="text-red-500 text-xs mt-1.5">{errors.origin}</p>}
              </div>

              {/* Row 2: Budget + Days + Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    BUDGET
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input type="number" name="budget" value={form.budget}
                      onChange={handleChange} placeholder="15,000" min="1"
                      className={`${inputCls(errors.budget)} pl-8`} />
                  </div>
                  {errors.budget && <p className="text-red-500 text-xs mt-1.5">{errors.budget}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    DAYS
                  </label>
                  <input type="number" name="days" value={form.days}
                    onChange={handleChange} placeholder="3" min="1"
                    className={inputCls(errors.days)} />
                  {errors.days && <p className="text-red-500 text-xs mt-1.5">{errors.days}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    TRAVELERS
                  </label>
                  <input type="number" name="travelers" value={form.travelers}
                    onChange={handleChange} placeholder="2" min="1"
                    className={inputCls(errors.travelers)} />
                  {errors.travelers && <p className="text-red-500 text-xs mt-1.5">{errors.travelers}</p>}
                </div>
              </div>

              {/* Row 3: Date */}
              <div className="max-w-xs">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  TRAVEL DATE
                </label>
                <input type="date" name="travel_date" value={form.travel_date}
                  onChange={handleChange}
                  className={inputCls(errors.travel_date)} />
                {errors.travel_date && <p className="text-red-500 text-xs mt-1.5">{errors.travel_date}</p>}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  INTERESTS
                  <span className="normal-case font-normal text-slate-400 ml-2">(select at least one)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ id, icon: Icon }) => {
                    const active = form.interests.includes(id)
                    return (
                      <button key={id} type="button" onClick={() => toggleInterest(id)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                          border transition-all duration-200
                          ${active
                            ? 'bg-navy-900 text-cyan-400 border-navy-700 shadow-sm scale-105'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-navy-300 hover:text-navy-800'
                          }`}>
                        <Icon className="w-4 h-4" /> {id}
                      </button>
                    )
                  })}
                </div>
                {errors.interests && <p className="text-red-500 text-xs mt-2">{errors.interests}</p>}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-base tracking-wide
                    bg-gradient-to-r from-navy-900 to-navy-800 text-white
                    hover:from-navy-800 hover:to-navy-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:shadow-glow-navy active:scale-[0.99] transition-all duration-200
                    flex items-center justify-center gap-3">
                  {loading
                    ? <><span className="animate-spin text-xl">⏳</span> Discovering destinations...</>
                    : <>Discover My Journey <span className="text-cyan-400">→</span></>
                  }
                </button>
                <p className="text-center text-slate-400 text-xs mt-3">
                  Powered by live travel data via SerpApi
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
