'use client';

import React, { useState, useEffect } from 'react';
import InteractiveTour from './InteractiveTour';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import BootstrapClient from '@/components/BootstrapClient';
import Footer from './Footer';

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
    <>{children}</>
  );
};

export default Layout;
