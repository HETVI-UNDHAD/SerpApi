import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';

const TripContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const INITIAL_RESEARCH_STAGES = [
  { id: 1, key: 'TRANSPORT', title: 'Flights & Inter-city Transit', status: 'pending', duration_ms: null, result_count: 0, detail: 'Google Flights engine via SerpApi' },
  { id: 2, key: 'HOTEL', title: 'Hotels & Basecamps', status: 'pending', duration_ms: null, result_count: 0, detail: 'Google Hotels engine via SerpApi' },
  { id: 3, key: 'PLACES', title: 'Places & Attractions', status: 'pending', duration_ms: null, result_count: 0, detail: 'Google Maps Places engine via SerpApi' },
  { id: 4, key: 'REVIEWS', title: 'Traveler Reviews & Sentiment', status: 'pending', duration_ms: null, result_count: 0, detail: 'Real review snippet sentiment analysis' },
  { id: 5, key: 'EVENTS', title: 'Live Events & Pop-ups', status: 'pending', duration_ms: null, result_count: 0, detail: 'Google Search local events via SerpApi' },
  { id: 6, key: 'ROUTING', title: 'Live Road Routing & Buffers', status: 'pending', duration_ms: null, result_count: 0, detail: 'Google Maps Directions with concurrency & caching' },
  { id: 7, key: 'BUDGET', title: 'Hard Constraints & Budget', status: 'pending', duration_ms: null, result_count: 0, detail: 'Deterministic Constraint Engine' },
  { id: 8, key: 'VALIDATION', title: 'Master Itinerary & Validation', status: 'pending', duration_ms: null, result_count: 0, detail: 'Explainable Journey Engine' }
];

