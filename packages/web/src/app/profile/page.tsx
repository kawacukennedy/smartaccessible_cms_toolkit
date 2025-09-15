'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface ProfileCardProps {
  user: { name: string; email: string; avatarUrl?: string } | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="card mb-4">
      <div className="card-body text-center">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="User Avatar" className="rounded-circle mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
        ) : (
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <h5 className="card-title">{user?.name || 'Guest User'}</h5>
        <p className="card-text text-muted">{user?.email || 'N/A'}</p>
      </div>
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
    <div className="card">
      <div className="card-header">Preferences</div>
      <div className="card-body">
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="darkModeToggle"
            checked={darkModeEnabled}
            onChange={handleDarkModeToggle}
          />
          <label className="form-check-label" htmlFor="darkModeToggle">Dark Mode</label>
        </div>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="emailNotificationsToggle"
            checked={emailNotificationsEnabled}
            onChange={handleEmailNotificationsToggle}
          />
          <label className="form-check-label" htmlFor="emailNotificationsToggle">Email Notifications</label>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth(); // Assuming useAuth provides user info
  const { theme, setTheme } = useTheme();

  const handleToggleDarkMode = (enabled: boolean) => {
    setTheme(enabled ? 'dark' : 'light');
  };

  const handleToggleEmailNotifications = (enabled: boolean) => {
    alert(`Email notifications ${enabled ? 'enabled' : 'disabled'}`);
    // In a real app, update user preferences in backend
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">User Profile</h1>
      <div className="row">
        <div className="col-md-4">
          <ProfileCard user={user} />
        </div>
        <div className="col-md-8">
          <ProfilePreferences
            initialDarkMode={theme === 'dark'}
            onToggleDarkMode={handleToggleDarkMode}
            initialEmailNotifications={false} // Assuming default is false
            onToggleEmailNotifications={handleToggleEmailNotifications}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
