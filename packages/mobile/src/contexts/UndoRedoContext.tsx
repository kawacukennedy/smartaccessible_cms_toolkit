'use client';

import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';

interface UndoRedoContextType {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  addChange: (newState: string) => void;
  currentContent: string;
  feedbackMessage: string; // New: feedback message for undo/redo actions
}

const UndoRedoContext = createContext<UndoRedoContextType | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const history = useRef<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentContent, setCurrentContent] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(''); // New state for feedback message

  // Update currentContent when currentIndex or history changes
  useEffect(() => {
    if (currentIndex >= 0 && history.current[currentIndex] !== undefined) {
      setCurrentContent(history.current[currentIndex]);
    } else {
      setCurrentContent(''); // Or initial content if applicable
    }
  }, [currentIndex, history]);

  const addChange = useCallback((newState: string) => {
    // Only add if the new state is different from the current state
    if (newState === history.current[currentIndex]) {
      return;
    }

    // If we are not at the end of history, truncate it
    if (currentIndex < history.current.length - 1) {
      history.current = history.current.slice(0, currentIndex + 1);
    }
    history.current.push(newState);
    setCurrentIndex(history.current.length - 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFeedbackMessage('Undo successful.');
    } else {
      setFeedbackMessage('Cannot undo further.');
    }
    setTimeout(() => setFeedbackMessage(''), 2000); // Clear feedback after 2 seconds
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.current.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFeedbackMessage('Redo successful.');
    } else {
      setFeedbackMessage('Cannot redo further.');
    }
    setTimeout(() => setFeedbackMessage(''), 2000); // Clear feedback after 2 seconds
  }, [currentIndex]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.current.length - 1;

  const value = useMemo(
    () => ({ canUndo, canRedo, undo, redo, addChange, currentContent, feedbackMessage }),
    [canUndo, canRedo, undo, redo, addChange, currentContent, feedbackMessage]
  );

  return (
    <UndoRedoContext.Provider value={value}>
      {children}
    </UndoRedoContext.Provider>
  );
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (context === undefined) {
    throw new Error('useUndoRedo must be used within an UndoRedoProvider');
  }
  return context;
};