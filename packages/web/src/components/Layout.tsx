'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const InteractiveTour = dynamic(() => import('./InteractiveTour'), { ssr: false });
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import './Layout.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Footer from './Footer'; // Import Footer component

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { highContrast, fontSize, colorBlindMode, reducedMotion } = useAccessibility();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Open global search
            break;
          case 'n':
            e.preventDefault();
            // Open notifications
            break;
          case 'm':
            e.preventDefault();
            // Open media library
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className={`flex flex-col min-h-screen bg-background_light dark:bg-background_dark ${highContrast ? 'high-contrast' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
      <Header toggleSidebar={toggleSidebar} startTour={startTour} />
      <div className="flex flex-grow">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-grow">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
      <InteractiveTour run={runTour} setRunTour={setRunTour} />
      <Footer />
    </div>
  );
};

export default Layout;