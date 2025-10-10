// Advanced Theme Builder with Custom CSS Variables
export interface ThemeColors {
  // Base colors
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Interactive colors
  hover: string;
  focus: string;
  active: string;
  disabled: string;

  // Border and shadow
  border: string;
  borderLight: string;
  shadow: string;
  shadowLight: string;

  // Custom properties
  [key: string]: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface CustomTheme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  animations?: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

// Predefined themes
export const predefinedThemes: Record<string, CustomTheme> = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      hover: '#2563eb',
      focus: '#1d4ed8',
      active: '#1e40af',
      disabled: '#d1d5db',
      border: '#d1d5db',
      borderLight: '#e5e7eb',
      shadow: 'rgba(0, 0, 0, 0.1)',
      shadowLight: 'rgba(0, 0, 0, 0.05)',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },

  dark: {
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#9ca3af',
      accent: '#fbbf24',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
      hover: '#3b82f6',
      focus: '#2563eb',
      active: '#1d4ed8',
      disabled: '#4b5563',
      border: '#374151',
      borderLight: '#4b5563',
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowLight: 'rgba(0, 0, 0, 0.2)',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    },
  },

  highContrast: {
    name: 'High Contrast',
    colors: {
      primary: '#ffffff',
      secondary: '#ffffff',
      accent: '#ffff00',
      background: '#000000',
      surface: '#000000',
      text: '#ffffff',
      textSecondary: '#cccccc',
      success: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff',
      hover: '#ffffff',
      focus: '#ffff00',
      active: '#ffffff',
      disabled: '#666666',
      border: '#ffffff',
      borderLight: '#cccccc',
      shadow: 'rgba(255, 255, 255, 0.1)',
      shadowLight: 'rgba(255, 255, 255, 0.05)',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
      },
      fontWeight: {
        light: 400,
        normal: 500,
        medium: 600,
        semibold: 700,
        bold: 800,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(255, 255, 255, 0.1)',
      md: '0 4px 6px -1px rgba(255, 255, 255, 0.2), 0 2px 4px -1px rgba(255, 255, 255, 0.1)',
      lg: '0 10px 15px -3px rgba(255, 255, 255, 0.2), 0 4px 6px -2px rgba(255, 255, 255, 0.1)',
      xl: '0 20px 25px -5px rgba(255, 255, 255, 0.2), 0 10px 10px -5px rgba(255, 255, 255, 0.1)',
    },
  },

  sepia: {
    name: 'Sepia',
    colors: {
      primary: '#8b4513',
      secondary: '#a0522d',
      accent: '#daa520',
      background: '#f4f1e8',
      surface: '#faf7f0',
      text: '#5c4033',
      textSecondary: '#8b7355',
      success: '#228b22',
      warning: '#daa520',
      error: '#8b0000',
      info: '#4682b4',
      hover: '#654321',
      focus: '#8b4513',
      active: '#654321',
      disabled: '#d2b48c',
      border: '#d2b48c',
      borderLight: '#f5deb3',
      shadow: 'rgba(139, 69, 19, 0.1)',
      shadowLight: 'rgba(139, 69, 19, 0.05)',
    },
    typography: {
      fontFamily: '"Crimson Text", "Times New Roman", serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(139, 69, 19, 0.1)',
      md: '0 4px 6px -1px rgba(139, 69, 19, 0.15), 0 2px 4px -1px rgba(139, 69, 19, 0.1)',
      lg: '0 10px 15px -3px rgba(139, 69, 19, 0.15), 0 4px 6px -2px rgba(139, 69, 19, 0.1)',
      xl: '0 20px 25px -5px rgba(139, 69, 19, 0.15), 0 10px 10px -5px rgba(139, 69, 19, 0.1)',
    },
  },

  solarized: {
    name: 'Solarized',
    colors: {
      primary: '#268bd2',
      secondary: '#586e75',
      accent: '#b58900',
      background: '#fdf6e3',
      surface: '#eee8d5',
      text: '#586e75',
      textSecondary: '#93a1a1',
      success: '#859900',
      warning: '#b58900',
      error: '#dc322f',
      info: '#268bd2',
      hover: '#2aa198',
      focus: '#268bd2',
      active: '#2aa198',
      disabled: '#93a1a1',
      border: '#93a1a1',
      borderLight: '#eee8d5',
      shadow: 'rgba(88, 110, 117, 0.1)',
      shadowLight: 'rgba(88, 110, 117, 0.05)',
    },
    typography: {
      fontFamily: '"Source Code Pro", "Monaco", "Menlo", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(88, 110, 117, 0.1)',
      md: '0 4px 6px -1px rgba(88, 110, 117, 0.15), 0 2px 4px -1px rgba(88, 110, 117, 0.1)',
      lg: '0 10px 15px -3px rgba(88, 110, 117, 0.15), 0 4px 6px -2px rgba(88, 110, 117, 0.1)',
      xl: '0 20px 25px -5px rgba(88, 110, 117, 0.15), 0 10px 10px -5px rgba(88, 110, 117, 0.1)',
    },
  },
};

