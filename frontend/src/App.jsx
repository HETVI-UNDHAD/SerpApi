import React from 'react';
import { TripProvider, useTrip } from './context/TripContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import TripBuilderPage from './pages/TripBuilderPage';
import ResearchCenterPage from './pages/ResearchCenterPage';
import DashboardPage from './pages/DashboardPage';
import DesignShowcasePage from './pages/DesignShowcasePage';
import TravelBackdrop from './components/TravelBackdrop';
import FloatingAssistant from './components/FloatingAssistant';

function AppContent() {
  const { activeScreen, theme } = useTrip();
  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-screen flex flex-col font-sans transition-colors duration-400 selection:bg-blue-600 selection:text-white ${
      isDark ? 'text-slate-100 bg-[#090D16]' : 'text-slate-900 bg-[#FBFBFA]'
    }`}>
      <TravelBackdrop isDark={isDark} />
      <Navbar />
      <div className="flex-1 flex min-w-0 transition-all duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">
            {activeScreen === 'landing' && <LandingPage />}
            {activeScreen === 'builder' && <TripBuilderPage />}
            {activeScreen === 'research' && <ResearchCenterPage />}
            {activeScreen === 'dashboard' && <DashboardPage />}
            {activeScreen === 'design-showcase' && <DesignShowcasePage />}
          </main>
          <Footer />
        </div>
      </div>
      <FloatingAssistant />
    </div>
  );
}

export default function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}
