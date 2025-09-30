'use client';

import React from 'react';
import { useAISuggestions } from '@/contexts/AISuggestionContext';
import { AISuggestion } from '@/types/ai-suggestion';

interface AISuggestionsPanelProps {
  onApplySuggestion: (suggestion: AISuggestion) => void;
}

const getConfidenceColorClass = (confidence: number) => {
  if (confidence > 75) return 'list-group-item-success'; // High confidence
  if (confidence >= 50) return 'list-group-item-warning'; // Medium confidence
  return 'list-group-item-danger'; // Low confidence
};

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ onApplySuggestion }) => {
  const { suggestions, applySuggestion, rejectSuggestion, clearSuggestions } = useAISuggestions();

  const handleApply = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion); // Call the passed handler
    applySuggestion(suggestion.id); // Remove from panel
  };

  const handleApplyAllSafe = () => {
    const safeSuggestions = suggestions.filter(s => s.confidence > 75); // Assuming >75% is 'safe'
    safeSuggestions.forEach(suggestion => onApplySuggestion(suggestion));
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
                <li key={suggestion.id} className={`list-group-item d-flex justify-content-between align-items-center ${getConfidenceColorClass(suggestion.confidence)}`}>
                  <div>
                    <strong>{suggestion.type}:</strong> {suggestion.message} (Confidence: {suggestion.confidence}%)<br/>
                    <small>Recommendation: {suggestion.recommendation}</small>
                  </div>
                  <div>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApply(suggestion)}
                    >
                      Apply Suggestion
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectSuggestion(suggestion.id)}
                    >
                      Reject Suggestion
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary w-100 mb-2" onClick={handleApplyAllSafe}>
              Apply All Safe Suggestions
            </button>
            <button className="btn btn-outline-secondary w-100" onClick={clearSuggestions}>
              Clear All Suggestions
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
