import React, { useEffect, useRef } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification } from '@/types/notification';

interface ToastItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onClose }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastRef.current) {
      const toast = new (window as any).bootstrap.Toast(toastRef.current, { autohide: true, delay: 4000 });
      toast.show();
      toastRef.current.addEventListener('hidden.bs.toast', () => {
        onClose(notification.id);
      });
    }
  }, [notification.id, onClose]);

  return (
    <div
      key={notification.id}
      id={`toast-${notification.id}`}
      className={`toast align-items-center text-white bg-${notification.style === 'error' ? 'danger' : notification.style === 'warning' ? 'warning' : notification.style === 'success' ? 'success' : notification.style === 'ai_suggestion' ? 'info' : 'primary'} border-0 fade show`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref={toastRef}
      style={{ marginBottom: 10 }}
    >
      <div className="d-flex">
        <div className="toast-body">{notification.message}</div>
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

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const toastNotifications = notifications.filter(n => n.displayType === 'toast');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20, // Changed top to bottom
        right: 20,
        zIndex: 1050,
      }}
    >
      {toastNotifications.map(notification => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationToast;