export function TripProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('travelos_theme');
    return saved === 'dark' ? 'light' : (saved || 'light');
  });

  React.useEffect(() => {
    localStorage.setItem('travelos_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

  const [activeScreen, setActiveScreen] = useState('landing'); // 'landing' | 'builder' | 'research' | 'dashboard' | 'design-showcase'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'itinerary' | 'map' | 'flights' | 'hotels' | 'budget' | 'intelligence' | 'assistant'
  const [selectedDay, setSelectedDay] = useState(1);

  const [formData, setFormData] = useState({
    origin: 'Ahmedabad',
    destination: 'Goa',
    originCoords: null,
    destinationCoords: null,
    duration: 3,
    dates: {
      outbound: '',
      return: ''
    },
    travelers: 2,
    budget: 20000,
    interests: ['Beaches', 'Food', 'Nightlife'],
    travelStyle: 'Balanced',
    transportPreference: 'Flight',
    accommodationPreference: 'Hotel'
  });

  const [currentTrip, setCurrentTrip] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);
  const [budgetOptimizationError, setBudgetOptimizationError] = useState('');
  const [destinationsDiscovery, setDestinationsDiscovery] = useState([]);

  // Live Research Center stages (Real Server-Sent Events)
  const [researchSteps, setResearchSteps] = useState(INITIAL_RESEARCH_STAGES);

  // Live changes monitor state
  const [liveChangesModalOpen, setLiveChangesModalOpen] = useState(false);
  const [liveChangesReport, setLiveChangesReport] = useState(null);
  const [isCheckingChanges, setIsCheckingChanges] = useState(false);

  // Replanning conversation logs
  const [chatMessages, setChatMessages] = useState([]);

  /**
   * Run Destination Discovery: "Help Me Choose a Destination"
   */
  async function runDestinationDiscovery(criteria) {
    setIsDiscovering(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/destinations/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: criteria?.origin || formData.origin,
          budget: criteria?.budget || formData.budget,
          duration: criteria?.duration || formData.duration,
          interests: criteria?.interests || formData.interests
        })
      });
      const data = await res.json();
      if (data.success && data.destinations) {
        setDestinationsDiscovery(data.destinations);
        return data.destinations;
      }
    } catch (err) {
      console.error('[Error in destination discovery]:', err);
    } finally {
      setIsDiscovering(false);
    }
  }

  /**
   * Main Trip Generation Workflow streaming real Server-Sent Events (SSE)
   */
  async function generateTrip(customData) {
    const payload = customData || formData;
    setCurrentTrip(null);
    setIsGenerating(true);
    setActiveScreen('research');

    // Reset research steps with clean pending state
    setResearchSteps(INITIAL_RESEARCH_STAGES.map(s => ({ ...s })));

    let finalTrip = null;

    try {
      // 1. Stream real stage events via SSE endpoint
      const streamRes = await fetch(`${API_BASE_URL}/api/trips/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!streamRes.ok || !streamRes.body) {
        throw new Error(`SSE stream failed (HTTP ${streamRes.status})`);
      }

      const reader = streamRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          if (!part.trim()) continue;
          let eventType = 'message';
          let dataStr = '';

          for (const line of part.split('\n')) {
            if (line.startsWith('event: ')) eventType = line.slice(7).trim();
            else if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
          }

          if (dataStr) {
            try {
              const data = JSON.parse(dataStr);
              if (eventType === 'stage') {
                setResearchSteps(prev => prev.map(step => {
                  if (step.key === data.stage) {
                    return {
                      ...step,
                      status: data.status,
                      duration_ms: data.duration_ms,
                      result_count: data.result_count,
                      detail: data.detail || step.detail
                    };
                  }
                  return step;
                }));
              } else if (eventType === 'complete' && data.trip) {
                finalTrip = data.trip;
              } else if (eventType === 'error') {
                throw new Error(data.error || 'Server error occurred during trip generation');
              }
            } catch (err) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }

      // Fallback: If stream closed without complete event, query standard POST /api/trips
      if (!finalTrip) {
        const fallbackRes = await fetch(`${API_BASE_URL}/api/trips`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success && fallbackData.trip) {
          finalTrip = fallbackData.trip;
        } else {
          throw new Error(fallbackData.error || 'Failed to generate trip');
        }
      }

      setCurrentTrip(finalTrip);
      setSelectedDay(1);
      setActiveTab('overview');

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}

      setTimeout(() => {
        setActiveScreen('dashboard');
        setIsGenerating(false);
      }, 900);

      setChatMessages([
        {
          role: 'agent',
          text: `Hello! I have generated your customized ${finalTrip.duration}-day ${finalTrip.transportation?.mode || 'flight'} trip to ${finalTrip.destination}. Transportation, hotels, places, and routes have been grounded via live SerpApi queries. How would you like to refine or replan your journey?`
        }
      ]);

      return finalTrip;
    } catch (err) {
      console.error('[Error generating trip]:', err);
      alert(`Trip Generation Error: ${err.message}. Please verify the backend is running.`);
      setActiveScreen('builder');
      setIsGenerating(false);
    }
  }

  /**
   * Optimize for Budget
   */
  async function optimizeTripBudget() {
    if (!currentTrip?.id) {
      setBudgetOptimizationError('The current trip is not available to optimize.');
      return;
    }
    setBudgetOptimizationError('');
    setIsReplanning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${currentTrip.id}/optimize`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.trip) throw new Error(data.error || 'Unable to optimize this trip.');
      setCurrentTrip(data.trip);
      setChatMessages(prev => [
        ...prev,
        { role: 'user', text: 'Optimize for Budget' },
        { role: 'agent', text: data.trip.replanningReason || 'No lower-cost alternatives are currently available.' }
      ]);
    } catch (err) {
      console.error('[Error optimizing budget]:', err);
      setBudgetOptimizationError(err.message || 'Unable to optimize this trip.');
    } finally {
      setIsReplanning(false);
    }
  }

  /**
   * What-If Simulator & Dynamic Replanner
   */
  async function runWhatIf(simulationTypeOrPrompt) {
    if (!currentTrip?.id) return;
    setIsReplanning(true);

    const userText = simulationTypeOrPrompt;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${currentTrip.id}/what-if`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, simulationType: userText })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setCurrentTrip(data.trip);
        setChatMessages(prev => [
          ...prev,
          { role: 'agent', text: data.trip.replanningReason || 'I have updated your itinerary and route according to your requirement.' }
        ]);
      }
    } catch (err) {
      console.error('[Error in what-if simulation]:', err);
      setChatMessages(prev => [
        ...prev,
        { role: 'agent', text: `Sorry, could not apply simulation: ${err.message}` }
      ]);
    } finally {
      setIsReplanning(false);
    }
  }

  /**
   * Check for Live Changes (SerpApi Price/Schedule Monitor)
   */
  async function checkForChanges() {
    if (!currentTrip?.id) return;
    setIsCheckingChanges(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${currentTrip.id}/check-changes`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.report) {
        setLiveChangesReport(data.report);
        setLiveChangesModalOpen(true);
      }
    } catch (err) {
      console.error('[Error checking live changes]:', err);
    } finally {
      setIsCheckingChanges(false);
    }
  }

  function resetTrip() {
    setCurrentTrip(null);
    setActiveScreen('builder');
  }

  return (
    <TripContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        activeScreen,
        setActiveScreen,
        activeTab,
        setActiveTab,
        selectedDay,
        setSelectedDay,
        formData,
        setFormData,
        currentTrip,
        isGenerating,
        isDiscovering,
        isReplanning,
        budgetOptimizationError,
        destinationsDiscovery,
        researchSteps,
        liveChangesModalOpen,
        setLiveChangesModalOpen,
        liveChangesReport,
        isCheckingChanges,
        chatMessages,
        generateTrip,
        runDestinationDiscovery,
        optimizeTripBudget,
        runWhatIf,
        checkForChanges,
        resetTrip
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within a TripProvider');
  return ctx;
}
