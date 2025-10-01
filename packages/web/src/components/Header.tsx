'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Menu, Search, Mic, User, Bell, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  startTour: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, startTour }) => {
  const { theme, setTheme } = useTheme();
  const { addNotification } = useNotifications();
  const { isLoggedIn, user, logout } = useAuth();
  const { highContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode, reducedMotion, toggleReducedMotion } = useAccessibility();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const cycleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 shadow-md bg-primary text-white" style={{ height: '64px' }}>
      <nav className="container-fluid flex items-center justify-between h-full">
        <div className="flex items-center">
          <button className="p-2 mr-2" onClick={toggleSidebar} aria-controls="sidebarOffcanvas" aria-label="Toggle sidebar">
            <Menu />
          </button>
          <Link href="/" className="navbar-brand" aria-label="SmartAccessible CMS Home">
            SmartAccessible CMS
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/dashboard" className="hover:text-secondary">Dashboard</Link>
          <Link href="/pages" className="hover:text-secondary">Pages</Link>
          <Link href="/templates" className="hover:text-secondary">Templates</Link>
          <Link href="/assets" className="hover:text-secondary">Assets</Link>
          <Link href="/analytics" className="hover:text-secondary">Analytics</Link>
          <Link href="/settings" className="hover:text-secondary">Settings</Link>
        </div>

        <div className="flex items-center space-x-4">
          <form className="relative flex items-center" role="search">
            <input
              ref={searchInputRef}
              className="form-control bg-background_dark text-white placeholder-gray-400 rounded-full px-4 py-2 w-64"
              type="search"
              placeholder="Search... (Ctrl+/)"
              aria-label="Search"
              role="combobox"
              aria-expanded={isSearchExpanded}
              aria-controls="search-results-list"
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => setIsSearchExpanded(false)}
            />
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <Mic size={20} className="text-gray-400 hover:text-white" />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search size={20} className="text-gray-400" />
            </div>
          </form>

          <button onClick={cycleTheme} className="p-2">
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>

          <button className="p-2">
            <Bell />
          </button>

          {isLoggedIn ? (
            <div className="dropdown">
              <button className="flex items-center space-x-2 p-2">
                <User />
                <span>{user?.name || 'Profile'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li><Link href="/profile" className="dropdown-item">Profile</Link></li>
                <li><Link href="/notifications" className="dropdown-item">Notifications</Link></li>
                <li><Link href="/preferences" className="dropdown-item">Preferences</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;