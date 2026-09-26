import { useState, useEffect } from 'react'
import { generateItinerary, fetchHotels, fetchFlights, fetchAttractions } from '../services/api'
import PlaceImage from './PlaceImage'

export default function TripDetailModal({ destination, preferences, onClose }) {
  const [activeTab, setActiveTab] = useState('itinerary')
  
  // Tab states
  const [itinerary, setItinerary] = useState(null)
  const [loadingItinerary, setLoadingItinerary] = useState(true)
  const [itineraryError, setItineraryError] = useState('')

  const [hotels, setHotels] = useState([])
  const [loadingHotels, setLoadingHotels] = useState(false)
  const [hotelsLoaded, setHotelsLoaded] = useState(false)

  const [flights, setFlights] = useState([])
  const [loadingFlights, setLoadingFlights] = useState(false)
  const [flightsLoaded, setFlightsLoaded] = useState(false)

  const [attractions, setAttractions] = useState([])
  const [loadingAttractions, setLoadingAttractions] = useState(false)
  const [attractionsLoaded, setAttractionsLoaded] = useState(false)

  const destName = destination.name.split(' - ')[0].split(' | ')[0].trim()

  // Auto-fetch Itinerary on mount
  useEffect(() => {
    async function loadItinerary() {
      setLoadingItinerary(true)
      setItineraryError('')
      try {
        const data = await generateItinerary({
          destination: destName,
          days: preferences?.days || 3,
          budget: preferences?.budget || 15000,
          travelers: preferences?.travelers || 2,
          travel_date: preferences?.travel_date || '',
          interests: preferences?.interests || [],
        })
        setItinerary(data)
      } catch (err) {
        setItineraryError(err.message || 'Failed to generate itinerary')
      } finally {
        setLoadingItinerary(false)
      }
    }
    loadItinerary()
  }, [destName, preferences])

  // Lazy load other tabs on switch
  useEffect(() => {
    if (activeTab === 'hotels' && !hotelsLoaded) {
      setLoadingHotels(true)
      fetchHotels({
        destination: destName,
        check_in_date: preferences?.travel_date || undefined,
        adults: preferences?.travelers || 2,
      })
        .then(res => {
          setHotels(res.hotels || [])
          setHotelsLoaded(true)
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingHotels(false))
    } else if (activeTab === 'flights' && !flightsLoaded) {
      setLoadingFlights(true)
      fetchFlights({
        origin: preferences?.origin || 'Delhi',
        destination: destName,
        outbound_date: preferences?.travel_date || undefined,
        adults: preferences?.travelers || 1,
      })
        .then(res => {
          setFlights(res.flights || [])
          setFlightsLoaded(true)
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingFlights(false))
    } else if (activeTab === 'attractions' && !attractionsLoaded) {
      setLoadingAttractions(true)
      fetchAttractions({
        destination: destName,
        interests: preferences?.interests || [],
      })
        .then(res => {
          setAttractions(res.attractions || [])
          setAttractionsLoaded(true)
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingAttractions(false))
    }
  }, [activeTab, destName, preferences, hotelsLoaded, flightsLoaded, attractionsLoaded])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-900 px-6 sm:px-8 py-6 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
            ✕
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-400/30">
              Trip Plan & Live Insights
            </span>
            <span className="text-xs text-white/60">Powered by SerpApi</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">{destName}</h2>

          {/* Quick info badges */}
          {preferences && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
                🛫 From: {preferences.origin}
              </span>
              <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
                ⏱️ {preferences.days} Days
              </span>
              <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
                👥 {preferences.travelers} Travelers
              </span>
              <span className="text-xs bg-cyan-400/20 text-cyan-300 font-bold px-3 py-1 rounded-lg">
                💰 Budget: ₹{Number(preferences.budget).toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Tabs header */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-b border-white/10">
            {[
              { id: 'itinerary', label: '🗓️ AI Itinerary' },
              { id: 'hotels', label: '🏨 Hotels & Stays' },
              { id: 'flights', label: 'Flights & Transit' },
              { id: 'attractions', label: 'Top Attractions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-cyan-400 text-navy-900 shadow-md scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50 space-y-6">
          
          {/* TAB 1: ITINERARY */}
          {activeTab === 'itinerary' && (
            <div>
              {loadingItinerary ? (
                <div className="py-16 text-center space-y-4">
                  <div className="animate-spin text-4xl inline-block">✨</div>
                  <p className="text-lg font-bold text-navy-900">Crafting your personalized day-by-day plan with live data...</p>
                  <p className="text-sm text-slate-500">Querying SerpApi for top sights, local foods, and stay recommendations.</p>
                </div>
              ) : itineraryError ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
                  ⚠️ {itineraryError}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Trip Summary & Recommended Stay Banner */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Trip Overview</h4>
                      <p className="text-slate-700 text-sm leading-relaxed font-medium">{itinerary.summary}</p>
                      
                      {/* Budget Breakdown Pill */}
                      {itinerary.budget_breakdown && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <h5 className="text-xs font-bold text-navy-900 mb-2">Estimated Budget Allocation:</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-slate-500 block">🏨 Stays</span>
                              <span className="font-bold text-slate-800">₹{itinerary.budget_breakdown.accommodation?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-slate-500 block">Food</span>
                              <span className="font-bold text-slate-800">₹{itinerary.budget_breakdown.food_and_dining?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-slate-500 block">🎟️ Activities</span>
                              <span className="font-bold text-slate-800">₹{itinerary.budget_breakdown.activities_and_tickets?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-slate-500 block">🚕 Transit</span>
                              <span className="font-bold text-slate-800">₹{itinerary.budget_breakdown.local_transit?.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {itinerary.recommended_stay && (
                      <div className="bg-gradient-to-br from-teal-900 to-navy-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-300 px-2 py-0.5 rounded">
                            Recommended Base
                          </span>
                          <h4 className="font-bold text-base text-white mt-2">{itinerary.recommended_stay.name}</h4>
                          <p className="text-xs text-white/70 mt-1 line-clamp-2">{itinerary.recommended_stay.description}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                          <span className="text-cyan-300 font-black text-sm">{itinerary.recommended_stay.price}</span>
                          <button
                            onClick={() => setActiveTab('hotels')}
                            className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
                            View All Hotels →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Day by Day Cards */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-navy-900">Day-by-Day Schedule</h3>
                    {itinerary.days?.map(day => (
                      <div key={day.day} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                          <span className="font-black text-navy-900 text-sm sm:text-base">
                            📅 {day.title}
                          </span>
                          {day.meals_highlight && (
                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                              🍽️ {day.meals_highlight}
                            </span>
                          )}
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Morning */}
                          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
                                <span>🌅 Morning</span>
                                <span className="font-mono text-[11px] text-amber-700">{day.morning.time}</span>
                              </div>
                              <h5 className="font-bold text-slate-800 text-sm">{day.morning.title}</h5>
                              <p className="text-xs text-slate-600 mt-1">{day.morning.description}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-amber-100/60 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">{day.morning.category}</span>
                              {day.morning.link && (
                                <a href={day.morning.link} target="_blank" rel="noopener noreferrer" className="text-cyan-700 font-bold hover:underline">
                                  Details →
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Afternoon */}
                          <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold text-orange-800 mb-1">
                                <span>Afternoon</span>
                                <span className="font-mono text-[11px] text-orange-700">{day.afternoon.time}</span>
                              </div>
                              <h5 className="font-bold text-slate-800 text-sm">{day.afternoon.title}</h5>
                              <p className="text-xs text-slate-600 mt-1">{day.afternoon.description}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-orange-100/60 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">{day.afternoon.category}</span>
                              {day.afternoon.link && (
                                <a href={day.afternoon.link} target="_blank" rel="noopener noreferrer" className="text-cyan-700 font-bold hover:underline">
                                  Details →
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Evening */}
                          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold text-indigo-800 mb-1">
                                <span>Evening</span>
                                <span className="font-mono text-[11px] text-indigo-700">{day.evening.time}</span>
                              </div>
                              <h5 className="font-bold text-slate-800 text-sm">{day.evening.title}</h5>
                              <p className="text-xs text-slate-600 mt-1">{day.evening.description}</p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-indigo-100/60 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">{day.evening.category}</span>
                              {day.evening.link && (
                                <a href={day.evening.link} target="_blank" rel="noopener noreferrer" className="text-cyan-700 font-bold hover:underline">
                                  Details →
                                </a>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HOTELS */}
          {activeTab === 'hotels' && (
            <div>
              {loadingHotels ? (
                <div className="py-16 text-center space-y-3">
                  <div className="animate-spin text-3xl">🏨</div>
                  <p className="text-base font-bold text-navy-900">Fetching live hotels via SerpApi Google Hotels...</p>
                </div>
              ) : hotels.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No hotel listings found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotels.map((hotel, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-cyan-400 transition-all">
                      <div className="relative h-36">
                        <PlaceImage
                          query={hotel.image ? null : `${hotel.name} ${destName} hotel`}
                          fallbackSrc={hotel.image || null}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                          skeletonClassName="absolute inset-0"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-base leading-tight">{hotel.name}</h4>
                          {hotel.rating && (
                            <span className="shrink-0 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                              ⭐ {hotel.rating}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{hotel.description}</p>
                        
                        {hotel.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {hotel.amenities.map((a, i) => (
                              <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-black text-navy-900 text-base">{hotel.price}</span>
                        {hotel.link && (
                          <a href={hotel.link} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1">
                            Book / View Rates →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FLIGHTS & TRANSIT */}
          {activeTab === 'flights' && (
            <div>
              {loadingFlights ? (
                <div className="py-16 text-center space-y-3">
                  <div className="animate-spin text-3xl">...</div>
                  <p className="text-base font-bold text-navy-900">Searching routes & fares via SerpApi Google Flights...</p>
                </div>
              ) : flights.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No transit routes found for this query.</div>
              ) : (
                <div className="space-y-3">
                  {flights.map((flight, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xl">
                          →
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">{flight.airline}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>⏱️ Duration: {flight.duration}</span>
                            {flight.departure_time && <span>🛫 {flight.departure_time}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                        <span className="font-black text-navy-900 text-base">{flight.price}</span>
                        {flight.booking_link && (
                          <a href={flight.booking_link} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-bold bg-navy-900 text-white hover:bg-navy-800 px-4 py-2 rounded-xl transition-all">
                            View Deal →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ATTRACTIONS */}
          {activeTab === 'attractions' && (
            <div>
              {loadingAttractions ? (
                <div className="py-16 text-center space-y-3">
                  <div className="animate-spin text-3xl">...</div>
                  <p className="text-base font-bold text-navy-900">Discovering top spots via SerpApi Local Discovery...</p>
                </div>
              ) : attractions.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No attractions found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attractions.map((spot, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{spot.title}</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{spot.description}</p>
                      </div>
                      {spot.link && (
                        <div className="mt-4 pt-2">
                          <a href={spot.link} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1">
                            Explore details →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400">
            Real-time travel data from SerpApi &bull; TripWise AI Hackathon Track 03
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
