'use client';

import React, { useEffect } from 'react';
import MediaUploader from './MediaUploader';
import AI_Toolbar from './AI_Toolbar';
import SEOPanel from './SEOPanel';
import { generateMockAISuggestions } from '@/lib/ai-suggestions';
import { useAISuggestions }m '@/contexts/AISuggestionContext';
import { useUndoRedo } from '@/contexts/UndoRedoContext';

interface EditorPanelProps {
  content: string;
  onContentChange: (content: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ content, onContentChange }) => {
  const { addSuggestion } = useAISuggestions();
  const { addChange } = useUndoRedo();

  // Add content to undo/redo history when it changes
  useEffect(() => {
    addChange(content);
  }, [content, addChange]);

  const handleGenerateSuggestions = () => {
    const suggestions = generateMockAISuggestions(content);
    suggestions.forEach(addSuggestion);
  };

  const isContentEmpty = content.trim() === '';

  return (
    <div className="card h-100">
      <div className="card-header">Editor</div>
      <div className="card-body d-flex flex-column">
        <div className="mb-3 flex-grow-1">
          <label htmlFor="contentEditor" className="form-label">Content</label>
          <textarea
            className={`form-control h-100 ${isContentEmpty ? 'is-invalid' : ''}`}
            id="contentEditor"
            rows={10}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          ></textarea>
          {isContentEmpty && (
            <div className="invalid-feedback d-block">
              Warning: Content is empty. Consider adding descriptive text for accessibility (e.g., alt text for images).
            </div>
          )}
        </div>
        <MediaUploader />
        <AI_Toolbar onGenerateSuggestions={handleGenerateSuggestions} />
        <SEOPanel />
      </div>
    </div>
  );
};

export default EditorPanel;
