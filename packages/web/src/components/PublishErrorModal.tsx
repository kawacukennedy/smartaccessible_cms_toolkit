'use client';

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PublishErrorModalProps {
  show: boolean;
  onClose: () => void;
  onRetry: () => void;
  errorMessage: string;
  errorLogs?: string;
}

const PublishErrorModal: React.FC<PublishErrorModalProps> = ({
  show,
  onClose,
  onRetry,
  errorMessage,
  errorLogs,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Publish Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-danger">An error occurred during publishing:</p>
        <p>{errorMessage}</p>
        {errorLogs && (
          <div className="mt-3 p-2 bg-light border rounded">
            <h6>Error Details:</h6>
            <pre className="text-muted small">{errorLogs}</pre>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="warning" onClick={onRetry}>
          Retry
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PublishErrorModal;
