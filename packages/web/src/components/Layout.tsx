'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const { highContrast, fontSize, colorBlindMode } = useAccessibility();

  return (
    <div
      className={`main-layout ${theme} ${highContrast ? 'high-contrast' : ''} ${colorBlindMode !== 'none' ? colorBlindMode : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <Header />
      <div className="main-content">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
