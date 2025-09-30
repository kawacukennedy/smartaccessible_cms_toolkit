'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import BlockListPanel from './content-editor/BlockListPanel';
import EditorPanel from './content-editor/EditorPanel';
import EditorToolbar from './content-editor/EditorToolbar'; // Import EditorToolbar
import LivePreviewPanel from './content-editor/LivePreviewPanel';
import AIPanel from './content-editor/AIPanel'; // Import AIPanel
import AccessibilityDashboard from './content-editor/AccessibilityDashboard'; // Import AccessibilityDashboard
import MediaLibrary from './content-editor/MediaLibrary'; // Import MediaLibrary
import PublishConfirmationModal from './PublishConfirmationModal'; // Import PublishConfirmationModal
import VersionHistoryPanel from './VersionHistoryPanel'; // Import VersionHistoryPanel
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { AISuggestion } from '@/types/ai-suggestion';
import { useNotifications } from '@/contexts/NotificationContext'; // Import useNotifications
import { useOnboarding } from '@/contexts/OnboardingContext'; // Import useOnboarding

const ContentEditor: React.FC = () => {
  const { currentContent, addChange, undo, redo } = useUndoRedo(); // Destructure undo and redo
  const { addNotification } = useNotifications();
  const { completeStep } = useOnboarding();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false); // State for AI Panel visibility
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'queued' | 'running' | 'done' | 'failed'>('idle'); // AI Scan status for ContentEditor
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const activeScroller = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedAddChange = useCallback(debounce((newContent: string) => {
    addChange(newContent);
  }, 200), [addChange]); // Debounce for 200ms

  const handleScroll = (source: 'editor' | 'preview', percentage: number) => {
    if (activeScroller.current && activeScroller.current !== source) {
      return;
    }

    activeScroller.current = source;
    setScrollPercentage(percentage);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      activeScroller.current = null;
    }, 150);
  };

  // Initialize content in UndoRedoContext if it's empty
  useEffect(() => {
    if (currentContent === '') {
      addChange(''); // Add an initial empty state
    }
  }, [currentContent, addChange]);

  const toggleAIPanel = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
    setIsAccessibilityPanelOpen(false);
    setIsMediaLibraryOpen(false);
    setIsVersionHistoryOpen(false);
  };

  const toggleAccessibilityPanel = () => {
    setIsAccessibilityPanelOpen(!isAccessibilityPanelOpen);
    setIsAIPanelOpen(false);
    setIsMediaLibraryOpen(false);
    setIsVersionHistoryOpen(false);
  };

  const toggleMediaLibrary = () => {
    setIsMediaLibraryOpen(!isMediaLibraryOpen);
    setIsAIPanelOpen(false);
    setIsAccessibilityPanelOpen(false);
    setIsVersionHistoryOpen(false);
    completeStep('Explore the media library');
  };

  const toggleVersionHistory = () => {
    setIsVersionHistoryOpen(!isVersionHistoryOpen);
    setIsAIPanelOpen(false);
    setIsAccessibilityPanelOpen(false);
    setIsMediaLibraryOpen(false);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    completeStep('Preview your content');
  };

  const handleBlockSelect = (blockContent: string) => {
    addChange(blockContent);
    completeStep('Create your first block');
  };

  const handleApplyAISuggestion = (suggestion: AISuggestion) => {
    // For simplicity, let's just append the suggestion message to the content
    // In a real application, this would involve more sophisticated content manipulation
    const newContent = currentContent + '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    addChange(newContent);
    completeStep('Use an AI suggestion');
  };

  const handleSave = () => {
    console.log('Saving content:', currentContent);
    // addNotification({ displayType: 'toast', style: 'info', message: 'Content save initiated.' }); // Handled by EditorToolbar now
    // In a real app, this would trigger an API call to save the content
  };

  const handleAISuggestionRequest = () => {
    addNotification({ displayType: 'toast', style: 'info', message: 'AI Suggestion requested.' });
    // In a real app, this would trigger an AI scan
  };

  const runValidationChecks = (): string[] => {
    const issues: string[] = [];
    if (currentContent.length < 10) {
      issues.push('Content is too short.');
    }
    if (!currentContent.includes('title')) {
      issues.push('Missing a clear title.');
    }
    // Mock accessibility checks
    if (currentContent.includes('img') && !currentContent.includes('alt=')) {
      issues.push('Image missing alt text.');
    }
    if (currentContent.includes('low contrast')) {
      issues.push('Potential low contrast text detected.');
    }
    return issues;
  };

  const handlePublish = () => {
    const issues = runValidationChecks();
    setValidationIssues(issues);
    setIsPublishModalOpen(true);
  };

  const handleConfirmPublish = () => {
    console.log('Publishing content confirmed:', currentContent);
    addNotification({ displayType: 'toast', style: 'info', message: 'Publishing content...' });
    // Simulate API call for publishing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        addNotification({ displayType: 'toast', style: 'success', message: 'Content published successfully!' });
        completeStep('Publish your first piece');
      } else {
        addNotification({ displayType: 'toast', style: 'error', message: 'Publish failed. Retry?' });
      }
      setIsPublishModalOpen(false);
    }, 2000);
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
        onPreview={togglePreviewMode}
        onPublish={handlePublish} // Pass handlePublish to EditorToolbar
        isPreviewMode={isPreviewMode}
        onToggleAccessibilityPanel={toggleAccessibilityPanel}
        onToggleMediaLibrary={toggleMediaLibrary}
        onToggleVersionHistory={toggleVersionHistory}
      />
      {isPreviewMode ? (
        <LivePreviewPanel content={currentContent} scrollPercentage={scrollPercentage} onScroll={(p) => handleScroll('preview', p)} />
      ) : (
        <div className="row h-100">
          <div className="col-md-3 h-100">
            <BlockListPanel onBlockSelect={handleBlockSelect} />
          </div>
          <div className="col-md-6 h-100">
            <EditorPanel content={currentContent} onContentChange={debouncedAddChange} onScroll={(p) => handleScroll('editor', p)} />
          </div>
          {/* AI Panel & Accessibility Dashboard - visible on desktop */}
          <div className="col-md-3 h-100 d-none d-lg-block">
            {isAIPanelOpen && (
                <AIPanel onApplySuggestion={handleApplyAISuggestion} onAIScanRequest={handleAISuggestionRequest} />
            )}
            {isAccessibilityPanelOpen && (
                <AccessibilityDashboard />
            )}
            {isMediaLibraryOpen && (
                <MediaLibrary />
            )}
            {isVersionHistoryOpen && (
                <VersionHistoryPanel />
            )}
          </div>
        </div>
      )}

      {/* AI Panel Toggle Button for mobile/tablet */}
      {!isPreviewMode && (
        <>
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
        </>
      )}

      <PublishConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        validationIssues={validationIssues}
      />
    </div>
  );
};


export default ContentEditor;
