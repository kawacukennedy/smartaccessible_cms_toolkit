// Mobile Theme Builder - Adapted for React Native
export interface MobileThemeColors {
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
}

export interface MobileThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface MobileThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface MobileThemeBorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface MobileCustomTheme {
  name: string;
  colors: MobileThemeColors;
  typography: MobileThemeTypography;
  spacing: MobileThemeSpacing;
  borderRadius: MobileThemeBorderRadius;
}

// Predefined mobile themes
export const mobilePredefinedThemes: Record<string, MobileCustomTheme> = {
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
    },
    typography: {
      fontFamily: 'System',
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    borderRadius: {
      none: 0,
      sm: 2,
      md: 6,
      lg: 8,
      xl: 12,
      full: 9999,
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
    },
    typography: {
      fontFamily: 'System',
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    borderRadius: {
      none: 0,
      sm: 2,
      md: 6,
      lg: 8,
      xl: 12,
      full: 9999,
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
    },
    typography: {
      fontFamily: 'System',
      fontSize: {
        xs: 14,
        sm: 16,
        base: 18,
        lg: 20,
        xl: 24,
        '2xl': 28,
      },
      fontWeight: {
        light: '400',
        normal: '500',
        medium: '600',
        semibold: '700',
        bold: '800',
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
    },
    borderRadius: {
      none: 0,
      sm: 2,
      md: 6,
      lg: 8,
      xl: 12,
      full: 9999,
    },
  },
};

// Mobile Theme Builder
export class MobileThemeBuilder {
  private theme: Partial<MobileCustomTheme> = {};

  static create(name: string): MobileThemeBuilder {
    const builder = new MobileThemeBuilder();
    builder.theme.name = name;
    return builder;
  }

  fromBase(baseTheme: MobileCustomTheme): MobileThemeBuilder {
    this.theme = { ...baseTheme };
    return this;
  }

  setColors(colors: Partial<MobileThemeColors>): MobileThemeBuilder {
    this.theme.colors = { ...this.theme.colors, ...colors };
    return this;
  }

  setTypography(typography: Partial<MobileThemeTypography>): MobileThemeBuilder {
    this.theme.typography = { ...this.theme.typography, ...typography };
    return this;
  }

  setSpacing(spacing: Partial<MobileThemeSpacing>): MobileThemeBuilder {
    this.theme.spacing = { ...this.theme.spacing, ...spacing };
    return this;
  }

  setBorderRadius(borderRadius: Partial<MobileThemeBorderRadius>): MobileThemeBuilder {
    this.theme.borderRadius = { ...this.theme.borderRadius, ...borderRadius };
    return this;
  }

  build(): MobileCustomTheme {
    if (!this.theme.name) {
      throw new Error('Theme name is required');
    }

    // Ensure all required properties are present
    const defaultTheme = mobilePredefinedThemes.light;
    return {
      name: this.theme.name,
      colors: { ...defaultTheme.colors, ...this.theme.colors },
      typography: { ...defaultTheme.typography, ...this.theme.typography },
      spacing: { ...defaultTheme.spacing, ...this.theme.spacing },
      borderRadius: { ...defaultTheme.borderRadius, ...this.theme.borderRadius },
    };
  }
}

// Convert mobile theme to React Native styles
export const createThemeStyles = (theme: MobileCustomTheme) => {
  return {
    // Colors
    primary: { color: theme.colors.primary },
    secondary: { color: theme.colors.secondary },
    accent: { color: theme.colors.accent },
    background: { backgroundColor: theme.colors.background },
    surface: { backgroundColor: theme.colors.surface },
    text: { color: theme.colors.text },
    textSecondary: { color: theme.colors.textSecondary },
    success: { color: theme.colors.success },
    warning: { color: theme.colors.warning },
    error: { color: theme.colors.error },
    info: { color: theme.colors.info },

    // Typography
    fontFamily: { fontFamily: theme.typography.fontFamily },
    fontSizeXs: { fontSize: theme.typography.fontSize.xs },
    fontSizeSm: { fontSize: theme.typography.fontSize.sm },
    fontSizeBase: { fontSize: theme.typography.fontSize.base },
    fontSizeLg: { fontSize: theme.typography.fontSize.lg },
    fontSizeXl: { fontSize: theme.typography.fontSize.xl },
    fontSize2xl: { fontSize: theme.typography.fontSize['2xl'] },

    fontWeightLight: { fontWeight: theme.typography.fontWeight.light },
    fontWeightNormal: { fontWeight: theme.typography.fontWeight.normal },
    fontWeightMedium: { fontWeight: theme.typography.fontWeight.medium },
    fontWeightSemibold: { fontWeight: theme.typography.fontWeight.semibold },
    fontWeightBold: { fontWeight: theme.typography.fontWeight.bold },

    lineHeightTight: { lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.base },
    lineHeightNormal: { lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.base },
    lineHeightRelaxed: { lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base },

    // Spacing
    spacingXs: { padding: theme.spacing.xs },
    spacingSm: { padding: theme.spacing.sm },
    spacingMd: { padding: theme.spacing.md },
    spacingLg: { padding: theme.spacing.lg },
    spacingXl: { padding: theme.spacing.xl },
    spacing2xl: { padding: theme.spacing['2xl'] },
    spacing3xl: { padding: theme.spacing['3xl'] },

    // Border radius
    borderRadiusNone: { borderRadius: theme.borderRadius.none },
    borderRadiusSm: { borderRadius: theme.borderRadius.sm },
    borderRadiusMd: { borderRadius: theme.borderRadius.md },
    borderRadiusLg: { borderRadius: theme.borderRadius.lg },
    borderRadiusXl: { borderRadius: theme.borderRadius.xl },
    borderRadiusFull: { borderRadius: theme.borderRadius.full },

    // Common combinations
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
    },
    input: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  };
};

// Theme validation
export const validateMobileTheme = (theme: Partial<MobileCustomTheme>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!theme.name) {
    errors.push('Theme name is required');
  }

  if (!theme.colors) {
    errors.push('Theme colors are required');
  } else {
    const requiredColors = ['primary', 'background', 'text'];
    requiredColors.forEach(color => {
      if (!theme.colors![color as keyof MobileThemeColors]) {
        errors.push(`Required color '${color}' is missing`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Color utilities for mobile
export const mobileColorUtils = {
  // Generate derived colors
  lightenColor: (color: string, percent: number): string => {
    // Simple color manipulation for React Native
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  },

  darkenColor: (color: string, percent: number): string => {
    return mobileColorUtils.lightenColor(color, -percent);
  },

  isLightColor: (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128;
  }
};