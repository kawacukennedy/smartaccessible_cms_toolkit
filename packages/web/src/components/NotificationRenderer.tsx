'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationToast from '@/components/NotificationToast';
import NotificationModal from '@/components/NotificationModal';
import NotificationSnackbar from '@/components/NotificationSnackbar';

const NotificationRenderer: React.FC = () => {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div className="notification-renderer-container">
      {notifications.map((notification) => {
        switch (notification.displayType) {
          case 'toast':
            return (
              <NotificationToast
                key={notification.id}
                notification={notification}
                onClose={() => dismissNotification(notification.id)}
              />
            );
          case 'modal':
            return (
              <NotificationModal
                key={notification.id}
                notification={notification}
                onClose={() => dismissNotification(notification.id)}
              />
            );
          case 'snackbar':
            return (
              <NotificationSnackbar
                key={notification.id}
                notification={notification}
                onClose={() => dismissNotification(notification.id)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default NotificationRenderer;
