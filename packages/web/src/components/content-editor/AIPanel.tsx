'use client';

import React, { useEffect, useRef, useState } from 'react';
import AISuggestionsPanel from './AISuggestionsPanel';
import SEOPanel from './SEOPanel'; // Assuming SEOPanel exists and is relevant for Accessibility
import { AISuggestion } from '@/types/ai-suggestion';

interface AIPanelProps {
  onApplySuggestion: (suggestion: AISuggestion) => void;
  isOpen?: boolean; // Added for responsive control
  togglePanel?: () => void; // Added for responsive control
  isResponsive?: boolean; // Added to indicate responsive rendering
}

const AIPanel: React.FC<AIPanelProps> = ({ onApplySuggestion, isOpen, togglePanel, isResponsive }) => {
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1024);
    };

    if (isResponsive) {
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial check
    }

    return () => {
      if (isResponsive) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isResponsive]);

  useEffect(() => {
    if (isResponsive && offcanvasRef.current) {
      const offcanvas = new (window as any).bootstrap.Offcanvas(offcanvasRef.current);
      if (isOpen && isMobile) {
        offcanvas.show();
      } else {
        offcanvas.hide();
      }
    }
  }, [isOpen, isResponsive, isMobile]);

  if (isResponsive && isMobile) {
    return (
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="aiPanelOffcanvas"
        aria-labelledby="aiPanelOffcanvasLabel"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="aiPanelOffcanvasLabel">AI Panel</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={togglePanel}
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="card h-100"> {/* Card wrapper for consistency */}
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs" id="aiPanelTabs" role="tablist">
                <li className="nav-item">
                  <button
                    className="nav-link active"
                    id="accessibility-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#accessibility"
                    type="button"
                    role="tab"
                    aria-controls="accessibility"
                    aria-selected="true"
                  >
                    Accessibility
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    id="suggestions-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#suggestions"
                    type="button"
                    role="tab"
                    aria-controls="suggestions"
                    aria-selected="false"
                  >
                    Suggestions
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    id="variations-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#variations"
                    type="button"
                    role="tab"
                    aria-controls="variations"
                    aria-selected="false"
                  >
                    Variations
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body tab-content" id="aiPanelTabsContent">
              <div
                className="tab-pane fade show active"
                id="accessibility"
                role="tabpanel"
                aria-labelledby="accessibility-tab"
              >
                <SEOPanel />
              </div>
              <div className="tab-pane fade" id="suggestions" role="tabpanel" aria-labelledby="suggestions-tab">
                <AISuggestionsPanel onApplySuggestion={onApplySuggestion} />
              </div>
              <div className="tab-pane fade" id="variations" role="tabpanel" aria-labelledby="variations-tab">
                <h5>Content Variations</h5>
                <p>Generate different versions of your content here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isResponsive && isTablet) {
    return (
      <div className={`ai-panel-bottom-drawer ${isOpen ? 'show' : ''}`}>
        <div className="card h-100">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs" id="aiPanelTabs" role="tablist">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  id="accessibility-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#accessibility"
                  type="button"
                  role="tab"
                  aria-controls="accessibility"
                  aria-selected="true"
                >
                  Accessibility
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="suggestions-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#suggestions"
                  type="button"
                  role="tab"
                  aria-controls="suggestions"
                  aria-selected="false"
                >
                  Suggestions
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="variations-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#variations"
                  type="button"
                  role="tab"
                  aria-controls="variations"
                  aria-selected="false"
                >
                  Variations
                </button>
              </li>
            </ul>
            <button type="button" className="btn-close float-end" aria-label="Close" onClick={togglePanel}></button>
          </div>
          <div className="card-body tab-content" id="aiPanelTabsContent">
            <div
              className="tab-pane fade show active"
              id="accessibility"
              role="tabpanel"
              aria-labelledby="accessibility-tab"
            >
              <SEOPanel />
            </div>
            <div className="tab-pane fade" id="suggestions" role="tabpanel" aria-labelledby="suggestions-tab">
              <AISuggestionsPanel onApplySuggestion={onApplySuggestion} />
            </div>
            <div className="tab-pane fade" id="variations" role="tabpanel" aria-labelledby="variations-tab">
              <h5>Content Variations</h5>
              <p>Generate different versions of your content here.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default desktop rendering
  return (
    <div className="card h-100">
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs" id="aiPanelTabs" role="tablist">
          <li className="nav-item">
            <button
              className="nav-link active"
              id="accessibility-tab"
              data-bs-toggle="tab"
              data-bs-target="#accessibility"
              type="button"
              role="tab"
              aria-controls="accessibility"
              aria-selected="true"
            >
              Accessibility
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              id="suggestions-tab"
              data-bs-toggle="tab"
              data-bs-target="#suggestions"
              type="button"
              role="tab"
              aria-controls="suggestions"
              aria-selected="false"
            >
              Suggestions
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              id="variations-tab"
              data-bs-toggle="tab"
              data-bs-target="#variations"
              type="button"
              role="tab"
              aria-controls="variations"
              aria-selected="false"
            >
              Variations
            </button>
          </li>
        </ul>
      </div>
      <div className="card-body tab-content" id="aiPanelTabsContent">
        <div
          className="tab-pane fade show active"
          id="accessibility"
          role="tabpanel"
          aria-labelledby="accessibility-tab"
        >
          <SEOPanel />
        </div>
        <div className="tab-pane fade" id="suggestions" role="tabpanel" aria-labelledby="suggestions-tab">
          <AISuggestionsPanel onApplySuggestion={onApplySuggestion} />
        </div>
        <div className="tab-pane fade" id="variations" role="tabpanel" aria-labelledby="variations-tab">
          <h5>Content Variations</h5>
          <p>Generate different versions of your content here.</p>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
