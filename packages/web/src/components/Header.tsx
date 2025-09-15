'use client';

import React, { useEffect, useRef } from 'react'; // Import useRef
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, setTheme, toggleTheme } = useTheme(); // Destructure setTheme
  const { i18n } = useTranslation();
  const { addNotification } = useNotifications();
  const { isLoggedIn, user, logout } = useAuth();
  const { highContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode } = useAccessibility();

  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for search input
  const profileDropdownRef = useRef<HTMLButtonElement>(null); // Ref for profile dropdown button

  const navbarClass = theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
  }, [toggleTheme]); // Add searchInputRef and profileDropdownRef to dependencies if they were state variables

  return (
    <header className={`navbar ${navbarClass}`}>
      <div className="container-fluid">
        {/* Sidebar Toggle Button for mobile/tablet */}
        <button
          className="btn btn-primary d-md-none me-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
          onClick={toggleSidebar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <span className="navbar-brand mb-0 h1">SmartAccessible CMS Toolkit</span>
        <div className="d-flex align-items-center">
          {/* SearchInput Placeholder */}
          <input ref={searchInputRef} type="text" className="form-control me-2" placeholder="Search..." aria-label="Search" />

          {/* Profile/Login Dropdown */}
          {isLoggedIn ? (
            <div className="dropdown me-2">
              <button ref={profileDropdownRef} className="btn btn-secondary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                {user?.username || 'Profile'}
              </button>
              <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">Help</a></li> {/* Added Help */}
                <li><a className="dropdown-item" href="#">Docs</a></li> {/* Added Docs */}
                <li><hr className="dropdown-divider" /></li>
                <li><h6 className="dropdown-header">Theme</h6></li>
                <li><button className={`dropdown-item ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>Light</button></li>
                <li><button className={`dropdown-item ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>Dark</button></li>
                <li><button className={`dropdown-item ${theme === 'high_contrast' ? 'active' : ''}`} onClick={() => setTheme('high_contrast')}>High Contrast</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary me-2">
              Login
            </Link>
          )}

          {/* NotificationsIcon Placeholder */}
          <button className="btn btn-outline-secondary me-2" type="button" onClick={triggerSampleNotification}>
            Notifications
          </button>

          {/* Accessibility Controls */}
          <button className={`btn btn-outline-secondary me-2 ${highContrast ? 'active' : ''}`} onClick={toggleHighContrast}>
            High Contrast
          </button>
          <button className="btn btn-outline-secondary me-2" onClick={increaseFontSize}>
            A+
          </button>
          <button className="btn btn-outline-secondary me-2" onClick={decreaseFontSize}>
            A-
          </button>

          {/* Color Blind Mode Dropdown */}
          <div className="dropdown d-inline-block me-2">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="colorBlindDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {colorBlindMode === 'none' ? 'Color Blind Mode' : colorBlindMode.replace('_', ' ')}
            </button>
            <ul className="dropdown-menu" aria-labelledby="colorBlindDropdown">
              <li><button className="dropdown-item" type="button" onClick={() => setColorBlindMode('none')}>None</button></li>
              <li><button className="dropdown-item" type="button" onClick={() => setColorBlindMode('protanopia')}>Protanopia</button></li>
              <li><button className="dropdown-item" type="button" onClick={() => setColorBlindMode('deuteranopia')}>Deuteranopia</button></li>
              <li><button className="dropdown-item" type="button" onClick={() => setColorBlindMode('tritanopia')}>Tritanopia</button></li>
              <li><button className="dropdown-item" type="button" onClick={() => setColorBlindMode('achromatopsia')}>Achromatopsia</button></li>
            </ul>
          </div>

          {/* Language Switcher */}
          <div className="dropdown d-inline-block me-2">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              {i18n.language.toUpperCase()}
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li><button className="dropdown-item" type="button" onClick={() => changeLanguage('en')}>English</button></li>
              <li><button className="dropdown-item" type="button" onClick={() => changeLanguage('fr')}>Français</button></li>
            </ul>
          </div>

          {/* Removed old Theme Switcher */}
        </div>
      </div>
    </header>
  );
