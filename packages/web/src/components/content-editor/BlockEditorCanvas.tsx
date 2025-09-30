
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { saveContentToIndexedDB } from '@/lib/db/indexedDB'; // Import IndexedDB utility

// Define a type for a block
interface Block {
  id: string;
  type: string;
  content: string;
  // Add other properties as needed for different block types
}

// Draggable Block Component
const DraggableBlock: React.FC<{ block: Block; index: number; moveBlock: (dragIndex: number, hoverIndex: number) => void }> = ({ block, index, moveBlock }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'block',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveBlock(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations, but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { id: block.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`editor-block card mb-3 p-3 ${isDragging ? 'is-dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      {block.content}
      {/* Inline AI suggestions (lightbulb icon, keyboard shortcut Alt + S) */}
      <button className="btn btn-sm btn-outline-info ms-2" title="AI Suggestion available (Alt+S)">
        <i className="bi bi-lightbulb"></i>
      </button>
    </div>
  );
};

// BlockEditorCanvas Component
const BlockEditorCanvas: React.FC<{ initialContent?: string | null }> = ({ initialContent }) => {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (initialContent) {
      try {
        return JSON.parse(initialContent);
      } catch (e) {
        console.error("Failed to parse initial content from IndexedDB", e);
        return [
          { id: '1', type: 'text', content: 'This is the first text block.' },
          { id: '2', type: 'media', content: 'Image block placeholder.' },
          { id: '3', type: 'text', content: 'Another text block here.' },
        ];
      }
    } else {
      return [
        { id: '1', type: 'text', content: 'This is the first text block.' },
        { id: '2', type: 'media', content: 'Image block placeholder.' },
        { id: '3', type: 'text', content: 'Another text block here.' },
      ];
    }
  });

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const dragBlock = blocks[dragIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, dragBlock);
    setBlocks(newBlocks);
  };

  // Save content to IndexedDB whenever blocks change
  useEffect(() => {
    saveContentToIndexedDB('editor-content', JSON.stringify(blocks));
  }, [blocks]);

  // Keyboard shortcut for AI suggestions (Alt + S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'S') {
        event.preventDefault();
        // Trigger AI suggestion logic (e.g., open a modal, show a popover)
        console.log('AI Suggestion shortcut triggered!');
        // For now, let's just add a temporary block to simulate
        setBlocks((prevBlocks) => [
          ...prevBlocks,
          { id: Date.now().toString(), type: 'ai-suggestion', content: 'AI-generated content suggestion.' },
        ]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="block-editor-canvas p-4 border rounded bg-light" role="main" aria-live="polite">
        <h3 className="mb-4">Block Editor Canvas</h3>
        {blocks.map((block, index) => (
          <DraggableBlock key={block.id} index={index} block={block} moveBlock={moveBlock} />
        ))}
        <div className="d-grid gap-2 mt-4">
          <button className="btn btn-outline-secondary">Add Text Block</button>
          <button className="btn btn-outline-secondary">Add Media Block</button>
          <button className="btn btn-outline-secondary">Add Form Block</button>
          <button className="btn btn-outline-secondary">Add Custom Storyblok Component</button>
        </div>
      </div>
    </DndProvider>
  );
};

export default BlockEditorCanvas;
