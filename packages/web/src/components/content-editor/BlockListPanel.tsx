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
          {blocks.map((block) => (
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
