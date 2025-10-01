'use client';

import React from 'react';

interface PublishErrorModalProps {
  show: boolean;
  onClose: () => void;
  onRetry: () => void;
  errorMessage: string;
  errorLogs?: string;
}

const PublishErrorModal: React.FC<PublishErrorModalProps> = ({ show, onClose, onRetry, errorMessage, errorLogs }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-error">Publish Error</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
        </div>
        <div className="space-y-4">
          <p>An error occurred during publishing:</p>
          <p className="text-error font-semibold">{errorMessage}</p>
          {errorLogs && (
            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
              <h6 className="font-bold">Error Details:</h6>
              <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{errorLogs}</pre>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Close</button>
          <button onClick={onRetry} className="px-4 py-2 rounded-md bg-warning text-white hover:bg-opacity-80">Retry</button>
        </div>
      </div>
    </div>
  );
};

export default PublishErrorModal;