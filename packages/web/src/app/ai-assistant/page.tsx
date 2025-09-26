'use client';

import React, { useState } from 'react';
import AISuggestionsPanel from '@/components/content-editor/AISuggestionsPanel';
import SEOPanel from '@/components/content-editor/SEOPanel';
import { AISuggestion } from '@/types/ai-suggestion';
import { useUndoRedo } from '@/contexts/UndoRedoContext';

const AIAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [variationPrompt, setVariationPrompt] = useState('');
  const [generatedVariation, setGeneratedVariation] = useState('');
  const { currentContent } = useUndoRedo();

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    // This would typically apply the suggestion to the current content
    // For this standalone page, we'll just log it for now.
    console.log('Applying suggestion:', suggestion);
  };

  const handleGenerateVariation = () => {
    const simulatedVariation = `Based on your prompt: "${variationPrompt}" and current content: "${currentContent.substring(0, 50)}...", here is a generated variation.`;
    setGeneratedVariation(simulatedVariation);
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">AI Assistant</h1>
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">AI Sections</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <button className={`btn btn-link ${activeTab === 'suggestions' ? 'active' : ''}`} onClick={() => setActiveTab('suggestions')}>Suggestions</button>
              </li>
              <li className="list-group-item">
                <button className={`btn btn-link ${activeTab === 'accessibility' ? 'active' : ''}`} onClick={() => setActiveTab('accessibility')}>Accessibility</button>
              </li>
              <li className="list-group-item">
                <button className={`btn btn-link ${activeTab === 'variations' ? 'active' : ''}`} onClick={() => setActiveTab('variations')}>Variations</button>
              </li>
              {/* Add more AI sections as needed */}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              {activeTab === 'suggestions' && (
                <AISuggestionsPanel onApplySuggestion={handleApplySuggestion} />
              )}
              {activeTab === 'accessibility' && (
                <SEOPanel /> // Reusing SEOPanel for accessibility for now
              )}
              {activeTab === 'variations' && (
                <div className="p-3">
                  <div className="mb-3">
                    <label htmlFor="variationPrompt" className="form-label">Prompt for Variation</label>
                    <textarea
                      className="form-control"
                      id="variationPrompt"
                      rows={3}
                      value={variationPrompt}
                      onChange={(e) => setVariationPrompt(e.target.value)}
                      placeholder="e.g., Make it more concise, Change the tone to formal."
                    ></textarea>
                  </div>
                  <button className="btn btn-primary mb-3" onClick={handleGenerateVariation}>
                    Generate Variation
                  </button>
                  {generatedVariation && (
                    <div className="card bg-light p-3">
                      <h6>Generated Variation:</h6>
                      <p>{generatedVariation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
