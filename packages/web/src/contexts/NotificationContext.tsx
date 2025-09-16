'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import { Notification } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const liveRegionRef = useRef<HTMLDivElement>(null); // Ref for the live region

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString(); // Simple unique ID
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { ...notification, id },
    ]);

    // Announce notification message to screen readers
    if (liveRegionRef.current && notification.message) {
      liveRegionRef.current.textContent = notification.message;
    }

    // Auto-remove toast notifications after a delay
    if (notification.displayType === 'toast') {
      setTimeout(() => {
        removeNotification(id);
        // Clear live region after announcement
        if (liveRegionRef.current && liveRegionRef.current.textContent === notification.message) {
          liveRegionRef.current.textContent = '';
        }
      }, 5000); // 5 seconds
    }
  }, [removeNotification]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      {/* Hidden ARIA live region for screen reader announcements */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        className="visually-hidden" // Bootstrap class to hide visually but keep accessible
      ></div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};