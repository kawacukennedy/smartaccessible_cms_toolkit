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
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, setTheme, toggleTheme } = useTheme(); // Destructure setTheme
  // const { i18n } = useTranslation(); // Removed
  const { addNotification } = useNotifications();
  const { isLoggedIn, user, logout } = useAuth();
  const { highContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode } = useAccessibility();

  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input
  const profileDropdownRef = useRef<HTMLButtonElement>(null); // Ref for profile dropdown button

  const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';

  

  const triggerSampleNotification = () => {
    addNotification({
      type: 'info',
      message: 'This is a sample info notification!',
    });
    addNotification({
      type: 'success',
      message: 'Content saved successfully!',
    });
    addNotification({
      type: 'warning',
      message: 'Review accessibility suggestions.',
    });
    addNotification({
      type: 'error',
      message: 'Failed to publish content.',
    });
  };

  // Keyboard shortcut for theme toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        toggleTheme();
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
  }, [toggleTheme, searchInputRef, profileDropdownRef]); // Added refs to dependencies

  return (
    <header>
      <nav className={`navbar navbar-expand-lg ${navbarClass}`}>
        <div className="container-fluid">
          <button className="btn btn-primary me-2" onClick={toggleSidebar} aria-controls="sidebarOffcanvas" aria-label="Toggle sidebar">
            <i className="bi bi-list"></i>
          </button>
          <Link href="/" className="navbar-brand" aria-label="Go to dashboard">
            SmartAccessible CMS
          </Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* Primary Navigation Items */}
              <li className="nav-item">
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link href="/content" className="nav-link">Content</Link>
              </li>
              <li className="nav-item">
                <Link href="/accessibility" className="nav-link">Accessibility</Link>
              </li>
              <li className="nav-item">
                <Link href="/preview" className="nav-link">Preview</Link>
              </li>
              <li className="nav-item">
                <Link href="/ai-assistant" className="nav-link">AI Assistant</Link>
              </li>
              <li className="nav-item">
                <Link href="/analytics" className="nav-link">Analytics</Link>
              </li>
              <li className="nav-item">
                <Link href="/settings" className="nav-link">Settings</Link>
              </li>
            </ul>
            <div className="d-flex">
              {/* Persistent Toolbar / Quick Actions */}
              <button className="btn btn-outline-success me-2" title="Save Draft (Ctrl+S)">
                <i className="bi bi-save"></i> Save
              </button>
              <button className="btn btn-outline-secondary me-2" title="Undo (Ctrl+Z)">
                <i className="bi bi-arrow-counterclockwise"></i> Undo
              </button>
              <button className="btn btn-outline-secondary me-2" title="Redo">
                <i className="bi bi-arrow-clockwise"></i> Redo
              </button>
              <button className="btn btn-outline-info me-2" title="Preview (Ctrl+Shift+P)">
                <i className="bi bi-eye"></i> Preview
              </button>
              <button className="btn btn-outline-primary me-2" title="Run AI Scan (Ctrl+Alt+A)">
                <i className="bi bi-robot"></i> AI Suggest
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
                  >
                    <i className="bi bi-person-circle"></i> {user?.name || 'Profile'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li><Link href="/profile" className="dropdown-item">Profile</Link></li>
                    <li><Link href="/notifications" className="dropdown-item">Notifications</Link></li>
                    <li><Link href="/help" className="dropdown-item">Help</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                  </ul>
                </div>
              ) : (
                <Link href="/login" className="btn btn-primary">Login</Link>
              )}

              {/* Theme Toggle */}
              <button className="btn btn-outline-secondary ms-2" onClick={toggleTheme} title="Toggle Theme (Ctrl+Shift+T)">
                <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`}></i>
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
