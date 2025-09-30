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

import React, { useState, useEffect, useCallback } from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';
import dynamic from 'next/dynamic';
import PublishConfirmationModal from '@/components/PublishConfirmationModal'; // Import confirmation modal
import PublishErrorModal from '@/components/PublishErrorModal'; // Import error modal

// Dynamically import EditorToolbar to ensure it's treated as a client component
const EditorToolbar = dynamic(() => import('./content-editor/EditorToolbar'), { ssr: false });

// Dynamically import EditorPanel to ensure it's treated as a client component
const EditorPanel = dynamic(() => import('./content-editor/EditorPanel'), { ssr: false });

// Dynamically import PreviewPane to ensure it's treated as a client component
const PreviewPane = dynamic(() => import('./content-editor/PreviewPane'), { ssr: false });

const ContentEditor: React.FC = () => {
  const { currentContent, addChange, undo, redo } = useUndoRedo();
  const { addNotification } = useNotifications();

  const [accessibilityScore, setAccessibilityScore] = useState(85); // Mock score
  const [isAiAssistEnabled, setIsAiAssistEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false); // State for confirmation modal
  const [publishError, setPublishError] = useState<{ message: string; logs?: string } | null>(null); // State for publish error

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    console.log('Saving draft:', currentContent);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const saveTime = new Date().toLocaleTimeString();
    addNotification({ displayType: 'toast', style: 'success', message: `Draft saved successfully at ${saveTime}!` });
    setIsSaving(false);
  }, [currentContent, addNotification]);

  const handlePublish = useCallback(() => {
    setShowPublishConfirmation(true); // Show confirmation modal first
  }, []);

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

  return (
    <div className="d-flex flex-column h-100">
      <EditorToolbar
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        accessibilityScore={accessibilityScore}
        isAiAssistEnabled={isAiAssistEnabled}
        toggleAiAssist={toggleAiAssist}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />
      <div className="flex-grow-1 d-flex">
        <div className="flex-grow-1 p-3 border-end">
          <EditorPanel onContentChange={addChange} initialContent={currentContent} />
        </div>
        <div className="p-3" style={{ width: '30%' }}>
          <PreviewPane content={currentContent} />
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
