'use client';

import React from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { Undo, Redo, Save, Send, Shield, Sparkles, Sidebar, Eye } from 'lucide-react';

interface EditorToolbarProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  onToggleAIAssist: () => void;
  isAiAssistEnabled: boolean;
  accessibilityScore: number;
  isOffline: boolean;
  isSaving?: boolean;
  onToggleSidebar?: () => void;
  onToggleAIPanel?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSaveDraft,
  onPublish,
  onToggleAIAssist,
  isAiAssistEnabled,
  accessibilityScore,
  isOffline,
  isSaving,
  onToggleSidebar,
  onToggleAIPanel,
}) => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const getAccessibilityBadgeColor = (score: number) => {
    if (score < 50) return 'bg-error';
    if (score < 80) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="flex items-center justify-between p-2 bg-background_light dark:bg-background_dark border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
          <Undo size={20} />
        </button>
        <button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
          <Redo size={20} />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Shield size={20} />
          <span className={`text-sm font-bold px-2 py-1 rounded-full text-white ${getAccessibilityBadgeColor(accessibilityScore)}`}>
            {accessibilityScore}
          </span>
        </div>
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <Sidebar size={20} />
          </button>
        )}
        <button onClick={onToggleAIAssist} className={`p-2 rounded-md ${isAiAssistEnabled ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
          <Sparkles size={20} />
        </button>
        {onToggleAIPanel && (
          <button onClick={onToggleAIPanel} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <Eye size={20} />
          </button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onSaveDraft} disabled={isSaving} className="px-4 py-2 text-sm font-semibold rounded-md bg-secondary text-white hover:bg-opacity-80 disabled:opacity-50">
          <Save size={16} className="inline-block mr-1" />
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        <button onClick={onPublish} className="px-4 py-2 text-sm font-semibold rounded-md bg-primary text-white hover:bg-opacity-80">
          <Send size={16} className="inline-block mr-1" />
          {isOffline ? 'Queue Publish' : 'Publish'}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
