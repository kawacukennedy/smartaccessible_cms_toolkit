import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import BlockEditorCanvas from './content-editor/BlockEditorCanvas';
import EditorToolbar from './content-editor/EditorToolbar';
import PreviewPane from './content-editor/PreviewPane';
import { Eye } from 'lucide-react';
import AIPanel from './content-editor/AIPanel';
import CollaborationPanel from './CollaborationPanel';
import PublishConfirmationModal from './PublishConfirmationModal';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useOffline } from '@/contexts/OfflineContext';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { getContentFromIndexedDB, saveContentToIndexedDB, getAllOfflineContent, deleteContentFromIndexedDB } from '@/lib/db/indexedDB';
import PublishErrorModal from './PublishErrorModal';
import Sidebar from './Sidebar';

const ContentEditor: React.FC = () => {
  const { currentContent, addChange } = useUndoRedo();
  const { addNotification } = useNotifications();
  const { isOffline, setPendingSyncCount } = useOffline();
  const { isOnline: isCollaborationOnline, updateCursor, applyOperation } = useCollaboration();
  const searchParams = useSearchParams();
  const contentId = searchParams.get('id');

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [isPreviewPaneOpen, setIsPreviewPaneOpen] = useState(false);
  const [isCollaborationPanelOpen, setIsCollaborationPanelOpen] = useState(false);
  const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'queued' | 'running' | 'done' | 'failed'>('idle');
  const [aiTaskId, setAiTaskId] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<'idle' | 'editing' | 'autosaving' | 'saved' | 'error' | 'publishing' | 'published' | 'conflict'>('idle');
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
      if (contentId) {
        try {
          const response = await fetch(`/api/content/${contentId}`);
          if (response.ok) {
            const data = await response.json();
            setInitialEditorContent(data.content);
            addNotification({ displayType: 'toast', style: 'info', message: 'Content loaded.' });
          } else {
            addNotification({ displayType: 'toast', style: 'error', message: 'Failed to load content.' });
          }
        } catch (error) {
          addNotification({ displayType: 'toast', style: 'error', message: 'Error loading content.' });
        }
      } else {
        const storedContent = await getContentFromIndexedDB('editor-content');
        if (storedContent) {
          setInitialEditorContent(storedContent.content);
          addNotification({ displayType: 'toast', style: 'info', message: 'Loaded unsaved changes.' });
        }
      }
      const allOffline = await getAllOfflineContent();
      setPendingSyncCount(allOffline.filter(item => item.status === 'pending_sync').length);
    };
    loadContent();
  }, [addNotification, setPendingSyncCount, contentId]);

  const handleSaveDraft = useCallback(async () => {
    setEditorState('autosaving');
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addNotification({ displayType: 'toast', style: 'success', message: `Draft saved!` });
      setEditorState('saved');
      setDraftContent(currentContent);
    } catch (error) {
      setEditorState('error');
    } finally {
      setIsSaving(false);
    }
  }, [currentContent, addNotification]);

  // Autosave functionality
  useEffect(() => {
    const autosaveInterval = setInterval(async () => {
      if (currentContent && currentContent !== publishedContent) {
        await handleSaveDraft();
      }
    }, 10000); // 10 seconds

    return () => clearInterval(autosaveInterval);
  }, [currentContent, publishedContent, handleSaveDraft]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSaveDraft();
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              // Redo - would need to implement redo in UndoRedoContext
            } else {
              e.preventDefault();
              // Undo - would need to implement undo in UndoRedoContext
            }
            break;
        }
        if (e.altKey && e.key === 'p') {
          e.preventDefault();
          handlePublish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveDraft, handlePublish]);

  const handleAIScanRequest = useCallback(async () => {
    if (aiScanStatus !== 'idle') return;

    setAiScanStatus('queued');
    try {
      const response = await fetch('/api/ai/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: 'workspace_1',
          content_snapshot: currentContent,
          scan_types: ['readability', 'accessibility', 'alt_text', 'tone'],
        }),
      });
      const data = await response.json();
      setAiTaskId(data.task_id);
      setAiScanStatus('running');

      // Start polling
      const pollInterval = setInterval(async () => {
        const pollResponse = await fetch(`/api/ai/scan?taskId=${data.task_id}`);
        const pollData = await pollResponse.json();
        if (pollData.status === 'done') {
          setAiScanStatus('done');
          // Update suggestions
          clearInterval(pollInterval);
        } else if (pollData.status === 'failed') {
          setAiScanStatus('failed');
          clearInterval(pollInterval);
        }
      }, 2000); // Poll every 2 seconds
    } catch (error) {
      setAiScanStatus('failed');
    }
  }, [aiScanStatus, currentContent]);

  const handlePublish = useCallback(() => setShowPublishConfirmation(true), []);

  const confirmPublish = useCallback(async () => {
    setShowPublishConfirmation(false);
    setEditorState('publishing');
    setIsPublishing(true);
    setPublishError(null);
    try {
      if (contentId) {
        const response = await fetch(`/api/content/${contentId}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: currentContent }),
        });
        if (!response.ok) throw new Error('Publish failed');
      } else {
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: currentContent, type: 'page', locale: 'en' }),
        });
        if (!response.ok) throw new Error('Create and publish failed');
      }
      addNotification({ displayType: 'toast', style: 'success', message: 'Content published!' });
      setEditorState('published');
      setPublishedContent(currentContent);
      await deleteContentFromIndexedDB('editor-content');
      setPendingSyncCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      setEditorState('error');
      setPublishError({ message: error.message, logs: error.stack });
      addNotification({ displayType: 'toast', style: 'error', message: 'Failed to publish.' });
    } finally {
      setIsPublishing(false);
    }
  }, [currentContent, addNotification, setPendingSyncCount, contentId]);

  return (
    <div className="flex h-full bg-neutral-100 dark:bg-neutral-900">
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        accessibilityScore={accessibilityScore}
        isAiAssistEnabled={isAiAssistEnabled}
        onToggleAIAssist={() => setIsAiAssistEnabled(prev => !prev)}
        isOffline={isOffline}
        isSaving={isSaving}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onToggleAIPanel={() => setIsAIPanelOpen(prev => !prev)}
        onTogglePreview={() => setIsPreviewPaneOpen(prev => !prev)}
        onToggleCollaboration={() => setIsCollaborationPanelOpen(prev => !prev)}
        isPreviewPaneOpen={isPreviewPaneOpen}
        isCollaborationPanelOpen={isCollaborationPanelOpen}
      />
      <div className="flex flex-grow">
        {isSidebarOpen && (
          <div className="w-70 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
            <Sidebar isSidebarOpen={true} />
          </div>
        )}
        <div className="flex-grow flex">
          <div className="flex-grow p-4 overflow-auto">
            <BlockEditorCanvas initialContent={initialEditorContent} onContentChange={addChange} />
          </div>
          {isPreviewPaneOpen && (
            <div className="w-96 bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700">
              <PreviewPane draftContent={draftContent} publishedContent={publishedContent} />
            </div>
          )}
          {isAIPanelOpen && (
            <div className="w-90 bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700">
              <AIPanel
                onApplySuggestion={(suggestion) => {/* handle apply */}}
                aiScanStatus={aiScanStatus}
                onAIScanRequest={handleAIScanRequest}
                currentContent={currentContent || draftContent}
              />
            </div>
          )}
          {isCollaborationPanelOpen && (
            <div className="w-80 bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700">
              <CollaborationPanel />
            </div>
          )}
        </div>
      </div>
      <PublishConfirmationModal show={showPublishConfirmation} onClose={() => setShowPublishConfirmation(false)} onConfirm={confirmPublish} />
      <PublishErrorModal show={!!publishError} onClose={() => setPublishError(null)} onRetry={confirmPublish} errorMessage={publishError?.message || ''} errorLogs={publishError?.logs} />
    </div>
  );
};

export default ContentEditor;