'use client';

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface PublishConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PublishConfirmationModal: React.FC<PublishConfirmationModalProps> = ({
  show,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Publish</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to publish this content live?</p>
        <p>This action will make your changes visible to the public.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Publish Live
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PublishConfirmationModal;