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
import ConflictResolutionModal from './ConflictResolutionModal';
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [serverContent, setServerContent] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'queued' | 'running' | 'done' | 'failed'>('idle');
  const { setSuggestions, applySuggestion, suggestions } = useAISuggestions();
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
    addChange(newContent, { type: 'ai-suggestion', payload: { id: suggestion.id, contentBefore, contentAfter: newContent } });
    completeStep('Use an AI suggestion');
    trackEvent('ai_applied', { suggestionType: suggestion.type, confidence: suggestion.confidence });
    applySuggestion(suggestion.id); // Remove from panel
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
    addChange(newContent, { type: 'ai-suggestion', payload: { id: suggestion.id, contentBefore, contentAfter: newContent } });
    completeStep('Use an AI suggestion');
    trackEvent('ai_applied', { suggestionType: suggestion.type, confidence: suggestion.confidence });
    applySuggestion(suggestion.id); // Remove from panel
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

  const commands = [
    { id: 'save', name: 'Save', action: handleSave },
    { id: 'publish', name: 'Publish', action: handlePublish },
    { id: 'toggle-preview', name: 'Toggle Preview', action: togglePreviewMode },
    { id: 'toggle-ai-panel', name: 'Toggle AI Panel', action: toggleAIPanel },
    { id: 'toggle-accessibility-panel', name: 'Toggle Accessibility Panel', action: toggleAccessibilityPanel },
    { id: 'toggle-media-library', name: 'Toggle Media Library', action: toggleMediaLibrary },
    { id: 'toggle-version-history', name: 'Toggle Version History', action: toggleVersionHistory },
    { id: 'undo', name: 'Undo', action: undo },
    { id: 'redo', name: 'Redo', action: redo },
  ];

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
        setIsCommandPaletteOpen(true);
        trackEvent('command_palette_shortcut');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave, handlePublish, undo, redo, toggleAIPanel, addNotification]); // Dependencies for useEffect

  return (
    <div>
      <h1>Content Editor Placeholder</h1>
    </div>
  );
};

export default ContentEditor;
