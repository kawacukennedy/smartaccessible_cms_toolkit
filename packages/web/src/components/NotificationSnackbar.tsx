'use client';

import React, { useEffect, useRef } from 'react';
import { Notification } from '@/types/notification';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationSnackbarProps {
  notification: Notification;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const snackbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (snackbarRef.current) {
      const toast = new (window as any).bootstrap.Toast(snackbarRef.current, { autohide: true, delay: 4000 });
      toast.show();
      snackbarRef.current.addEventListener('hidden.bs.toast', () => {
        removeNotification(notification.id);
      });
    }
  }, [notification.id, removeNotification]);

  return (
    <div
      className={`toast align-items-center text-white bg-${notification.style === 'error' ? 'danger' : notification.style === 'warning' ? 'warning' : notification.style === 'success' ? 'success' : 'primary'} border-0 fade show`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref={snackbarRef}
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1050,
        minWidth: '300px',
        marginBottom: 10,
      }}
    >
      <div className="d-flex">
        <div className="toast-body">
          {notification.message}
        </div>
        {notification.actionLabel && notification.onActionClick && (
          <button
            type="button"
            className="btn btn-link text-white me-2"
            onClick={() => {
              notification.onActionClick?.();
              removeNotification(notification.id);
            }}
          >
            {notification.actionLabel}
          </button>
        )}
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={() => removeNotification(notification.id)}
        ></button>
      </div>
    </div>
  );
};

export default NotificationSnackbar;
