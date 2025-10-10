'use client';

import React, { createContext, useState, useContext, useCallback, useMemo, ReactNode } from 'react';
import { useVoiceNavigation, createDefaultVoiceCommands } from '../lib/voiceNavigation';
import { useGestureSupport, useKeyboardGestures } from '../lib/gestureSupport';
import { announceToScreenReader, manageFocus, useScreenReaderDetection, useHighContrastDetection } from '../lib/screenReader';

type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface AccessibilityContextType {
  // Existing features
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'small' | 'medium' | 'large';
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  colorBlindMode: ColorBlindMode;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;

  // Voice navigation
  voiceNavigationEnabled: boolean;
  toggleVoiceNavigation: () => void;
  startVoiceNavigation: () => void;
  stopVoiceNavigation: () => void;
  speak: (text: string) => void;

  // Gesture support
  gestureSupportEnabled: boolean;
  toggleGestureSupport: () => void;

  // Screen reader enhancements
  screenReaderEnhanced: boolean;
  toggleScreenReaderEnhanced: () => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;

  // Focus management
  moveFocusTo: (element: HTMLElement | null) => void;
  moveFocusToNext: () => void;
  moveFocusToPrevious: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Existing state
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('none');
  const [reducedMotion, setReducedMotion] = useState(false);

  // New accessibility features state
  const [voiceNavigationEnabled, setVoiceNavigationEnabled] = useState(false);
  const [gestureSupportEnabled, setGestureSupportEnabled] = useState(true);
  const [screenReaderEnhanced, setScreenReaderEnhanced] = useState(true);

  // Voice navigation setup
  const voiceCommands = createDefaultVoiceCommands({
    navigateTo: (page) => {
      // Implement navigation logic
      console.log(`Navigate to ${page}`);
      announceToScreenReader(`Navigating to ${page}`);
    },
    toggleMenu: () => {
      // Implement menu toggle
      console.log('Toggle menu');
      announceToScreenReader('Menu toggled');
    },
    search: (query) => {
      // Implement search
      console.log(`Search for ${query}`);
      announceToScreenReader(`Searching for ${query}`);
    },
    goBack: () => {
      window.history.back();
      announceToScreenReader('Going back');
    },
    scrollUp: () => {
      window.scrollBy(0, -window.innerHeight / 2);
      announceToScreenReader('Scrolled up');
    },
    scrollDown: () => {
      window.scrollBy(0, window.innerHeight / 2);
      announceToScreenReader('Scrolled down');
    }
  });

  const { startListening, stopListening, speak } = useVoiceNavigation(
    voiceCommands,
    { language: 'en-US', continuous: true }
  );

  // Screen reader detection
  useScreenReaderDetection();
  useHighContrastDetection();

  // Existing functions
  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const newValue = !prev;
      announceToScreenReader(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      let newSize: 'small' | 'medium' | 'large' = 'medium';
      if (prev === 'small') newSize = 'medium';
      else if (prev === 'medium') newSize = 'large';
      else newSize = 'large';

      announceToScreenReader(`Font size increased to ${newSize}`);
      return newSize;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => {
      let newSize: 'small' | 'medium' | 'large' = 'small';
      if (prev === 'large') newSize = 'medium';
      else if (prev === 'medium') newSize = 'small';
      else newSize = 'small';

      announceToScreenReader(`Font size decreased to ${newSize}`);
      return newSize;
    });
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => {
      const newValue = !prev;
      announceToScreenReader(`Reduced motion ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);

  // New functions
  const toggleVoiceNavigation = useCallback(() => {
    setVoiceNavigationEnabled((prev) => {
      const newValue = !prev;
      announceToScreenReader(`Voice navigation ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);

  const startVoiceNavigation = useCallback(() => {
    if (voiceNavigationEnabled) {
      startListening();
    }
  }, [voiceNavigationEnabled, startListening]);

  const stopVoiceNavigation = useCallback(() => {
    stopListening();
  }, [stopListening]);

  const toggleGestureSupport = useCallback(() => {
    setGestureSupportEnabled((prev) => {
      const newValue = !prev;
      announceToScreenReader(`Gesture support ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);

  const toggleScreenReaderEnhanced = useCallback(() => {
    setScreenReaderEnhanced((prev) => {
      const newValue = !prev;
      announceToScreenReader(`Screen reader enhancements ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);

  const moveFocusTo = useCallback((element: HTMLElement | null) => {
    manageFocus.moveTo(element);
  }, []);

  const moveFocusToNext = useCallback(() => {
    manageFocus.moveToNext();
  }, []);

  const moveFocusToPrevious = useCallback(() => {
    manageFocus.moveToPrevious();
  }, []);

  const value = useMemo(
    () => ({
      // Existing
      highContrast,
      toggleHighContrast,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      colorBlindMode,
      setColorBlindMode,
      reducedMotion,
      toggleReducedMotion,

      // Voice navigation
      voiceNavigationEnabled,
      toggleVoiceNavigation,
      startVoiceNavigation,
      stopVoiceNavigation,
      speak,

      // Gesture support
      gestureSupportEnabled,
      toggleGestureSupport,

      // Screen reader enhancements
      screenReaderEnhanced,
      toggleScreenReaderEnhanced,
      announce,

      // Focus management
      moveFocusTo,
      moveFocusToNext,
      moveFocusToPrevious,
    }),
    [
      highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize,
      colorBlindMode, reducedMotion, toggleReducedMotion,
      voiceNavigationEnabled, toggleVoiceNavigation, startVoiceNavigation, stopVoiceNavigation, speak,
      gestureSupportEnabled, toggleGestureSupport,
      screenReaderEnhanced, toggleScreenReaderEnhanced, announce,
      moveFocusTo, moveFocusToNext, moveFocusToPrevious
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
