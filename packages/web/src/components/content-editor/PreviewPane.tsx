'use client';

import React, { useState } from 'react';

interface PreviewPaneProps {
  content: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content }) => {
  const [view, setView] = useState('desktop'); // 'desktop', 'tablet', 'mobile'

  const getFrameStyle = () => {
    switch (view) {
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
        <h5>Preview</h5>
        <div>
          <button
            className={`btn btn-sm me-1 ${view === 'desktop' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setView('desktop')}
            title="Desktop View"
          >
            <i className="bi bi-laptop"></i>
          </button>
          <button
            className={`btn btn-sm me-1 ${view === 'tablet' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setView('tablet')}
            title="Tablet View"
          >
            <i className="bi bi-tablet"></i>
          </button>
          <button
            className={`btn btn-sm ${view === 'mobile' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setView('mobile')}
            title="Mobile View"
          >
            <i className="bi bi-phone"></i>
          </button>
        </div>
      </div>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center p-3 overflow-auto">
        <div
          className="preview-frame border bg-white shadow-sm"
          style={{
            ...getFrameStyle(),
            overflow: 'auto',
            transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
          }}
        >
          <div className="p-3">
            {/* Render the content here. For now, just plain text. */}
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPane;
