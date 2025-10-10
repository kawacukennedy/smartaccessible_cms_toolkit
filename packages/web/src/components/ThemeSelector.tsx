'use client';

import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { predefinedThemes, CustomTheme } from '../lib/themeBuilder';

interface ThemeCardProps {
  theme: CustomTheme;
  isActive: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isCustom?: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  isCustom = false
}) => {
  return (
    <div
      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      {/* Color Palette Preview */}
      <div className="flex space-x-1 mb-3">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: theme.colors.secondary }}
        />
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: theme.colors.background }}
        />
      </div>

      {/* Theme Name */}
      <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1">
        {theme.name}
      </h3>

      {/* Theme Type */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {isCustom ? 'Custom' : 'Preset'}
      </p>

      {/* Action Buttons for Custom Themes */}
      {isCustom && (
        <div className="absolute top-2 right-2 flex space-x-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              title="Edit theme"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title="Delete theme"
            >
              🗑️
            </button>
          )}
        </div>
      )}

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
};

const ThemeSelector: React.FC = () => {
  const {
    theme: legacyTheme,
    setTheme: setLegacyTheme,
    currentTheme,
    customThemes,
    setCustomTheme,
    removeCustomTheme
  } = useTheme();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Combine preset and custom themes
  const allThemes = [
    ...Object.values(predefinedThemes),
    ...customThemes
  ];

  // Filter themes based on search
  const filteredThemes = allThemes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleThemeSelect = (selectedTheme: CustomTheme) => {
    setCustomTheme(selectedTheme);

    // Also update legacy theme if it's a preset
    const presetKey = Object.keys(predefinedThemes).find(
      key => predefinedThemes[key].name === selectedTheme.name
    );
    if (presetKey) {
      setLegacyTheme(presetKey as any);
    }
  };

  const handleDeleteCustomTheme = (themeName: string) => {
    if (window.confirm(`Are you sure you want to delete the "${themeName}" theme?`)) {
      removeCustomTheme(themeName);
    }
  };

  const handleEditTheme = (theme: CustomTheme) => {
    // This would open the theme builder with the selected theme
    console.log('Edit theme:', theme);
    // In a real implementation, this would navigate to the theme builder
    // with the theme pre-loaded
  };

  return (
    <div className="theme-selector max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Theme Selector
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showAdvanced ? 'Simple View' : 'Advanced View'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search themes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Current Theme Info */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current Theme</h3>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: currentTheme.colors.secondary }}
            />
            <div
              className="w-6 h-6 rounded"
              style={{ backgroundColor: currentTheme.colors.accent }}
            />
          </div>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {currentTheme.name}
          </span>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredThemes.map((theme) => {
          const isCustom = customThemes.some(ct => ct.name === theme.name);
          const isActive = currentTheme.name === theme.name;

          return (
            <ThemeCard
              key={theme.name}
              theme={theme}
              isActive={isActive}
              onSelect={() => handleThemeSelect(theme)}
              onEdit={isCustom ? () => handleEditTheme(theme) : undefined}
              onDelete={isCustom ? () => handleDeleteCustomTheme(theme.name) : undefined}
              isCustom={isCustom}
            />
          );
        })}
      </div>

      {/* Advanced Features */}
      {showAdvanced && (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Advanced Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Theme Statistics
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>Total Themes: {allThemes.length}</div>
                <div>Preset Themes: {Object.keys(predefinedThemes).length}</div>
                <div>Custom Themes: {customThemes.length}</div>
                <div>Current Theme: {currentTheme.name}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)];
                    handleThemeSelect(randomTheme);
                  }}
                  className="w-full px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  🎲 Random Theme
                </button>
                <button
                  onClick={() => {
                    // Reset to light theme
                    handleThemeSelect(predefinedThemes.light);
                  }}
                  className="w-full px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  🔄 Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No themes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search query.' : 'Create a custom theme to get started.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;