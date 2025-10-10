'use client';

import React, { useState } from 'react';
import { Laptop, Tablet, Smartphone, GitCompare, Share } from 'lucide-react';

interface PreviewPaneProps {
  draftContent: string;
  publishedContent: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ draftContent, publishedContent }) => {
  const [view, setView] = useState<'desktop' | 'tablet' | 'mobile_portrait' | 'mobile_landscape'>('desktop');
  const [diffMode, setDiffMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'high_contrast'>('light');

  const renderContent = (content: string) => {
    return (
      <div
        className={`p-4 rounded-lg shadow-inner overflow-auto ${getThemeClasses()}`}
        dangerouslySetInnerHTML={{ __html: content || '<p>No content.</p>' }}
      />
    );
  };

  const getFrameWidth = () => {
    switch (view) {
      case 'mobile_portrait': return 'w-full max-w-sm h-96';
      case 'mobile_landscape': return 'w-full max-w-md h-48';
      case 'tablet': return 'w-full max-w-lg';
      case 'desktop':
      default: return 'w-full';
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark': return 'bg-gray-900 text-white';
      case 'high_contrast': return 'bg-black text-white';
      default: return 'bg-white text-black';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
          <button onClick={() => setView('desktop')} className={`p-2 rounded-md ${view === 'desktop' ? 'bg-white dark:bg-gray-700' : ''}`}><Laptop size={20} /></button>
          <button onClick={() => setView('tablet')} className={`p-2 rounded-md ${view === 'tablet' ? 'bg-white dark:bg-gray-700' : ''}`}><Tablet size={20} /></button>
          <button onClick={() => setView('mobile_portrait')} className={`p-2 rounded-md ${view === 'mobile_portrait' ? 'bg-white dark:bg-gray-700' : ''}`} title="Mobile Portrait"><Smartphone size={20} /></button>
          <button onClick={() => setView('mobile_landscape')} className={`p-2 rounded-md ${view === 'mobile_landscape' ? 'bg-white dark:bg-gray-700' : ''}`} title="Mobile Landscape"><Smartphone size={20} className="rotate-90" /></button>
        </div>
        <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
          <button onClick={() => setTheme('light')} className={`p-2 rounded-md ${theme === 'light' ? 'bg-white dark:bg-gray-700' : ''}`}>Light</button>
          <button onClick={() => setTheme('dark')} className={`p-2 rounded-md ${theme === 'dark' ? 'bg-white dark:bg-gray-700' : ''}`}>Dark</button>
          <button onClick={() => setTheme('high_contrast')} className={`p-2 rounded-md ${theme === 'high_contrast' ? 'bg-white dark:bg-gray-700' : ''}`}>HC</button>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setDiffMode(!diffMode)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${diffMode ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>
            <GitCompare size={16} />
            <span>Diff Mode</span>
          </button>
          <button onClick={() => navigator.share({ title: 'Preview', url: window.location.href })} className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-800">
            <Share size={16} />
            <span>Share</span>
          </button>
        </div>
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
