import React, { useEffect, useRef, useCallback } from 'react';

interface PublishConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  validationIssues: string[];
}

const PublishConfirmationModal: React.FC<PublishConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  validationIssues,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    if (modalRef.current) {
      const modalInstance = (window as any).bootstrap.Modal.getInstance(modalRef.current);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (modalRef.current) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      const modalElement = modalRef.current;
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();

      const handleHidden = () => {
        onClose();
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };

      modalElement.addEventListener('hidden.bs.modal', handleHidden);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusableElement = focusableElements[0] as HTMLElement;
          const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              event.preventDefault();
            }
          }
        } else if (event.key === 'Escape') {
          handleClose();
        }
      };

      modalElement.addEventListener('keydown', handleKeyDown);

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
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.dispose();
        }
      };
    }
  }, [isOpen, onClose, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-labelledby="publishConfirmationModalLabel" aria-modal="true" ref={modalRef}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="publishConfirmationModalLabel">Confirm Publish</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {validationIssues.length > 0 ? (
              <div className="alert alert-warning" role="alert">
                <p className="fw-bold">The following issues were found:</p>
                <ul>
                  {validationIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
                <p>Please review and fix them before publishing.</p>
              </div>
            ) : (
              <p>Publish content? Final accessibility checks will run.</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirm}
              disabled={validationIssues.length > 0} // Disable confirm if there are issues
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;
