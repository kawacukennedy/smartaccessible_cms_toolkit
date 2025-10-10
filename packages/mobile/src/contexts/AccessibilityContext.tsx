
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { AccessibilityInfo, Vibration } from 'react-native';

interface AccessibilityContextType {
  // Existing features
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  colorBlindMode: 'none' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly';
  setColorBlindMode: (mode: 'none' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly') => void;
  fontSize: 'small' | 'medium' | 'large';
  increaseFontSize: () => void;
  decreaseFontSize: () => void;

  // New mobile-specific features
  voiceOverEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  toggleHapticFeedback: () => void;
  largeTextEnabled: boolean;
  toggleLargeText: () => void;
  buttonShapesEnabled: boolean;
  toggleButtonShapes: () => void;

  // Gesture and interaction helpers
  announceForAccessibility: (message: string) => void;
  performHapticFeedback: (type?: 'light' | 'medium' | 'heavy') => void;
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
  // Existing state
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly'>('none');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // New mobile-specific state
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);
  const [largeTextEnabled, setLargeTextEnabled] = useState(false);
  const [buttonShapesEnabled, setButtonShapesEnabled] = useState(false);

  // Check VoiceOver status on mount
  React.useEffect(() => {
    const checkVoiceOver = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setVoiceOverEnabled(enabled);
    };

    checkVoiceOver();

    // Listen for VoiceOver changes
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setVoiceOverEnabled);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Existing functions
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

  // New mobile-specific functions
  const toggleHapticFeedback = useCallback(() => {
    setHapticFeedbackEnabled(prev => !prev);
  }, []);

  const toggleLargeText = useCallback(() => {
    setLargeTextEnabled(prev => !prev);
  }, []);

  const toggleButtonShapes = useCallback(() => {
    setButtonShapesEnabled(prev => !prev);
  }, []);

  const announceForAccessibility = useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const performHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!hapticFeedbackEnabled) return;

    switch (type) {
      case 'light':
        Vibration.vibrate(50);
        break;
      case 'medium':
        Vibration.vibrate(100);
        break;
      case 'heavy':
        Vibration.vibrate([0, 100, 50, 100]);
        break;
    }
  }, [hapticFeedbackEnabled]);

  const value = useMemo(
    () => ({
      // Existing
      highContrast,
      toggleHighContrast,
      reducedMotion,
      toggleReducedMotion,
      colorBlindMode,
      setColorBlindMode,
      fontSize,
      increaseFontSize,
      decreaseFontSize,

      // New mobile features
      voiceOverEnabled,
      hapticFeedbackEnabled,
      toggleHapticFeedback,
      largeTextEnabled,
      toggleLargeText,
      buttonShapesEnabled,
      toggleButtonShapes,

      // Helpers
      announceForAccessibility,
      performHapticFeedback,
    }),
    [
      highContrast, toggleHighContrast, reducedMotion, toggleReducedMotion,
      colorBlindMode, setColorBlindMode, fontSize, increaseFontSize, decreaseFontSize,
      voiceOverEnabled, hapticFeedbackEnabled, toggleHapticFeedback,
      largeTextEnabled, toggleLargeText, buttonShapesEnabled, toggleButtonShapes,
      announceForAccessibility, performHapticFeedback
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
