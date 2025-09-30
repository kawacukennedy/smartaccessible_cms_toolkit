'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Command {
  id: string;
  name: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setFilteredCommands(
      commands.filter(command =>
        command.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setActiveIndex(0);
  }, [searchTerm, commands]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex(prevIndex => (prevIndex + 1) % filteredCommands.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex(prevIndex =>
          (prevIndex - 1 + filteredCommands.length) % filteredCommands.length
        );
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (filteredCommands[activeIndex]) {
          filteredCommands[activeIndex].action();
          onClose();
        }
      }
    },
    [isOpen, onClose, filteredCommands, activeIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
            <ul className="list-group mt-3">
              {filteredCommands.map((command, index) => (
                <li
                  key={command.id}
                  className={`list-group-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                >
                  {command.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
