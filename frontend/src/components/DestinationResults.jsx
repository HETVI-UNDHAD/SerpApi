import { useState } from 'react'
import DestinationCard from './DestinationCard'
import TripDetailModal from './TripDetailModal'

function SkeletonCard({ tall }) {
  return (
    <div className={`rounded-2xl bg-slate-200 animate-pulse ${tall ? 'h-72 sm:h-80' : 'h-56 sm:h-64'}`} />
  )
}

export default function DestinationResults({ status, destinations, queryUsed, preferences, onChangePreferences }) {
  const [selectedDestination, setSelectedDestination] = useState(null)

  return (
    <section id="discover" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1.5 rounded-full border border-teal-200 mb-4">
              DESTINATION DISCOVERY
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-navy-900 leading-tight">
              {status === 'loading' && 'Finding destinations\nfor you...'}
              {status === 'success' && 'Places worth\ngoing to'}
              {status === 'empty'   && 'No destinations\nfound'}
              {status === 'error'   && 'Something\nwent wrong'}
            </h2>

            {preferences && status !== 'loading' && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                  {preferences.origin}
                </span>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                  📅 {preferences.days} day{preferences.days > 1 ? 's' : ''}
                </span>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                  ₹{Number(preferences.budget).toLocaleString('en-IN')}
                </span>
                {preferences.interests.map(i => (
                  <span key={i} className="text-xs font-semibold bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full border border-cyan-200">
                    {i}
                  </span>
                ))}
              </div>
            )}

            {queryUsed && status === 'success' && (
              <p className="text-xs text-slate-400 mt-3 font-mono">
                Search: "{queryUsed}" &bull; <span className="text-cyan-600 font-semibold">Click any destination to see AI itinerary & live stays</span>
              </p>
            )}
          </div>

          <button onClick={onChangePreferences}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold
              text-navy-900 border-2 border-navy-200 hover:border-navy-900 hover:bg-navy-900 hover:text-white
              transition-all duration-200">
            ✏️ Change Preferences
          </button>
        </div>

        {/* Loading skeleton */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2"><SkeletonCard tall /></div>
            <div className="flex flex-col gap-4">
              <SkeletonCard /><SkeletonCard />
            </div>
          </div>
        )}

        {/* Results — editorial layout */}
        {status === 'success' && destinations.length > 0 && (
          <>
            {/* Featured + side grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2">
                <DestinationCard
                  destination={destinations[0]}
                  index={0}
                  featured
                  onSelect={setSelectedDestination}
                />
              </div>
              <div className="flex flex-col gap-4">
                {destinations[1] && (
                  <DestinationCard
                    destination={destinations[1]}
                    index={1}
                    onSelect={setSelectedDestination}
                  />
                )}
                {destinations[2] && (
                  <DestinationCard
                    destination={destinations[2]}
                    index={2}
                    onSelect={setSelectedDestination}
                  />
                )}
              </div>
            </div>
            {/* Remaining grid */}
            {destinations.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.slice(3).map((dest, i) => (
                  <DestinationCard
                    key={i}
                    destination={dest}
                    index={i + 3}
                    onSelect={setSelectedDestination}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {status === 'empty' && (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-xl font-bold text-slate-700 mb-2">
              We couldn't find suitable destinations.
            </p>
            <p className="text-slate-400">Try changing your interests or starting location.</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">⚠️</div>
            <p className="text-xl font-bold text-slate-700 mb-2">
              Unable to load destinations.
            </p>
            <p className="text-slate-400">Please check your connection and try again.</p>
          </div>
        )}

      </div>

      {/* Trip Details Modal */}
      {selectedDestination && (
        <TripDetailModal
          destination={selectedDestination}
          preferences={preferences}
          onClose={() => setSelectedDestination(null)}
        />
      )}
    </section>
  )
}

