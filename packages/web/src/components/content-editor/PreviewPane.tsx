'use client';

import React, { useState } from 'react';
import { Laptop, Tablet, Smartphone, GitCompare } from 'lucide-react';

interface PreviewPaneProps {
  draftContent: string;
  publishedContent: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ draftContent, publishedContent }) => {
  const [view, setView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [diffMode, setDiffMode] = useState(false);

  const renderContent = (content: string) => {
    return (
      <div
        className="p-4 bg-white rounded-lg shadow-inner overflow-auto"
        dangerouslySetInnerHTML={{ __html: content || '<p>No content.</p>' }}
      />
    );
  };

  const getFrameWidth = () => {
    switch (view) {
      case 'mobile': return 'w-full max-w-sm';
      case 'tablet': return 'w-full max-w-md';
      case 'desktop':
      default: return 'w-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
          <button onClick={() => setView('desktop')} className={`p-2 rounded-md ${view === 'desktop' ? 'bg-white dark:bg-gray-700' : ''}`}><Laptop size={20} /></button>
          <button onClick={() => setView('tablet')} className={`p-2 rounded-md ${view === 'tablet' ? 'bg-white dark:bg-gray-700' : ''}`}><Tablet size={20} /></button>
          <button onClick={() => setView('mobile')} className={`p-2 rounded-md ${view === 'mobile' ? 'bg-white dark:bg-gray-700' : ''}`}><Smartphone size={20} /></button>
        </div>
        <button onClick={() => setDiffMode(!diffMode)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${diffMode ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>
          <GitCompare size={16} />
          <span>Diff Mode</span>
        </button>
      </div>

      <div className={`flex-grow p-4 overflow-auto ${getFrameWidth()}`}>
        {diffMode ? (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div>
              <h6 className="text-center text-sm font-bold mb-2">Draft</h6>
              {renderContent(draftContent)}
            </div>
            <div>
              <h6 className="text-center text-sm font-bold mb-2">Published</h6>
              {renderContent(publishedContent)}
            </div>
          </div>
        ) : (
          renderContent(draftContent)
        )}
      </div>
    </div>
  );
};

export default PreviewPane;
