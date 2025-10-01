'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MediaUploader from './MediaUploader';
import SEOPanel from './SEOPanel';
import BlockContextMenu from './BlockContextMenu';
import { generateMockAISuggestions } from '@/lib/ai-suggestions';
import TiptapBlock from './TiptapBlock';
import { useAISuggestions } from '@/contexts/AISuggestionContext';
import { useUndoRedo } from '@/contexts/UndoRedoContext';
import { AISuggestion } from '@/types/ai-suggestion';
import AISuggestionModal from '@/components/AISuggestionModal'; // Import AI Suggestion Modal

interface Block {
  id: string;
  type: 'text' | 'image'; // Extend with more types as needed
  content: string;
  suggestions?: string[]; // Added suggestions array
  accessibilityAlerts?: string[]; // Added accessibilityAlerts array
  collaborators?: { id: string; avatar: string; name: string }[]; // New collaborators property
}

interface EditorPanelProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  onScroll: (percentage: number) => void;
  isAiAssistEnabled: boolean; // New prop
}

const EditorPanel: React.FC<EditorPanelProps> = ({ initialContent, onContentChange, onScroll, isAiAssistEnabled }) => {
  const { addSuggestion, suggestions: aiSuggestions } = useAISuggestions();
  const { addChange } = useUndoRedo();

  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      return initialContent ? JSON.parse(initialContent) : [];
    } catch (e) {
      return [];
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const [activeSuggestionsBlockId, setActiveSuggestionsBlockId] = useState<string | null>(null);
  const [activeAlertsBlockId, setActiveAlertsBlockId] = useState<string | null>(null);
  const [showAISuggestionModal, setShowAISuggestionModal] = useState(false); // State for AI Suggestion Modal
  const [currentAISuggestion, setCurrentAISuggestion] = useState<{ blockId: string; suggestion: string; currentContent: string; previewContent: string } | null>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleBlockContentChange = (blockId: string, newContent: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    );
  };

  // Update undo/redo history when blocks change
  useEffect(() => {
    const joinedContent = blocks.map(block => block.content).join('\n');
    addChange(joinedContent);
    onContentChange(joinedContent); // Notify parent of content change
  }, [blocks, addChange, onContentChange]);

  const handleGenerateSuggestions = () => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => ({
        ...block,
        suggestions: generateMockAISuggestions(block.content).map(s => s.message), // Assign mock suggestions to each block
        accessibilityAlerts: block.id === 'block-1' ? ['Missing alt text', 'Low contrast'] : [], // Mock alerts
      }))
    );
  };

  const handleOpenAISuggestionModal = (blockId: string, suggestion: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      // Simulate preview fix
      const previewContent = block.content + ' [AI FIX: ' + suggestion + ']';
      setCurrentAISuggestion({ blockId, suggestion, currentContent: block.content, previewContent });
      setShowAISuggestionModal(true);
    }
  };

  const handleApplySuggestion = (blockId: string, suggestion: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId
          ? { ...block, content: block.content + ' ' + suggestion, suggestions: [] } // Apply and clear suggestions
          : block
      )
    );
    setActiveSuggestionsBlockId(null);
    setShowAISuggestionModal(false);
  };

  const handleRejectSuggestion = () => {
    setShowAISuggestionModal(false);
    setCurrentAISuggestion(null);
  };

  const handleIgnoreSuggestions = (blockId: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === blockId ? { ...block, suggestions: [] } : block))
    );
    setActiveSuggestionsBlockId(null);
  };

  const handleFixAlert = (blockId: string, alert: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId
          ? { ...block, accessibilityAlerts: block.accessibilityAlerts?.filter(a => a !== alert) } // Remove fixed alert
          : block
      )
    );
    // In a real app, this would apply a fix to the content
  };

  const handleIgnoreAlerts = (blockId: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === blockId ? { ...block, accessibilityAlerts: [] } : block))
    );
    setActiveAlertsBlockId(null);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML); // For Firefox
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[dragItem.current];
    newBlocks.splice(dragItem.current, 1); // Remove dragged item
    newBlocks.splice(dragOverItem.current, 0, draggedBlock); // Insert at new position

    dragItem.current = null;
    dragOverItem.current = null;
    setBlocks(newBlocks);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(index, 1);

    if (direction === 'up' && index > 0) {
      newBlocks.splice(index - 1, 0, movedBlock);
    } else if (direction === 'down' && index < newBlocks.length) {
      newBlocks.splice(index + 1, 0, movedBlock);
    }
    setBlocks(newBlocks);
  };

  const handleDuplicateBlock = (id: string) => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;

    const newBlocks = [...blocks];
    const duplicatedBlock = { ...newBlocks[index], id: `block-${Date.now()}` }; // New ID for duplicated block
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    setBlocks(newBlocks);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const percentage = e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight);
    onScroll(percentage);
  };

  return (
    <div className="card h-100">
      <div className="card-header">Editor</div>
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1 overflow-auto p-2" onScroll={handleScroll}>
          {blocks.map((block, index) => (
            <React.Fragment key={block.id}>
              {isDragging && dragOverItem.current === index && (
                <div className="drag-placeholder mb-3 p-4 border-2 border-dashed border-blue-500 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-center">
                  Drop block here
                </div>
              )}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`editor-block mb-3 p-2 border rounded position-relative ${isDragging && dragItem.current === index ? 'is-dragging' : ''} ${block.accessibilityAlerts && block.accessibilityAlerts.length > 0 ? 'has-error-alert' : ''}`}
                style={{ cursor: 'grab' }}
              >
                <div className="block-controls position-absolute top-0 end-0 p-1">
                  {block.collaborators && block.collaborators.length > 0 && (
                    <div className="collaborator-avatars d-flex mb-1">
                      {block.collaborators.map(collab => (
                        <img
                          key={collab.id}
                          src={collab.avatar}
                          alt={collab.name}
                          className="rounded-circle me-1" // Bootstrap classes for styling
                          style={{ width: '24px', height: '24px' }}
                          title={collab.name}
                        />
                      ))}
                    </div>
                  )}
                  <BlockContextMenu
                    blockId={block.id}
                    onMoveUp={() => handleMoveBlock(block.id, 'up')}
                    onMoveDown={() => handleMoveBlock(block.id, 'down')}
                    onDuplicate={handleDuplicateBlock}
                    onDelete={handleDeleteBlock}
                    onViewSuggestions={() => setActiveSuggestionsBlockId(block.id)}
                    onViewAlerts={() => setActiveAlertsBlockId(block.id)}
                    hasSuggestions={!!block.suggestions && block.suggestions.length > 0}
                    hasAlerts={!!block.accessibilityAlerts && block.accessibilityAlerts.length > 0}
                  />
                </div>
                {block.type === 'text' && (
                  <TiptapBlock
                    content={block.content}
                    onChange={(newContent) => handleBlockContentChange(block.id, newContent)}
                  />
                )}
                {/* Inline AI Suggestions Display */}
                {isAiAssistEnabled && activeSuggestionsBlockId === block.id && block.suggestions && block.suggestions.length > 0 && (
                  <div className="ai-suggestions-inline mt-2 p-2 bg-light border rounded">
                    <p className="fw-bold">AI Suggestions:</p>
                    {block.suggestions.map((suggestion, sIndex) => (
                      <div key={sIndex} className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted">{suggestion}</span>
                        <div>
                          <button className="btn btn-sm btn-success me-1" onClick={() => handleOpenAISuggestionModal(block.id, suggestion)}>Preview Fix</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleIgnoreSuggestions(block.id)}>Ignore</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Inline Accessibility Alerts Display */}
                {activeAlertsBlockId === block.id && block.accessibilityAlerts && block.accessibilityAlerts.length > 0 && (
                  <div className="accessibility-alerts-inline mt-2 p-2 bg-light border rounded">
                    <p className="fw-bold">Accessibility Alerts:</p>
                    {block.accessibilityAlerts.map((alert, aIndex) => (
                      <div key={aIndex} className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-danger">{alert}</span>
                        <div>
                          <button className="btn btn-sm btn-warning me-1" onClick={() => handleFixAlert(block.id, alert)}>Fix</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => handleIgnoreAlerts(block.id)}>Ignore</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Add more block types here */}
              </div>
            </React.Fragment>
          ))}
          {isDragging && dragOverItem.current === blocks.length && (
            <div className="drag-placeholder mb-3 p-4 border-2 border-dashed border-blue-500 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-center">
              Drop block here
            </div>
          )}
        </div>
        <SEOPanel />
      </div>

      <AISuggestionModal
        show={showAISuggestionModal}
        onClose={handleRejectSuggestion}
        onApply={(suggestion) => currentAISuggestion && handleApplySuggestion(currentAISuggestion.blockId, suggestion)}
        onReject={handleRejectSuggestion}
        suggestion={currentAISuggestion?.suggestion || ''}
        currentContent={currentAISuggestion?.currentContent || ''}
        previewContent={currentAISuggestion?.previewContent || ''}
      />
    </div>
  );
};

export default EditorPanel;