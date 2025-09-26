
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  colorBlindMode: 'none' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly';
  setColorBlindMode: (mode: 'none' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly') => void;
  fontSize: 'small' | 'medium' | 'large';
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly'>('none');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion(prev => !prev);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return prev;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize(prev => {
      if (prev === 'large') return 'medium';
      if (prev === 'medium') return 'small';
      return prev;
    });
  }, []);

  const value = useMemo(
    () => ({
      highContrast,
      toggleHighContrast,
      reducedMotion,
      toggleReducedMotion,
      colorBlindMode,
      setColorBlindMode,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
    }),
    [highContrast, toggleHighContrast, reducedMotion, toggleReducedMotion, colorBlindMode, setColorBlindMode, fontSize, increaseFontSize, decreaseFontSize]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
