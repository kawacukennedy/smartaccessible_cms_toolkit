'use client';

import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

interface UndoRedoContextType {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  addChange: (newState: string) => void;
  currentContent: string;
  history: string[]; // Expose history for versioning
  currentIndex: number; // Expose current index
  goToState: (index: number) => void; // Function to jump to a specific state
}

const UndoRedoContext = createContext<UndoRedoContextType | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const history = useRef<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentContent, setCurrentContent] = useState('');
  const { addNotification } = useNotifications();

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
      addNotification({ displayType: 'toast', style: 'info', message: 'Action undone' });
    } else {
      addNotification({ displayType: 'toast', style: 'warning', message: 'Cannot undo further.' });
    }
  }, [currentIndex, addNotification]);

  const redo = useCallback(() => {
    if (currentIndex < history.current.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      addNotification({ displayType: 'toast', style: 'info', message: 'Action redone' });
    } else {
      addNotification({ displayType: 'toast', style: 'warning', message: 'Cannot redo further.' });
    }
  }, [currentIndex, addNotification]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.current.length - 1;

  const goToState = useCallback((index: number) => {
    if (index >= 0 && index < history.current.length) {
      setCurrentIndex(index);
      addNotification({ displayType: 'toast', style: 'info', message: `Jumped to state ${index + 1}.` });
    } else {
      addNotification({ displayType: 'toast', style: 'error', message: 'Invalid state index.' });
    }
  }, [addNotification]);

  const value = useMemo(
    () => ({ canUndo, canRedo, undo, redo, addChange, currentContent, history: history.current, currentIndex, goToState }),
    [canUndo, canRedo, undo, redo, addChange, currentContent, history.current, currentIndex, goToState]
  );

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (context === undefined) {
    throw new Error('useUndoRedo must be used within an UndoRedoProvider');
  }
  return context;
};