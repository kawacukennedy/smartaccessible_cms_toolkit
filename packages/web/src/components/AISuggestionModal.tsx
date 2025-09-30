'use client';

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface AISuggestionModalProps {
  show: boolean;
  onClose: () => void;
  onApply: (suggestion: string) => void;
  onReject: () => void;
  suggestion: string;
  currentContent: string;
  previewContent: string;
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({
  show,
  onClose,
  onApply,
  onReject,
  suggestion,
  currentContent,
  previewContent,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>AI Suggestion Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Suggestion:</h6>
        <p>{suggestion}</p>

        <h6 className="mt-3">Current Content:</h6>
        <div className="p-2 border rounded bg-light mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <pre>{currentContent}</pre>
        </div>

        <h6>Preview with Fix:</h6>
        <div className="p-2 border rounded bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <pre>{previewContent}</pre>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onReject}>
          Reject
        </Button>
        <Button variant="primary" onClick={() => onApply(suggestion)}>
          Apply Fix
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AISuggestionModal;
