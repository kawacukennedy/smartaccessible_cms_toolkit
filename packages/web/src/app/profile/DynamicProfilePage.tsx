'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Mail, Moon, Sun, Bell, BellOff } from 'lucide-react';

interface ProfileCardProps {
  user: { name: string; email: string; avatarUrl?: string } | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center mb-6">
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt="User Avatar" className="rounded-full w-24 h-24 object-cover mx-auto mb-4" />
      ) : (
        <div className="rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 w-24 h-24 text-4xl">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
      <h3 className="text-xl font-bold mb-1">{user?.name || 'Guest User'}</h3>
      <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center"><Mail size={16} className="mr-2" />{user?.email || 'N/A'}</p>
    </div>
  );
};

interface ProfilePreferencesProps {
  initialDarkMode: boolean;
  onToggleDarkMode: (enabled: boolean) => void;
  initialEmailNotifications: boolean;
  onToggleEmailNotifications: (enabled: boolean) => void;
}

const ProfilePreferences: React.FC<ProfilePreferencesProps> = ({
  initialDarkMode,
  onToggleDarkMode,
  initialEmailNotifications,
  onToggleEmailNotifications,
}) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(initialDarkMode);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(initialEmailNotifications);

  const handleDarkModeToggle = () => {
    const newState = !darkModeEnabled;
    setDarkModeEnabled(newState);
    onToggleDarkMode(newState);
  };

  const handleEmailNotificationsToggle = () => {
    const newState = !emailNotificationsEnabled;
    setEmailNotificationsEnabled(newState);
    onToggleEmailNotifications(newState);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="darkModeToggle" className="flex items-center text-lg">
            {darkModeEnabled ? <Moon size={20} className="mr-2" /> : <Sun size={20} className="mr-2" />}
            Dark Mode
          </label>
          <input
            type="checkbox"
            id="darkModeToggle"
            checked={darkModeEnabled}
            onChange={handleDarkModeToggle}
            className="sr-only peer"
          />
          <div onClick={handleDarkModeToggle} className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary dark:peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] peer-checked:after:bg-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary cursor-pointer">
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="emailNotificationsToggle" className="flex items-center text-lg">
            {emailNotificationsEnabled ? <Bell size={20} className="mr-2" /> : <BellOff size={20} className="mr-2" />}
            Email Notifications
          </label>
          <input
            type="checkbox"
            id="emailNotificationsToggle"
            checked={emailNotificationsEnabled}
            onChange={handleEmailNotificationsToggle}
            className="sr-only peer"
          />
          <div onClick={handleEmailNotificationsToggle} className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary dark:peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] peer-checked:after:bg-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary cursor-pointer">
          </div>
        </div>
      </div>
    </div>
  );
};

const DynamicProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleToggleDarkMode = (enabled: boolean) => {
    setTheme(enabled ? 'dark' : 'light');
  };

  const handleToggleEmailNotifications = (enabled: boolean) => {
    alert(`Email notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileCard user={user} />
        </div>
        <div className="md:col-span-2">
          <ProfilePreferences
            initialDarkMode={theme === 'dark'}
            onToggleDarkMode={handleToggleDarkMode}
            initialEmailNotifications={false}
            onToggleEmailNotifications={handleToggleEmailNotifications}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicProfilePage;
