import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MobileCustomTheme,
  mobilePredefinedThemes,
  createThemeStyles,
  MobileThemeBuilder
} from '../lib/mobileThemeBuilder';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  // Legacy theme support
  theme: Theme;
  toggleTheme: () => void;

  // Advanced theming
  currentTheme: MobileCustomTheme;
  customThemes: MobileCustomTheme[];
  themeStyles: ReturnType<typeof createThemeStyles>;
  setCustomTheme: (theme: MobileCustomTheme) => void;
  addCustomTheme: (theme: MobileCustomTheme) => void;
  removeCustomTheme: (themeName: string) => void;
  loadThemeFromStorage: () => Promise<void>;
  saveThemeToStorage: (theme: MobileCustomTheme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Legacy theme state
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme || 'light');

  // Advanced theming state
  const [currentTheme, setCurrentTheme] = useState<MobileCustomTheme>(mobilePredefinedThemes.light);
  const [customThemes, setCustomThemes] = useState<MobileCustomTheme[]>([]);
  const [themeStyles, setThemeStyles] = useState(createThemeStyles(mobilePredefinedThemes.light));

  // Load themes from storage on mount
  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  // Update theme styles when current theme changes
  useEffect(() => {
    const styles = createThemeStyles(currentTheme);
    setThemeStyles(styles);
  }, [currentTheme]);

  // Legacy theme effect
  useEffect(() => {
    const legacyTheme = mobilePredefinedThemes[theme];
    if (legacyTheme) {
      setCurrentTheme(legacyTheme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setCustomTheme = (theme: MobileCustomTheme) => {
    setCurrentTheme(theme);
    saveThemeToStorage(theme);
  };

  const addCustomTheme = (theme: MobileCustomTheme) => {
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

  const loadThemeFromStorage = async () => {
    try {
      // Load current theme
      const savedTheme = await AsyncStorage.getItem('currentMobileTheme');
      if (savedTheme) {
        const themeData = JSON.parse(savedTheme);
        setCurrentTheme(themeData);
      }

      // Load custom themes
      const savedCustomThemes = await AsyncStorage.getItem('customMobileThemes');
      if (savedCustomThemes) {
        const themesData = JSON.parse(savedCustomThemes);
        setCustomThemes(themesData);
      }
    } catch (error) {
      console.error('Failed to load themes from storage:', error);
    }
  };

  const saveThemeToStorage = async (theme: MobileCustomTheme) => {
    try {
      await AsyncStorage.setItem('currentMobileTheme', JSON.stringify(theme));
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  };

  const saveCustomThemesToStorage = async (themes: MobileCustomTheme[]) => {
    try {
      await AsyncStorage.setItem('customMobileThemes', JSON.stringify(themes));
    } catch (error) {
      console.error('Failed to save custom themes to storage:', error);
    }
  };

  const value = useMemo(() => ({
    // Legacy
    theme,
    toggleTheme,

    // Advanced
    currentTheme,
    customThemes,
    themeStyles,
    setCustomTheme,
    addCustomTheme,
    removeCustomTheme,
    loadThemeFromStorage,
    saveThemeToStorage,
  }), [
    theme,
    currentTheme,
    customThemes,
    themeStyles
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
