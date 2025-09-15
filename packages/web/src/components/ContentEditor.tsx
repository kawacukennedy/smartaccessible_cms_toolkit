'use client';

import React, { useState, useEffect } from 'react';
import BlockListPanel from './content-editor/BlockListPanel';
import EditorPanel from './content-editor/EditorPanel';
import EditorToolbar from './content-editor/EditorToolbar'; // Import EditorToolbar
import AIPanel from './content-editor/AIPanel'; // Import AIPanel
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { AISuggestion } from '@/types/ai-suggestion';
import { useNotifications } from '@/contexts/NotificationContext'; // Import useNotifications

const ContentEditor: React.FC = () => {
  const { currentContent, addChange } = useUndoRedo();
  const { addNotification } = useNotifications();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false); // State for AI Panel visibility

  // Initialize content in UndoRedoContext if it's empty
  useEffect(() => {
    if (currentContent === '') {
      addChange(''); // Add an initial empty state
    }
  }, [currentContent, addChange]);

  const toggleAIPanel = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
  };

  const handleBlockSelect = (blockContent: string) => {
    addChange(blockContent); // Update content in UndoRedoContext
  };

  const handleApplyAISuggestion = (suggestion: AISuggestion) => {
    // For simplicity, let's just append the suggestion message to the content
    // In a real application, this would involve more sophisticated content manipulation
    const newContent = currentContent + '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    addChange(newContent);
  };

  const handleSave = () => {
    console.log('Saving content:', currentContent);
    addNotification({ displayType: 'toast', style: 'info', message: 'Content save initiated.' });
    // In a real app, this would trigger an API call to save the content
  };

  const handleAISuggestionRequest = () => {
    console.log('Requesting AI suggestions for:', currentContent);
    addNotification({ displayType: 'toast', style: 'info', message: 'AI suggestion request sent.' });
    // In a real app, this would trigger an API call for AI suggestions
  };

  const handlePreview = () => {
    console.log('Opening preview for:', currentContent);
    addNotification({ displayType: 'toast', style: 'info', message: 'Preview opened.' });
    // In a real app, this would open a preview in a new tab or modal
  };

  const handlePublish = () => {
    console.log('Publishing content:', currentContent);
    addNotification({ displayType: 'toast', style: 'info', message: 'Publishing content initiated.' });
    // In a real app, this would trigger the publish flow (validation, confirmation, API call)
  };

  return (
    <div className="container-fluid h-100 py-3">
      <EditorToolbar
        onSave={handleSave}
        onAISuggestion={handleAISuggestionRequest}
        onPreview={handlePreview}
        onPublish={handlePublish} // Pass handlePublish to EditorToolbar
      />
      <div className="row h-100">
        <div className="col-md-3 h-100">
          <BlockListPanel onBlockSelect={handleBlockSelect} />
        </div>
        <div className="col-md-6 h-100">
          <EditorPanel content={currentContent} onContentChange={addChange} />
        </div>
        {/* AI Panel - visible on desktop, toggled on mobile/tablet */}
        <div className="col-md-3 h-100 d-none d-lg-block"> {/* Hide on md and below, show on lg and above */}
          <AIPanel onApplySuggestion={handleApplyAISuggestion} />
        </div>
      </div>

      {/* AI Panel Toggle Button for mobile/tablet */}
      <button
        className="btn btn-primary d-lg-none position-fixed bottom-0 end-0 m-3" // Show on md and below, hide on lg and above
        type="button"
        onClick={toggleAIPanel}
      >
        Toggle AI Panel
      </button>

      {/* AI Panel for mobile/tablet (rendered as offcanvas/bottom drawer) */}
      {/* This will be handled within AIPanel.tsx using props */}
      <AIPanel
        onApplySuggestion={handleApplyAISuggestion}
        isOpen={isAIPanelOpen}
        togglePanel={toggleAIPanel}
        isResponsive={true} // Indicate that it's being rendered responsively
      />
    </div>
  );
};


export default ContentEditor;
