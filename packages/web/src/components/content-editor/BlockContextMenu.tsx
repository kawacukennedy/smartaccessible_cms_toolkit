import React from 'react';

interface BlockContextMenuProps {
  blockId: string;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onViewSuggestions: (id: string) => void;
  onViewAlerts: (id: string) => void;
  hasSuggestions: boolean;
  hasAlerts: boolean;
}

const BlockContextMenu: React.FC<BlockContextMenuProps> = ({
  blockId,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onViewSuggestions,
  onViewAlerts,
  hasSuggestions,
  hasAlerts,
}) => {
  return (
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-secondary dropdown-toggle"
        type="button"
        id={`blockContextMenu-${blockId}`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Block actions"
      >
        <i className="bi bi-three-dots"></i>
      </button>
      <ul className="dropdown-menu" aria-labelledby={`blockContextMenu-${blockId}`}>
        <li>
          <button className="dropdown-item" onClick={() => onMoveUp(blockId)}>
            <i className="bi bi-arrow-up me-2"></i> Move Up
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => onMoveDown(blockId)}>
            <i className="bi bi-arrow-down me-2"></i> Move Down
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => onDuplicate(blockId)}>
            <i className="bi bi-copy me-2"></i> Duplicate
          </button>
        </li>
        <li>
          <button className="dropdown-item text-danger" onClick={() => onDelete(blockId)}>
            <i className="bi bi-trash me-2"></i> Delete
          </button>
        </li>
        {hasSuggestions && (
          <li>
            <hr className="dropdown-divider" />
          </li>
        )}
        {hasSuggestions && (
          <li>
            <button className="dropdown-item" onClick={() => onViewSuggestions(blockId)}>
              <i className="bi bi-lightbulb me-2"></i> View AI Suggestions
            </button>
          </li>
        )}
        {hasAlerts && (
          <li>
            <button className="dropdown-item" onClick={() => onViewAlerts(blockId)}>
              <i className="bi bi-exclamation-triangle me-2"></i> View Accessibility Alerts
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default BlockContextMenu;
