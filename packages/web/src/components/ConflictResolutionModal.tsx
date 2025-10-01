'use client';

import React, { useState, useEffect } from 'react';

interface ConflictResolutionModalProps {
  show: boolean;
  onClose: () => void;
  onResolve: (resolution: 'yours' | 'theirs' | 'merged', mergedContent?: string) => void;
  yourContent: string;
  theirContent: string;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({ show, onClose, onResolve, yourContent, theirContent }) => {
  const [mergedContent, setMergedContent] = useState(yourContent);

  useEffect(() => {
    if (show) {
      setMergedContent(yourContent);
    }
  }, [show, yourContent]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Conflict Detected!</h2>
        <p className="mb-6">A conflict between your local changes and the server's version was detected. Please choose how to resolve it.</p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">Your Version</h3>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md h-72 overflow-auto">{yourContent}</pre>
            <button onClick={() => onResolve('yours', yourContent)} className="mt-2 w-full px-4 py-2 rounded-md bg-success text-white hover:bg-opacity-80">Keep Your Version</button>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Their Version</h3>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md h-72 overflow-auto">{theirContent}</pre>
            <button onClick={() => onResolve('theirs', theirContent)} className="mt-2 w-full px-4 py-2 rounded-md bg-warning text-white hover:bg-opacity-80">Keep Their Version</button>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-2">Manually Merge</h3>
          <textarea value={mergedContent} onChange={e => setMergedContent(e.target.value)} rows={10} className="w-full p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md font-mono"></textarea>
          <button onClick={() => onResolve('merged', mergedContent)} className="mt-2 w-full px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Apply Manual Merge</button>
        </div>
        <div className="flex justify-end mt-8">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Cancel (Discard local changes)</button>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;
