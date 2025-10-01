'use client';

import React from 'react';

interface AISuggestionModalProps {
  show: boolean;
  onClose: () => void;
  onApply: (suggestion: string) => void;
  onReject: () => void;
  suggestion: string;
  currentContent: string;
  previewContent: string;
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({ show, onClose, onApply, onReject, suggestion, currentContent, previewContent }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AI Suggestion</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <h6 className="font-bold">Suggestion:</h6>
            <p>{suggestion}</p>
          </div>
          <div>
            <h6 className="font-bold">Current Content:</h6>
            <pre className="p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-auto">{currentContent}</pre>
          </div>
          <div>
            <h6 className="font-bold">Preview with Fix:</h6>
            <pre className="p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-auto">{previewContent}</pre>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onReject} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Reject</button>
          <button onClick={() => onApply(suggestion)} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Apply Fix</button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionModal;