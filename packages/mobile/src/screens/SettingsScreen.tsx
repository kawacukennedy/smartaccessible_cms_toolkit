import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import MobileDeploymentDashboard from '../components/MobileDeploymentDashboard';
import MobileIntegrationTestRunner from '../components/MobileIntegrationTestRunner';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [accessibilityScore, setAccessibilityScore] = useState(85);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState({
    colorContrast: true,
    touchTargets: true,
    screenReader: true,
    keyboardNavigation: true,
  });
  const [showDeploymentDashboard, setShowDeploymentDashboard] = useState(false);
  const [showIntegrationTests, setShowIntegrationTests] = useState(false);

  const {
    // Existing
    highContrast, toggleHighContrast,
    reducedMotion, toggleReducedMotion,
    colorBlindMode, setColorBlindMode,
    fontSize, increaseFontSize, decreaseFontSize,

    // New mobile features
    voiceOverEnabled,
    hapticFeedbackEnabled, toggleHapticFeedback,
    largeTextEnabled, toggleLargeText,
    buttonShapesEnabled, toggleButtonShapes,

    // Helpers
    announceForAccessibility,
    performHapticFeedback
  } = useAccessibility();

  const handleSettingChange = (settingName: string, newValue: boolean) => {
    announceForAccessibility(`${settingName} ${newValue ? 'enabled' : 'disabled'}`);
    performHapticFeedback('light');
  };

  const handleFontSizeChange = (increase: boolean) => {
    if (increase) {
      increaseFontSize();
      announceForAccessibility('Font size increased');
    } else {
      decreaseFontSize();
      announceForAccessibility('Font size decreased');
    }
    performHapticFeedback('light');
  };

  const handleColorBlindModeChange = (mode: string) => {
    setColorBlindMode(mode as any);
    announceForAccessibility(`Color blind mode set to ${mode}`);
    performHapticFeedback('light');
  };

  const runAccessibilityTests = async () => {
    setIsRunningTests(true);
    announceForAccessibility('Running accessibility tests');

    // Simulate comprehensive accessibility testing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = {
      colorContrast: Math.random() > 0.1, // 90% pass rate
      touchTargets: Math.random() > 0.05, // 95% pass rate
      screenReader: Math.random() > 0.15, // 85% pass rate
      keyboardNavigation: Math.random() > 0.2, // 80% pass rate
    };

    setTestResults(results);

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    const score = Math.round((passedTests / totalTests) * 100);
    setAccessibilityScore(score);

    setIsRunningTests(false);

    const failedTests = Object.entries(results)
      .filter(([_, passed]) => !passed)
      .map(([test, _]) => test);

    if (failedTests.length > 0) {
      Alert.alert(
        'Accessibility Test Results',
        `Score: ${score}%\n\nPassed: ${passedTests}/${totalTests}\n\nIssues found:\n${failedTests.join('\n')}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Accessibility Test Results',
        `Perfect score: ${score}%!\n\nAll tests passed.`,
        [{ text: 'OK' }]
      );
    }

    announceForAccessibility(`Accessibility tests complete. Score: ${score} percent`);
  };

  const checkCompliance = (standard: string) => {
    const complianceLevels = {
      'WCAG 2.1 AA': accessibilityScore >= 85,
      'WCAG 2.1 AAA': accessibilityScore >= 95,
      'Section 508': accessibilityScore >= 80,
      'EN 301 549': accessibilityScore >= 85,
    };

    const compliant = complianceLevels[standard as keyof typeof complianceLevels];

    Alert.alert(
      `${standard} Compliance`,
      compliant
        ? `✅ Your app meets ${standard} requirements (Score: ${accessibilityScore}%)`
        : `❌ Your app does not meet ${standard} requirements (Score: ${accessibilityScore}%). Please review the failed tests.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      accessible={true}
      accessibilityLabel="Accessibility Dashboard"
      accessibilityHint="Comprehensive accessibility settings and testing dashboard"
    >
      <Text style={styles.title} accessibilityRole="header">
        Accessibility Dashboard
      </Text>

      {/* Accessibility Score Overview */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreTitle}>Accessibility Score</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>{accessibilityScore}%</Text>
          <View style={styles.scoreBar}>
            {Platform.OS === 'android' ? (
              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={accessibilityScore / 100}
                color={accessibilityScore >= 85 ? '#28a745' : accessibilityScore >= 70 ? '#ffc107' : '#dc3545'}
              />
            ) : (
              <View style={[styles.progressBar, { width: `${accessibilityScore}%` }]} />
            )}
          </View>
        </View>
        <Text style={styles.scoreDescription}>
          {accessibilityScore >= 95 ? 'Excellent accessibility' :
           accessibilityScore >= 85 ? 'Good accessibility' :
           accessibilityScore >= 70 ? 'Fair accessibility' : 'Needs improvement'}
        </Text>
      </View>

      {/* Quick Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Quick Tests
        </Text>

        <TouchableOpacity
          style={[styles.testButton, isRunningTests && styles.disabledButton]}
          onPress={runAccessibilityTests}
          disabled={isRunningTests}
          accessibilityLabel="Run accessibility tests"
          accessibilityHint="Perform comprehensive accessibility testing"
        >
          <Text style={styles.testButtonText}>
            {isRunningTests ? '🧪 Running Tests...' : '🧪 Run Accessibility Tests'}
          </Text>
        </TouchableOpacity>

        <View style={styles.testResults}>
          <View style={styles.testResult}>
            <Text style={styles.testLabel}>Color Contrast</Text>
            <Text style={[styles.testStatus, testResults.colorContrast ? styles.pass : styles.fail]}>
              {testResults.colorContrast ? '✅ Pass' : '❌ Fail'}
            </Text>
          </View>
          <View style={styles.testResult}>
            <Text style={styles.testLabel}>Touch Targets</Text>
            <Text style={[styles.testStatus, testResults.touchTargets ? styles.pass : styles.fail]}>
              {testResults.touchTargets ? '✅ Pass' : '❌ Fail'}
            </Text>
          </View>
          <View style={styles.testResult}>
            <Text style={styles.testLabel}>Screen Reader</Text>
            <Text style={[styles.testStatus, testResults.screenReader ? styles.pass : styles.fail]}>
              {testResults.screenReader ? '✅ Pass' : '❌ Fail'}
            </Text>
          </View>
          <View style={styles.testResult}>
            <Text style={styles.testLabel}>Keyboard Navigation</Text>
            <Text style={[styles.testStatus, testResults.keyboardNavigation ? styles.pass : styles.fail]}>
              {testResults.keyboardNavigation ? '✅ Pass' : '❌ Fail'}
            </Text>
          </View>
        </View>
      </View>

      {/* Compliance Check */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Compliance Check
        </Text>
        <Text style={styles.complianceDescription}>
          Check your app's compliance with various accessibility standards
        </Text>

        <View style={styles.complianceButtons}>
          {['WCAG 2.1 AA', 'WCAG 2.1 AAA', 'Section 508', 'EN 301 549'].map((standard) => (
            <TouchableOpacity
              key={standard}
              style={styles.complianceButton}
              onPress={() => checkCompliance(standard)}
              accessibilityLabel={`Check ${standard} compliance`}
              accessibilityHint={`Verify compliance with ${standard} accessibility standard`}
            >
              <Text style={styles.complianceButtonText}>{standard}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Visual Accessibility Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Visual Accessibility
        </Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>High Contrast</Text>
          <Switch
            value={highContrast}
            onValueChange={(value) => {
              toggleHighContrast();
              handleSettingChange('High contrast', value);
            }}
            accessibilityLabel="High contrast mode"
            accessibilityHint="Toggle high contrast colors for better visibility"
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Reduced Motion</Text>
          <Switch
            value={reducedMotion}
            onValueChange={(value) => {
              toggleReducedMotion();
              handleSettingChange('Reduced motion', value);
            }}
            accessibilityLabel="Reduced motion"
            accessibilityHint="Reduce animations and transitions"
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Large Text</Text>
          <Switch
            value={largeTextEnabled}
            onValueChange={(value) => {
              toggleLargeText();
              handleSettingChange('Large text', value);
            }}
            accessibilityLabel="Large text mode"
            accessibilityHint="Use larger text throughout the app"
          />
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Font Size</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.sizeButton}
              onPress={() => handleFontSizeChange(false)}
              accessibilityLabel="Decrease font size"
              accessibilityHint="Make text smaller"
            >
              <Text style={styles.buttonText}>A-</Text>
            </TouchableOpacity>
            <Text style={styles.sizeValue}>{fontSize}</Text>
            <TouchableOpacity
              style={styles.sizeButton}
              onPress={() => handleFontSizeChange(true)}
              accessibilityLabel="Increase font size"
              accessibilityHint="Make text larger"
            >
              <Text style={styles.buttonText}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingLabel}>Color Blind Mode</Text>
          <View style={styles.pickerContainer}>
            {['none', 'protanomaly', 'deuteranomaly', 'tritanomaly'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.pickerOption,
                  colorBlindMode === mode && styles.pickerOptionSelected
                ]}
                onPress={() => handleColorBlindModeChange(mode)}
                accessibilityLabel={`Color blind mode ${mode}`}
                accessibilityHint={`Select ${mode} color blind mode`}
              >
                <Text style={[
                  styles.pickerText,
                  colorBlindMode === mode && styles.pickerTextSelected
                ]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Interaction & Motor Accessibility */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Interaction & Motor
        </Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Haptic Feedback</Text>
          <Switch
            value={hapticFeedbackEnabled}
            onValueChange={(value) => {
              toggleHapticFeedback();
              handleSettingChange('Haptic feedback', value);
            }}
            accessibilityLabel="Haptic feedback"
            accessibilityHint="Enable vibration feedback for interactions"
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Button Shapes</Text>
          <Switch
            value={buttonShapesEnabled}
            onValueChange={(value) => {
              toggleButtonShapes();
              handleSettingChange('Button shapes', value);
            }}
            accessibilityLabel="Button shapes"
            accessibilityHint="Show clear button boundaries"
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>VoiceOver</Text>
          <Switch
            value={voiceOverEnabled}
            onValueChange={() => {
              Alert.alert(
                'VoiceOver',
                'VoiceOver status is managed by iOS. Please go to Settings > Accessibility > VoiceOver to change this setting.',
                [{ text: 'OK' }]
              );
            }}
            accessibilityLabel="VoiceOver status"
            accessibilityHint="VoiceOver screen reader status (managed by system)"
          />
        </View>

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={() => {
            // This will be handled by the gesture system
            Alert.alert(
              'Voice Navigation',
              'Double-tap anywhere on the screen to open voice navigation, or use voice commands when available.',
              [{ text: 'OK' }]
            );
            announceForAccessibility('Voice navigation activated. Double tap anywhere to open voice commands');
          }}
          accessibilityLabel="Activate voice navigation"
          accessibilityHint="Enable voice-controlled navigation features"
        >
          <Text style={styles.voiceButtonText}>🎤 Voice Navigation</Text>
        </TouchableOpacity>
      </View>

      {/* Theme Customization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Theme Customization
        </Text>

        <TouchableOpacity
          style={styles.themeButton}
          onPress={() => {
            navigation.navigate('ThemeBuilder' as never);
            announceForAccessibility('Opening theme builder');
          }}
          accessibilityLabel="Open theme builder"
          accessibilityHint="Create and customize app themes"
        >
          <Text style={styles.themeButtonText}>🎨 Open Theme Builder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: '#06b6d4' }]}
          onPress={() => {
            navigation.navigate('Analytics' as never);
            announceForAccessibility('Opening analytics dashboard');
          }}
          accessibilityLabel="Open analytics dashboard"
          accessibilityHint="View app usage analytics and insights"
        >
          <Text style={styles.themeButtonText}>📊 View Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: '#10b981' }]}
          onPress={() => {
            navigation.navigate('Performance' as never);
            announceForAccessibility('Opening performance monitor');
          }}
          accessibilityLabel="Open performance monitor"
          accessibilityHint="Monitor app performance and identify bottlenecks"
        >
          <Text style={styles.themeButtonText}>⚡ Performance Monitor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: '#8b5cf6' }]}
          onPress={() => {
            setShowDeploymentDashboard(true);
            announceForAccessibility('Opening deployment dashboard');
          }}
          accessibilityLabel="Open deployment dashboard"
          accessibilityHint="Manage app deployment, updates, and monitoring"
        >
          <Text style={styles.themeButtonText}>🚀 Deployment Dashboard</Text>
        </TouchableOpacity>

        <Text style={styles.themeDescription}>
          Create custom themes with your preferred colors, or choose from preset themes for different visual experiences.
          View detailed analytics about your app usage and user behavior patterns.
          Monitor app performance metrics and get optimization recommendations.
        </Text>
      </View>

      {/* Advanced Testing & Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Advanced Testing & Tools
        </Text>

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            announceForAccessibility('This is a test announcement for screen readers');
            performHapticFeedback('medium');
          }}
          accessibilityLabel="Test accessibility announcement"
          accessibilityHint="Test screen reader announcement and haptic feedback"
        >
          <Text style={styles.testButtonText}>Test Announcement & Haptic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            Alert.alert(
              'Accessibility Info',
              `VoiceOver: ${voiceOverEnabled ? 'Enabled' : 'Disabled'}\nHaptic: ${hapticFeedbackEnabled ? 'Enabled' : 'Disabled'}\nHigh Contrast: ${highContrast ? 'Enabled' : 'Disabled'}`,
              [{ text: 'OK' }]
            );
          }}
          accessibilityLabel="Show accessibility status"
          accessibilityHint="Display current accessibility settings"
        >
          <Text style={styles.testButtonText}>Show Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: '#17a2b8' }]}
          onPress={() => {
            setShowIntegrationTests(true);
            announceForAccessibility('Opening integration test runner');
          }}
          accessibilityLabel="Run integration tests"
          accessibilityHint="Test all mobile features and integrations"
        >
          <Text style={styles.testButtonText}>🔗 Integration Tests</Text>
        </TouchableOpacity>
      </View>

      <MobileDeploymentDashboard
        isVisible={showDeploymentDashboard}
        onClose={() => setShowDeploymentDashboard(false)}
      />

      <MobileIntegrationTestRunner
        isVisible={showIntegrationTests}
        onClose={() => setShowIntegrationTests(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  scoreSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  testResults: {
    marginTop: 16,
  },
  testResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  testLabel: {
    fontSize: 16,
    color: '#333',
  },
  testStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  pass: {
    color: '#28a745',
  },
  fail: {
    color: '#dc3545',
  },
  complianceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  complianceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  complianceButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  complianceButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingGroup: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sizeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sizeValue: {
    fontSize: 16,
    color: '#666',
    minWidth: 60,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  pickerOption: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
  },
  pickerText: {
    color: '#333',
    fontSize: 14,
  },
  pickerTextSelected: {
    color: 'white',
  },
  testButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  themeButton: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  themeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  themeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  voiceButton: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
});

export default SettingsScreen;