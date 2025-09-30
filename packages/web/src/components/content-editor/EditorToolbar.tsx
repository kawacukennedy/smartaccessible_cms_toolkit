'use client';

import React from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';

interface EditorToolbarProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  accessibilityScore: number;
  isAiAssistEnabled: boolean;
  toggleAiAssist: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSaveDraft,
  onPublish,
  accessibilityScore,
  isAiAssistEnabled,
  toggleAiAssist,
}) => {
  const { canUndo, canRedo, undo, redo } = useUndoRedo();

  const getAccessibilityBadgeColor = (score: number) => {
    if (score < 50) return 'danger';
    if (score < 80) return 'warning';
    return 'success';
  };

  return (
    <div className="d-flex flex-wrap align-items-center mb-3">
      {/* Undo/Redo */}
      <button className="btn btn-outline-secondary me-2" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
        <i className="bi bi-arrow-counterclockwise"></i> Undo
      </button>
      <button className="btn btn-outline-secondary me-2" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
        <i className="bi bi-arrow-clockwise"></i> Redo
      </button>

      {/* Save/Publish */}
      <button className="btn btn-success me-2" onClick={onSaveDraft} title="Save Draft">
        <i className="bi bi-save"></i> Save Draft
      </button>
      <button className="btn btn-primary me-2" onClick={onPublish} title="Publish">
        <i className="bi bi-cloud-upload"></i> Publish
      </button>

      {/* Accessibility Score */}
      <span className={`badge bg-${getAccessibilityBadgeColor(accessibilityScore)} me-2`} title="Accessibility Score">
        Accessibility: {accessibilityScore}%
      </span>

      {/* AI Assist Toggle */}
      <button
        className={`btn me-2 ${isAiAssistEnabled ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={toggleAiAssist}
        title="Toggle AI Assist"
      >
        <i className="bi bi-robot"></i> AI Assist {isAiAssistEnabled ? 'On' : 'Off'}
      </button>
    </div>
  );
};

export default EditorToolbar;
