'use client';

import React from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';

interface AI_ToolbarProps {
  onGenerateSuggestions: () => void;
}

const AI_Toolbar: React.FC<AI_ToolbarProps> = ({ onGenerateSuggestions }) => {
  const { canUndo, canRedo, undo, redo } = useUndoRedo();

  return (
    <div className="mb-3">
      <h5>AI Actions</h5>
      <button className="btn btn-outline-primary me-2" onClick={onGenerateSuggestions}>Generate Suggestions</button>
      <button className="btn btn-outline-secondary me-2">Check Accessibility</button>
      <button className="btn btn-info me-2" onClick={undo} disabled={!canUndo}>Undo</button>
      <button className="btn btn-info" onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
};

export default AI_Toolbar;
