'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ThemeBuilder, CustomTheme, predefinedThemes, applyTheme, validateTheme, themeUtils } from '../lib/themeBuilder';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-24">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const FontSelector: React.FC<FontSelectorProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-24">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const ThemeBuilderComponent: React.FC = () => {
  const [themeName, setThemeName] = useState('Custom Theme');
  const [baseTheme, setBaseTheme] = useState('light');
  const [customTheme, setCustomTheme] = useState<CustomTheme | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'preview'>('colors');

  // Theme properties state
  const [colors, setColors] = useState({
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
  });

  const [typography, setTypography] = useState({
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load base theme
  useEffect(() => {
    const base = predefinedThemes[baseTheme];
    if (base) {
      setColors(base.colors);
      setTypography({
        fontFamily: base.typography.fontFamily,
      });
    }
  }, [baseTheme]);

  // Generate theme
  const generateTheme = useCallback(() => {
    try {
      const theme = ThemeBuilder.create(themeName)
        .fromBase(predefinedThemes[baseTheme])
        .setColors(colors)
        .setTypography(typography)
        .build();

      const validation = validateTheme(theme);
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        return;
      }

      setValidationErrors([]);
      setCustomTheme(theme);
      applyTheme(theme);
    } catch (error) {
      setValidationErrors([error instanceof Error ? error.message : 'Unknown error']);
    }
  }, [themeName, baseTheme, colors, typography]);

  // Auto-generate derived colors
  const updateDerivedColors = useCallback((primaryColor: string) => {
    const isLight = themeUtils.isLightColor(primaryColor);
    const hoverColor = themeUtils.darkenColor(primaryColor, 10);
    const focusColor = themeUtils.darkenColor(primaryColor, 15);
    const activeColor = themeUtils.darkenColor(primaryColor, 20);

    setColors(prev => ({
      ...prev,
      primary: primaryColor,
      hover: hoverColor,
      focus: focusColor,
      active: activeColor,
    }));
  }, []);

  // Preset themes
  const applyPresetTheme = useCallback((preset: string) => {
    const theme = predefinedThemes[preset];
    if (theme) {
      setThemeName(theme.name);
      setBaseTheme(preset);
      setColors(theme.colors);
      setTypography({
        fontFamily: theme.typography.fontFamily,
      });
      setCustomTheme(theme);
      applyTheme(theme);
    }
  }, []);

  // Export theme
  const exportTheme = useCallback(() => {
    if (!customTheme) return;

    const themeData = JSON.stringify(customTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [customTheme]);

  // Import theme
  const importTheme = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);
        const validation = validateTheme(themeData);
        if (!validation.valid) {
          setValidationErrors(validation.errors);
          return;
        }

        setThemeName(themeData.name);
        setColors(themeData.colors);
        setTypography(themeData.typography);
        setCustomTheme(themeData);
        applyTheme(themeData);
        setValidationErrors([]);
      } catch (error) {
        setValidationErrors(['Invalid theme file']);
      }
    };
    reader.readAsText(file);
  }, []);

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'typography', label: 'Typography', icon: '📝' },
    { id: 'spacing', label: 'Spacing', icon: '📏' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
  ];

  return (
    <div className="theme-builder max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Advanced Theme Builder
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={generateTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Theme
          </button>
          <button
            onClick={exportTheme}
            disabled={!customTheme}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export
          </button>
          <label className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500">
            Import
            <input
              type="file"
              accept=".json"
              onChange={importTheme}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded">
          <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">Validation Errors:</h3>
          <ul className="text-red-700 dark:text-red-300 text-sm">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Theme Name and Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Name
          </label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter theme name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Base Theme
          </label>
          <select
            value={baseTheme}
            onChange={(e) => setBaseTheme(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(predefinedThemes).map((theme) => (
              <option key={theme} value={theme}>
                {predefinedThemes[theme].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Preset Themes</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(predefinedThemes).map((preset) => (
            <button
              key={preset}
              onClick={() => applyPresetTheme(preset)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {predefinedThemes[preset].name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'colors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Base Colors</h3>
              <ColorPicker
                label="Primary"
                value={colors.primary}
                onChange={(value) => {
                  setColors(prev => ({ ...prev, primary: value }));
                  updateDerivedColors(value);
                }}
              />
              <ColorPicker
                label="Secondary"
                value={colors.secondary}
                onChange={(value) => setColors(prev => ({ ...prev, secondary: value }))}
              />
              <ColorPicker
                label="Accent"
                value={colors.accent}
                onChange={(value) => setColors(prev => ({ ...prev, accent: value }))}
              />
              <ColorPicker
                label="Background"
                value={colors.background}
                onChange={(value) => setColors(prev => ({ ...prev, background: value }))}
              />
              <ColorPicker
                label="Surface"
                value={colors.surface}
                onChange={(value) => setColors(prev => ({ ...prev, surface: value }))}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Text & States</h3>
              <ColorPicker
                label="Text"
                value={colors.text}
                onChange={(value) => setColors(prev => ({ ...prev, text: value }))}
              />
              <ColorPicker
                label="Text Secondary"
                value={colors.textSecondary}
                onChange={(value) => setColors(prev => ({ ...prev, textSecondary: value }))}
              />
              <ColorPicker
                label="Success"
                value={colors.success}
                onChange={(value) => setColors(prev => ({ ...prev, success: value }))}
              />
              <ColorPicker
                label="Warning"
                value={colors.warning}
                onChange={(value) => setColors(prev => ({ ...prev, warning: value }))}
              />
              <ColorPicker
                label="Error"
                value={colors.error}
                onChange={(value) => setColors(prev => ({ ...prev, error: value }))}
              />
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Typography Settings</h3>
            <FontSelector
              label="Font Family"
              value={typography.fontFamily}
              onChange={(value) => setTypography(prev => ({ ...prev, fontFamily: value }))}
              options={[
                '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                '"Source Code Pro", "Monaco", "Menlo", monospace',
                '"Crimson Text", "Times New Roman", serif',
              ]}
            />
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
              <p
                className="text-lg"
                style={{ fontFamily: typography.fontFamily }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Spacing & Layout</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Spacing settings are managed through the base theme. Use the Base Theme selector above to change spacing presets.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div className="text-2xl mb-2">📏</div>
                <div className="text-sm font-medium">Spacing Scale</div>
                <div className="text-xs text-gray-500">xs to 3xl</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div className="text-2xl mb-2">🔲</div>
                <div className="text-sm font-medium">Border Radius</div>
                <div className="text-xs text-gray-500">none to full</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div className="text-2xl mb-2">🌑</div>
                <div className="text-sm font-medium">Shadows</div>
                <div className="text-xs text-gray-500">sm to xl</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-medium">Animations</div>
                <div className="text-xs text-gray-500">duration & easing</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme Preview</h3>

            {customTheme ? (
              <div className="space-y-4">
                {/* Component Previews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-300 rounded">
                    <h4 className="font-medium mb-2">Buttons</h4>
                    <div className="space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Primary
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                        Secondary
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-300 rounded">
                    <h4 className="font-medium mb-2">Form Elements</h4>
                    <input
                      type="text"
                      placeholder="Input field"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 border border-gray-300 rounded">
                  <h4 className="font-medium mb-2">Typography</h4>
                  <p className="text-sm text-gray-600 mb-2">Small text</p>
                  <p className="text-base mb-2">Regular text with <strong>bold</strong> and <em>italic</em> elements.</p>
                  <p className="text-lg font-medium">Large heading text</p>
                </div>

                <div className="p-4 border border-gray-300 rounded">
                  <h4 className="font-medium mb-2">Color Palette</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(colors).slice(0, 10).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-8 h-8 rounded mx-auto mb-1 border border-gray-300"
                          style={{ backgroundColor: value }}
                        />
                        <div className="text-xs text-gray-600 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🎨</div>
                <p>Generate a theme to see the preview</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeBuilderComponent;