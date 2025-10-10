import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import {
  MobileDeploymentUtils,
  DeploymentConfig,
  DeploymentMetrics,
  UpdateInfo
} from '../lib/mobileDeploymentUtils';

interface MobileDeploymentDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const MobileDeploymentDashboard: React.FC<MobileDeploymentDashboardProps> = ({
  isVisible,
  onClose,
}) => {
  const [config, setConfig] = useState<DeploymentConfig | null>(null);
  const [metrics, setMetrics] = useState<DeploymentMetrics | null>(null);
  const [availableUpdate, setAvailableUpdate] = useState<UpdateInfo | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
  }, [isVisible]);

  const loadData = async () => {
    try {
      const [configData, metricsData] = await Promise.all([
        MobileDeploymentUtils.getDeploymentConfig(),
        MobileDeploymentUtils.getDeploymentMetrics(),
      ]);
      setConfig(configData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading deployment data:', error);
      Alert.alert('Error', 'Failed to load deployment data');
    }
  };

  const updateConfig = async (updates: Partial<DeploymentConfig>) => {
    if (!config) return;

    try {
      await MobileDeploymentUtils.updateDeploymentConfig(updates);
      setConfig({ ...config, ...updates });
      Alert.alert('Success', 'Configuration updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update configuration');
    }
  };

  const checkForUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const update = await MobileDeploymentUtils.checkForUpdates();
      setAvailableUpdate(update);

      if (update) {
        Alert.alert(
          'Update Available',
          `Version ${update.version} is available.\n\n${update.releaseNotes}`,
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Download', onPress: () => downloadUpdate(update) },
          ]
        );
      } else {
        Alert.alert('No Updates', 'Your app is up to date');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check for updates');
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const downloadUpdate = async (update: UpdateInfo) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const success = await MobileDeploymentUtils.downloadAndInstallUpdate(update);

      clearInterval(progressInterval);
      setDownloadProgress(100);

      if (success) {
        Alert.alert('Success', 'Update installed successfully. Please restart the app.');
        setAvailableUpdate(null);
        await loadData(); // Refresh data
      } else {
        Alert.alert('Error', 'Failed to install update');
      }
    } catch (error) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const clearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will reset all deployment data and crash reports. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await MobileDeploymentUtils.clearAllData();
              await loadData();
              Alert.alert('Success', 'All deployment data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const renderConfigSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Configuration</Text>

      {config && (
        <View style={styles.configList}>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>App Version</Text>
            <Text style={styles.configValue}>{config.appVersion}</Text>
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Build Number</Text>
            <Text style={styles.configValue}>{config.buildNumber}</Text>
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Environment</Text>
            <View style={[styles.environmentBadge, { backgroundColor: MobileDeploymentUtils.getEnvironmentColor(config.environment) }]}>
              <Text style={styles.environmentText}>{config.environment.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Update Channel</Text>
            <Text style={styles.configValue}>{config.updateChannel}</Text>
          </View>

          <View style={styles.configSwitch}>
            <Text style={styles.configLabel}>Auto Update</Text>
            <Switch
              value={config.autoUpdate}
              onValueChange={(value) => updateConfig({ autoUpdate: value })}
            />
          </View>

          <View style={styles.configSwitch}>
            <Text style={styles.configLabel}>Crash Reporting</Text>
            <Switch
              value={config.crashReporting}
              onValueChange={(value) => updateConfig({ crashReporting: value })}
            />
          </View>

          <View style={styles.configSwitch}>
            <Text style={styles.configLabel}>Analytics</Text>
            <Switch
              value={config.analyticsEnabled}
              onValueChange={(value) => updateConfig({ analyticsEnabled: value })}
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderUpdateSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Updates</Text>

      <TouchableOpacity
        style={[styles.updateButton, isCheckingUpdate && styles.disabledButton]}
        onPress={checkForUpdates}
        disabled={isCheckingUpdate}
      >
        {isCheckingUpdate ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.updateButtonText}>🔍 Check for Updates</Text>
        )}
      </TouchableOpacity>

      {availableUpdate && (
        <View style={styles.updateInfo}>
          <Text style={styles.updateTitle}>Update Available: v{availableUpdate.version}</Text>
          <Text style={styles.updateNotes}>{availableUpdate.releaseNotes}</Text>
          <Text style={styles.updateSize}>
            Size: {MobileDeploymentUtils.formatFileSize(availableUpdate.size)}
            {availableUpdate.mandatory && ' (Mandatory)'}
          </Text>

          <TouchableOpacity
            style={[styles.downloadButton, isDownloading && styles.disabledButton]}
            onPress={() => downloadUpdate(availableUpdate)}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <View style={styles.downloadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.downloadingText}>Downloading... {Math.round(downloadProgress)}%</Text>
              </View>
            ) : (
              <Text style={styles.downloadButtonText}>⬇️ Download & Install</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderMetricsSection = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.metricsToggle}
        onPress={() => setShowMetrics(!showMetrics)}
      >
        <Text style={styles.sectionTitle}>Deployment Metrics</Text>
        <Text style={styles.toggleText}>{showMetrics ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {showMetrics && metrics && (
        <View style={styles.metricsList}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>App Starts</Text>
            <Text style={styles.metricValue}>{metrics.appStarts}</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Crashes</Text>
            <Text style={styles.metricValue}>{metrics.crashCount}</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Update Checks</Text>
            <Text style={styles.metricValue}>{metrics.updateChecks}</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Successful Updates</Text>
            <Text style={styles.metricValue}>{metrics.successfulUpdates}</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Failed Updates</Text>
            <Text style={styles.metricValue}>{metrics.failedUpdates}</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Last Update Check</Text>
            <Text style={styles.metricValue}>
              {metrics.lastUpdateCheck.toLocaleDateString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Deployment Dashboard</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {renderConfigSection()}
          {renderUpdateSection()}
          {renderMetricsSection()}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maintenance</Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearData}
            >
              <Text style={styles.clearButtonText}>🗑️ Clear All Data</Text>
            </TouchableOpacity>

            <Text style={styles.warningText}>
              This will reset deployment configuration, metrics, and crash reports.
            </Text>
          </View>
        </ScrollView>
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
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  configList: {
    gap: 10,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  configLabel: {
    fontSize: 16,
    color: '#333',
  },
  configValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  configSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  environmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  environmentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  updateInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#28a745',
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 8,
  },
  updateNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  updateSize: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  downloadingText: {
    color: '#fff',
    fontSize: 14,
  },
  metricsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 18,
    color: '#666',
  },
  metricsList: {
    marginTop: 10,
    gap: 8,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  metricLabel: {
    fontSize: 14,
    color: '#333',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 12,
    color: '#dc3545',
    textAlign: 'center',
  },
});

export default MobileDeploymentDashboard;