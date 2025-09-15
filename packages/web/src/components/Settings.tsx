'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const { highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode } = useAccessibility();

  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    alert('User preferences saved!');
    // In a real app, save to backend
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password changed!');
    // In a real app, update password in backend
  };

  return (
    <div className="container-fluid py-3">
      <h1>Settings</h1>
      <p>Manage your application preferences and account settings.</p>

      <div className="row">
        {/* User Preferences */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">User Preferences</div>
            <div className="card-body">
              <form onSubmit={handleSavePreferences}>
                <div className="mb-3">
                  <label htmlFor="themeSelect" className="form-label">Theme</label>
                  <select id="themeSelect" className="form-select" value={theme} onChange={() => toggleTheme()}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="languageSelect" className="form-label">Language</label>
                  <select id="languageSelect" className="form-select" value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Accessibility</label>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="highContrastToggle" checked={highContrast} onChange={toggleHighContrast} />
                    <label className="form-check-label" htmlFor="highContrastToggle">High Contrast Mode</label>
                  </div>
                  <div className="mt-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm me-2" onClick={increaseFontSize}>A+</button>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={decreaseFontSize}>A-</button>
                  </div>
                  <div className="mt-2">
                    <label htmlFor="colorBlindSelect" className="form-label">Color Blind Mode</label>
                    <select id="colorBlindSelect" className="form-select" value={colorBlindMode} onChange={(e) => setColorBlindMode(e.target.value as any)}>
                      <option value="none">None</option>
                      <option value="protanopia">Protanopia</option>
                      <option value="deuteranopia">Deuteranopia</option>
                      <option value="tritanopia">Tritanopia</option>
                      <option value="achromatopsia">Achromatopsia</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Save Preferences</button>
              </form>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">Account Management</div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPasswordInput" className="form-label">New Password</label>
                  <input type="password" className="form-control" id="newPasswordInput" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleChangePassword}>Change Password</button>
              </form>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Settings;
