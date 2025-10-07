'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { saveContentToIndexedDB } from '@/lib/db/indexedDB';
import { Lightbulb, PlusCircle } from 'lucide-react';
import GripVerticalIcon from '../icons/GripVerticalIcon';

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

const DraggableBlock: React.FC<{ block: Block; index: number; moveBlock: (dragIndex: number, hoverIndex: number) => void }> = ({ block, index, moveBlock }) => {
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

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className={`relative p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-shadow duration-200 ${isDragging ? 'shadow-lg scale-105' : ''}`}>
        <div className="flex items-center">
            <div className="cursor-move p-2">
                <GripVerticalIcon size={20} />
            </div>
            <div className="flex-grow">{block.payload?.content || 'Block content'}</div>
            <button className="p-2 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800" title="AI Suggestion available (Alt+S)">
                <Lightbulb size={20} className="text-yellow-500" />
            </button>
        </div>
    </div>
  );
};

const BlockEditorCanvas: React.FC<{ initialContent?: string | null }> = ({ initialContent }) => {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    try {
      return initialContent ? JSON.parse(initialContent) : [];
    } catch (e) {
      return [];
    }
  });

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const dragBlock = blocks[dragIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, dragBlock);
    setBlocks(newBlocks);
  };

  useEffect(() => {
    saveContentToIndexedDB('editor-content', JSON.stringify(blocks));
  }, [blocks]);

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
          <DraggableBlock key={block.id} index={index} block={block} moveBlock={moveBlock} />
        ))}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
            <button onClick={() => addBlock('TextBlock')} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <PlusCircle size={20} />
                <span>Text</span>
            </button>
            <button onClick={() => addBlock('ImageBlock')} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <PlusCircle size={20} />
                <span>Image</span>
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