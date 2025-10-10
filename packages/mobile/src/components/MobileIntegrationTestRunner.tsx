import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { runMobileIntegrationTests, TestResult } from '../lib/mobileIntegrationTests';

interface MobileIntegrationTestRunnerProps {
  isVisible: boolean;
  onClose: () => void;
}

const MobileIntegrationTestRunner: React.FC<MobileIntegrationTestRunnerProps> = ({
  isVisible,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    duration: number;
  } | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setSummary(null);

    try {
      const { results, summary: testSummary } = await runMobileIntegrationTests();
      setTestResults(results);
      setSummary(testSummary);
    } catch (error) {
      console.error('Test runner error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const renderTestResult = ({ item }: { item: TestResult }) => (
    <View style={[styles.testResult, item.passed ? styles.passedTest : styles.failedTest]}>
      <View style={styles.testHeader}>
        <Text style={[styles.testName, item.passed ? styles.passedText : styles.failedText]}>
          {item.passed ? '✅' : '❌'} {item.testName}
        </Text>
        <Text style={styles.testDuration}>{item.duration}ms</Text>
      </View>
      {!item.passed && item.error && (
        <Text style={styles.testError}>{item.error}</Text>
      )}
    </View>
  );

  const getSuccessRate = () => {
    if (!summary) return 0;
    return ((summary.passed / summary.total) * 100).toFixed(1);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Integration Tests</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.controlSection}>
            <TouchableOpacity
              style={[styles.runButton, isRunning && styles.disabledButton]}
              onPress={runTests}
              disabled={isRunning}
            >
              {isRunning ? (
                <View style={styles.runningContainer}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.runButtonText}>Running Tests...</Text>
                </View>
              ) : (
                <Text style={styles.runButtonText}>🧪 Run Integration Tests</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.description}>
              Test all mobile features including media processing, gesture support, voice navigation, and deployment utilities.
            </Text>
          </View>

          {summary && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Test Results Summary</Text>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{summary.total}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, styles.passedStat]}>{summary.passed}</Text>
                  <Text style={styles.statLabel}>Passed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, styles.failedStat]}>{summary.failed}</Text>
                  <Text style={styles.statLabel}>Failed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{summary.duration}ms</Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
              </View>
              <View style={styles.successRate}>
                <Text style={styles.successRateText}>
                  Success Rate: {getSuccessRate()}%
                </Text>
              </View>
            </View>
          )}

          {testResults.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Detailed Results</Text>
              <FlatList
                data={testResults}
                renderItem={renderTestResult}
                keyExtractor={(item) => item.testName}
                showsVerticalScrollIndicator={false}
                style={styles.resultsList}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007BFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  controlSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  runButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  runButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  runningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summarySection: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  passedStat: {
    color: '#28a745',
  },
  failedStat: {
    color: '#dc3545',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  successRate: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  successRateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  resultsSection: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultsList: {
    flex: 1,
  },
  testResult: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  passedTest: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  failedTest: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  passedText: {
    color: '#155724',
  },
  failedText: {
    color: '#721c24',
  },
  testDuration: {
    fontSize: 12,
    color: '#666',
  },
  testError: {
    fontSize: 14,
    color: '#721c24',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default MobileIntegrationTestRunner;