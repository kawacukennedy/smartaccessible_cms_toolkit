import React from 'react';
import { useUndoRedo } from '@/contexts/UndoRedoContext';

const VersionHistoryPanel: React.FC = () => {
  const { history, currentIndex, goToState } = useUndoRedo();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Version History</h2>
      </div>
      <div className="p-4">
        {history.length === 0 ? (
          <p className="text-muted">No history available.</p>
        ) : (
          <ul className="list-group">
            {history.map((entry, index) => (
              <li
                key={index}
                className={`list-group-item d-flex justify-content-between align-items-center ${index === currentIndex ? 'active' : ''}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                <span>Version {index + 1}</span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => goToState(index)}
                  disabled={index === currentIndex}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VersionHistoryPanel;
