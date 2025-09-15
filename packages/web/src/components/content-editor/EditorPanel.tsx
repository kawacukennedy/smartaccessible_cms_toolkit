'use client';

import React, { useEffect, useState, useRef } from 'react';
import MediaUploader from './MediaUploader';
import AI_Toolbar from './AI_Toolbar';
import SEOPanel from './SEOPanel';
import { generateMockAISuggestions } from '@/lib/ai-suggestions';
import { useAISuggestions } from '@/contexts/AISuggestionContext';
import { useUndoRedo } from '@/contexts/UndoRedoContext';

interface Block {
  id: string;
  type: 'text' | 'image'; // Extend with more types as needed
  content: string;
}

interface EditorPanelProps {
  content: string; // This will now represent the joined content of all blocks
  onContentChange: (content: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ content, onContentChange }) => {
  const { addSuggestion } = useAISuggestions();
  const { addChange } = useUndoRedo();

  const [blocks, setBlocks] = useState<Block[]>([
    { id: 'block-1', type: 'text', content: 'This is the first block.' },
    { id: 'block-2', type: 'text', content: 'This is the second block.' },
  ]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Update undo/redo history when blocks change
  useEffect(() => {
    const joinedContent = blocks.map(block => block.content).join('\n');
    addChange(joinedContent);
    onContentChange(joinedContent); // Notify parent of content change
  }, [blocks, addChange, onContentChange]);

  const handleBlockContentChange = (id: string, newContent: string) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => (block.id === id ? { ...block, content: newContent } : block))
    );
  };

  const handleGenerateSuggestions = () => {
    const joinedContent = blocks.map(block => block.content).join('\n');
    const suggestions = generateMockAISuggestions(joinedContent);
    suggestions.forEach(addSuggestion);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[dragItem.current];
    newBlocks.splice(dragItem.current, 1); // Remove dragged item
    newBlocks.splice(dragOverItem.current, 0, draggedBlock); // Insert at new position

    dragItem.current = null;
    dragOverItem.current = null;
    setBlocks(newBlocks);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
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

  return (
    <div className="card h-100">
      <div className="card-header">Editor</div>
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1 overflow-auto p-2">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              className="editor-block mb-3 p-2 border rounded position-relative"
              style={{ cursor: 'grab' }}
            >
              <div className="block-controls position-absolute top-0 end-0 p-1">
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleMoveBlock(block.id, 'up')} disabled={index === 0} aria-label="Move block up">
                  <i className="bi bi-arrow-up"></i>
                </button>
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => handleMoveBlock(block.id, 'down')} disabled={index === blocks.length - 1} aria-label="Move block down">
                  <i className="bi bi-arrow-down"></i>
                </button>
                <button className="btn btn-sm btn-outline-info me-1" onClick={() => handleDuplicateBlock(block.id)} aria-label="Duplicate block">
                  <i className="bi bi-copy"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBlock(block.id)} aria-label="Delete block">
                  <i className="bi bi-trash"></i>
                </button>
                {/* More dropdown can be added here */}
              </div>
              {block.type === 'text' && (
                <div
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                  onBlur={(e) => handleBlockContentChange(block.id, e.currentTarget.innerHTML)}
                  className="form-control-plaintext"
                />
              )}
              {/* Add more block types here */}
            </div>
          ))}
        </div>
        <MediaUploader />
        <AI_Toolbar onGenerateSuggestions={handleGenerateSuggestions} />
        <SEOPanel />
      </div>
    </div>
  );
};

export default EditorPanel;
