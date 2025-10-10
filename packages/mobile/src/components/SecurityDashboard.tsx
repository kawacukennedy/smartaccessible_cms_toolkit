import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import {
  mobileSecurity,
  SecurityConfig,
  SecurityEvent,
  SecurityEventType
} from '../lib/mobileSecurity';

interface SecurityDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ isVisible, onClose }) => {
  const { themeStyles } = useTheme();
  const [config, setConfig] = useState<SecurityConfig | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [healthCheck, setHealthCheck] = useState<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadSecurityData();
    }
  }, [isVisible]);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      const [configData, eventsData, healthData] = await Promise.all([
        Promise.resolve(mobileSecurity.getSecurityConfig()),
        Promise.resolve(mobileSecurity.getSecurityEvents(50)),
        mobileSecurity.performSecurityHealthCheck()
      ]);

      setConfig(configData);
      setSecurityEvents(eventsData);
      setHealthCheck(healthData);
    } catch (error) {
      console.error('Error loading security data:', error);
      Alert.alert('Error', 'Failed to load security data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSecurityConfig = async (updates: Partial<SecurityConfig>) => {
    if (!config) return;

    try {
      await mobileSecurity.updateSecurityConfig(updates);
      setConfig({ ...config, ...updates });
      Alert.alert('Success', 'Security settings updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update security settings');
    }
  };

  const performBiometricTest = async () => {
    try {
      const success = await mobileSecurity.authenticateWithBiometrics('test_user');
      Alert.alert(
        success ? 'Success' : 'Failed',
        success ? 'Biometric authentication successful' : 'Biometric authentication failed'
      );
    } catch (error) {
      Alert.alert('Error', 'Biometric test failed');
    }
  };

  const clearSecurityEvents = async () => {
    Alert.alert(
      'Clear Events',
      'Are you sure you want to clear all security events?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await mobileSecurity.clearSecurityEvents();
              setSecurityEvents([]);
              Alert.alert('Success', 'Security events cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear security events');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEventTypeColor = (type: SecurityEventType) => {
    switch (type) {
      case 'login': return '#10b981';
      case 'logout': return '#6b7280';
      case 'failed_login': return '#f59e0b';
      case 'suspicious_activity': return '#f59e0b';
      case 'data_access': return '#3b82f6';
      case 'security_breach': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderSecurityEvent = ({ item }: { item: SecurityEvent }) => (
    <View style={[styles.eventItem, themeStyles.card]}>
      <View style={[styles.eventIndicator, { backgroundColor: getEventTypeColor(item.type) }]} />
      <View style={styles.eventContent}>
        <Text style={[styles.eventType, themeStyles.text]}>
          {item.type.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={[styles.eventDetails, themeStyles.textSecondary]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        {item.details && (
          <Text style={[styles.eventMessage, themeStyles.textSecondary]}>
            {JSON.stringify(item.details)}
          </Text>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, styles.centered, themeStyles.background]}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={[styles.loadingText, themeStyles.text]}>Loading security data...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, themeStyles.background]}>
        <View style={[styles.header, themeStyles.card]}>
          <Text style={[styles.title, themeStyles.text]}>Security Dashboard</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, themeStyles.text]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Security Health */}
          {healthCheck && (
            <View style={[styles.section, themeStyles.card]}>
              <View style={styles.healthHeader}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Security Health</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(healthCheck.status) }]}>
                  <Text style={styles.statusText}>
                    {healthCheck.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {healthCheck.issues.length > 0 && (
                <View style={styles.issuesList}>
                  <Text style={[styles.issuesTitle, themeStyles.text]}>Issues:</Text>
                  {healthCheck.issues.map((issue, index) => (
                    <Text key={index} style={[styles.issueText, themeStyles.textSecondary]}>
                      • {issue}
                    </Text>
                  ))}
                </View>
              )}

              {healthCheck.recommendations.length > 0 && (
                <View style={styles.recommendationsList}>
                  <Text style={[styles.recommendationsTitle, themeStyles.text]}>Recommendations:</Text>
                  {healthCheck.recommendations.map((rec, index) => (
                    <Text key={index} style={[styles.recommendationText, themeStyles.textSecondary]}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Security Settings */}
          {config && (
            <View style={[styles.section, themeStyles.card]}>
              <Text style={[styles.sectionTitle, themeStyles.text]}>Security Settings</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, themeStyles.text]}>Biometric Authentication</Text>
                  <Text style={[styles.settingDescription, themeStyles.textSecondary]}>
                    Use fingerprint or face recognition for login
                  </Text>
                </View>
                <Switch
                  value={config.biometricEnabled}
                  onValueChange={(value) => updateSecurityConfig({ biometricEnabled: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, themeStyles.text]}>Data Encryption</Text>
                  <Text style={[styles.settingDescription, themeStyles.textSecondary]}>
                    Encrypt sensitive data at rest
                  </Text>
                </View>
                <Switch
                  value={config.encryptionEnabled}
                  onValueChange={(value) => updateSecurityConfig({ encryptionEnabled: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, themeStyles.text]}>Audit Logging</Text>
                  <Text style={[styles.settingDescription, themeStyles.textSecondary]}>
                    Log security events for monitoring
                  </Text>
                </View>
                <Switch
                  value={config.auditLoggingEnabled}
                  onValueChange={(value) => updateSecurityConfig({ auditLoggingEnabled: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, themeStyles.text]}>Remote Wipe</Text>
                  <Text style={[styles.settingDescription, themeStyles.textSecondary]}>
                    Allow remote data wipe on security breach
                  </Text>
                </View>
                <Switch
                  value={config.remoteWipeEnabled}
                  onValueChange={(value) => updateSecurityConfig({ remoteWipeEnabled: value })}
                />
              </View>

              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: '#28a745' }]}
                onPress={performBiometricTest}
              >
                <Text style={styles.testButtonText}>Test Biometric Auth</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Security Events */}
          <View style={[styles.section, themeStyles.card]}>
            <View style={styles.eventsHeader}>
              <Text style={[styles.sectionTitle, themeStyles.text]}>Recent Security Events</Text>
              <TouchableOpacity
                style={[styles.viewAllButton, { backgroundColor: '#007bff' }]}
                onPress={() => setShowEventsModal(true)}
              >
                <Text style={styles.viewAllButtonText}>View All</Text>
              </TouchableOpacity>
            </View>

            {securityEvents.length === 0 ? (
              <Text style={[styles.noEventsText, themeStyles.textSecondary]}>
                No security events recorded
              </Text>
            ) : (
              <FlatList
                data={securityEvents.slice(0, 5)}
                renderItem={renderSecurityEvent}
                keyExtractor={(item) => item.id}
                style={styles.eventsList}
                showsVerticalScrollIndicator={false}
              />
            )}

            {securityEvents.length > 0 && (
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: '#dc3545' }]}
                onPress={clearSecurityEvents}
              >
                <Text style={styles.clearButtonText}>Clear Events</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Events Modal */}
        <Modal visible={showEventsModal} animationType="slide" onRequestClose={() => setShowEventsModal(false)}>
          <View style={[styles.modalContainer, themeStyles.background]}>
            <View style={[styles.modalHeader, themeStyles.card]}>
              <Text style={[styles.modalTitle, themeStyles.text]}>Security Events</Text>
              <TouchableOpacity onPress={() => setShowEventsModal(false)} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, themeStyles.text]}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={securityEvents}
              renderItem={renderSecurityEvent}
              keyExtractor={(item) => item.id}
              style={styles.fullEventsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={[styles.noEventsText, themeStyles.textSecondary]}>
                  No security events recorded
                </Text>
              }
            />
          </View>
        </Modal>
      </View>
    </Modal>
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
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  issuesList: {
    marginBottom: 16,
  },
  issuesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ef4444',
  },
  issueText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  recommendationsList: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#10b981',
  },
  recommendationText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  testButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsList: {
    maxHeight: 300,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  eventIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  eventContent: {
    flex: 1,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 12,
    marginBottom: 4,
  },
  eventMessage: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
  clearButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    borderBottomColor: '#dee2e6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fullEventsList: {
    flex: 1,
    padding: 16,
  },
});

export default SecurityDashboard;