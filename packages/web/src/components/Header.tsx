'use client';

import React, { useEffect, useRef } from 'react'; // Import useRef
import { useTheme } from '@/contexts/ThemeContext';
// import { useTranslation } from 'react-i18next'; // Removed
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface HeaderProps {
  toggleSidebar: () => void;
  startTour: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, startTour }) => {
  const { theme, setTheme } = useTheme(); // Destructure setTheme
  // const { i18n } = useTranslation(); // Removed
  const { addNotification } = useNotifications();
  const { isLoggedIn, user, logout } = useAuth();
  const { highContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode, reducedMotion, toggleReducedMotion } = useAccessibility();

  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input
  const profileDropdownRef = useRef<HTMLButtonElement>(null); // Ref for profile dropdown button

  const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high_contrast');
    else if (theme === 'high_contrast') setTheme('sepia');
    else if (theme === 'sepia') setTheme('solarized');
    else setTheme('light');
  };

  const triggerSampleNotification = () => {
    addNotification({
      displayType: 'toast',
      style: 'info',
      message: 'This is a sample info notification!',
    });
    addNotification({
      displayType: 'toast',
      style: 'success',
      message: 'Content saved successfully!',
    });
    addNotification({
      displayType: 'toast',
      style: 'warning',
      message: 'Review accessibility suggestions.',
    });
    addNotification({
      displayType: 'toast',
      style: 'error',
      message: 'Failed to publish content.',
    });
  };

  // Keyboard shortcut for theme toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        cycleTheme();
      }
      // Keyboard shortcut for search focus
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      // Keyboard shortcut for navigation focus (Alt+N)
      if (event.altKey && event.key === 'N') {
        event.preventDefault();
        // Focus the profile dropdown button as a proxy for navigation focus
        // In a more complex app, this might focus the sidebar or a dedicated nav element
        profileDropdownRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cycleTheme, searchInputRef, profileDropdownRef]); // Added refs to dependencies

  return (
    <header>
      <nav className={`navbar navbar-expand-lg sticky-top shadow-sm ${navbarClass} app-header`}>
        <div className="container-fluid">
          <button className="btn btn-primary me-2" onClick={toggleSidebar} aria-controls="sidebarOffcanvas" aria-label="Toggle sidebar">
            <i className="bi bi-list"></i>
          </button>
          <Link href="/" className="navbar-brand" aria-label="SmartAccessible CMS Home">
            SmartAccessible CMS Toolkit
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Primary Navigation Items */}
              <li className="nav-item">
                <Link href="/dashboard" className="nav-link" aria-label="Go to Dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link href="/content" className="nav-link" aria-label="Manage Pages">Pages</Link>
              </li>
              <li className="nav-item">
                <Link href="/templates" className="nav-link" aria-label="Browse Templates">Templates</Link>
              </li>
              <li className="nav-item">
                <Link href="/assets" className="nav-link" aria-label="Manage Assets">Assets</Link>
              </li>
              <li className="nav-item">
                <Link href="/analytics" className="nav-link" aria-label="View Analytics">Analytics</Link>
              </li>
              <li className="nav-item">
                <Link href="/settings" className="nav-link" aria-label="Change Settings">Settings</Link>
              </li>
            </ul>
            <div className="d-flex">
              {/* Global Search Bar */}
              <form className="d-flex me-2" role="search">
                <input
                  ref={searchInputRef}
                  className="form-control me-2"
                  type="search"
                  placeholder="Search... (Ctrl+/)"
                  aria-label="Search"
                  role="combobox"
                  aria-expanded="false"
                  aria-controls="search-results-list"
                />
                <button className="btn btn-outline-secondary" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </form>

              {/* Persistent Toolbar / Quick Actions */}
              <button className="btn btn-outline-success me-2" title="Save current draft (Ctrl+S)">
                <i className="bi bi-save"></i> Save Draft
              </button>
              <button className="btn btn-outline-secondary me-2" title="Undo last action (Ctrl+Z)">
                <i className="bi bi-arrow-counterclockwise"></i> Undo
              </button>
              <button className="btn btn-outline-secondary me-2" title="Redo last action (Ctrl+Shift+Z)">
                <i className="bi bi-arrow-clockwise"></i> Redo
              </button>
              <button className="btn btn-outline-info me-2" title="Preview device">
                <i className="bi bi-eye"></i> Preview
              </button>
              <button className="btn btn-outline-primary me-2" title="AI suggestions">
                <i className="bi bi-robot"></i> AI suggestions
              </button>

              {/* Secondary Navigation / User Actions */}
              {isLoggedIn ? (
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    ref={profileDropdownRef}
                    aria-label="User menu"
                    role="menu"
                    aria-haspopup="true"
                  >
                    <i className="bi bi-person-circle"></i> {user?.name || 'Profile'}
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

              {/* Theme Toggle */}
              <button className="btn btn-outline-secondary ms-2" onClick={cycleTheme} title="Switch light/dark">
                <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>
              {/* Font Size Controls */}
              <button className="btn btn-outline-secondary ms-2" onClick={increaseFontSize} title="Increase Font Size">
                <i className="bi bi-plus-circle"></i>
              </button>
              <button className="btn btn-outline-secondary ms-2" onClick={decreaseFontSize} title="Decrease Font Size">
                <i className="bi bi-dash-circle"></i>
              </button>
              {/* Reduced Motion Toggle */}
              <button className="btn btn-outline-secondary ms-2" onClick={toggleReducedMotion} title="Toggle Reduced Motion">
                <i className={`bi ${reducedMotion ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-up'}`}></i>
              </button>
              {/* Sample Notification Trigger */}
              <button className="btn btn-outline-info ms-2" onClick={triggerSampleNotification} title="Trigger Sample Notifications">
                <i className="bi bi-bell"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
