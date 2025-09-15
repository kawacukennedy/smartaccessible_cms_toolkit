'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationToast from '@/components/NotificationToast';
import NotificationModal from '@/components/NotificationModal';
import NotificationSnackbar from '@/components/NotificationSnackbar';

const NotificationRenderer: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <div>
      <h1>Notification Renderer</h1>
    </div>
  );
};

export default NotificationRenderer;
