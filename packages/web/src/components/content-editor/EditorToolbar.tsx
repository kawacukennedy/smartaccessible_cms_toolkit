'use client';

import React, { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface EditorToolbarProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  onToggleAIAssist: (enabled: boolean) => void;
  isAIAssistEnabled: boolean;
  accessibilityScore: number; // Score from 0-100
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSaveDraft,
  onPublish,
  onToggleAIAssist,
  isAIAssistEnabled,
  accessibilityScore,
}) => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { addNotification } = useNotifications();
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Determine accessibility badge color
  const getAccessibilityBadgeClass = (score: number) => {
    if (score < 50) return 'bg-danger';
    if (score < 80) return 'bg-warning';
    return 'bg-success';
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSaveDraft();
    addNotification({
      displayType: 'toast',
      style: 'success',
      message: `Draft saved successfully at ${new Date().toLocaleTimeString()}`,
    });
    setIsSaving(false);
  };

  const handlePublish = async () => {
    setShowPublishConfirm(false);
    setIsPublishing(true);
    // Simulate API call
    try {
      await new Promise((resolve, reject) => setTimeout(() => {
        // Simulate a random publish error for demonstration
        if (Math.random() > 0.8) {
          reject(new Error("Publish failed: Network error."));
        } else {
          resolve(true);
        }
      }, 1500));
      onPublish();
      addNotification({
        displayType: 'toast',
        style: 'success',
        message: 'Content published successfully!',
      });
    } catch (error: any) {
      addNotification({
        displayType: 'modal',
        style: 'error',
        message: `Publish failed: ${error.message}. Please try again.`, // Use modal for errors
        title: 'Publish Error',
      });
    }
    setIsPublishing(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        canUndo && undo();
      }
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        canRedo && redo();
      }
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSaveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, undo, canRedo, redo, onSaveDraft]);

  return (
    <div className="editor-toolbar d-flex justify-content-center p-2 bg-light border-bottom">
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-undo">Undo (Ctrl+Z)</Tooltip>}>
        <Button variant="outline-secondary" onClick={undo} disabled={!canUndo} className="me-2">
          <i className="bi bi-arrow-counterclockwise"></i>
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-redo">Redo (Ctrl+Y)</Tooltip>}>
        <Button variant="outline-secondary" onClick={redo} disabled={!canRedo} className="me-4">
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-save">Save Draft (Ctrl+S)</Tooltip>}>
        <Button variant="success" onClick={handleSaveDraft} disabled={isSaving} className="me-2">
          {isSaving ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-save"></i>
          )}
          <span className="ms-2">Save Draft</span>
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-publish">Publish</Tooltip>}>
        <Button variant="primary" onClick={() => setShowPublishConfirm(true)} disabled={isPublishing} className="me-4">
          {isPublishing ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-send"></i>
          )}
          <span className="ms-2">Publish</span>
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-accessibility">Accessibility Score</Tooltip>}>
        <Button variant="outline-info" className="me-2">
          <i className="bi bi-universal-access"></i>
          <span className={`badge ${getAccessibilityBadgeClass(accessibilityScore)} ms-2`}>{accessibilityScore}</span>
        </Button>
      </OverlayTrigger>

      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-ai-assist">Toggle AI Assist</Tooltip>}>
        <Button
          variant={isAIAssistEnabled ? 'primary' : 'outline-primary'}
          onClick={() => onToggleAIAssist(!isAIAssistEnabled)}
        >
          <i className="bi bi-robot"></i>
          <span className="ms-2">AI Assist</span>
        </Button>
      </OverlayTrigger>

      {/* Publish Confirmation Modal */}
      <Modal show={showPublishConfirm} onHide={() => setShowPublishConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Publish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to publish this content live?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPublishConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePublish}>
            Publish Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditorToolbar;