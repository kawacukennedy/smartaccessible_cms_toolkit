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

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { useNotifications } from '@/contexts/NotificationContext';
import dynamic from 'next/dynamic';

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

  const handleSaveDraft = useCallback(() => {
    // Simulate saving draft
    console.log('Saving draft:', currentContent);
    addNotification({ displayType: 'toast', style: 'success', message: 'Draft saved successfully!' });
  }, [currentContent, addNotification]);

  const handlePublish = useCallback(() => {
    // Simulate publishing content
    console.log('Publishing content:', currentContent);
    addNotification({ displayType: 'toast', style: 'success', message: 'Content published successfully!' });
  }, [currentContent, addNotification]);

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
      />
      <div className="flex-grow-1 d-flex">
        <div className="flex-grow-1 p-3 border-end">
          <EditorPanel onContentChange={addChange} initialContent={currentContent} />
        </div>
        {/* Preview Pane */}
        <div className="p-3" style={{ width: '30%' }}>
          <PreviewPane content={currentContent} />
        </div>
      </div>
    </div>
  );
};
