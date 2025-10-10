import {
  ThemeBuilder,
  predefinedThemes,
  applyTheme,
  validateTheme,
  generateCSSVariables,
  themeUtils
} from '../themeBuilder';

// Mock document and window for testing
const mockDocument = {
  head: {
    appendChild: jest.fn(),
  },
  createElement: jest.fn(),
  getElementById: jest.fn(),
  documentElement: {
    setAttribute: jest.fn(),
  },
};

const mockWindow = {
  getComputedStyle: jest.fn(),
};

Object.defineProperty(global, 'document', { value: mockDocument });
Object.defineProperty(global, 'window', { value: mockWindow });

describe('ThemeBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDocument.createElement.mockReturnValue({
      setAttribute: jest.fn(),
      textContent: '',
    });
  });

  describe('ThemeBuilder.create', () => {
    it('should create a theme builder instance', () => {
      const builder = ThemeBuilder.create('Test Theme');
      expect(builder).toBeInstanceOf(ThemeBuilder);
    });
  });

  describe('ThemeBuilder.build', () => {
    it('should build a complete theme', () => {
      const theme = ThemeBuilder.create('Test Theme')
        .setColors({
          primary: '#ff0000',
          background: '#ffffff',
          text: '#000000',
        })
        .build();

      expect(theme.name).toBe('Test Theme');
      expect(theme.colors.primary).toBe('#ff0000');
      expect(theme.colors.background).toBe('#ffffff');
      expect(theme.colors.text).toBe('#000000');
    });

    it('should throw error when name is missing', () => {
      const builder = new ThemeBuilder();
      expect(() => builder.build()).toThrow('Theme name is required');
    });
  });

  describe('fromBase', () => {
    it('should inherit from base theme', () => {
      const theme = ThemeBuilder.create('Custom Theme')
        .fromBase(predefinedThemes.light)
        .setColors({ primary: '#ff0000' })
        .build();

      expect(theme.colors.primary).toBe('#ff0000');
      expect(theme.colors.background).toBe(predefinedThemes.light.colors.background);
    });
  });

  describe('validateTheme', () => {
    it('should validate a correct theme', () => {
      const theme = {
        name: 'Valid Theme',
        colors: {
          primary: '#ff0000',
          background: '#ffffff',
          text: '#000000',
        },
        typography: predefinedThemes.light.typography,
        spacing: predefinedThemes.light.spacing,
        borderRadius: predefinedThemes.light.borderRadius,
        shadows: predefinedThemes.light.shadows,
      };

      const result = validateTheme(theme);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate theme without name', () => {
      const theme = {
        colors: { primary: '#ff0000' },
      };

      const result = validateTheme(theme as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Theme name is required');
    });

    it('should invalidate theme without required colors', () => {
      const theme = {
        name: 'Invalid Theme',
        colors: {},
      };

      const result = validateTheme(theme as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Required color \'primary\' is missing');
    });
  });

  describe('generateCSSVariables', () => {
    it('should generate CSS variables string', () => {
      const theme = predefinedThemes.light;
      const css = generateCSSVariables(theme);

      expect(css).toContain(':root {');
      expect(css).toContain('--color-primary: #3b82f6;');
      expect(css).toContain('--font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;');
      expect(css).toContain('--spacing-md: 1rem;');
      expect(css).toContain('}');
    });
  });

  describe('applyTheme', () => {
    it('should apply theme to document', () => {
      const mockStyleElement = {
        setAttribute: jest.fn(),
        textContent: '',
      };

      mockDocument.getElementById.mockReturnValue(null);
      mockDocument.createElement.mockReturnValue(mockStyleElement);

      const theme = predefinedThemes.light;
      applyTheme(theme);

      expect(mockDocument.createElement).toHaveBeenCalledWith('style');
      expect(mockStyleElement.setAttribute).toHaveBeenCalledWith('id', 'dynamic-theme-styles');
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockStyleElement);
      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should update existing style element', () => {
      const mockStyleElement = {
        setAttribute: jest.fn(),
        textContent: '',
      };

      mockDocument.getElementById.mockReturnValue(mockStyleElement);

      const theme = predefinedThemes.dark;
      applyTheme(theme);

      expect(mockStyleElement.textContent).toContain('--color-primary: #60a5fa;');
    });
  });

  describe('themeUtils', () => {
    describe('randomColor', () => {
      it('should generate a valid hex color', () => {
        const color = themeUtils.randomColor();
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    describe('lightenColor', () => {
      it('should lighten a color', () => {
        const lightened = themeUtils.lightenColor('#000000', 50);
        expect(lightened).not.toBe('#000000');
      });
    });

    describe('darkenColor', () => {
      it('should darken a color', () => {
        const darkened = themeUtils.darkenColor('#ffffff', 50);
        expect(darkened).not.toBe('#ffffff');
      });
    });

    describe('isLightColor', () => {
      it('should identify light colors', () => {
        expect(themeUtils.isLightColor('#ffffff')).toBe(true);
        expect(themeUtils.isLightColor('#000000')).toBe(false);
      });
    });
  });
});