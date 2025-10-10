import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  MobileThemeBuilder,
  mobilePredefinedThemes,
  MobileCustomTheme,
  validateMobileTheme,
  mobileColorUtils
} from '../lib/mobileThemeBuilder';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const { themeStyles } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
    '#000000', '#ffffff', '#6b7280', '#374151', '#111827'
  ];

  return (
    <View style={styles.colorPickerContainer}>
      <Text style={[styles.label, themeStyles.text]}>{label}</Text>
      <TouchableOpacity
        style={[styles.colorButton, { backgroundColor: value }]}
        onPress={() => setShowPicker(true)}
        accessibilityLabel={`Select ${label} color`}
        accessibilityHint="Opens color picker"
      >
        <Text style={styles.colorValue}>{value.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.card]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Select {label} Color</Text>

            <FlatList
              data={presetColors}
              keyExtractor={(color) => color}
              numColumns={5}
              renderItem={({ item: color }) => (
                <TouchableOpacity
                  style={[styles.colorOption, { backgroundColor: color }]}
                  onPress={() => {
                    onChange(color);
                    setShowPicker(false);
                  }}
                  accessibilityLabel={`Select color ${color}`}
                />
              )}
              contentContainerStyle={styles.colorGrid}
            />

            <View style={styles.customColorContainer}>
              <Text style={[styles.customColorLabel, themeStyles.textSecondary]}>Custom Hex:</Text>
              <TextInput
                style={[styles.customColorInput, themeStyles.input]}
                value={value}
                onChangeText={(text) => {
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(text)) {
                    onChange(text);
                  }
                }}
                placeholder="#000000"
                maxLength={7}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.closeButton, themeStyles.button]}
              onPress={() => setShowPicker(false)}
            >
              <Text style={themeStyles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MobileThemeBuilder: React.FC = () => {
  const {
    currentTheme,
    customThemes,
    themeStyles,
    setCustomTheme,
    addCustomTheme,
    removeCustomTheme
  } = useTheme();

  const [themeName, setThemeName] = useState('Custom Theme');
  const [baseTheme, setBaseTheme] = useState('light');
  const [colors, setColors] = useState(currentTheme.colors);
  const [showBuilder, setShowBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'preview'>('colors');

  const resetToBaseTheme = useCallback(() => {
    const base = mobilePredefinedThemes[baseTheme];
    if (base) {
      setColors(base.colors);
    }
  }, [baseTheme]);

  const generateTheme = useCallback(() => {
    try {
      const theme = MobileThemeBuilder.create(themeName)
        .fromBase(mobilePredefinedThemes[baseTheme])
        .setColors(colors)
        .build();

      const validation = validateMobileTheme(theme);
      if (!validation.valid) {
        Alert.alert('Validation Error', validation.errors.join('\n'));
        return;
      }

      addCustomTheme(theme);
      setCustomTheme(theme);
      setShowBuilder(false);

      Alert.alert('Success', 'Theme created successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [themeName, baseTheme, colors, addCustomTheme, setCustomTheme]);

  const applyPresetTheme = useCallback((preset: string) => {
    const theme = mobilePredefinedThemes[preset];
    if (theme) {
      setCustomTheme(theme);
      Alert.alert('Theme Applied', `${theme.name} theme applied successfully!`);
    }
  }, [setCustomTheme]);

  const deleteCustomTheme = useCallback((themeName: string) => {
    Alert.alert(
      'Delete Theme',
      `Are you sure you want to delete "${themeName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeCustomTheme(themeName)
        }
      ]
    );
  }, [removeCustomTheme]);

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'typography', label: 'Typography', icon: '📝' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
  ];

  return (
    <ScrollView style={[styles.container, themeStyles.background]}>
      <Text style={[styles.title, themeStyles.text]}>Mobile Theme Builder</Text>

      {/* Current Theme Info */}
      <View style={[styles.currentThemeCard, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Current Theme</Text>
        <View style={styles.colorPalette}>
          <View style={[styles.colorSwatch, { backgroundColor: currentTheme.colors.primary }]} />
          <View style={[styles.colorSwatch, { backgroundColor: currentTheme.colors.secondary }]} />
          <View style={[styles.colorSwatch, { backgroundColor: currentTheme.colors.accent }]} />
          <View style={[styles.colorSwatch, { backgroundColor: currentTheme.colors.background }]} />
        </View>
        <Text style={[styles.themeName, themeStyles.text]}>{currentTheme.name}</Text>
      </View>

      {/* Preset Themes */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Preset Themes</Text>
        <View style={styles.presetGrid}>
          {Object.keys(mobilePredefinedThemes).map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[styles.presetButton, themeStyles.button]}
              onPress={() => applyPresetTheme(preset)}
            >
              <Text style={themeStyles.buttonText}>
                {mobilePredefinedThemes[preset].name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Themes */}
      {customThemes.length > 0 && (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>Custom Themes</Text>
          <FlatList
            data={customThemes}
            keyExtractor={(theme) => theme.name}
            renderItem={({ item: theme }) => (
              <View style={styles.customThemeItem}>
                <View style={styles.customThemeInfo}>
                  <View style={styles.colorPalette}>
                    <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary }]} />
                    <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary }]} />
                    <View style={[styles.colorSwatch, { backgroundColor: theme.colors.accent }]} />
                  </View>
                  <Text style={[styles.themeName, themeStyles.text]}>{theme.name}</Text>
                </View>
                <View style={styles.customThemeActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setCustomTheme(theme)}
                  >
                    <Text style={{ color: 'white', fontSize: 12 }}>Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                    onPress={() => deleteCustomTheme(theme.name)}
                  >
                    <Text style={{ color: 'white', fontSize: 12 }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* Create Custom Theme Button */}
      <TouchableOpacity
        style={[styles.createButton, themeStyles.button]}
        onPress={() => setShowBuilder(true)}
      >
        <Text style={themeStyles.buttonText}>Create Custom Theme</Text>
      </TouchableOpacity>

      {/* Theme Builder Modal */}
      <Modal
        visible={showBuilder}
        animationType="slide"
        onRequestClose={() => setShowBuilder(false)}
      >
        <View style={[styles.modalContainer, themeStyles.background]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Create Custom Theme</Text>
            <TouchableOpacity
              onPress={() => setShowBuilder(false)}
              style={styles.closeIcon}
            >
              <Text style={[styles.closeText, themeStyles.text]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Theme Name and Base */}
            <View style={styles.formSection}>
              <Text style={[styles.label, themeStyles.text]}>Theme Name</Text>
              <TextInput
                style={[styles.textInput, themeStyles.input]}
                value={themeName}
                onChangeText={setThemeName}
                placeholder="Enter theme name"
              />

              <Text style={[styles.label, themeStyles.text]}>Base Theme</Text>
              <View style={styles.baseThemeOptions}>
                {Object.keys(mobilePredefinedThemes).map((theme) => (
                  <TouchableOpacity
                    key={theme}
                    style={[
                      styles.baseThemeOption,
                      baseTheme === theme && styles.baseThemeOptionSelected
                    ]}
                    onPress={() => {
                      setBaseTheme(theme);
                      resetToBaseTheme();
                    }}
                  >
                    <Text style={[
                      styles.baseThemeText,
                      baseTheme === theme && styles.baseThemeTextSelected,
                      themeStyles.text
                    ]}>
                      {mobilePredefinedThemes[theme].name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id && styles.tabActive
                  ]}
                  onPress={() => setActiveTab(tab.id as any)}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.id && styles.tabTextActive,
                    themeStyles.text
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            {activeTab === 'colors' && (
              <View style={styles.tabContent}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Color Customization</Text>

                <ColorPicker
                  label="Primary"
                  value={colors.primary}
                  onChange={(value) => setColors(prev => ({ ...prev, primary: value }))}
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

                <ColorPicker
                  label="Text"
                  value={colors.text}
                  onChange={(value) => setColors(prev => ({ ...prev, text: value }))}
                />

                <TouchableOpacity
                  style={[styles.resetButton, themeStyles.button]}
                  onPress={resetToBaseTheme}
                >
                  <Text style={themeStyles.buttonText}>Reset to Base Colors</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'typography' && (
              <View style={styles.tabContent}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Typography Settings</Text>
                <Text style={[styles.infoText, themeStyles.textSecondary]}>
                  Typography settings are managed through the base theme selection above.
                  Choose a different base theme to change fonts and sizes.
                </Text>
              </View>
            )}

            {activeTab === 'preview' && (
              <View style={styles.tabContent}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Theme Preview</Text>

                {/* Preview Components */}
                <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.previewTitle, { color: colors.text }]}>
                    Preview Card
                  </Text>
                  <Text style={[styles.previewText, { color: colors.textSecondary }]}>
                    This is how your theme will look in the app.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.previewButton, { backgroundColor: colors.primary }]}
                  onPress={() => {}}
                >
                  <Text style={[styles.previewButtonText, { color: colors.background }]}>
                    Sample Button
                  </Text>
                </TouchableOpacity>

                <View style={[styles.previewInput, {
                  borderColor: colors.border,
                  backgroundColor: colors.surface
                }]}>
                  <Text style={[styles.previewInputText, { color: colors.text }]}>
                    Sample input field
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelButton, themeStyles.button, { backgroundColor: '#6b7280' }]}
              onPress={() => setShowBuilder(false)}
            >
              <Text style={themeStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, themeStyles.button]}
              onPress={generateTheme}
            >
              <Text style={themeStyles.buttonText}>Create Theme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  currentThemeCard: {
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  colorPalette: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  themeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  customThemeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  customThemeInfo: {
    flex: 1,
  },
  customThemeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeIcon: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  baseThemeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  baseThemeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  baseThemeOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  baseThemeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  baseThemeTextSelected: {
    color: '#3b82f6',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
  tabContent: {
    flex: 1,
  },
  colorPickerContainer: {
    marginBottom: 16,
  },
  colorButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  colorValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  colorGrid: {
    alignItems: 'center',
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  customColorContainer: {
    marginBottom: 16,
  },
  customColorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  customColorInput: {
    textAlign: 'center',
  },
  closeButton: {
    alignItems: 'center',
  },
  resetButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  previewCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
  },
  previewButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  previewInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  previewInputText: {
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    alignItems: 'center',
  },
});

export default MobileThemeBuilder;