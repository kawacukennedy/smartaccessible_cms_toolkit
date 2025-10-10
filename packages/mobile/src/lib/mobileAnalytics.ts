// Mobile Analytics Tracker - Adapted for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, Platform } from 'react-native';

interface MobileAnalyticsEvent {
  type: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
  deviceInfo: {
    platform: string;
    version: string;
    screenSize: string;
    orientation: 'portrait' | 'landscape';
  };
}

interface SessionInfo {
  id: string;
  startTime: number;
  endTime?: number;
  events: MobileAnalyticsEvent[];
  metadata: Record<string, any>;
}

class MobileAnalyticsTracker {
  private static instance: MobileAnalyticsTracker;
  private sessionId: string;
  private sessionStartTime: number;
  private events: MobileAnalyticsEvent[] = [];
  private isOnline: boolean = true;
  private deviceInfo: MobileAnalyticsEvent['deviceInfo'];

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.deviceInfo = this.getDeviceInfo();
    this.initializeTracker();
  }

  static getInstance(): MobileAnalyticsTracker {
    if (!MobileAnalyticsTracker.instance) {
      MobileAnalyticsTracker.instance = new MobileAnalyticsTracker();
    }
    return MobileAnalyticsTracker.instance;
  }

  private async initializeTracker(): Promise<void> {
    try {
      // Load any pending events from storage
      await this.loadPendingEvents();

      // Set up network status monitoring
      this.monitorNetworkStatus();

      // Track app launch
      await this.trackEvent('app_launch', {
        coldStart: true,
        previousVersion: await this.getPreviousVersion(),
      });

    } catch (error) {
      console.error('Failed to initialize mobile analytics:', error);
    }
  }

  private generateSessionId(): string {
    return `mobile-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): MobileAnalyticsEvent['deviceInfo'] {
    const { width, height } = Dimensions.get('window');
    const isPortrait = height > width;

    return {
      platform: Platform.OS,
      version: Platform.Version.toString(),
      screenSize: `${Math.round(width)}x${Math.round(height)}`,
      orientation: isPortrait ? 'portrait' : 'landscape',
    };
  }

  private monitorNetworkStatus(): void {
    // In a real implementation, you'd use NetInfo from @react-native-community/netinfo
    // For now, we'll assume online status
    this.isOnline = true;
  }

  private async loadPendingEvents(): Promise<void> {
    try {
      const pendingEvents = await AsyncStorage.getItem('pendingAnalyticsEvents');
      if (pendingEvents) {
        const events: MobileAnalyticsEvent[] = JSON.parse(pendingEvents);
        this.events.push(...events);
        await AsyncStorage.removeItem('pendingAnalyticsEvents');
      }
    } catch (error) {
      console.error('Failed to load pending events:', error);
    }
  }

  private async savePendingEvents(): Promise<void> {
    try {
      await AsyncStorage.setItem('pendingAnalyticsEvents', JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to save pending events:', error);
    }
  }

  private async getPreviousVersion(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('appVersion');
    } catch {
      return null;
    }
  }

  // Core tracking methods
  async trackEvent(type: string, data: Record<string, any> = {}): Promise<void> {
    const event: MobileAnalyticsEvent = {
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      deviceInfo: this.deviceInfo,
    };

    this.events.push(event);

    try {
      if (this.isOnline) {
        await this.sendEventToServer(event);
      } else {
        await this.savePendingEvents();
      }
    } catch (error) {
      console.error('Failed to track event:', error);
      await this.savePendingEvents();
    }
  }

  private async sendEventToServer(event: MobileAnalyticsEvent): Promise<void> {
    // In a real implementation, this would send to your analytics endpoint
    // For now, we'll just log it
    console.log('Analytics Event:', event);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));

    // Remove from events array after successful send
    this.events = this.events.filter(e => e !== event);
  }

  // Specific tracking methods
  async trackScreenView(screenName: string, metadata: Record<string, any> = {}): Promise<void> {
    await this.trackEvent('screen_view', {
      screenName,
      ...metadata,
    });
  }

  async trackUserInteraction(
    elementType: string,
    elementId: string,
    action: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.trackEvent('user_interaction', {
      elementType,
      elementId,
      action,
      ...metadata,
    });
  }

  async trackContentInteraction(
    contentId: string,
    contentType: string,
    action: 'view' | 'edit' | 'create' | 'delete',
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.trackEvent('content_interaction', {
      contentId,
      contentType,
      action,
      ...metadata,
    });
  }

  async trackAISuggestion(
    action: 'accepted' | 'rejected' | 'modified',
    suggestionData: {
      suggestionId: string;
      type: string;
      confidence: number;
      originalContent?: string;
      modifiedContent?: string;
    }
  ): Promise<void> {
    await this.trackEvent('ai_suggestion', {
      action,
      ...suggestionData,
    });
  }

  async trackPerformanceMetrics(metrics: {
    appStartTime?: number;
    jsBundleLoadTime?: number;
    timeToInteractive?: number;
    memoryUsage?: number;
    fps?: number;
  }): Promise<void> {
    await this.trackEvent('performance_metrics', metrics);
  }

  async trackError(
    error: Error,
    context: Record<string, any> = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    await this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      severity,
      ...context,
    });
  }

  // Session management
  async startContentEditingSession(
    contentId: string,
    metadata: Record<string, any> = {}
  ): Promise<string> {
    const sessionId = `editing-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await this.trackEvent('content_editing_start', {
      contentId,
      sessionId,
      ...metadata,
    });

    return sessionId;
  }

  async endContentEditingSession(
    sessionId: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.trackEvent('content_editing_end', {
      sessionId,
      ...metadata,
    });
  }

  // Analytics data retrieval
  async getAnalyticsData(
    timeRange: { start: Date; end: Date },
    filters: Record<string, any> = {}
  ): Promise<{
    events: MobileAnalyticsEvent[];
    summary: {
      totalEvents: number;
      uniqueScreens: number;
      avgSessionDuration: number;
      topEvents: Array<{ type: string; count: number }>;
    };
  }> {
    // In a real implementation, this would query your analytics database
    // For now, return mock data
    const mockEvents = this.events.filter(event =>
      event.timestamp >= timeRange.start.getTime() &&
      event.timestamp <= timeRange.end.getTime()
    );

    const eventTypes = mockEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(eventTypes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));

    const uniqueScreens = new Set(
      mockEvents
        .filter(e => e.type === 'screen_view')
        .map(e => e.data.screenName)
    ).size;

    return {
      events: mockEvents,
      summary: {
        totalEvents: mockEvents.length,
        uniqueScreens,
        avgSessionDuration: 0, // Would calculate from session data
        topEvents,
      },
    };
  }

  // Sync offline events
  async syncOfflineEvents(): Promise<void> {
    if (!this.isOnline) return;

    try {
      const pendingEvents = await AsyncStorage.getItem('pendingAnalyticsEvents');
      if (pendingEvents) {
        const events: MobileAnalyticsEvent[] = JSON.parse(pendingEvents);

        for (const event of events) {
          await this.sendEventToServer(event);
        }

        await AsyncStorage.removeItem('pendingAnalyticsEvents');
        console.log(`Synced ${events.length} offline events`);
      }
    } catch (error) {
      console.error('Failed to sync offline events:', error);
    }
  }

  // Cleanup
  async destroy(): Promise<void> {
    await this.savePendingEvents();
    MobileAnalyticsTracker.instance = null as any;
  }
}

export default MobileAnalyticsTracker;
export { MobileAnalyticsEvent, SessionInfo };