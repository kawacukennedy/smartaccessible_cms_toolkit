import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import MobilePerformanceMonitor, { PerformanceMetrics } from '../lib/mobilePerformanceMonitor';

const { width } = Dimensions.get('window');

const MobilePerformanceDashboard: React.FC = () => {
  const { themeStyles } = useTheme();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [analysis, setAnalysis] = useState<{
    score: number;
    issues: string[];
    recommendations: string[];
  } | null>(null);
  const [monitor] = useState(() => MobilePerformanceMonitor.getInstance());

  useEffect(() => {
    // Subscribe to performance updates
    const unsubscribe = monitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setAnalysis(monitor.analyzePerformance());
    });

    // Initial data load
    setMetrics(monitor.getMetrics());
    setAnalysis(monitor.analyzePerformance());

    return unsubscribe;
  }, [monitor]);

  const runPerformanceTest = async () => {
    Alert.alert('Performance Test', 'Running performance test...');

    await monitor.measureAsyncExecutionTime(async () => {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 100));

      // Test memory allocation
      const testArray = new Array(10000).fill(Math.random());
      testArray.length = 0; // Allow GC

      // Test rendering performance
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(i);
      }
    }, 'performance-test');

    Alert.alert('Test Complete', 'Performance test finished');
  };

  const resetMetrics = () => {
    monitor.reset();
    Alert.alert('Reset', 'Performance metrics have been reset');
  };

  const exportData = () => {
    const data = monitor.exportData();
    console.log('Performance Data:', JSON.stringify(data, null, 2));
    Alert.alert('Data Exported', 'Performance data logged to console');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    unit: string,
    icon: string,
    color: string = '#3b82f6'
  ) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricIcon}>{icon}</Text>
        <View style={styles.metricContent}>
          <Text style={[styles.metricValue, themeStyles.text]}>
            {typeof value === 'number' ? value.toFixed(1) : value}
            <Text style={styles.metricUnit}>{unit}</Text>
          </Text>
          <Text style={[styles.metricTitle, themeStyles.textSecondary]}>{title}</Text>
        </View>
      </View>
    </View>
  );

  if (!metrics || !analysis) {
    return (
      <View style={[styles.container, styles.centered, themeStyles.background]}>
        <Text style={[styles.loadingText, themeStyles.text]}>Loading performance data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, themeStyles.background]}>
      <Text style={[styles.title, themeStyles.text]}>Performance Monitor</Text>

      {/* Performance Score */}
      <View style={[styles.scoreCard, themeStyles.card]}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreIcon}>📊</Text>
          <View style={styles.scoreContent}>
            <Text
              style={[styles.scoreValue, { color: getScoreColor(analysis.score) }]}
            >
              {analysis.score}
            </Text>
            <Text style={[styles.scoreLabel, themeStyles.textSecondary]}>
              {getScoreLabel(analysis.score)}
            </Text>
          </View>
        </View>
        <Text style={[styles.scoreDescription, themeStyles.textSecondary]}>
          Overall performance score based on FPS, memory usage, and network performance
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        {renderMetricCard('FPS', metrics.fps, '', '🎯', '#10b981')}
        {renderMetricCard('Memory', metrics.memoryUsage, 'MB', '🧠', '#f59e0b')}
        {renderMetricCard('Network Requests', metrics.networkRequests, '', '🌐', '#3b82f6')}
        {renderMetricCard('Avg Response', metrics.averageResponseTime, 'ms', '⚡', '#8b5cf6')}
        {renderMetricCard('Render Time', metrics.renderTime, 'ms', '🎨', '#06b6d4')}
        {renderMetricCard('Time to Interactive', metrics.timeToInteractive, 'ms', '🚀', '#ec4899')}
      </View>

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>Performance Issues</Text>
          {analysis.issues.map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <Text style={styles.issueIcon}>⚠️</Text>
              <Text style={[styles.issueText, themeStyles.text]}>{issue}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>Recommendations</Text>
          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>💡</Text>
              <Text style={[styles.recommendationText, themeStyles.text]}>{recommendation}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Custom Metrics */}
      {Object.keys(metrics.customMetrics).length > 0 && (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>Custom Metrics</Text>
          {Object.entries(metrics.customMetrics).map(([key, value]) => (
            <View key={key} style={styles.customMetricItem}>
              <Text style={[styles.customMetricName, themeStyles.text]}>{key}</Text>
              <Text style={[styles.customMetricValue, themeStyles.text]}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recent Entries */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Recent Performance Entries</Text>
        {monitor.getEntries().slice(-5).reverse().map((entry, index) => (
          <View key={`${entry.name}-${entry.startTime}`} style={styles.entryItem}>
            <View style={styles.entryHeader}>
              <Text style={[styles.entryName, themeStyles.text]}>{entry.name}</Text>
              <Text style={[styles.entryDuration, themeStyles.textSecondary]}>
                {entry.duration.toFixed(1)}ms
              </Text>
            </View>
            <Text style={[styles.entryType, themeStyles.textSecondary]}>
              {entry.entryType}
            </Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, themeStyles.button]}
          onPress={runPerformanceTest}
        >
          <Text style={themeStyles.buttonText}>🧪 Run Performance Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
          onPress={exportData}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            📤 Export Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
          onPress={resetMetrics}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            🔄 Reset Metrics
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  scoreCard: {
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  scoreDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  metricsGrid: {
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  metricTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  issueText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  customMetricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  customMetricName: {
    fontSize: 14,
    fontWeight: '500',
  },
  customMetricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  entryItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  entryDuration: {
    fontSize: 12,
  },
  entryType: {
    fontSize: 12,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default MobilePerformanceDashboard;