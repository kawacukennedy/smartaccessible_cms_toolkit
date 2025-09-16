'use client';

import React, { useState, useEffect, useCallback } from 'react';
import BlockListPanel from './content-editor/BlockListPanel';
import EditorPanel from './content-editor/EditorPanel';
import EditorToolbar from './content-editor/EditorToolbar'; // Import EditorToolbar
import AIPanel from './content-editor/AIPanel'; // Import AIPanel
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { AISuggestion } from '@/types/ai-suggestion';
import { useNotifications } from '@/contexts/NotificationContext'; // Import useNotifications

const ContentEditor: React.FC = () => {
  const { currentContent, addChange, undo, redo } = useUndoRedo(); // Destructure undo and redo
  const { addNotification } = useNotifications();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false); // State for AI Panel visibility
  const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'queued' | 'running' | 'done' | 'failed'>('idle'); // AI Scan status for ContentEditor

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
    addChange(blockContent);
  };

  const handleApplyAISuggestion = (suggestion: AISuggestion) => {
    // For simplicity, let's just append the suggestion message to the content
    // In a real application, this would involve more sophisticated content manipulation
    const newContent = currentContent + '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    addChange(newContent);
  };

  const handleSave = () => {
    console.log('Saving content:', currentContent);
    // addNotification({ displayType: 'toast', style: 'info', message: 'Content save initiated.' }); // Handled by EditorToolbar now
    // In a real app, this would trigger an API call to save the content
  };

  const handleAISuggestionRequest = useCallback(() => {
    setAiScanStatus('queued');
    addNotification({ displayType: 'toast', style: 'info', message: 'AI suggestion request sent.' });
    // Simulate AI processing
    setTimeout(() => {
      setAiScanStatus('running');
      addNotification({ displayType: 'toast', style: 'info', message: 'Generating AI suggestions...' });
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        if (success) {
          setAiScanStatus('done');
          addNotification({ displayType: 'toast', style: 'success', message: 'AI suggestions generated!' });
        } else {
          setAiScanStatus('failed');
          addNotification({ displayType: 'toast', style: 'error', message: 'Failed to generate AI suggestions. Retry?' });
        }
        setTimeout(() => setAiScanStatus('idle'), 3000); // Reset status after 3 seconds
      }, 2000);
    }, 500);
  }, [addNotification]);

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

  // New useEffect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default browser shortcuts for common actions
      if (event.ctrlKey || event.metaKey) { // Ctrl for Windows/Linux, Meta for Mac
        switch (event.key) {
          case 's': // Ctrl+S or Cmd+S
            event.preventDefault();
            handleSave();
            break;
          case 'z': // Ctrl+Z or Cmd+Z
            event.preventDefault();
            undo();
            break;
          case 'Z': // Ctrl+Shift+Z or Cmd+Shift+Z
            event.preventDefault();
            redo();
            break;
          case 'k': // Ctrl+K or Cmd+K for search
            event.preventDefault();
            console.log('Search shortcut triggered');
            addNotification({ displayType: 'toast', style: 'info', message: 'Search triggered.' });
            // Implement search functionality here
            break;
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.altKey) {
        switch (event.key) {
          case 'p': // Ctrl+Alt+P or Cmd+Alt+P for publish
            event.preventDefault();
            handlePublish();
            break;
          case 'a': // Ctrl+Alt+A or Cmd+Alt+A for AI panel
            event.preventDefault();
            toggleAIPanel();
            break;
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') { // Ctrl+Shift+P or Cmd+Shift+P for command palette
        event.preventDefault();
        console.log('Command Palette shortcut triggered');
        addNotification({ displayType: 'toast', style: 'info', message: 'Command Palette triggered.' });
        // Implement command palette functionality here
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave, handlePublish, undo, redo, toggleAIPanel, addNotification]); // Dependencies for useEffect


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
          <AIPanel onApplySuggestion={handleApplyAISuggestion} onAIScanRequest={handleAISuggestionRequest} />
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
        onAIScanRequest={handleAISuggestionRequest}
      />
    </div>
  );
};


export default ContentEditor;
