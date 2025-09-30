'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

interface ConflictResolutionModalProps {
  show: boolean;
  onClose: () => void;
  onResolve: (resolution: 'yours' | 'theirs' | 'merged', mergedContent?: string) => void;
  yourContent: string;
  theirContent: string;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  show,
  onClose,
  onResolve,
  yourContent,
  theirContent,
}) => {
  const [mergedContent, setMergedContent] = useState(yourContent);

  useEffect(() => {
    if (show) {
      setMergedContent(yourContent); // Reset merged content when modal opens
    }
  }, [show, yourContent]);

  const handleKeepYours = () => {
    onResolve('yours', yourContent);
  };

  const handleKeepTheirs = () => {
    onResolve('theirs', theirContent);
  };

  const handleMergeManually = () => {
    onResolve('merged', mergedContent);
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered backdrop="static" keyboard={false}> {/* Prevent closing without resolution */}
      <Modal.Header>
        <Modal.Title>Conflict Detected!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>It looks like there's a conflict between your local changes and the server's version. Please choose how to resolve it.</p>
        <Row>
          <Col md={6}>
            <h5>Your Version</h5>
            <div className="border p-3 bg-light" style={{ height: '300px', overflowY: 'auto' }}>
              <pre>{yourContent}</pre>
            </div>
            <Button variant="success" className="mt-2 w-100" onClick={handleKeepYours}>
              Keep Your Version
            </Button>
          </Col>
          <Col md={6}>
            <h5>Their Version</h5>
            <div className="border p-3 bg-light" style={{ height: '300px', overflowY: 'auto' }}>
              <pre>{theirContent}</pre>
            </div>
            <Button variant="warning" className="mt-2 w-100" onClick={handleKeepTheirs}>
              Keep Their Version
            </Button>
          </Col>
        </Row>
        <h5 className="mt-4">Manually Merge</h5>
        <Form.Control
          as="textarea"
          rows={10}
          value={mergedContent}
          onChange={(e) => setMergedContent(e.target.value)}
          className="font-monospace"
        />
        <Button variant="primary" className="mt-2 w-100" onClick={handleMergeManually}>
          Apply Manual Merge
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel (Discard local changes)
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConflictResolutionModal;