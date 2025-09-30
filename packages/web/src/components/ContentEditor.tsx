import React, { useState, useEffect, useCallback, useRef } from 'react';
import BlockEditorCanvas from './content-editor/BlockEditorCanvas';
import EditorToolbar from './content-editor/EditorToolbar';
import PreviewPane from './content-editor/PreviewPane';
import PublishConfirmationModal from './PublishConfirmationModal';
import VersionHistoryPanel from './VersionHistoryPanel';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { AISuggestion } from '@/types/ai-suggestion';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAISuggestions } from '@/contexts/AISuggestionContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import ConflictResolutionModal from './ConflictResolutionModal';
import { trackEvent } from '@/lib/telemetry';
import dynamic from 'next/dynamic';
import PublishErrorModal from '@/components/PublishErrorModal';
import { getContentFromIndexedDB, saveContentToIndexedDB, getAllOfflineContent, updateContentStatusInIndexedDB, deleteContentFromIndexedDB } from '@/lib/db/indexedDB';
import { useOffline } from '@/contexts/OfflineContext'; // Import useOffline

const ContentEditor: React.FC = () => {
  const { currentContent, addChange, undo, redo } = useUndoRedo();
  const { addNotification } = useNotifications();
  const { isOffline, pendingSyncCount, setPendingSyncCount, setIsOffline } = useOffline(); // Use useOffline hook

  const [accessibilityScore, setAccessibilityScore] = useState(85); // Mock score
  const [isAiAssistEnabled, setIsAiAssistEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [publishError, setPublishError] = useState<{ message: string; logs?: string } | null>(null);
  const [hasAiSuggestions, setHasAiSuggestions] = useState(false); // New state for AI suggestions

  // Mock content for preview panes
  const [draftContent, setDraftContent] = useState('<p>This is your <b>draft</b> content.</p>');
  const [publishedContent, setPublishedContent] = useState('<p>This is the <i>last published</i> content.</p>');

  const [initialEditorContent, setInitialEditorContent] = useState<string | null>(null);

  // Load content from IndexedDB on mount and update pending sync count
  useEffect(() => {
    const loadContent = async () => {
      const storedContent = await getContentFromIndexedDB('editor-content');
      if (storedContent) {
        setInitialEditorContent(storedContent.content);
        addNotification({
          displayType: 'toast',
          style: 'info',
          message: 'Loaded unsaved changes from offline storage.',
        });
      }
      const allOffline = await getAllOfflineContent();
      setPendingSyncCount(allOffline.filter(item => item.status === 'pending_sync').length);
    };
    loadContent();
  }, [addNotification, setPendingSyncCount]);

  // Auto-sync changes when back online
  useEffect(() => {
    if (!isOffline && pendingSyncCount > 0) {
      const syncChanges = async () => {
        const pending = await getAllOfflineContent();
        for (const item of pending.filter(item => item.status === 'pending_sync')) {
          console.log('Attempting to sync:', item.id);
          // Simulate API call to publish queued content
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            addNotification({
              displayType: 'toast',
              style: 'success',
              message: `Synced queued content: ${item.id}`,
            });
            await deleteContentFromIndexedDB(item.id); // Remove after successful sync
            setPendingSyncCount(prev => prev - 1);
          } catch (error) {
            console.error('Failed to sync queued content:', item.id, error);
            addNotification({
              displayType: 'toast',
              style: 'error',
              message: `Failed to sync ${item.id}. Will retry later.`,
            });
          }
        }
      };
      syncChanges();
    }
  }, [isOffline, pendingSyncCount, addNotification, setPendingSyncCount]);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    console.log('Saving draft:', currentContent);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const saveTime = new Date().toLocaleTimeString();
    addNotification({ displayType: 'toast', style: 'success', message: `Draft saved successfully at ${saveTime}!` });
    setIsSaving(false);
    setDraftContent(currentContent); // Update draft content for preview
  }, [currentContent, addNotification]);

  const handlePublish = useCallback(() => {
    setShowPublishConfirmation(true); // Show confirmation modal first
  }, []);

  const handleQueuePublish = useCallback(async () => {
    await saveContentToIndexedDB('editor-content', currentContent, 'pending_sync');
    setPendingSyncCount(prev => prev + 1);
  }, [currentContent, setPendingSyncCount]);

  const confirmPublish = useCallback(async () => {
    setShowPublishConfirmation(false);
    setIsPublishing(true);
    setPublishError(null); // Clear previous errors

    try {
      console.log('Publishing content:', currentContent);
      // Simulate API call with potential error
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          if (Math.random() > 0.8) { // 20% chance of error
            reject(new Error('Failed to connect to publishing service.'));
          }
          resolve(true);
        }, 2000)
      );
      addNotification({ displayType: 'toast', style: 'success', message: 'Content published successfully!' });
      setPublishedContent(currentContent); // Update published content for preview
      await deleteContentFromIndexedDB('editor-content'); // Clear from IndexedDB after successful publish
      setPendingSyncCount(prev => Math.max(0, prev - 1)); // Decrement if it was a pending sync
    } catch (error: any) {
      console.error('Publish error:', error);
      setPublishError({ message: error.message || 'Unknown error', logs: error.stack });
      addNotification({ displayType: 'toast', style: 'error', message: 'Failed to publish content.' });
    } finally {
      setIsPublishing(false);
    }
  }, [currentContent, addNotification, setPendingSyncCount]);

  const handleRetryPublish = useCallback(() => {
    setPublishError(null);
    confirmPublish(); // Retry publishing
  }, [confirmPublish]);

  const toggleAiAssist = useCallback(() => {
    setIsAiAssistEnabled((prev) => !prev);
    addNotification({ displayType: 'toast', style: 'info', message: `AI Assist ${isAiAssistEnabled ? 'disabled' : 'enabled'}.` });
  }, [isAiAssistEnabled, addNotification]);

  // Mock accessibility score update
  useEffect(() => {
    const interval = setInterval(() => {
      setAccessibilityScore(Math.floor(Math.random() * (95 - 70 + 1)) + 70); // Score between 70-95
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock AI suggestions availability
  useEffect(() => {
    // Simulate AI suggestions becoming available based on content
    setHasAiSuggestions(currentContent.includes('AI') || currentContent.includes('suggestion'));
  }, [currentContent]);

  return (
    <div className="d-flex flex-column h-100">
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onQueuePublish={handleQueuePublish}
        accessibilityScore={accessibilityScore}
        isAiAssistEnabled={isAiAssistEnabled}
        onToggleAIAssist={toggleAiAssist}
        isOffline={isOffline}
        pendingSyncCount={pendingSyncCount}
      />
      <div className="flex-grow-1 d-flex">
        <div className="flex-grow-1 p-3 border-end">
          <BlockEditorCanvas initialContent={initialEditorContent} />
        </div>
        <div className="p-3" style={{ width: '50%' }}>
          <PreviewPane draftContent={draftContent} publishedContent={publishedContent} />
        </div>
      </div>

      <PublishConfirmationModal
        show={showPublishConfirmation}
        onClose={() => setShowPublishConfirmation(false)}
        onConfirm={confirmPublish}
      />

      <PublishErrorModal
        show={!!publishError}
        onClose={() => setPublishError(null)}
        onRetry={handleRetryPublish}
        errorMessage={publishError?.message || ''}
        errorLogs={publishError?.logs}
      />
    </div>
  );
};

export default ContentEditor;


  // Auto-sync changes when back online
  useEffect(() => {
    if (!isOffline && pendingSyncCount > 0) {
      const syncChanges = async () => {
        const pending = await getAllOfflineContent();
        for (const item of pending.filter(item => item.status === 'pending_sync')) {
          console.log('Attempting to sync:', item.id);
          // Simulate API call to publish queued content
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            addNotification({
              displayType: 'toast',
              style: 'success',
              message: `Synced queued content: ${item.id}`,
            });
            await deleteContentFromIndexedDB(item.id); // Remove after successful sync
            setPendingSyncCount(prev => prev - 1);
          } catch (error) {
            console.error('Failed to sync queued content:', item.id, error);
            addNotification({
              displayType: 'toast',
              style: 'error',
              message: `Failed to sync ${item.id}. Will retry later.`,
            });
          }
        }
      };
      syncChanges();
    }
  }, [isOffline, pendingSyncCount, addNotification]);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    console.log('Saving draft:', currentContent);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const saveTime = new Date().toLocaleTimeString();
    addNotification({ displayType: 'toast', style: 'success', message: `Draft saved successfully at ${saveTime}!` });
    setIsSaving(false);
    setDraftContent(currentContent); // Update draft content for preview
  }, [currentContent, addNotification]);

  const handlePublish = useCallback(() => {
    setShowPublishConfirmation(true); // Show confirmation modal first
  }, []);

  const handleQueuePublish = useCallback(async () => {
    await saveContentToIndexedDB('editor-content', currentContent, 'pending_sync');
    setPendingSyncCount(prev => prev + 1);
  }, [currentContent]);

  const confirmPublish = useCallback(async () => {
    setShowPublishConfirmation(false);
    setIsPublishing(true);
    setPublishError(null); // Clear previous errors

    try {
      console.log('Publishing content:', currentContent);
      // Simulate API call with potential error
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          if (Math.random() > 0.8) { // 20% chance of error
            reject(new Error('Failed to connect to publishing service.'));
          } else {
            resolve(true);
          }
        }, 2000)
      );
      addNotification({ displayType: 'toast', style: 'success', message: 'Content published successfully!' });
      setPublishedContent(currentContent); // Update published content for preview
      await deleteContentFromIndexedDB('editor-content'); // Clear from IndexedDB after successful publish
      setPendingSyncCount(prev => Math.max(0, prev - 1)); // Decrement if it was a pending sync
    } catch (error: any) {
      console.error('Publish error:', error);
      setPublishError({ message: error.message || 'Unknown error', logs: error.stack });
      addNotification({ displayType: 'toast', style: 'error', message: 'Failed to publish content.' });
    } finally {
      setIsPublishing(false);
    }
  }, [currentContent, addNotification]);

  const handleRetryPublish = useCallback(() => {
    setPublishError(null);
    confirmPublish(); // Retry publishing
  }, [confirmPublish]);

  const toggleAiAssist = useCallback(() => {
    setIsAiAssistEnabled((prev) => !prev);
    addNotification({ displayType: 'toast', style: 'info', message: `AI Assist ${isAiAssistEnabled ? 'disabled' : 'enabled'}.` });
  }, [isAiAssistEnabled, addNotification]);

  // Mock accessibility score update
  useEffect(() => {
    const interval = setInterval(() => {
      setAccessibilityScore(Math.floor(Math.random() * (95 - 70 + 1)) + 70); // Score between 70-95
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock AI suggestions availability
  useEffect(() => {
    // Simulate AI suggestions becoming available based on content
    setHasAiSuggestions(currentContent.includes('AI') || currentContent.includes('suggestion'));
  }, [currentContent]);

  return (
    <div className="d-flex flex-column h-100">
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onQueuePublish={handleQueuePublish}
        accessibilityScore={accessibilityScore}
        isAiAssistEnabled={isAiAssistEnabled}
        onToggleAIAssist={toggleAiAssist}
        isOffline={isOffline}
        pendingSyncCount={pendingSyncCount}
      />
      <div className="flex-grow-1 d-flex">
        <div className="flex-grow-1 p-3 border-end">
          <BlockEditorCanvas initialContent={initialEditorContent} />
        </div>
        <div className="p-3" style={{ width: '50%' }}>
          <PreviewPane draftContent={draftContent} publishedContent={publishedContent} />
        </div>
      </div>

      <PublishConfirmationModal
        show={showPublishConfirmation}
        onClose={() => setShowPublishConfirmation(false)}
        onConfirm={confirmPublish}
      />

      <PublishErrorModal
        show={!!publishError}
        onClose={() => setPublishError(null)}
        onRetry={handleRetryPublish}
        errorMessage={publishError?.message || ''}
        errorLogs={publishError?.logs}
      />
    </div>
  );
};

export default ContentEditor;
