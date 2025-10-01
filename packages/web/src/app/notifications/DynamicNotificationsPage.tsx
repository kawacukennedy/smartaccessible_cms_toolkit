'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { CheckLg, X, Info, AlertTriangle, Bug, CheckCircle } from 'lucide-react';

const DynamicNotificationsPage: React.FC = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();

  const [filter, setFilter] = useState('All');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !notification.read;
    if (filter === 'System') return ['info', 'warning', 'error', 'success'].includes(notification.style);
    if (filter === 'User') return notification.style === 'ai_suggestion';
    return true;
  });

  const markAllAsRead = () => {
    notifications.forEach(notification => markAsRead(notification.id));
  };

  const getNotificationIcon = (style: string) => {
    switch (style) {
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'error': return <Bug size={16} className="text-red-500" />;
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Notifications Center</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'All' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
          <button onClick={() => setFilter('Unread')} className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'Unread' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Unread</button>
          <button onClick={() => setFilter('System')} className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'System' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>System</button>
          <button onClick={() => setFilter('User')} className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'User' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>User</button>
        </div>
        <div className="flex space-x-2">
          <button onClick={markAllAsRead} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium">Mark All as Read</button>
          <button onClick={() => notifications.forEach(n => removeNotification(n.id))} className="px-4 py-2 rounded-md bg-error text-white hover:bg-red-700 text-sm font-medium">Dismiss All</button>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400" aria-live="polite">No notifications to display for this filter.</p>
      ) : (
        <ul className="space-y-3" aria-labelledby="notifications-heading">
          {filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center space-x-3">
                {getNotificationIcon(notification.style)}
                <div>
                  <strong className="font-semibold" aria-label={`Notification type: ${notification.style}`}>{notification.style.toUpperCase()}:</strong>
                  <span className="ml-1" aria-label={`Message: ${notification.message}`}>{notification.message}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2" aria-label={`Received at: ${new Date(notification.timestamp).toLocaleString()}`}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {!notification.read && (
                  <button
                    className="px-3 py-1 rounded-md bg-primary text-white hover:bg-blue-600 text-xs font-medium"
                    onClick={() => markAsRead(notification.id)}
                    aria-label={`Mark notification ${notification.message} as read`}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => removeNotification(notification.id)}
                  aria-label={`Dismiss notification ${notification.message}`}
                >
                  <X size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DynamicNotificationsPage;