// Theme builder functions
export class ThemeBuilder {
  private theme: Partial<CustomTheme> = {};

  static create(name: string): ThemeBuilder {
    const builder = new ThemeBuilder();
    builder.theme.name = name;
    return builder;
  }

  fromBase(baseTheme: CustomTheme): ThemeBuilder {
    this.theme = { ...baseTheme };
    return this;
  }

  setColors(colors: Partial<ThemeColors>): ThemeBuilder {
    this.theme.colors = { ...this.theme.colors, ...colors };
    return this;
  }

  setTypography(typography: Partial<ThemeTypography>): ThemeBuilder {
    this.theme.typography = { ...this.theme.typography, ...typography };
    return this;
  }

  setSpacing(spacing: Partial<ThemeSpacing>): ThemeBuilder {
    this.theme.spacing = { ...this.theme.spacing, ...spacing };
    return this;
  }

  setBorderRadius(borderRadius: Partial<ThemeBorderRadius>): ThemeBuilder {
    this.theme.borderRadius = { ...this.theme.borderRadius, ...borderRadius };
    return this;
  }

  setShadows(shadows: Partial<ThemeShadows>): ThemeBuilder {
    this.theme.shadows = { ...this.theme.shadows, ...shadows };
    return this;
  }

  build(): CustomTheme {
    if (!this.theme.name) {
      throw new Error('Theme name is required');
    }

    // Ensure all required properties are present
    const defaultTheme = predefinedThemes.light;
    return {
      name: this.theme.name,
      colors: { ...defaultTheme.colors, ...this.theme.colors },
      typography: { ...defaultTheme.typography, ...this.theme.typography },
      spacing: { ...defaultTheme.spacing, ...this.theme.spacing },
      borderRadius: { ...defaultTheme.borderRadius, ...this.theme.borderRadius },
      shadows: { ...defaultTheme.shadows, ...this.theme.shadows },
      animations: this.theme.animations || defaultTheme.animations,
    };
  }
}

// CSS Variables generator
export const generateCSSVariables = (theme: CustomTheme): string => {
  const variables: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables.push(`  --color-${key}: ${value};`);
  });

  // Typography
  variables.push(`  --font-family: ${theme.typography.fontFamily};`);
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables.push(`  --font-size-${key}: ${value};`);
  });
  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    variables.push(`  --font-weight-${key}: ${value};`);
  });
  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    variables.push(`  --line-height-${key}: ${value};`);
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables.push(`  --spacing-${key}: ${value};`);
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables.push(`  --border-radius-${key}: ${value};`);
  });

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables.push(`  --shadow-${key}: ${value};`);
  });

  // Animations
  if (theme.animations) {
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      variables.push(`  --animation-duration-${key}: ${value};`);
    });
    Object.entries(theme.animations.easing).forEach(([key, value]) => {
      variables.push(`  --animation-easing-${key}: ${value};`);
    });
  }

  return `:root {\n${variables.join('\n')}\n}`;
};

// Apply theme to document
export const applyTheme = (theme: CustomTheme): void => {
  if (typeof document === 'undefined') return;

  const cssVariables = generateCSSVariables(theme);
  const styleId = 'dynamic-theme-styles';

  let styleElement = document.getElementById(styleId) as HTMLStyleElement;
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = cssVariables;

  // Set data attribute for theme name
  document.documentElement.setAttribute('data-theme', theme.name.toLowerCase().replace(/\s+/g, '-'));
};

// Theme validation
export const validateTheme = (theme: Partial<CustomTheme>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!theme.name) {
    errors.push('Theme name is required');
  }

  if (!theme.colors) {
    errors.push('Theme colors are required');
  } else {
    const requiredColors = ['primary', 'background', 'text'];
    requiredColors.forEach(color => {
      if (!theme.colors![color]) {
        errors.push(`Required color '${color}' is missing`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Export utilities
export const themeUtils = {
  // Generate a random color
  randomColor: (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  },

  // Lighten a color
  lightenColor: (color: string, percent: number): string => {
    // Simple color manipulation - in production, use a proper color library
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  },

  // Darken a color
  darkenColor: (color: string, percent: number): string => {
    return themeUtils.lightenColor(color, -percent);
  },

  // Check if color is light
  isLightColor: (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128;
  }
};