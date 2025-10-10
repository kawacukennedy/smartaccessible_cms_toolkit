'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { saveContentToIndexedDB } from '@/lib/db/indexedDB';
import { Lightbulb, PlusCircle, MoreVertical, Edit3, FileText } from 'lucide-react';
import GripVerticalIcon from '../icons/GripVerticalIcon';
import TiptapBlock from './TiptapBlock';
import BlockContextMenu from './BlockContextMenu';

interface Block {
  id: string;
  type: 'TextBlock' | 'ImageBlock' | 'Hero' | 'CTA' | 'Custom';
  meta: {
    created_by: string;
    created_at: string;
    version: number;
  };
  payload: any; // varies by type
  accessibility_meta: {
    alt_text?: string;
    aria_label?: string;
    contrast_warning?: boolean;
  };
}

const DraggableBlock: React.FC<{
  block: Block;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isEditing: boolean;
  onContentChange: (id: string, content: string) => void;
}> = ({ block, index, moveBlock, onDuplicate, onDelete, onEdit, isEditing, onContentChange }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'block',
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveBlock(dragIndex, hoverIndex);
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

  const handleContentChange = (content: string) => {
    onContentChange(block.id, content);
  };

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className={`relative p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-shadow duration-200 ${isDragging ? 'shadow-lg scale-105' : ''}`}>
        <div className="flex items-start">
            <div className="cursor-move p-2">
                <GripVerticalIcon size={20} />
            </div>
            <div className="flex-grow">
              {isEditing ? (
                <TiptapBlock
                  content={block.payload?.content || ''}
                  onChange={handleContentChange}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: block.payload?.content || 'Block content' }} />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(block.id)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Edit block"
              >
                <Edit3 size={16} />
              </button>
              <BlockContextMenu
                blockId={block.id}
                onMoveUp={() => moveBlock(index, Math.max(0, index - 1))}
                onMoveDown={() => moveBlock(index, Math.min(index + 1, index + 1))}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                onViewSuggestions={() => {}}
                onViewAlerts={() => {}}
                hasSuggestions={false}
                hasAlerts={false}
              />
              <button className="p-2 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800" title="AI Suggestion available (Alt+S)">
                <Lightbulb size={20} className="text-yellow-500" />
              </button>
            </div>
        </div>
    </div>
  );
};

const BlockEditorCanvas: React.FC<{ initialContent?: string | null; onContentChange?: (content: string) => void }> = ({ initialContent, onContentChange }) => {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      return initialContent ? JSON.parse(initialContent) : [];
    } catch (e) {
      return [];
    }
  });
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const dragBlock = blocks[dragIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, dragBlock);
    setBlocks(newBlocks);
  };

  const duplicateBlock = (id: string) => {
    const blockIndex = blocks.findIndex(b => b.id === id);
    if (blockIndex !== -1) {
      const duplicatedBlock = { ...blocks[blockIndex], id: Date.now().toString() };
      const newBlocks = [...blocks];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
      setBlocks(newBlocks);
    }
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const editBlock = (id: string) => {
    setEditingBlockId(editingBlockId === id ? null : id);
  };

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, payload: { ...b.payload, content } } : b));
  };

  useEffect(() => {
    const content = JSON.stringify(blocks);
    saveContentToIndexedDB('editor-content', content);
    onContentChange?.(content);
  }, [blocks, onContentChange]);

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      meta: {
        created_by: 'user',
        created_at: new Date().toISOString(),
        version: 1,
      },
      payload: { content: `New ${type} block` },
      accessibility_meta: {},
    };
    setBlocks(prev => [...prev, newBlock]);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <DraggableBlock
            key={block.id}
            index={index}
            block={block}
            moveBlock={moveBlock}
            onDuplicate={duplicateBlock}
            onDelete={deleteBlock}
            onEdit={editBlock}
            isEditing={editingBlockId === block.id}
            onContentChange={updateBlockContent}
          />
        ))}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
            <button onClick={() => addBlock('TextBlock')} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <FileText size={20} />
                <span>Text</span>
            </button>
            <button onClick={() => addBlock('ImageBlock')} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <PlusCircle size={20} />
                <span>Image</span>
            </button>
            <button onClick={() => addBlock('Hero')} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <PlusCircle size={20} />
                <span>Hero</span>
            </button>
            <button onClick={() => addBlock('CTA')} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <PlusCircle size={20} />
                <span>CTA</span>
            </button>
            <button onClick={() => addBlock('Custom')} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <PlusCircle size={20} />
                <span>Custom</span>
            </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default BlockEditorCanvas;