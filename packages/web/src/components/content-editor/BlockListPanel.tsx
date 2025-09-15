'use client';

import React, { useState, useRef, useEffect } from 'react';

interface BlockListPanelProps {
  onBlockSelect: (blockContent: string) => void;
}

const initialMockBlocks = [
  { id: 'block-1', title: 'Introduction', content: '<p>This is the <strong>introduction</strong> block content.</p>' },
  { id: 'block-2', title: 'Main Section', content: '<p>Content for the <em>main section</em> goes here.</p>' },
  { id: 'block-3', title: 'Conclusion', content: '<p>Final thoughts and <span style="color: blue;">conclusion</span>.</p>' },
];

const BlockListPanel: React.FC<BlockListPanelProps> = ({ onBlockSelect }) => {
  const [blocks, setBlocks] = useState(initialMockBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const listRef = useRef<HTMLUListElement>(null);
  const dragItem = useRef<number | null>(null); // Ref to store the index of the dragged item
  const dragOverItem = useRef<number | null>(null); // Ref to store the index of the item being dragged over

  const handleBlockClick = (blockId: string, blockContent: string) => {
    setSelectedBlockId(blockId);
    onBlockSelect(blockContent);
  };

  const handleAddBlock = () => {
    if (newBlockTitle.trim() === '') return;
    const newBlock = {
      id: `block-${Date.now()}`,
      title: newBlockTitle.trim(),
      content: `<p>New block content for ${newBlockTitle.trim()}.</p>`,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setNewBlockTitle('');
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      onBlockSelect(''); // Clear editor if selected block is deleted
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, block: typeof initialMockBlocks[0]) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBlockClick(block.id, block.content);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML); // For Firefox
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
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

  useEffect(() => {
    if (listRef.current && selectedBlockId) {
      const selectedElement = listRef.current.querySelector(`[data-block-id="${selectedBlockId}"]`) as HTMLLIElement;
      if (selectedElement) {
        selectedElement.focus();
      }
    }
  }, [selectedBlockId]);

  return (
    <div className="card h-100">
      <div className="card-header">Block List</div>
      <div className="card-body overflow-auto">
        <ul ref={listRef} className="list-group" role="listbox" aria-label="Content Blocks">
          {blocks.map((block, index) => (
            <li
              key={block.id}
              data-block-id={block.id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedBlockId === block.id ? 'active' : ''}`}
              onClick={() => handleBlockClick(block.id, block.content)}
              onKeyDown={(e) => handleKeyDown(e, block)}
              role="option"
              aria-selected={selectedBlockId === block.id}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            >
              {block.title}
              <button
                className="btn btn-sm btn-danger"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the block when deleting
                  handleDeleteBlock(block.id);
                }}
                aria-label={`Delete ${block.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="New block title"
            value={newBlockTitle}
            onChange={(e) => setNewBlockTitle(e.target.value)}
            aria-label="New block title"
          />
          <button className="btn btn-primary" type="button" onClick={handleAddBlock} aria-label="Add new block">
            Add Block
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockListPanel;
