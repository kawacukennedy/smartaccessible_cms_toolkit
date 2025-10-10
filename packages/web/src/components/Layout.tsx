'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InteractiveTour from './InteractiveTour';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import CommandPalette from './CommandPalette';
import './Layout.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Footer from './Footer'; // Import Footer component

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const { highContrast, fontSize, colorBlindMode, reducedMotion } = useAccessibility();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const router = useRouter();

  const commands = [
    {
      id: 'dashboard',
      name: 'Go to Dashboard',
      action: () => router.push('/dashboard'),
    },
    {
      id: 'content',
      name: 'Go to Content',
      action: () => router.push('/content'),
    },
    {
      id: 'settings',
      name: 'Go to Settings',
      action: () => router.push('/settings'),
    },
    {
      id: 'toggle-theme',
      name: 'Toggle Theme',
      action: () => setTheme(theme === 'light' ? 'dark' : 'light'),
    },
    {
      id: 'start-tour',
      name: 'Start Interactive Tour',
      action: () => setRunTour(true),
    },
  ];

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
            // Open global search - focus search input
            searchInputRef.current?.focus();
            break;
          case 'n':
            e.preventDefault();
            // Open notifications - would need to implement
            break;
          case 'm':
            e.preventDefault();
            // Open media library - would need to implement
            break;
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white p-2 z-50">Skip to main content</a>
      <Header toggleSidebar={toggleSidebar} startTour={startTour} />
      <div className="flex flex-grow">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-grow" id="main-content">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
      <InteractiveTour run={runTour} setRunTour={setRunTour} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />
      <Footer />
    </div>
  );
};

export default Layout;