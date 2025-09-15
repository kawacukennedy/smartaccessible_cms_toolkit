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
    <div
      className={`main-layout ${theme} ${highContrast ? 'high-contrast' : ''} ${colorBlindMode !== 'none' ? colorBlindMode : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <BootstrapClient /> {/* Place BootstrapClient here */}
      <Header toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Header */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Pass props to Sidebar */}
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

export default Layout;
