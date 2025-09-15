'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationToast from '@/components/NotificationToast';
import NotificationModal from '@/components/NotificationModal';
import NotificationSnackbar from '@/components/NotificationSnackbar';

const NotificationRenderer: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <>
      {notifications.map((notification) => {
        if (notification.displayType === 'modal') {
          return <NotificationModal key={notification.id} notification={notification} />;
        }
        if (notification.displayType === 'snackbar') {
          return <NotificationSnackbar key={notification.id} notification={notification} />;
        }
        // Default to toast if displayType is 'toast' or undefined
        return <NotificationToast key={notification.id} notification={notification} />;
      })}
    </>
  );
};

export default NotificationRenderer;
