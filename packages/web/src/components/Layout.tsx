'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import BootstrapClient from '@/components/BootstrapClient'; // Import BootstrapClient

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { highContrast, fontSize, colorBlindMode } = useAccessibility();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-layout d-flex flex-column min-vh-100 bg-${theme === 'dark' ? 'dark' : 'light'} ${highContrast ? 'high-contrast' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-grow-1">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content flex-grow-1 p-3">
          {children}
        </main>
      </div>
      <BootstrapClient />
    </div>
  );
};

export default Layout;


