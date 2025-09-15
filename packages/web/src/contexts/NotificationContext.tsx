'use client';

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { Notification } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp' | 'type'> & { displayType?: 'toast' | 'modal' | 'snackbar'; style?: 'info' | 'warning' | 'error' | 'success' | 'ai_suggestion'; title?: string; actions?: { label: string; onClick: () => void }[]; actionLabel?: string; onActionClick?: () => void; }) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'timestamp' | 'type'> & { displayType?: 'toast' | 'modal' | 'snackbar'; style?: 'info' | 'warning' | 'error' | 'error' | 'success' | 'ai_suggestion'; title?: string; actions?: { label: string; onClick: () => void }[]; actionLabel?: string; onActionClick?: () => void; }) => {
    const newNotification: Notification = {
      id: Date.now().toString(), // Simple unique ID for now
      read: false,
      timestamp: new Date().toISOString(),
      displayType: notification.displayType || 'toast', // Default to toast
      style: notification.style || 'info', // Default to info
      ...notification,
    };
    setNotifications((prev) => [...prev, newNotification]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({ notifications, addNotification, markAsRead, removeNotification }),
    [notifications, addNotification, markAsRead, removeNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
