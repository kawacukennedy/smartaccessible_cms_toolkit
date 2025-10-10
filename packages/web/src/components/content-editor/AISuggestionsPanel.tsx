'use client';

import React, { useState, useEffect } from 'react';
import { useAISuggestions } from '@/contexts/AISuggestionContext';
import { AISuggestion } from '@/types/ai-suggestion';
import { analyzeContent, generateAISuggestions, generateRealTimeSuggestions } from '@/lib/ai-suggestions';
import { TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Target, Eye } from 'lucide-react';

interface AISuggestionsPanelProps {
  onApplySuggestion: (suggestion: AISuggestion) => void;
  currentContent?: string;
  previousContent?: string;
}

const getConfidenceColorClass = (confidence: number) => {
  if (confidence > 75) return 'list-group-item-success'; // High confidence
  if (confidence >= 50) return 'list-group-item-warning'; // Medium confidence
  return 'list-group-item-danger'; // Low confidence
};

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  onApplySuggestion,
  currentContent = '',
  previousContent = ''
}) => {
  const { suggestions, applySuggestion, rejectSuggestion, clearSuggestions } = useAISuggestions();
  const [contentAnalysis, setContentAnalysis] = useState<any>(null);
  const [realTimeSuggestions, setRealTimeSuggestions] = useState<AISuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis' | 'insights'>('suggestions');

  // Analyze content when it changes
  useEffect(() => {
    if (currentContent) {
      const analysis = analyzeContent(currentContent);
      setContentAnalysis(analysis);

      // Generate real-time suggestions
      const rtSuggestions = generateRealTimeSuggestions(currentContent, previousContent);
      setRealTimeSuggestions(rtSuggestions);
    }
  }, [currentContent, previousContent]);

  const handleApply = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion); // Call the passed handler
    applySuggestion(suggestion.id); // Remove from panel
  };

  const handleApplyAllSafe = () => {
    const safeSuggestions = suggestions.filter(s => s.confidence > 75); // Assuming >75% is 'safe'
    safeSuggestions.forEach(suggestion => onApplySuggestion(suggestion));
    clearSuggestions(); // Clear all suggestions after applying
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle size={16} className="text-success" />;
    if (score >= 60) return <AlertTriangle size={16} className="text-warning" />;
    return <AlertTriangle size={16} className="text-danger" />;
  };

  return (
    <div className="card h-100" role="complementary" aria-label="AI Suggestions Panel">
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="ai-panel-status">
        {suggestions.length + realTimeSuggestions.length > 0
          ? `${suggestions.length + realTimeSuggestions.length} AI suggestions available`
          : 'No AI suggestions available'}
      </div>

      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'suggestions' ? 'active' : ''}`}
              onClick={() => setActiveTab('suggestions')}
              role="tab"
            >
              <Lightbulb size={14} className="me-1" />
              Suggestions ({suggestions.length + realTimeSuggestions.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
              role="tab"
            >
              <TrendingUp size={14} className="me-1" />
              Analysis
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
              role="tab"
            >
              <Target size={14} className="me-1" />
              Insights
            </button>
          </li>
        </ul>
      </div>

      <div className="card-body overflow-auto">
        {activeTab === 'suggestions' && (
          <>
            {[...suggestions, ...realTimeSuggestions].length === 0 ? (
              <div className="text-center text-muted py-4">
                <Lightbulb size={48} className="mb-3 opacity-50" />
                <p>No AI suggestions available.</p>
                <small>Start writing to get real-time suggestions!</small>
              </div>
            ) : (
              <>
                <ul className="list-group mb-3">
                  {[...suggestions, ...realTimeSuggestions].map((suggestion: AISuggestion) => (
                    <li key={suggestion.id} className={`list-group-item ${getConfidenceColorClass(suggestion.confidence)}`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <span className="badge bg-secondary me-2">{suggestion.type}</span>
                            <small className="text-muted">{suggestion.confidence}% confidence</small>
                          </div>
                          <strong>{suggestion.message}</strong>
                          <p className="mb-2 text-muted small">{suggestion.recommendation}</p>
                          {suggestion.autoFix && (
                            <span className="badge bg-info">Auto-fix available</span>
                          )}
                        </div>
                        <div className="ms-2">
                          <button
                            className="btn btn-success btn-sm me-1"
                            onClick={() => handleApply(suggestion)}
                            title="Apply suggestion"
                          >
                            Apply
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => rejectSuggestion(suggestion.id)}
                            title="Reject suggestion"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary flex-fill" onClick={handleApplyAllSafe}>
                    Apply Safe Suggestions
                  </button>
                  <button className="btn btn-outline-secondary" onClick={clearSuggestions}>
                    Clear All
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'analysis' && contentAnalysis && (
          <div className="analysis-content">
            <div className="row g-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title d-flex align-items-center">
                      <Eye className="me-2" />
                      Readability
                    </h6>
                    <div className="d-flex align-items-center mb-2">
                      {getScoreIcon(contentAnalysis.readability.score)}
                      <span className={`ms-2 fw-bold ${getScoreColor(contentAnalysis.readability.score)}`}>
                        {contentAnalysis.readability.score.toFixed(1)}% - {contentAnalysis.readability.level}
                      </span>
                    </div>
                    <ul className="list-unstyled small">
                      {contentAnalysis.readability.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title d-flex align-items-center">
                      <Target className="me-2" />
                      SEO Score
                    </h6>
                    <div className="d-flex align-items-center mb-2">
                      {getScoreIcon(contentAnalysis.seo.score)}
                      <span className={`ms-2 fw-bold ${getScoreColor(contentAnalysis.seo.score)}`}>
                        {contentAnalysis.seo.score.toFixed(1)}%
                      </span>
                    </div>
                    <p className="small mb-2">Top keywords: {contentAnalysis.seo.keywords.slice(0, 5).join(', ')}</p>
                    <ul className="list-unstyled small">
                      {contentAnalysis.seo.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title d-flex align-items-center">
                      <CheckCircle className="me-2" />
                      Accessibility
                    </h6>
                    <div className="d-flex align-items-center mb-2">
                      {getScoreIcon(contentAnalysis.accessibility.score)}
                      <span className={`ms-2 fw-bold ${getScoreColor(contentAnalysis.accessibility.score)}`}>
                        {contentAnalysis.accessibility.score.toFixed(1)}%
                      </span>
                    </div>
                    {contentAnalysis.accessibility.issues.length > 0 && (
                      <ul className="list-unstyled small text-danger">
                        {contentAnalysis.accessibility.issues.map((issue: string, index: number) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && contentAnalysis && (
          <div className="insights-content">
            <div className="row g-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Content Insights</h6>
                    <div className="mb-3">
                      <strong>Sentiment:</strong>
                      <span className={`ms-2 badge ${
                        contentAnalysis.sentiment.label === 'positive' ? 'bg-success' :
                        contentAnalysis.sentiment.label === 'negative' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {contentAnalysis.sentiment.label}
                      </span>
                    </div>
                    <div className="mb-3">
                      <strong>Primary Tone:</strong>
                      <span className="ms-2 badge bg-info">{contentAnalysis.tone.primary}</span>
                    </div>
                    <div>
                      <strong>Tone Suggestions:</strong>
                      <ul className="list-unstyled small mt-2">
                        {contentAnalysis.tone.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Content Statistics</h6>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="fw-bold fs-4">{currentContent.split(/\s+/).length}</div>
                        <small className="text-muted">Words</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold fs-4">{currentContent.split(/[.!?]+/).length}</div>
                        <small className="text-muted">Sentences</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold fs-4">{currentContent.length}</div>
                        <small className="text-muted">Characters</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
