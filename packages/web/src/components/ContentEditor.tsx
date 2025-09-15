'use client';

import React, { useState, useEffect } from 'react';
import BlockListPanel from './content-editor/BlockListPanel';
import EditorPanel from './content-editor/EditorPanel';
import AISuggestionsPanel from './content-editor/AISuggestionsPanel';
import LivePreviewPanel from './content-editor/LivePreviewPanel';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { AISuggestion } from '@/types/ai-suggestion';

const ContentEditor: React.FC = () => {
  const { currentContent, addChange } = useUndoRedo();

  // Initialize content in UndoRedoContext if it's empty
  useEffect(() => {
    if (currentContent === '') {
      addChange(''); // Add an initial empty state
    }
  }, [currentContent, addChange]);

  const handleBlockSelect = (blockContent: string) => {
    addChange(blockContent); // Update content in UndoRedoContext
  };

  const handleApplyAISuggestion = (suggestion: AISuggestion) => {
    // For simplicity, let's just append the suggestion message to the content
    // In a real application, this would involve more sophisticated content manipulation
    const newContent = currentContent + '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    addChange(newContent);
  };

  return (
    <div className="container-fluid h-100 py-3">
      <div className="row h-100">
        <div className="col-md-3 h-100">
          <BlockListPanel onBlockSelect={handleBlockSelect} />
        </div>
        <div className="col-md-6 h-100">
          <EditorPanel content={currentContent} onContentChange={addChange} />
        </div>
        <div className="col-md-3 h-100">
          <div className="row h-50 mb-3">
            <AISuggestionsPanel onApplySuggestion={handleApplyAISuggestion} />
          </div>
          <div className="row h-50">
            <LivePreviewPanel content={currentContent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
