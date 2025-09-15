'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationsCenter: React.FC = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();

  return (
    <div className="container-fluid py-3">
      <h1 id="notifications-heading">Notifications Center</h1>
      {notifications.length === 0 ? (
        <p aria-live="polite">No notifications to display.</p>
      ) : (
        <ul className="list-group" aria-labelledby="notifications-heading">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${notification.read ? 'list-group-item-secondary' : ''}`}
              role="status"
              aria-live="polite"
            >
              <div>
                <strong aria-label={`Notification type: ${notification.type}`}>{notification.type.toUpperCase()}:</strong>{' '}
                <span aria-label={`Message: ${notification.message}`}>{notification.message}</span>
                <small className="text-muted ms-2" aria-label={`Received at: ${new Date(notification.timestamp).toLocaleString()}`}>
                  {new Date(notification.timestamp).toLocaleString()}
                </small>
              </div>
              <div>
                {!notification.read && (
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => markAsRead(notification.id)}
                    aria-label={`Mark notification ${notification.message} as read`}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeNotification(notification.id)}
                  aria-label={`Dismiss notification ${notification.message}`}
                >
                  Dismiss
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsCenter;
