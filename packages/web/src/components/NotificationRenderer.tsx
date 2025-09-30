'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationToast from '@/components/NotificationToast';
import NotificationModal from '@/components/NotificationModal';
import NotificationSnackbar from '@/components/NotificationSnackbar';

const NotificationRenderer: React.FC = () => {
  return (
    <>
      <NotificationToast />
      <NotificationModal />
      <NotificationSnackbar />
    </>
  );
};

export default NotificationRenderer;
