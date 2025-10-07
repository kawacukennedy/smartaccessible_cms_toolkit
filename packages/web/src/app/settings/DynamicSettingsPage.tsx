'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const DynamicSettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode } = useAccessibility();

  const [activeTab, setActiveTab] = useState('general');
  const [siteName, setSiteName] = useState('SmartAccessible CMS');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('General settings saved!');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password reset initiated!');
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your application preferences and account settings.</p>

       <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
         <button onClick={() => setActiveTab('general')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'general' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>General</button>
         <button onClick={() => setActiveTab('accessibility')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'accessibility' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Accessibility Preferences</button>
         <button onClick={() => setActiveTab('integrations')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'integrations' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Integrations</button>
         <button onClick={() => setActiveTab('api-keys')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'api-keys' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>API Keys</button>
       </div>

      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-xl mb-4">Site Settings</h3>
            <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
                <input type="text" id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo Upload</label>
                <input type="file" id="logoUpload" onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-gray-700 dark:text-gray-300" />
              </div>
              <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Save Site Settings</button>
            </form>

            <h3 className="font-bold text-xl mt-8 mb-4">User Preferences</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="themeSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                <select id="themeSelect" value={theme} onChange={(e) => setTheme(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="high_contrast">High Contrast</option>
                </select>
              </div>
              <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Save Preferences</button>
            </form>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-xl mb-4">Accessibility Preferences</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Accessibility</label>
                <div className="flex items-center mt-2">
                  <input type="checkbox" id="highContrastToggle" checked={highContrast} onChange={toggleHighContrast} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <label htmlFor="highContrastToggle" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">High Contrast Mode</label>
                </div>
                <div className="mt-2">
                  <button type="button" className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm mr-2" onClick={increaseFontSize}>A+</button>
                  <button type="button" className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm" onClick={decreaseFontSize}>A-</button>
                </div>
                <div className="mt-2">
                  <label htmlFor="colorBlindSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color Blind Mode</label>
                  <select id="colorBlindSelect" value={colorBlindMode} onChange={(e) => setColorBlindMode(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia</option>
                    <option value="deuteranopia">Deuteranopia</option>
                    <option value="tritanopia">Tritanopia</option>
                    <option value="achromatopsia">Achromatopsia</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Save Accessibility Preferences</button>
            </form>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-xl mb-4">API Key Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Generate and manage API keys for external integrations.</p>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-xl mb-4">Integrations</h3>
            <p className="text-gray-600 dark:text-gray-400">Connect with third-party services.</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
        <h3 className="font-bold text-xl mb-4">Security</h3>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="flex items-center">
            <input type="checkbox" id="twoFactorToggle" checked={twoFactorEnabled} onChange={(e) => setTwoFactorEnabled(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label htmlFor="twoFactorToggle" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Enable Two-Factor Authentication</label>
          </div>
          <h4 className="font-bold text-lg mt-6 mb-2">Change Password</h4>
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default DynamicSettingsPage;
