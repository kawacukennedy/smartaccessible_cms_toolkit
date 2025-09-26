'use client';

import React, { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification } from '@/types/notification';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        // Display the toast
        const toastEl = document.getElementById(`toast-${notification.id}`);
        if (toastEl) {
          const toast = new (window as any).bootstrap.Toast(toastEl, { autohide: true, delay: 4000 }); // Changed delay to 4000
          toast.show();
          toastEl.addEventListener('hidden.bs.toast', () => {
            removeNotification(notification.id);
          });
        }
      }
    });
  }, [notifications, removeNotification]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20, // Changed top to bottom
        right: 20,
        zIndex: 1050,
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          id={`toast-${notification.id}`}
          className={`toast align-items-center text-white bg-${notification.style === 'error' ? 'danger' : notification.style === 'warning' ? 'warning' : notification.style === 'success' ? 'success' : notification.style === 'ai_suggestion' ? 'info' : 'primary'} border-0 fade show`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ marginBottom: 10 }}
        >
          <div className="d-flex">
            <div className="toast-body">{notification.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
