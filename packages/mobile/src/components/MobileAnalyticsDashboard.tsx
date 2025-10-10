import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import MobileAnalyticsTracker, { MobileAnalyticsEvent } from '../lib/mobileAnalytics';

const { width } = Dimensions.get('window');

interface AnalyticsSummary {
  totalEvents: number;
  uniqueScreens: number;
  avgSessionDuration: number;
  topEvents: Array<{ type: string; count: number }>;
}

const MobileAnalyticsDashboard: React.FC = () => {
  const { themeStyles } = useTheme();
  const [analyticsData, setAnalyticsData] = useState<{
    events: MobileAnalyticsEvent[];
    summary: AnalyticsSummary;
  } | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState(false);
  const [tracker] = useState(() => MobileAnalyticsTracker.getInstance());

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case '1h':
          startDate.setHours(endDate.getHours() - 1);
          break;
        case '24h':
          startDate.setHours(endDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
      }

      const data = await tracker.getAnalyticsData({ start: startDate, end: endDate });
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatEventType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'screen_view':
        return '📱';
      case 'user_interaction':
        return '👆';
      case 'content_interaction':
        return '📝';
      case 'ai_suggestion':
        return '🤖';
      case 'app_launch':
        return '🚀';
      case 'error':
        return '❌';
      default:
        return '📊';
    }
  };

  const renderSummaryCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.summaryCard, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={[styles.cardValue, themeStyles.text]}>{value}</Text>
      </View>
      <Text style={[styles.cardTitle, themeStyles.textSecondary]}>{title}</Text>
    </View>
  );

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {(['1h', '24h', '7d', '30d'] as const).map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range && styles.timeRangeButtonActive,
            themeStyles.button
          ]}
          onPress={() => setTimeRange(range)}
        >
          <Text
            style={[
              styles.timeRangeText,
              timeRange === range ? themeStyles.buttonText : themeStyles.text
            ]}
          >
            {range}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, themeStyles.background]}>
        <Text style={[styles.loadingText, themeStyles.text]}>Loading analytics...</Text>
      </View>
    );
  }

  if (!analyticsData) {
    return (
      <View style={[styles.container, styles.centered, themeStyles.background]}>
        <Text style={[styles.errorText, themeStyles.text]}>Failed to load analytics data</Text>
        <TouchableOpacity
          style={[styles.retryButton, themeStyles.button]}
          onPress={loadAnalyticsData}
        >
          <Text style={themeStyles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, themeStyles.background]}>
      <Text style={[styles.title, themeStyles.text]}>Analytics Dashboard</Text>

      {/* Time Range Selector */}
      {renderTimeRangeSelector()}

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        {renderSummaryCard(
          'Total Events',
          analyticsData.summary.totalEvents,
          '📊',
          '#3b82f6'
        )}
        {renderSummaryCard(
          'Screens Viewed',
          analyticsData.summary.uniqueScreens,
          '📱',
          '#10b981'
        )}
        {renderSummaryCard(
          'Top Event Type',
          analyticsData.summary.topEvents[0]?.type || 'None',
          '🏆',
          '#f59e0b'
        )}
        {renderSummaryCard(
          'Avg Session',
          `${Math.round(analyticsData.summary.avgSessionDuration / 1000 / 60)}m`,
          '⏱️',
          '#8b5cf6'
        )}
      </View>

      {/* Top Events Chart */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Top Events</Text>
        {analyticsData.summary.topEvents.slice(0, 5).map((event, index) => (
          <View key={event.type} style={styles.eventItem}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
              <Text style={[styles.eventType, themeStyles.text]}>
                {formatEventType(event.type)}
              </Text>
            </View>
            <View style={styles.eventCount}>
              <Text style={[styles.eventCountText, themeStyles.text]}>{event.count}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Events */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Recent Events</Text>
        {analyticsData.events.slice(0, 10).map((event, index) => (
          <View key={`${event.timestamp}-${index}`} style={styles.recentEventItem}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
              <Text style={[styles.eventType, themeStyles.text]}>
                {formatEventType(event.type)}
              </Text>
              <Text style={[styles.eventTime, themeStyles.textSecondary]}>
                {formatTimestamp(event.timestamp)}
              </Text>
            </View>
            {Object.keys(event.data).length > 0 && (
              <View style={styles.eventData}>
                <Text style={[styles.eventDataText, themeStyles.textSecondary]}>
                  {Object.entries(event.data)
                    .slice(0, 2)
                    .map(([key, value]) => `${key}: ${String(value)}`)
                    .join(', ')}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Device Info */}
      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Device Information</Text>
        {analyticsData.events.length > 0 && (
          <View style={styles.deviceInfo}>
            <Text style={[styles.deviceInfoText, themeStyles.text]}>
              Platform: {analyticsData.events[0].deviceInfo.platform}
            </Text>
            <Text style={[styles.deviceInfoText, themeStyles.text]}>
              Screen: {analyticsData.events[0].deviceInfo.screenSize}
            </Text>
            <Text style={[styles.deviceInfoText, themeStyles.text]}>
              Orientation: {analyticsData.events[0].deviceInfo.orientation}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, themeStyles.button]}
          onPress={loadAnalyticsData}
        >
          <Text style={themeStyles.buttonText}>🔄 Refresh Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#10b981' }]}
          onPress={() => tracker.syncOfflineEvents()}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            📤 Sync Offline Data
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
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    opacity: 1,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 14,
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
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  eventType: {
    fontSize: 14,
    flex: 1,
  },
  eventCount: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recentEventItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  eventData: {
    marginLeft: 28,
  },
  eventDataText: {
    fontSize: 12,
  },
  deviceInfo: {
    gap: 4,
  },
  deviceInfoText: {
    fontSize: 14,
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

export default MobileAnalyticsDashboard;