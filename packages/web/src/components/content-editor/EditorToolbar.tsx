'use client';

import React, { useState } from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface EditorToolbarProps {
  onSave: () => void;
  onAISuggestion: () => void;
  onPreview: () => void;
  onPublish: () => void; // Added onPublish prop
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onSave, onAISuggestion, onPreview, onPublish }) => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { addNotification } = useNotifications();
  const [hasValidationErrors, setHasValidationErrors] = useState(false); // Placeholder for validation errors
  const [isPublishInProgress, setIsPublishInProgress] = useState(false); // Placeholder for publish in progress

  const handleSave = () => {
    onSave();
    addNotification({ displayType: 'toast', style: 'success', message: 'Content saved successfully!' });
  };

  const handleAISuggestion = () => {
    onAISuggestion();
    addNotification({ displayType: 'toast', style: 'info', message: 'Generating AI suggestions...' });
  };

  const handlePreview = () => {
    onPreview();
    addNotification({ displayType: 'toast', style: 'info', message: 'Opening preview...' });
  };

  const handlePublish = () => {
    setIsPublishInProgress(true); // Simulate publish in progress
    onPublish();
    addNotification({ displayType: 'toast', style: 'info', message: 'Publishing content...' });
    setTimeout(() => {
      setIsPublishInProgress(false);
      addNotification({ displayType: 'toast', style: 'success', message: 'Content published successfully!' });
    }, 2000); // Simulate publish delay
  };

  const isPublishDisabled = hasValidationErrors || isPublishInProgress;

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button className="btn btn-outline-secondary me-2" onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button className="btn btn-outline-secondary" onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
      <div>
        <button className="btn btn-outline-primary me-2" onClick={handlePreview}>
          Preview
        </button>
        <button className="btn btn-success me-2" onClick={handleSave}>
          Save
        </button>
        <button className="btn btn-info me-2" onClick={handleAISuggestion}>
          AI Suggestion
        </button>
        <button className="btn btn-primary" onClick={handlePublish} disabled={isPublishDisabled} title="Publish (Ctrl+Alt+P)">
          <i className="bi bi-upload"></i> Publish
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
