'use client';

import React, { useEffect, useRef, useState } from 'react';
import AISuggestionsPanel from './AISuggestionsPanel';
import SEOPanel from './SEOPanel'; // Assuming SEOPanel exists and is relevant for Accessibility
import { AISuggestion } from '@/types/ai-suggestion';
import { useUndoRedo } from '@/contexts/UndoRedoContext'; // Import useUndoRedo
import { useNotifications } from '@/contexts/NotificationContext'; // Import useNotifications

interface AIPanelProps {
  onApplySuggestion: (suggestion: AISuggestion) => void;
  isOpen?: boolean; // Added for responsive control
  togglePanel?: () => void; // Added for responsive control
  isResponsive?: boolean; // Added to indicate responsive rendering
  onAIScanRequest?: () => void; // New prop to trigger AI scan status updates
}

const AIPanel: React.FC<AIPanelProps> = ({ onApplySuggestion, isOpen, togglePanel, isResponsive, onAIScanRequest }) => {
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [variationPrompt, setVariationPrompt] = useState('');
  const [generatedVariation, setGeneratedVariation] = useState('');
  const [aiScanStatus, setAiScanStatus] = useState<'idle' | 'queued' | 'running' | 'done' | 'failed'>('idle'); // AI Scan status
  const { currentContent } = useUndoRedo(); // Get current content from UndoRedoContext
  const { addNotification } = useNotifications(); // Use notifications for AI scan feedback

  const handleGenerateVariation = () => {
    setAiScanStatus('queued');
    addNotification({ displayType: 'toast', style: 'info', message: 'AI scan queued.' });
    // In a real application, this would involve an API call to an AI model
    // For now, we'll just simulate a variation based on the prompt and current content
    setTimeout(() => {
      setAiScanStatus('running');
      addNotification({ displayType: 'toast', style: 'info', message: 'AI scan in progress…' });
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        if (success) {
          const simulatedVariation = `Based on your prompt: "${variationPrompt}" and current content: "${currentContent.substring(0, 50)}...", here is a generated variation.`;
          setGeneratedVariation(simulatedVariation);
          setAiScanStatus('done');
          addNotification({ displayType: 'toast', style: 'success', message: 'AI scan complete.' });
        } else {
          setGeneratedVariation('Failed to generate variation. Please try again.');
          setAiScanStatus('failed');
          addNotification({ displayType: 'toast', style: 'error', message: 'AI scan failed. Retry?' });
        }
        setTimeout(() => setAiScanStatus('idle'), 3000); // Reset status after 3 seconds
      }, 2000); // Simulate AI processing delay
    }, 500); // Simulate queue delay
  };

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

  const renderAIPanelContent = () => (
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
        {aiScanStatus !== 'idle' && (
          <div role="status" aria-live="polite" className="mb-3 text-muted">
            {aiScanStatus === 'queued' && 'AI scan queued'}
            {aiScanStatus === 'running' && 'AI scan in progress…'}
            {aiScanStatus === 'done' && 'AI scan complete'}
            {aiScanStatus === 'failed' && 'AI scan failed. Retry?'}
          </div>
        )}
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
          <div className="mb-3">
            <label htmlFor="variationPrompt" className="form-label">Prompt for Variation</label>
            <textarea
              className="form-control"
              id="variationPrompt"
              rows={3}
              value={variationPrompt}
              onChange={(e) => setVariationPrompt(e.target.value)}
              placeholder="e.g., Make it more concise, Change the tone to formal."
              aria-label="Enter prompt for AI content variation"
            ></textarea>
          </div>
          <button className="btn btn-primary mb-3" onClick={handleGenerateVariation} aria-label="Generate AI content variation">
            Generate Variation
          </button>
          {generatedVariation && (
            <div className="card bg-light p-3" role="region" aria-live="polite">
              <h6>Generated Variation:</h6>
              <p>{generatedVariation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isResponsive && isMobile) {
    return (
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="aiPanelOffcanvas"
        aria-labelledby="aiPanelOffcanvasLabel"
        aria-modal="true" // Indicate that it's a modal dialog
        role="dialog" // Indicate that it's a modal dialog
        ref={offcanvasRef}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="aiPanelOffcanvasLabel">AI Panel</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close AI Panel"
            onClick={togglePanel}
          ></button>
        </div>
        <div className="offcanvas-body">
          {renderAIPanelContent()}
        </div>
      </div>
    );
  }

  if (isResponsive && isTablet) {
    return (
      <div className={`ai-panel-bottom-drawer ${isOpen ? 'show' : ''}`} role="dialog" aria-modal="true" aria-label="AI Panel">
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
            <button type="button" className="btn-close float-end" aria-label="Close AI Panel" onClick={togglePanel}></button>
          </div>
          <div className="card-body tab-content" id="aiPanelTabsContent">
            {aiScanStatus !== 'idle' && (
              <div role="status" aria-live="polite" className="mb-3 text-muted">
                {aiScanStatus === 'queued' && 'AI scan queued'}
                {aiScanStatus === 'running' && 'AI scan in progress…'}
                {aiScanStatus === 'done' && 'AI scan complete'}
                {aiScanStatus === 'failed' && 'AI scan failed. Retry?'}
              </div>
            )}
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
              <div className="mb-3">
                  <label htmlFor="variationPrompt" className="form-label">Prompt for Variation</label>
                  <textarea
                    className="form-control"
                    id="variationPrompt"
                    rows={3}
                    value={variationPrompt}
                    onChange={(e) => setVariationPrompt(e.target.value)}
                    placeholder="e.g., Make it more concise, Change the tone to formal."
                    aria-label="Enter prompt for AI content variation"
                  ></textarea>
                </div>
                <button className="btn btn-primary mb-3" onClick={handleGenerateVariation} aria-label="Generate AI content variation">
                  Generate Variation
                </button>
                {generatedVariation && (
                  <div className="card bg-light p-3" role="region" aria-live="polite">
                    <h6>Generated Variation:</h6>
                    <p>{generatedVariation}</p>
                  </div>
                )}
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
        {aiScanStatus !== 'idle' && (
          <div role="status" aria-live="polite" className="mb-3 text-muted">
            {aiScanStatus === 'queued' && 'AI scan queued'}
            {aiScanStatus === 'running' && 'AI scan in progress…'}
            {aiScanStatus === 'done' && 'AI scan complete'}
            {aiScanStatus === 'failed' && 'AI scan failed. Retry?'}
          </div>
        )}
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
          <div className="mb-3">
            <label htmlFor="variationPrompt" className="form-label">Prompt for Variation</label>
            <textarea
              className="form-control"
              id="variationPrompt"
              rows={3}
              value={variationPrompt}
              onChange={(e) => setVariationPrompt(e.target.value)}
              placeholder="e.g., Make it more concise, Change the tone to formal."
              aria-label="Enter prompt for AI content variation"
            ></textarea>
          </div>
          <button className="btn btn-primary mb-3" onClick={handleGenerateVariation} aria-label="Generate AI content variation">
            Generate Variation
          </button>
          {generatedVariation && (
            <div className="card bg-light p-3" role="region" aria-live="polite">
              <h6>Generated Variation:</h6>
              <p>{generatedVariation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;