import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';

const ContentScreen = () => {
  const navigation = useNavigation();
  const { themeStyles } = useTheme();

  const navigateToAdvancedEditor = () => {
    navigation.navigate('AdvancedContentEditor' as never);
  };

  const navigateToAnalytics = () => {
    navigation.navigate('Analytics' as never);
  };

  const navigateToPerformance = () => {
    navigation.navigate('Performance' as never);
  };

  const navigateToThemeBuilder = () => {
    navigation.navigate('ThemeBuilder' as never);
  };

  return (
    <ScrollView style={[styles.container, themeStyles.background]}>
      <View style={styles.header}>
        <Text style={[styles.title, themeStyles.text]}>Content Management</Text>
        <Text style={[styles.subtitle, themeStyles.textSecondary]}>
          Create, edit, and manage your content with advanced AI-powered tools
        </Text>
      </View>

      <View style={styles.featuresGrid}>
        <TouchableOpacity
          style={[styles.featureCard, themeStyles.card]}
          onPress={navigateToAdvancedEditor}
          accessibilityLabel="Advanced Content Editor"
          accessibilityHint="Open the advanced content editor with AI assistance"
        >
          <Text style={[styles.featureIcon, themeStyles.text]}>📝</Text>
          <Text style={[styles.featureTitle, themeStyles.text]}>Advanced Editor</Text>
          <Text style={[styles.featureDescription, themeStyles.textSecondary]}>
            AI-powered writing with SEO optimization and rich media support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureCard, themeStyles.card]}
          onPress={navigateToAnalytics}
          accessibilityLabel="Analytics Dashboard"
          accessibilityHint="View detailed analytics and usage statistics"
        >
          <Text style={[styles.featureIcon, themeStyles.text]}>📊</Text>
          <Text style={[styles.featureTitle, themeStyles.text]}>Analytics</Text>
          <Text style={[styles.featureDescription, themeStyles.textSecondary]}>
            Track user behavior, performance metrics, and engagement data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureCard, themeStyles.card]}
          onPress={navigateToPerformance}
          accessibilityLabel="Performance Dashboard"
          accessibilityHint="Monitor app performance and identify bottlenecks"
        >
          <Text style={[styles.featureIcon, themeStyles.text]}>⚡</Text>
          <Text style={[styles.featureTitle, themeStyles.text]}>Performance</Text>
          <Text style={[styles.featureDescription, themeStyles.textSecondary]}>
            Real-time performance monitoring and optimization tools
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.featureCard, themeStyles.card]}
          onPress={navigateToThemeBuilder}
          accessibilityLabel="Theme Builder"
          accessibilityHint="Customize app appearance and create themes"
        >
          <Text style={[styles.featureIcon, themeStyles.text]}>🎨</Text>
          <Text style={[styles.featureTitle, themeStyles.text]}>Theme Builder</Text>
          <Text style={[styles.featureDescription, themeStyles.textSecondary]}>
            Create and customize themes for personalized experience
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.infoTitle, themeStyles.text]}>Advanced Features</Text>
        <Text style={[styles.infoText, themeStyles.textSecondary]}>
          • AI-powered content analysis and improvement{'\n'}
          • Real-time SEO optimization and scoring{'\n'}
          • Advanced media processing and management{'\n'}
          • Gesture-based navigation and voice commands{'\n'}
          • Comprehensive analytics and performance monitoring{'\n'}
          • Customizable themes and accessibility options
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoSection: {
    padding: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ContentScreen;