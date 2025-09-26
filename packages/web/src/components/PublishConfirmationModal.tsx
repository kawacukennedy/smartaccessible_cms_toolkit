import React from 'react';

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
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-labelledby="publishConfirmationModalLabel" aria-modal="true">
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
              <p>Are you sure you want to publish this content? Final accessibility checks will run.</p>
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
