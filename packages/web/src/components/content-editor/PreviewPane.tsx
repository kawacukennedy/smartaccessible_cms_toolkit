'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

interface PreviewPaneProps {
  draftContent: string;
  publishedContent: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ draftContent, publishedContent }) => {
  const [view, setView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [diffMode, setDiffMode] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50); // Percentage
  const dividerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPosition = localStorage.getItem('previewDividerPosition');
    if (storedPosition) {
      setDividerPosition(parseFloat(storedPosition));
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        let newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        newPosition = Math.max(10, Math.min(90, newPosition)); // Keep within 10% and 90%
        setDividerPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      localStorage.setItem('previewDividerPosition', dividerPosition.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [dividerPosition]);

  const renderContent = (content: string) => {
    // In a real application, this would render the content securely within an iframe
    // For now, we'll just display it as raw HTML or text
    return (
      <div
        className="preview-content p-3"
        dangerouslySetInnerHTML={{ __html: content || '<p>No content to display.</p>' }}
      />
    );
  };

  const getFrameWidth = () => {
    switch (view) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  return (
    <div className="preview-pane border rounded bg-light d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
        <ButtonGroup aria-label="Preview Views">
          <Button variant={view === 'desktop' ? 'primary' : 'outline-secondary'} onClick={() => setView('desktop')}>
            <i className="bi bi-laptop"></i> Desktop
          </Button>
          <Button variant={view === 'tablet' ? 'primary' : 'outline-secondary'} onClick={() => setView('tablet')}>
            <i className="bi bi-tablet"></i> Tablet
          </Button>
          <Button variant={view === 'mobile' ? 'primary' : 'outline-secondary'} onClick={() => setView('mobile')}>
            <i className="bi bi-phone"></i> Mobile
          </Button>
        </ButtonGroup>
        <Button
          variant={diffMode ? 'primary' : 'outline-secondary'}
          onClick={() => setDiffMode(!diffMode)}
        >
          <i className="bi bi-git"></i> Diff Mode
        </Button>
      </div>

      <div ref={containerRef} className="preview-container flex-grow-1 d-flex position-relative overflow-hidden">
        {diffMode ? (
          <>
            <div style={{ width: `${dividerPosition}%`, overflow: 'auto' }} className="h-100 border-end">
              <h6 className="text-center mt-2">Draft</h6>
              <div style={{ width: getFrameWidth(), margin: '0 auto' }}>
                {renderContent(draftContent)}
              </div>
            </div>
            <div
              ref={dividerRef}
              className="preview-divider position-absolute top-0 bottom-0 bg-secondary"
              style={{ left: `${dividerPosition}%`, width: '8px', cursor: 'ew-resize', transform: 'translateX(-50%)', zIndex: 100 }}
              onMouseDown={handleMouseDown}
              aria-label="Resize preview panes"
            ></div>
            <div style={{ width: `${100 - dividerPosition}%`, overflow: 'auto' }} className="h-100">
              <h6 className="text-center mt-2">Published</h6>
              <div style={{ width: getFrameWidth(), margin: '0 auto' }}>
                {renderContent(publishedContent)}
              </div>
            </div>
          </>
        ) : (
          <div style={{ width: getFrameWidth(), margin: '0 auto', overflow: 'auto' }} className="h-100">
            {renderContent(draftContent)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPane;