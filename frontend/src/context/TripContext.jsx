import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';

const TripContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function TripProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('travelos_theme') || 'dark';
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
  const [destinationsDiscovery, setDestinationsDiscovery] = useState([]);

  // Live Research Center stages
  const [researchSteps, setResearchSteps] = useState([
    { id: 1, title: 'Searching live flights via SerpApi', status: 'pending', detail: 'Google Flights engine' },
    { id: 2, title: 'Searching verified hotels & live rates', status: 'pending', detail: 'Google Hotels engine' },
    { id: 3, title: 'Discovering attractions with GPS coordinates', status: 'pending', detail: 'Google Maps places API' },
    { id: 4, title: 'Extracting sentiment & review intelligence', status: 'pending', detail: 'Travel forums & reviews' },
    { id: 5, title: 'Comparing options & calculating budget', status: 'pending', detail: 'Dynamic constraint optimizer' },
    { id: 6, title: 'Optimizing routes & travel times', status: 'pending', detail: 'Haversine geographical clustering' }
  ]);

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
   * Main Trip Generation Workflow with animated real-time research stages
   */
  async function generateTrip(customData) {
    const payload = customData || formData;
    setIsGenerating(true);
    setActiveScreen('research');

    // Reset research steps
    setResearchSteps([
      { id: 1, title: 'Searching live flights via SerpApi', status: 'in-progress', detail: 'Google Flights engine' },
      { id: 2, title: 'Searching verified hotels & live rates', status: 'pending', detail: 'Google Hotels engine' },
      { id: 3, title: 'Discovering attractions with GPS coordinates', status: 'pending', detail: 'Google Maps places API' },
      { id: 4, title: 'Extracting sentiment & review intelligence', status: 'pending', detail: 'Travel forums & reviews' },
      { id: 5, title: 'Comparing options & calculating budget', status: 'pending', detail: 'Dynamic constraint optimizer' },
      { id: 6, title: 'Optimizing routes & travel times', status: 'pending', detail: 'Haversine geographical clustering' }
    ]);

    // Animate stages smoothly while backend works
    const stepInterval = setInterval(() => {
      setResearchSteps(prev => {
        const nextPending = prev.findIndex(s => s.status === 'in-progress');
        if (nextPending !== -1 && nextPending < prev.length - 1) {
          const updated = [...prev];
          updated[nextPending].status = 'done';
          updated[nextPending + 1].status = 'in-progress';
          return updated;
        }
        return prev;
      });
    }, 600);

    try {
      const res = await fetch(`${API_BASE_URL}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      clearInterval(stepInterval);

      if (data.success && data.trip) {
        // Mark all steps done
        setResearchSteps(prev => prev.map(s => ({ ...s, status: 'done' })));

        setCurrentTrip(data.trip);
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

        // Small delay so user sees 100% completed research screen
        setTimeout(() => {
          setActiveScreen('dashboard');
          setIsGenerating(false);
        }, 800);

        // Initialize chat history with agent welcome
        setChatMessages([
          {
            role: 'agent',
            text: `Hello! I have generated your customized ${data.trip.duration}-day trip to ${data.trip.destination}. Flight options, 4★ hotel rates, and route-optimized attractions have been researched live via SerpApi. How would you like to refine or replan your journey?`
          }
        ]);

        return data.trip;
      } else {
        throw new Error(data.error || 'Failed to generate trip');
      }
    } catch (err) {
      clearInterval(stepInterval);
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
    if (!currentTrip?.id) return;
    setIsReplanning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${currentTrip.id}/optimize`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setCurrentTrip(data.trip);
        setChatMessages(prev => [
          ...prev,
          { role: 'user', text: 'Optimize for Budget' },
          { role: 'agent', text: data.trip.replanningReason || 'Trip has been optimized for budget with cheaper rates and free scenic activities.' }
        ]);
      }
    } catch (err) {
      console.error('[Error optimizing budget]:', err);
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
