'use client';

import React, { useState } from 'react';
import TemplateSelector from './TemplateSelector';

interface NewPageModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (title: string, slug: string, template: string, seoTitle: string, seoDescription: string) => void;
}

const NewPageModal: React.FC<NewPageModalProps> = ({ show, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  const handleCreate = () => {
    onCreate(title, slug, selectedTemplate, seoTitle, seoDescription);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create New Page</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="pageTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Page Title</label>
            <input type="text" id="pageTitle" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="pageSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Page Slug</label>
            <input type="text" id="pageSlug" value={slug} onChange={e => setSlug(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">SEO Title (Optional)</label>
            <input type="text" id="seoTitle" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">SEO Description (Optional)</label>
            <textarea id="seoDescription" value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Template</label>
            <TemplateSelector onSelectTemplate={setSelectedTemplate} selectedTemplateId={selectedTemplate} />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button onClick={handleCreate} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80">Create Page</button>
        </div>
      </div>
    </div>
  );
};

export default NewPageModal;