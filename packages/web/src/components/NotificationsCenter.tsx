'use client';

import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationsCenter: React.FC = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();

  const [filter, setFilter] = useState('All'); // State for active filter

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !notification.read;
    // Assuming 'System' and 'User' types are available in notification.metadata or a new property
    // For now, I'll just filter by 'info', 'warning', 'error', 'success' as 'System' and 'ai_suggestion' as 'User'
    if (filter === 'System') return ['info', 'warning', 'error', 'success'].includes(notification.style);
    if (filter === 'User') return notification.style === 'ai_suggestion';
    return true;
  });

  const markAllAsRead = () => {
    notifications.forEach(notification => markAsRead(notification.id));
  };

  return (
    <div className="container-fluid py-3">
      <h1 className="mb-4">Notifications Center</h1>

      {/* Filter Bar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group" role="group" aria-label="Notification filters">
          <button type="button" className={`btn btn-outline-primary ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button type="button" className={`btn btn-outline-primary ${filter === 'Unread' ? 'active' : ''}`} onClick={() => setFilter('Unread')}>Unread</button>
          <button type="button" className={`btn btn-outline-primary ${filter === 'System' ? 'active' : ''}`} onClick={() => setFilter('System')}>System</button>
          <button type="button" className={`btn btn-outline-primary ${filter === 'User' ? 'active' : ''}`} onClick={() => setFilter('User')}>User</button>
        </div>
        <button className="btn btn-secondary" onClick={markAllAsRead}>Mark All as Read</button>
      </div>

      {filteredNotifications.length === 0 ? (
        <p aria-live="polite">No notifications to display for this filter.</p>
      ) : (
        <ul className="list-group" aria-labelledby="notifications-heading">
          {filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${notification.read ? 'list-group-item-secondary' : ''}`}
              role="status"
              aria-live="polite"
            >
              <div>
                <strong aria-label={`Notification type: ${notification.style}`}>{notification.style.toUpperCase()}:</strong>{' '}
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
