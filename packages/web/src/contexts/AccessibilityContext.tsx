'use client';

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  colorBlindMode: ColorBlindMode;
  setColorBlindMode: (mode: ColorBlindMode) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('none');

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 24)); // Max font size 24px
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 12)); // Min font size 12px
  }, []);

  const value = useMemo(
    () => ({
      highContrast,
      toggleHighContrast,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      colorBlindMode,
      setColorBlindMode,
    }),
    [highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize, colorBlindMode, setColorBlindMode]
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
