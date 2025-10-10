import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import MobileAnalyticsTracker from '../lib/mobileAnalytics';
import MobilePerformanceMonitor from '../lib/mobilePerformanceMonitor';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { themeStyles } = useTheme();
  const { steps, completeStep } = useOnboarding();
  const [analyticsSummary, setAnalyticsSummary] = useState({
    totalEvents: 0,
    sessionsToday: 0,
    avgSessionDuration: 0,
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    appStartTime: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load analytics summary
      const tracker = MobileAnalyticsTracker.getInstance();
      const events = await tracker.getEvents();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayEvents = events.filter(event => new Date(event.timestamp) >= today);
      const sessions = new Set(todayEvents.map(event => event.sessionId)).size;

      setAnalyticsSummary({
        totalEvents: events.length,
        sessionsToday: sessions,
        avgSessionDuration: 180, // Mock data - would calculate from actual session data
      });

      // Load performance metrics
      const monitor = MobilePerformanceMonitor.getInstance();
      const metrics = monitor.getMetrics();

      setPerformanceMetrics({
        fps: metrics.fps,
        memoryUsage: metrics.memoryUsage,
        appStartTime: metrics.appStartTime,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const navigateToContent = () => {
    navigation.navigate('Content' as never);
    completeStep('Create your first block');
  };

  const navigateToAIScan = () => {
    navigation.navigate('Scan' as never);
    completeStep('Use an AI suggestion');
  };

  const navigateToSettings = () => {
    navigation.navigate('Profile' as never);
  };

  const showQuickActions = () => {
    Alert.alert(
      'Quick Actions',
      'Choose an action to perform',
      [
        { text: 'New Document', onPress: () => navigation.navigate('AdvancedContentEditor' as never) },
        { text: 'Run Tests', onPress: () => navigation.navigate('Settings' as never) },
        { text: 'View Analytics', onPress: () => navigation.navigate('Analytics' as never) },
        { text: 'Collaboration', onPress: () => navigation.navigate('Collaboration' as never) },
        { text: 'Security Dashboard', onPress: () => navigation.navigate('Security' as never) },
        { text: 'Cloud Sync', onPress: () => navigation.navigate('CloudSync' as never) },
        { text: 'Advanced Search', onPress: () => navigation.navigate('AdvancedSearch' as never) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;

  return (
    <ScrollView style={[styles.container, themeStyles.background]}>
      <View style={styles.header}>
        <Text style={[styles.title, themeStyles.text]}>SmartAccessible CMS</Text>
        <Text style={[styles.subtitle, themeStyles.textSecondary]}>
          Advanced Content Management System
        </Text>
      </View>

      {/* Onboarding Progress */}
      <View style={[styles.card, themeStyles.card]}>
        <Text style={[styles.cardTitle, themeStyles.text]}>Getting Started</Text>
        <Text style={[styles.progressText, themeStyles.text]}>
          {completedSteps} of {totalSteps} steps completed
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${(completedSteps / totalSteps) * 100}%` }]}
          />
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: '#007bff' }]}
          onPress={() => navigation.navigate('Onboarding' as never)}
        >
          <Text style={styles.primaryButtonText}>Continue Setup</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, themeStyles.card]}>
          <Text style={[styles.statValue, themeStyles.text]}>{analyticsSummary.totalEvents}</Text>
          <Text style={[styles.statLabel, themeStyles.textSecondary]}>Total Events</Text>
        </View>
        <View style={[styles.statCard, themeStyles.card]}>
          <Text style={[styles.statValue, themeStyles.text]}>{analyticsSummary.sessionsToday}</Text>
          <Text style={[styles.statLabel, themeStyles.textSecondary]}>Sessions Today</Text>
        </View>
        <View style={[styles.statCard, themeStyles.card]}>
          <Text style={[styles.statValue, themeStyles.text]}>{performanceMetrics.fps}</Text>
          <Text style={[styles.statLabel, themeStyles.textSecondary]}>FPS</Text>
        </View>
        <View style={[styles.statCard, themeStyles.card]}>
          <Text style={[styles.statValue, themeStyles.text]}>{Math.round(performanceMetrics.memoryUsage / 1024 / 1024)}MB</Text>
          <Text style={[styles.statLabel, themeStyles.textSecondary]}>Memory</Text>
        </View>
      </View>

      {/* Main Actions */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={navigateToContent}
          accessibilityLabel="Content Management"
          accessibilityHint="Access content creation and management tools"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>📝</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>Content</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            Create and edit content
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={navigateToAIScan}
          accessibilityLabel="AI Assistant"
          accessibilityHint="Use AI-powered content analysis and improvement"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>🤖</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>AI Scan</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            Analyze and improve content
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={() => navigation.navigate('Media' as never)}
          accessibilityLabel="Notifications"
          accessibilityHint="View notifications and alerts"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>🔔</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>Notifications</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            Stay updated
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={navigateToSettings}
          accessibilityLabel="Settings"
          accessibilityHint="Configure app settings and preferences"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>⚙️</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>Settings</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            Customize your experience
          </Text>
        </TouchableOpacity>
      </View>

      {/* Advanced Features */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Text style={[styles.cardTitle, themeStyles.text]}>Advanced Features</Text>
      </View>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={() => navigation.navigate('Collaboration' as never)}
          accessibilityLabel="Real-time Collaboration"
          accessibilityHint="Collaborate with team members in real-time"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>👥</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>Collaboration</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            Work together in real-time
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={() => navigation.navigate('Security' as never)}
          accessibilityLabel="Security Dashboard"
          accessibilityHint="Monitor and manage security settings"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>🔒</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>Security</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            Enterprise-grade security
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={() => navigation.navigate('CloudSync' as never)}
          accessibilityLabel="Cloud Synchronization"
          accessibilityHint="Sync content across devices and platforms"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>☁️</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>Cloud Sync</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            Sync across all devices
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, themeStyles.card]}
          onPress={() => navigation.navigate('AdvancedSearch' as never)}
          accessibilityLabel="Advanced Search"
          accessibilityHint="Powerful AI-powered search capabilities"
        >
          <Text style={[styles.actionIcon, themeStyles.text]}>🔍</Text>
          <Text style={[styles.actionTitle, themeStyles.text]}>Search</Text>
          <Text style={[styles.actionDescription, themeStyles.textSecondary]}>
            AI-powered search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={[styles.card, themeStyles.card]}>
        <Text style={[styles.cardTitle, themeStyles.text]}>Quick Actions</Text>
        <TouchableOpacity
          style={[styles.secondaryButton, themeStyles.card]}
          onPress={showQuickActions}
        >
          <Text style={[styles.secondaryButtonText, themeStyles.text]}>Show Quick Actions</Text>
        </TouchableOpacity>
      </View>

      {/* Advanced Features Preview */}
      <View style={[styles.card, themeStyles.card]}>
        <Text style={[styles.cardTitle, themeStyles.text]}>Advanced Features</Text>
        <Text style={[styles.featureList, themeStyles.textSecondary]}>
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
    backgroundColor: '#007bff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#e6f3ff',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 2,
  },
  primaryButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  statCard: {
    width: '48%',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  actionCard: {
    width: '48%',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  secondaryButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureList: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DashboardScreen;