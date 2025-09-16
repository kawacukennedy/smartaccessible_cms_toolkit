'use client';

import React, { useState, useEffect } from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface EditorToolbarProps {
  onSave: () => void;
  onAISuggestion: () => void;
  onPreview: () => void;
  onPublish: () => void; // Added onPublish prop
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onSave, onAISuggestion, onPreview, onPublish }) => {
  const { undo, redo, canUndo, canRedo, feedbackMessage } = useUndoRedo(); // Get feedbackMessage
  const { addNotification } = useNotifications();
  const [hasValidationErrors, setHasValidationErrors] = useState(false); // Placeholder for validation errors
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle'); // Autosave status
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'failed'>('idle'); // Publish status

  const handleSave = () => {
    setAutosaveStatus('saving');
    onSave();
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        setAutosaveStatus('saved');
        addNotification({ displayType: 'toast', style: 'success', message: 'Content saved successfully!' });
      } else {
        setAutosaveStatus('failed');
        addNotification({ displayType: 'toast', style: 'error', message: 'Save failed. Please try again.' });
      }
      setTimeout(() => setAutosaveStatus('idle'), 3000); // Reset status after 3 seconds
    }, 1500);
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
    setPublishStatus('publishing');
    onPublish();
    addNotification({ displayType: 'toast', style: 'info', message: 'Publishing content...' });
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        setPublishStatus('success');
        addNotification({ displayType: 'toast', style: 'success', message: 'Content published successfully!' });
      } else {
        setPublishStatus('failed');
        addNotification({ displayType: 'toast', style: 'error', message: 'Publish failed. Retry?' });
      }
      setTimeout(() => setPublishStatus('idle'), 3000); // Reset status after 3 seconds
    }, 2000);
  };

  const isPublishDisabled = hasValidationErrors || publishStatus === 'publishing';

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <button className="btn btn-outline-secondary me-2" onClick={undo} disabled={!canUndo} aria-label="Undo last action">
          Undo
        </button>
        <button className="btn btn-outline-secondary" onClick={redo} disabled={!canRedo} aria-label="Redo last action">
          Redo
        </button>
        {feedbackMessage && (
          <div role="status" aria-live="polite" className="ms-3 text-info">
            {feedbackMessage}
          </div>
        )}
      </div>
      <div className="d-flex align-items-center">
        {autosaveStatus !== 'idle' && (
          <div role="status" aria-live="polite" className="me-3 text-muted">
            {autosaveStatus === 'saving' && 'Saving draft…'}
            {autosaveStatus === 'saved' && 'Draft saved'}
            {autosaveStatus === 'failed' && 'Save failed. Retry?'}
          </div>
        )}
        {publishStatus !== 'idle' && (
          <div role="status" aria-live="polite" className="me-3 text-muted">
            {publishStatus === 'publishing' && 'Publishing content…'}
            {publishStatus === 'success' && 'Content published successfully.'}
            {publishStatus === 'failed' && 'Publish failed. Retry?'}
          </div>
        )}
        <button className="btn btn-outline-primary me-2" onClick={handlePreview} aria-label="Preview content">
          Preview
        </button>
        <button className="btn btn-success me-2" onClick={handleSave} aria-label="Save draft">
          Save Draft
        </button>
        <button className="btn btn-info me-2" onClick={handleAISuggestion} aria-label="Get AI suggestions">
          AI Suggestion
        </button>
        <button className="btn btn-primary" onClick={handlePublish} disabled={isPublishDisabled} title="Publish (Ctrl+Alt+P)" aria-label="Publish content">
          <i className="bi bi-upload"></i> Publish
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;