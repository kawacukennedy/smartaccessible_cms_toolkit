'use client';

import React from 'react';

interface PublishConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PublishConfirmationModal: React.FC<PublishConfirmationModalProps> = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Confirm Publish</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
        </div>
        <div className="space-y-4">
          <p>Are you sure you want to publish this content live?</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">This action will make your changes visible to the public.</p>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Publish Live</button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;
