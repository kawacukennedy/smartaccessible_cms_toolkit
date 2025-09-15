'use client';

import React, { useEffect, useRef } from 'react';
import { Notification } from '@/types/notification';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationModalProps {
  notification: Notification;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      const modal = new (window as any).bootstrap.Modal(modalRef.current);
      modal.show();

      modalRef.current.addEventListener('hidden.bs.modal', () => {
        removeNotification(notification.id);
      });
    }
  }, [notification.id, removeNotification]);

  return (
    <div
      className="modal fade"
      id={`notificationModal-${notification.id}`}
      tabIndex={-1}
      aria-labelledby={`notificationModalLabel-${notification.id}`}
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`notificationModalLabel-${notification.id}`}>
              {notification.title || 'Alert'}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => removeNotification(notification.id)}
            ></button>
          </div>
          <div className="modal-body">{notification.message}</div>
          <div className="modal-footer">
            {notification.actions?.map((action, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  action.onClick();
                  removeNotification(notification.id);
                }}
              >
                {action.label}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => removeNotification(notification.id)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
