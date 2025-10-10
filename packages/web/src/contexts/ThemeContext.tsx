'use client';

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { CustomTheme, predefinedThemes, applyTheme } from '../lib/themeBuilder';

type Theme = 'light' | 'dark' | 'high_contrast' | 'sepia' | 'solarized';

interface ThemeContextType {
  // Legacy theme support
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Advanced theming
  currentTheme: CustomTheme;
  customThemes: CustomTheme[];
  setCustomTheme: (theme: CustomTheme) => void;
  addCustomTheme: (theme: CustomTheme) => void;
  removeCustomTheme: (themeName: string) => void;
  loadThemeFromStorage: () => void;
  saveThemeToStorage: (theme: CustomTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Legacy theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'light';
    }
    return 'light';
  });

  // Advanced theming state
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(predefinedThemes.light);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  // Load themes from storage on mount
  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  // Apply theme when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Legacy theme effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      // Sync with advanced theming
      const legacyTheme = predefinedThemes[theme];
      if (legacyTheme) {
        setCurrentTheme(legacyTheme);
      }
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setCustomTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    saveThemeToStorage(theme);
  };

  const addCustomTheme = (theme: CustomTheme) => {
    setCustomThemes(prev => {
      const existing = prev.find(t => t.name === theme.name);
      if (existing) {
        // Update existing
        return prev.map(t => t.name === theme.name ? theme : t);
      } else {
        // Add new
        return [...prev, theme];
      }
    });
    saveCustomThemesToStorage([...customThemes, theme]);
  };

  const removeCustomTheme = (themeName: string) => {
    setCustomThemes(prev => prev.filter(t => t.name !== themeName));
    const updatedThemes = customThemes.filter(t => t.name !== themeName);
    saveCustomThemesToStorage(updatedThemes);
  };

  const loadThemeFromStorage = () => {
    if (typeof window === 'undefined') return;

    try {
      // Load current theme
      const savedTheme = localStorage.getItem('currentTheme');
      if (savedTheme) {
        const themeData = JSON.parse(savedTheme);
        setCurrentTheme(themeData);
      }

      // Load custom themes
      const savedCustomThemes = localStorage.getItem('customThemes');
      if (savedCustomThemes) {
        const themesData = JSON.parse(savedCustomThemes);
        setCustomThemes(themesData);
      }
    } catch (error) {
      console.error('Failed to load themes from storage:', error);
    }
  };

  const saveThemeToStorage = (theme: CustomTheme) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('currentTheme', JSON.stringify(theme));
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  };

  const saveCustomThemesToStorage = (themes: CustomTheme[]) => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('customThemes', JSON.stringify(themes));
    } catch (error) {
      console.error('Failed to save custom themes to storage:', error);
    }
  };

  const value = useMemo(() => ({
    // Legacy
    theme,
    setTheme,

    // Advanced
    currentTheme,
    customThemes,
    setCustomTheme,
    addCustomTheme,
    removeCustomTheme,
    loadThemeFromStorage,
    saveThemeToStorage,
  }), [
    theme,
    currentTheme,
    customThemes
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
