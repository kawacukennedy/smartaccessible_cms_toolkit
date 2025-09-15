'use client';

import React from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';

interface EditorToolbarProps {
  onSave: () => void;
  onAISuggestion: () => void;
  onPreview: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onSave, onAISuggestion, onPreview }) => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const { addNotification } = useNotifications();

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
        <button className="btn btn-info" onClick={handleAISuggestion}>
          AI Suggestion
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
