import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  mobileCloudSync,
  SyncConfig,
  SyncSession,
  SyncItem
} from '../lib/mobileCloudSync';

interface CloudSyncDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const CloudSyncDashboard: React.FC<CloudSyncDashboardProps> = ({ isVisible, onClose }) => {
  const { themeStyles } = useTheme();
  const [config, setConfig] = useState<SyncConfig | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    isOnline: boolean;
    queueLength: number;
    pendingItems: number;
    syncingItems: number;
    conflictedItems: number;
  } | null>(null);
  const [activeSession, setActiveSession] = useState<SyncSession | null>(null);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      loadSyncData();
    }
  }, [isVisible]);

  const loadSyncData = async () => {
    setIsLoading(true);
    try {
      const [configData, statusData, sessionData, queueData] = await Promise.all([
        Promise.resolve(mobileCloudSync.getSyncConfig()),
        Promise.resolve(mobileCloudSync.getSyncStatus()),
        Promise.resolve(mobileCloudSync.getActiveSession()),
        Promise.resolve(mobileCloudSync.getSyncQueue())
      ]);

      setConfig(configData);
      setSyncStatus(statusData);
      setActiveSession(sessionData);
      setSyncQueue(queueData);
    } catch (error) {
      console.error('Error loading sync data:', error);
      Alert.alert('Error', 'Failed to load sync data');
    } finally {
      setIsLoading(false);
    }
  };

  const performSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 0.1, 0.9));
      }, 500);

      const session = await mobileCloudSync.performSync();

      clearInterval(progressInterval);
      setSyncProgress(1);

      // Reload data
      await loadSyncData();

      Alert.alert(
        'Sync Complete',
        `Synced ${session.itemsSynced} items. ${session.itemsFailed} failed.`
      );
    } catch (error) {
      console.error('Sync failed:', error);
      Alert.alert('Sync Failed', error.message || 'An error occurred during sync');
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const updateSyncConfig = async (updates: Partial<SyncConfig>) => {
    if (!config) return;

    try {
      await mobileCloudSync.updateSyncConfig(updates);
      setConfig({ ...config, ...updates });
      Alert.alert('Success', 'Sync settings updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update sync settings');
    }
  };

  const createBackup = async () => {
    try {
      const backupId = await mobileCloudSync.createBackup();
      Alert.alert('Success', `Backup created with ID: ${backupId.slice(-8)}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create backup');
    }
  };

  const clearSyncQueue = async () => {
    Alert.alert(
      'Clear Queue',
      'Are you sure you want to clear the sync queue? Unsynced changes may be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await mobileCloudSync.clearSyncQueue();
              setSyncQueue([]);
              setSyncStatus(prev => prev ? { ...prev, queueLength: 0, pendingItems: 0 } : null);
              Alert.alert('Success', 'Sync queue cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear sync queue');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return '#10b981';
      case 'syncing': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'conflict': return '#ef4444';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'synced': return 'Synced';
      case 'syncing': return 'Syncing';
      case 'pending': return 'Pending';
      case 'conflict': return 'Conflict';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, themeStyles.background]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={[styles.loadingText, themeStyles.text]}>Loading sync data...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, themeStyles.background]}>
      <View style={[styles.header, themeStyles.card]}>
        <Text style={[styles.title, themeStyles.text]}>Cloud Sync</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, themeStyles.text]}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sync Status */}
        {syncStatus && (
          <View style={[styles.section, themeStyles.card]}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>Sync Status</Text>

            <View style={styles.statusGrid}>
              <View style={[styles.statusItem, themeStyles.card]}>
                <Text style={[styles.statusValue, themeStyles.text]}>
                  {syncStatus.isOnline ? '🟢' : '🔴'}
                </Text>
                <Text style={[styles.statusLabel, themeStyles.textSecondary]}>
                  {syncStatus.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>

              <View style={[styles.statusItem, themeStyles.card]}>
                <Text style={[styles.statusValue, themeStyles.text]}>
                  {syncStatus.queueLength}
                </Text>
                <Text style={[styles.statusLabel, themeStyles.textSecondary]}>
                  Queue
                </Text>
              </View>

              <View style={[styles.statusItem, themeStyles.card]}>
                <Text style={[styles.statusValue, themeStyles.text]}>
                  {syncStatus.pendingItems}
                </Text>
                <Text style={[styles.statusLabel, themeStyles.textSecondary]}>
                  Pending
                </Text>
              </View>

              <View style={[styles.statusItem, themeStyles.card]}>
                <Text style={[styles.statusValue, themeStyles.text]}>
                  {syncStatus.conflictedItems}
                </Text>
                <Text style={[styles.statusLabel, themeStyles.textSecondary]}>
                  Conflicts
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.syncButton,
                { backgroundColor: isSyncing ? '#6c757d' : '#28a745' },
                (!syncStatus.isOnline || syncStatus.queueLength === 0) && styles.disabledButton
              ]}
              onPress={performSync}
              disabled={isSyncing || !syncStatus.isOnline || syncStatus.queueLength === 0}
            >
              <Text style={styles.syncButtonText}>
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Text>
            </TouchableOpacity>

            {isSyncing && (
              <View style={styles.progressContainer}>
                {Platform.OS === 'android' ? (
                  <ProgressBarAndroid
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={syncProgress}
                    color="#007bff"
                  />
                ) : (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${syncProgress * 100}%` }]} />
                  </View>
                )}
                <Text style={[styles.progressText, themeStyles.textSecondary]}>
                  {Math.round(syncProgress * 100)}% complete
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Sync Configuration */}
        {config && (
          <View style={[styles.section, themeStyles.card]}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>Sync Settings</Text>

            <View style={styles.configGrid}>
              <TouchableOpacity
                style={[styles.configItem, themeStyles.card, config.enabled && styles.configActive]}
                onPress={() => updateSyncConfig({ enabled: !config.enabled })}
              >
                <Text style={[styles.configIcon, themeStyles.text]}>
                  {config.enabled ? '✅' : '❌'}
                </Text>
                <Text style={[styles.configLabel, themeStyles.text]}>
                  Sync Enabled
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.configItem, themeStyles.card, config.autoSync && styles.configActive]}
                onPress={() => updateSyncConfig({ autoSync: !config.autoSync })}
              >
                <Text style={[styles.configIcon, themeStyles.text]}>
                  {config.autoSync ? '🔄' : '⏸️'}
                </Text>
                <Text style={[styles.configLabel, themeStyles.text]}>
                  Auto Sync
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.configItem, themeStyles.card, config.syncOnCellular && styles.configActive]}
                onPress={() => updateSyncConfig({ syncOnCellular: !config.syncOnCellular })}
              >
                <Text style={[styles.configIcon, themeStyles.text]}>
                  {config.syncOnCellular ? '📶' : '🚫'}
                </Text>
                <Text style={[styles.configLabel, themeStyles.text]}>
                  Cellular Sync
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.configItem, themeStyles.card, config.backgroundSync && styles.configActive]}
                onPress={() => updateSyncConfig({ backgroundSync: !config.backgroundSync })}
              >
                <Text style={[styles.configIcon, themeStyles.text]}>
                  {config.backgroundSync ? '🌙' : '☀️'}
                </Text>
                <Text style={[styles.configLabel, themeStyles.text]}>
                  Background Sync
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.configNote, themeStyles.textSecondary]}>
              Sync Interval: {config.syncInterval} minutes
            </Text>
          </View>
        )}

        {/* Sync Queue */}
        {syncQueue.length > 0 && (
          <View style={[styles.section, themeStyles.card]}>
            <View style={styles.queueHeader}>
              <Text style={[styles.sectionTitle, themeStyles.text]}>Sync Queue</Text>
              <TouchableOpacity
                style={[styles.clearQueueButton, { backgroundColor: '#dc3545' }]}
                onPress={clearSyncQueue}
              >
                <Text style={styles.clearQueueButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            {syncQueue.slice(0, 10).map((item) => (
              <View key={item.id} style={[styles.queueItem, themeStyles.card]}>
                <View style={styles.queueItemHeader}>
                  <Text style={[styles.queueItemType, themeStyles.text]}>
                    {item.type.toUpperCase()}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.syncStatus) }]}>
                    <Text style={styles.statusBadgeText}>
                      {getStatusText(item.syncStatus)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.queueItemId, themeStyles.textSecondary]}>
                  {item.localId}
                </Text>
                {item.errorMessage && (
                  <Text style={[styles.queueItemError, { color: '#ef4444' }]}>
                    {item.errorMessage}
                  </Text>
                )}
              </View>
            ))}

            {syncQueue.length > 10 && (
              <Text style={[styles.moreItemsText, themeStyles.textSecondary]}>
                ... and {syncQueue.length - 10} more items
              </Text>
            )}
          </View>
        )}

        {/* Backup & Restore */}
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>Backup & Restore</Text>

          <TouchableOpacity
            style={[styles.backupButton, { backgroundColor: '#007bff' }]}
            onPress={createBackup}
          >
            <Text style={styles.backupButtonText}>Create Backup</Text>
          </TouchableOpacity>

          <Text style={[styles.backupNote, themeStyles.textSecondary]}>
            Backups are stored in the cloud and can be used to restore your data on other devices.
          </Text>
        </View>

        {/* Active Session */}
        {activeSession && (
          <View style={[styles.section, themeStyles.card]}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>Active Sync Session</Text>

            <View style={styles.sessionInfo}>
              <Text style={[styles.sessionDetail, themeStyles.text]}>
                Started: {activeSession.startTime.toLocaleString()}
              </Text>
              <Text style={[styles.sessionDetail, themeStyles.text]}>
                Processed: {activeSession.itemsProcessed} items
              </Text>
              <Text style={[styles.sessionDetail, themeStyles.text]}>
                Synced: {activeSession.itemsSynced} items
              </Text>
              {activeSession.itemsFailed > 0 && (
                <Text style={[styles.sessionDetail, { color: '#ef4444' }]}>
                  Failed: {activeSession.itemsFailed} items
                </Text>
              )}
            </View>

            {activeSession.errors.length > 0 && (
              <View style={styles.sessionErrors}>
                <Text style={[styles.errorsTitle, themeStyles.text]}>Errors:</Text>
                {activeSession.errors.map((error, index) => (
                  <Text key={index} style={[styles.errorText, { color: '#ef4444' }]}>
                    • {error}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statusItem: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 24,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  syncButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  configGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  configItem: {
    width: '48%',
    margin: '1%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  configActive: {
    borderColor: '#007bff',
  },
  configIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  configLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  configNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearQueueButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearQueueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  queueItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  queueItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  queueItemType: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  queueItemId: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  queueItemError: {
    fontSize: 12,
    marginTop: 4,
  },
  moreItemsText: {
    textAlign: 'center',
    fontSize: 14,
    padding: 8,
  },
  backupButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  backupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backupNote: {
    fontSize: 12,
    lineHeight: 18,
  },
  sessionInfo: {
    marginBottom: 16,
  },
  sessionDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  sessionErrors: {
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },
  errorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 4,
    color: '#ef4444',
  },
});

export default CloudSyncDashboard;