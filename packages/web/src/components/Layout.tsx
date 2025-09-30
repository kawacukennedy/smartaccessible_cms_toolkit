'use client';

import React, { useState, useEffect } from 'react';
import InteractiveTour from './InteractiveTour';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import BootstrapClient from '@/components/BootstrapClient'; // Import BootstrapClient
import Footer from './Footer'; // Import Footer component

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { highContrast, fontSize, colorBlindMode, reducedMotion } = useAccessibility();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const tourHasRun = localStorage.getItem('tourHasRun');
    if (!tourHasRun) {
      setRunTour(true);
      localStorage.setItem('tourHasRun', 'true');
    }

    const handleStartTourEvent = () => {
      setRunTour(true);
    };

    window.addEventListener('startTour', handleStartTourEvent);

    return () => {
      window.removeEventListener('startTour', handleStartTourEvent);
    };
  }, []);

  // Apply font size class to html element
  useEffect(() => {
    document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.documentElement.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const startTour = () => {
    setRunTour(true);
  };

  return (
    <div className={`main-layout d-flex flex-column min-vh-100 bg-${theme === 'dark' ? 'dark' : 'light'} ${highContrast ? 'high-contrast' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
      <Header toggleSidebar={toggleSidebar} startTour={startTour} />
      <div className="d-flex flex-grow-1">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content flex-grow-1 p-3">
          {children}
        </main>
      </div>
      <InteractiveTour run={runTour} setRunTour={setRunTour} />
      <BootstrapClient />
      <Footer /> {/* Render the Footer component */}
    </div>
  );
};

export default Layout;


