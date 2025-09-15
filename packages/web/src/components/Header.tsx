'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const { addNotification } = useNotifications();
  const { isLoggedIn, user, logout } = useAuth();
  const { highContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode } = useAccessibility();

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

  return (
    <header className={`navbar ${navbarClass}`}>
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">SmartAccessible CMS Toolkit</span>
        <div className="d-flex align-items-center">
          {/* SearchInput Placeholder */}
          <input type="text" className="form-control me-2" placeholder="Search..." aria-label="Search" />

          {/* Profile/Login Dropdown */}
          {isLoggedIn ? (
            <div className="dropdown me-2">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                {user?.username || 'Profile'}
              </button>
              <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                <li><a className="dropdown-item" href="#">Settings</a></li>
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

          {/* Theme Switcher */}
          <button className="btn btn-outline-primary" onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
