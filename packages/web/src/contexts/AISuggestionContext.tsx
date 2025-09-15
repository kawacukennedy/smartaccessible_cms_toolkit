'use client';

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { AISuggestion } from '@/types/ai-suggestion';

interface AISuggestionContextType {
  suggestions: AISuggestion[];
  addSuggestion: (suggestion: Omit<AISuggestion, 'id'>) => void;
  applySuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
}

const AISuggestionContext = createContext<AISuggestionContextType | undefined>(undefined);

export const AISuggestionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const addSuggestion = useCallback((suggestion: Omit<AISuggestion, 'id'>) => {
    const newSuggestion: AISuggestion = {
      id: Date.now().toString(),
      ...suggestion,
    };
    setSuggestions((prev) => [...prev, newSuggestion]);
  }, []);

  const applySuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    // In a real app, apply the suggestion to the content
    console.log(`Applied suggestion: ${id}`);
  }, []);

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    console.log(`Rejected suggestion: ${id}`);
  }, []);

  const value = useMemo(
    () => ({ suggestions, addSuggestion, applySuggestion, rejectSuggestion }),
    [suggestions, addSuggestion, applySuggestion, rejectSuggestion]
  );

  return (
    <AISuggestionContext.Provider value={value}>
      {children}
    </AISuggestionContext.Provider>
  );
};

export const useAISuggestions = () => {
  const context = useContext(AISuggestionContext);
  if (context === undefined) {
    throw new Error('useAISuggestions must be used within an AISuggestionProvider');
  }
  return context;
};
