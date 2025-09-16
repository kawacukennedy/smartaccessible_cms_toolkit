'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Notification } from '@/types/notification';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationModalProps {
  notification: Notification;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    if (modalRef.current) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalRef.current);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    removeNotification(notification.id);
  }, [notification.id, removeNotification]);

  useEffect(() => {
    if (modalRef.current) {
      // Store the element that was focused before the modal opened
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      const modalElement = modalRef.current;
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();

      const handleHidden = () => {
        removeNotification(notification.id);
        // Return focus to the previously focused element
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };

      modalElement.addEventListener('hidden.bs.modal', handleHidden);

      // Focus trapping logic
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusableElement = focusableElements[0] as HTMLElement;
          const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            // If Shift + Tab and focus is on the first element, move to the last
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              event.preventDefault();
            }
          } else {
            // If Tab and focus is on the last element, move to the first
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              event.preventDefault();
            }
          }
        } else if (event.key === 'Escape') {
          // Allow escape to close the modal
          handleClose();
        }
      };

      modalElement.addEventListener('keydown', handleKeyDown);

      // Set initial focus to the close button or first focusable element
      const closeButton = modalElement.querySelector('.btn-close') as HTMLElement;
      if (closeButton) {
        closeButton.focus();
      } else {
        const firstFocusable = modalElement.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }


      return () => {
        modalElement.removeEventListener('hidden.bs.modal', handleHidden);
        modalElement.removeEventListener('keydown', handleKeyDown);
        // Ensure modal is properly disposed if component unmounts before it's hidden
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.dispose();
        }
      };
    }
  }, [notification.id, removeNotification, handleClose]);

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
              onClick={handleClose}
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
                  handleClose();
                }}
              >
                {action.label}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClose}
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