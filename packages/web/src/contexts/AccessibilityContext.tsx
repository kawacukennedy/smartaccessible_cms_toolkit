'use client';

import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'small' | 'medium' | 'large';
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  colorBlindMode: ColorBlindMode;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>('none');
  const [reducedMotion, setReducedMotion] = useState(false);

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  const increaseFontSize = () => {
    setFontSize((prev) => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'large';
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      if (prev === 'large') return 'medium';
      if (prev === 'medium') return 'small';
      return 'small';
    });
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      highContrast,
      toggleHighContrast,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      colorBlindMode,
      setColorBlindMode,
      reducedMotion,
      toggleReducedMotion,
    }),
    [highContrast, fontSize, colorBlindMode, reducedMotion]
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
