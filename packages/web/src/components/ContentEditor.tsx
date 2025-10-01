import React, { useState, useEffect, useCallback, useRef } from 'react';
import BlockEditorCanvas from './content-editor/BlockEditorCanvas';
import EditorToolbar from './content-editor/EditorToolbar';
import PreviewPane from './content-editor/PreviewPane';
import PublishConfirmationModal from './PublishConfirmationModal';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOffline } from '@/contexts/OfflineContext';
import { getContentFromIndexedDB, saveContentToIndexedDB, getAllOfflineContent, deleteContentFromIndexedDB } from '@/lib/db/indexedDB';
import PublishErrorModal from './PublishErrorModal';

const ContentEditor: React.FC = () => {
  const { currentContent, addChange } = useUndoRedo();
  const { addNotification } = useNotifications();
  const { isOffline, setPendingSyncCount } = useOffline();

  const [accessibilityScore, setAccessibilityScore] = useState(85);
  const [isAiAssistEnabled, setIsAiAssistEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [publishError, setPublishError] = useState<{ message: string; logs?: string } | null>(null);
  const [draftContent, setDraftContent] = useState('<p>This is your <b>draft</b> content.</p>');
  const [publishedContent, setPublishedContent] = useState('<p>This is the <i>last published</i> content.</p>');
  const [initialEditorContent, setInitialEditorContent] = useState<string | null>(null);
  const [dividerPosition, setDividerPosition] = useState(50);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      const newDividerPosition = ((e.clientX - rect.left) / rect.width) * 100;
      if (newDividerPosition > 20 && newDividerPosition < 80) {
        setDividerPosition(newDividerPosition);
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const loadContent = async () => {
      const storedContent = await getContentFromIndexedDB('editor-content');
      if (storedContent) {
        setInitialEditorContent(storedContent.content);
        addNotification({ displayType: 'toast', style: 'info', message: 'Loaded unsaved changes.' });
      }
      const allOffline = await getAllOfflineContent();
      setPendingSyncCount(allOffline.filter(item => item.status === 'pending_sync').length);
    };
    loadContent();
  }, [addNotification, setPendingSyncCount]);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    addNotification({ displayType: 'toast', style: 'success', message: `Draft saved!` });
    setIsSaving(false);
    setDraftContent(currentContent);
  }, [currentContent, addNotification]);

  const handlePublish = useCallback(() => setShowPublishConfirmation(true), []);

  const confirmPublish = useCallback(async () => {
    setShowPublishConfirmation(false);
    setIsPublishing(true);
    setPublishError(null);
    try {
      await new Promise((resolve, reject) => setTimeout(() => Math.random() > 0.8 ? reject(new Error('Failed to connect.')) : resolve(true), 2000));
      addNotification({ displayType: 'toast', style: 'success', message: 'Content published!' });
      setPublishedContent(currentContent);
      await deleteContentFromIndexedDB('editor-content');
      setPendingSyncCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      setPublishError({ message: error.message, logs: error.stack });
      addNotification({ displayType: 'toast', style: 'error', message: 'Failed to publish.' });
    } finally {
      setIsPublishing(false);
    }
  }, [currentContent, addNotification, setPendingSyncCount]);

  return (
    <div className="flex flex-col h-full bg-background_light dark:bg-background_dark">
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        accessibilityScore={accessibilityScore}
        isAiAssistEnabled={isAiAssistEnabled}
        onToggleAIAssist={() => setIsAiAssistEnabled(prev => !prev)}
        isOffline={isOffline}
      />
      <div ref={editorRef} className="flex-grow grid" style={{ gridTemplateColumns: `${dividerPosition}% 1px ${100 - dividerPosition}%` }}>
        <div className="p-4 overflow-auto">
          <BlockEditorCanvas initialContent={initialEditorContent} />
        </div>
        <div onMouseDown={handleMouseDown} className="cursor-col-resize bg-gray-300 dark:bg-gray-700 w-1 h-full"></div>
        <div className="p-4 overflow-auto">
          <PreviewPane draftContent={draftContent} publishedContent={publishedContent} />
        </div>
      </div>
      <PublishConfirmationModal show={showPublishConfirmation} onClose={() => setShowPublishConfirmation(false)} onConfirm={confirmPublish} />
      <PublishErrorModal show={!!publishError} onClose={() => setPublishError(null)} onRetry={confirmPublish} errorMessage={publishError?.message || ''} errorLogs={publishError?.logs} />
    </div>
  );
};

export default ContentEditor;