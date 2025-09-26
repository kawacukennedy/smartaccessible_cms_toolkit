import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AISuggestionContextType {
  suggestions: string[];
  addSuggestion: (suggestion: string) => void;
}

const AISuggestionContext = createContext<AISuggestionContextType | undefined>(undefined);

export const AISuggestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const addSuggestion = (suggestion: string) => {
    setSuggestions((prev) => [...prev, suggestion]);
  };

  return (
    <AISuggestionContext.Provider value={{ suggestions, addSuggestion }}>
      {children}
    </AISuggestionContext.Provider>
  );
};

export const useAISuggestions = () => {
  const context = useContext(AISuggestionContext);
  if (!context) {
    throw new Error('useAISuggestions must be used within a AISuggestionProvider');
  }
  return context;
};