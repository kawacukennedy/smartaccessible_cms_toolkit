'use client';

import React from 'react';
import { useAISuggestions } from '@/contexts/AISuggestionContext';
import { AISuggestion } from '@/types/ai-suggestion';

interface AISuggestionsPanelProps {
  onApplySuggestion: (suggestion: AISuggestion) => void;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ onApplySuggestion }) => {
  const { suggestions, applySuggestion, rejectSuggestion, clearSuggestions } = useAISuggestions();

  const handleApply = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion); // Call the passed handler
    applySuggestion(suggestion.id); // Remove from panel
  };

  const handleApplyAll = () => {
    suggestions.forEach(suggestion => onApplySuggestion(suggestion));
    clearSuggestions(); // Clear all suggestions after applying
  };

  return (
    <div className="card h-100">
      <div className="card-header">AI Suggestions</div>
      <div className="card-body overflow-auto">
        {suggestions.length === 0 ? (
          <p>No AI suggestions available.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {suggestions.map((suggestion: AISuggestion) => (
                <li key={suggestion.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{suggestion.type}:</strong> {suggestion.message} (Confidence: {suggestion.confidence}%)
                  </div>
                  <div>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApply(suggestion)}
                    >
                      Apply
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectSuggestion(suggestion.id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary w-100" onClick={handleApplyAll}>
              Apply All Suggestions
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
