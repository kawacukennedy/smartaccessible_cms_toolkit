'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme(); // Use setTheme directly
  const { i18n } = useTranslation();
  const { highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode } = useAccessibility();

  const [activeTab, setActiveTab] = useState('general'); // State for active tab
  const [siteName, setSiteName] = useState('SmartAccessible CMS');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('General settings saved!');
    // In a real app, save to backend
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password reset initiated!');
    // In a real app, send password reset request to backend
  };

  return (
    <div className="container-fluid py-3">
      <h1>Settings</h1>
      <p>Manage your application preferences and account settings.</p>

      <ul className="nav nav-tabs mb-4 d-none d-md-flex" id="settingsTab" role="tablist"> {/* Horizontal tabs for desktop */}
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab" aria-controls="general" aria-selected={activeTab === 'general'} onClick={() => setActiveTab('general')}>General</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab" aria-controls="users" aria-selected={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === 'api-keys' ? 'active' : ''}`} id="api-keys-tab" data-bs-toggle="tab" data-bs-target="#api-keys" type="button" role="tab" aria-controls="api-keys" aria-selected={activeTab === 'api-keys'} onClick={() => setActiveTab('api-keys')}>API Keys</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === 'integrations' ? 'active' : ''}`} id="integrations-tab" data-bs-toggle="tab" data-bs-target="#integrations" type="button" role="tab" aria-controls="integrations" aria-selected={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')}>Integrations</button>
        </li>
      </ul>

      <div className="dropdown d-md-none mb-3"> {/* Dropdown for mobile tabs */}
        <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="settingsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
        <ul className="dropdown-menu w-100" aria-labelledby="settingsDropdown">
          <li><a className={`dropdown-item ${activeTab === 'general' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('general')}>General</a></li>
          <li><a className={`dropdown-item ${activeTab === 'users' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('users')}>Users</a></li>
          <li><a className={`dropdown-item ${activeTab === 'api-keys' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('api-keys')}>API Keys</a></li>
          <li><a className={`dropdown-item ${activeTab === 'integrations' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('integrations')}>Integrations</a></li>
        </ul>
      </div>

      <div className="tab-content" id="settingsTabContent">
        {/* General Tab Content */}
        <div className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`} id="general" role="tabpanel" aria-labelledby="general-tab">
          <div className="card mb-3">
            <div className="card-header">Site Settings</div>
            <div className="card-body">
              <form onSubmit={handleSaveGeneralSettings}>
                <div className="mb-3">
                  <label htmlFor="siteName" className="form-label">Site Name</label>
                  <input type="text" className="form-control" id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="logoUpload" className="form-label">Logo Upload</label>
                  <input type="file" className="form-control" id="logoUpload" onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)} />
                </div>
                <button type="submit" className="btn btn-primary">Save Site Settings</button>
              </form>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">User Preferences</div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="themeSelect" className="form-label">Theme</label>
                  <select id="themeSelect" className="form-select" value={theme} onChange={(e) => setTheme(e.target.value as any)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="high_contrast">High Contrast</option>
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

        {/* Users Tab Content */}
        <div className={`tab-pane fade ${activeTab === 'users' ? 'show active' : ''}`} id="users" role="tabpanel" aria-labelledby="users-tab">
          <div className="card">
            <div className="card-header">User Management</div>
            <div className="card-body">
              <p>Manage users and their roles here.</p>
              {/* Placeholder for user table/list */}
            </div>
          </div>
        </div>

        {/* API Keys Tab Content */}
        <div className={`tab-pane fade ${activeTab === 'api-keys' ? 'show active' : ''}`} id="api-keys" role="tabpanel" aria-labelledby="api-keys-tab">
          <div className="card">
            <div className="card-header">API Key Management</div>
            <div className="card-body">
              <p>Generate and manage API keys for external integrations.</p>
              {/* Placeholder for API key list */}
            </div>
          </div>
        </div>

        {/* Integrations Tab Content */}
        <div className={`tab-pane fade ${activeTab === 'integrations' ? 'show active' : ''}`} id="integrations" role="tabpanel" aria-labelledby="integrations-tab">
          <div className="card">
            <div className="card-header">Integrations</div>
            <div className="card-body">
              <p>Connect with third-party services.</p>
              {/* Placeholder for integrations list */}
            </div>
          </div>
        </div>
      </div>

      {/* Security Form Section (moved from Account Management) */}
      <div className="card mt-4">
        <div className="card-header">Security</div>
        <div className="card-body">
          <form onSubmit={handlePasswordReset}>
            <div className="mb-3 form-check form-switch">
              <input className="form-check-input" type="checkbox" id="twoFactorToggle" checked={twoFactorEnabled} onChange={(e) => setTwoFactorEnabled(e.target.checked)} />
              <label className="form-check-label" htmlFor="twoFactorToggle">Enable Two-Factor Authentication</label>
            </div>
            <h5 className="mt-4">Change Password</h5>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
