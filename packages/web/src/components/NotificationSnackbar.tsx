import React, { useEffect, useRef } from 'react';
import { Notification } from '@/types/notification';
import { useNotifications } from '@/contexts/NotificationContext';

interface SnackbarItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const SnackbarItem: React.FC<SnackbarItemProps> = ({ notification, onClose }) => {
  const snackbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (snackbarRef.current) {
      const toast = new (window as any).bootstrap.Toast(snackbarRef.current, { autohide: true, delay: 4000 });
      toast.show();
      snackbarRef.current.addEventListener('hidden.bs.toast', () => {
        onClose(notification.id);
      });
    }
  }, [notification.id, onClose]);

  return (
    <div
      key={notification.id}
      id={`snackbar-${notification.id}`}
      className={`toast align-items-center text-white bg-${notification.style === 'error' ? 'danger' : notification.style === 'warning' ? 'warning' : notification.style === 'success' ? 'success' : 'primary'} border-0 fade show`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref={snackbarRef}
      style={{ marginBottom: 10 }}
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
              onClose(notification.id);
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
          onClick={() => onClose(notification.id)}
        ></button>
      </div>
    </div>
  );
};

const NotificationSnackbar: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const snackbarNotifications = notifications.filter(n => n.displayType === 'snackbar');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1050,
        minWidth: '300px',
      }}
    >
      {snackbarNotifications.map(notification => (
        <SnackbarItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationSnackbar;
