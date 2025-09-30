'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { AISuggestion } from '@/types/ai-suggestion';
import { useUndoRedo } from './UndoRedoContext';

interface AISuggestionContextType {
  suggestions: AISuggestion[];
  addSuggestion: (suggestion: Omit<AISuggestion, 'id'>) => void;
  applySuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  clearSuggestions: () => void;
  setSuggestions: (suggestions: AISuggestion[]) => void; // New method to set suggestions directly
}

const AISuggestionContext = createContext<AISuggestionContextType | undefined>(undefined);

export const AISuggestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestionsState] = useState<AISuggestion[]>([]);
  const { addChange } = useUndoRedo();

  const addSuggestion = useCallback((suggestion: Omit<AISuggestion, 'id'>) => {
    const newSuggestion: AISuggestion = { ...suggestion, id: Date.now().toString() };
    setSuggestionsState((prev) => [...prev, newSuggestion]);
  }, []);

  const applySuggestion = useCallback((id: string) => {
    setSuggestionsState((prev) => prev.filter((s) => s.id !== id));
    // In a real application, this would also trigger an action to apply the suggestion to the content
  }, []);

  const rejectSuggestion = useCallback((id: string) => {
    setSuggestionsState((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestionsState([]);
  }, []);

  const setSuggestions = useCallback((newSuggestions: AISuggestion[]) => {
    setSuggestionsState(newSuggestions);
  }, []);

  return (
    <AISuggestionContext.Provider
      value={{
        suggestions,
        addSuggestion,
        applySuggestion,
        rejectSuggestion,
        clearSuggestions,
        setSuggestions,
      }}
    >
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
