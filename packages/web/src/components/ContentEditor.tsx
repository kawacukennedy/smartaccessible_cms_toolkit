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
import { useAISuggestions } from '@/contexts/AISuggestionContext';
import { useOnboarding } from '@/contexts/OnboardingContext'; // Import useOnboarding
import { trackEvent } from '@/lib/telemetry';

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
  const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'queued' | 'running' | 'done' | 'failed'>('idle');
  const { setSuggestions } = useAISuggestions();
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const activeScroller = useRef<'editor' | 'preview' | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Simulate AI scanning process
  useEffect(() => {
    if (aiScanStatus === 'queued') {
      setAiScanStatus('running');
      // Simulate API call for AI scan
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          setAiScanStatus('done');
          // Mock AI suggestions
          setSuggestions([
            { id: '1', type: 'accessibility', message: 'Consider adding alt text to images.', recommendation: 'Add descriptive alt text.', confidence: 85 },
            { id: '2', type: 'seo', message: 'Improve keyword density.', recommendation: 'Include relevant keywords naturally.', confidence: 70 },
            { id: '3', type: 'content', message: 'Break long paragraphs into shorter ones.', recommendation: 'Use shorter paragraphs for readability.', confidence: 90 },
            { id: '4', type: 'style', message: 'Check for passive voice.', recommendation: 'Rewrite sentences in active voice.', confidence: 40 },
          ]);
          addNotification({ displayType: 'toast', style: 'AI', message: 'AI scan complete. Suggestions ready.' });
        } else {
          setAiScanStatus('failed');
          addNotification({ displayType: 'toast', style: 'error', message: 'AI scan failed. Retry?' });
          trackEvent('error', { type: 'ai_scan_failed' });
        }
      }, 1500);
    }
  }, [aiScanStatus, setSuggestions, addNotification]);

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
    trackEvent('content_save', { type: 'autosave' });
    // Trigger AI scan on content change
    setAiScanStatus('queued');
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
    trackEvent('preview', { mode: isPreviewMode ? 'exit' : 'enter' });
  };

  const handleBlockSelect = (blockContent: string) => {
    addChange(blockContent);
    completeStep('Create your first block');
    trackEvent('content_save', { type: 'block_select' });
  };

  const handleApplyAISuggestion = (suggestion: AISuggestion) => {
    const contentBefore = currentContent;
    const newContent = currentContent + '\n\n' + `[AI Suggestion Applied: ${suggestion.message}]`;
    addChange(newContent);
    completeStep('Use an AI suggestion');
    trackEvent('ai_applied', { suggestionType: suggestion.type, confidence: suggestion.confidence });
    // Pass contentBefore and newContent to AISuggestionContext's applySuggestion
    // This is a conceptual call, as AISuggestionContext doesn't directly modify content
    // but it could be used to record the change for undo/redo purposes.
    // For now, we'll just call the applySuggestion from AISuggestionContext to remove it from the panel.
    // The actual content change is handled by addChange.
    applySuggestion(suggestion.id, contentBefore, newContent);
  };

  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');

  const handleSave = () => {
    setAutosaveStatus('saving');
    addNotification({ displayType: 'toast', style: 'info', message: 'Saving draft…' });
    console.log('Saving content:', currentContent);
    // Simulate API call for saving
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        setAutosaveStatus('saved');
        addNotification({ displayType: 'toast', style: 'success', message: 'Draft saved' });
        trackEvent('content_save', { type: 'manual' });
      } else {
        setAutosaveStatus('failed');
        addNotification({ displayType: 'toast', style: 'error', message: 'Save failed. Retry?' });
        trackEvent('error', { type: 'manual_save_failed' });
      }
    }, 1000);
  };

  const handleAISuggestionRequest = () => {
    addNotification({ displayType: 'toast', style: 'info', message: 'AI Suggestion requested.' });
    // In a real app, this would trigger an AI scan
  };

  const runValidationChecks = (): string[] => {
    trackEvent('validation', { type: 'pre_publish' });
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
    addNotification({ displayType: 'toast', style: 'info', message: 'Publish content? Final accessibility checks will run.' });
  };

  const handleConfirmPublish = () => {
    console.log('Publishing content confirmed:', currentContent);
    addNotification({ displayType: 'toast', style: 'info', message: 'Publishing content...' });
    // Simulate API call for publishing
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      if (success) {
        addNotification({ displayType: 'toast', style: 'success', message: 'Content published successfully.' });
        completeStep('Publish your first piece');
        trackEvent('publish', { status: 'success' });
      } else {
        addNotification({ displayType: 'toast', style: 'error', message: 'Publish failed. Retry?' });
        trackEvent('error', { type: 'publish_failed' });
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
            trackEvent('undo');
            break;
          case 'Z': // Ctrl+Shift+Z or Cmd+Shift+Z
            event.preventDefault();
            redo();
            trackEvent('redo');
            break;
          case 'k': // Ctrl+K or Cmd+K for search
            event.preventDefault();
            addNotification({ displayType: 'toast', style: 'info', message: 'Search functionality triggered (placeholder).' });
            // TODO: Implement actual search functionality here
            trackEvent('search_shortcut');
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
        addNotification({ displayType: 'toast', style: 'info', message: 'Command Palette triggered (placeholder).' });
        // TODO: Implement actual command palette functionality here
        trackEvent('command_palette_shortcut');
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
            <EditorPanel content={currentContent} onContentChange={debouncedAddChange} onScroll={(p) => handleScroll('editor', p)} aiSuggestions={suggestions} />
          </div>
          {/* AI Panel & Accessibility Dashboard - visible on desktop */}
          <div className="col-md-3 h-100 d-none d-lg-block">
            {isAIPanelOpen && (
                <AIPanel onApplySuggestion={handleApplyAISuggestion} onAIScanRequest={handleAISuggestionRequest} contentBefore={currentContent} contentAfter={currentContent} />
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
