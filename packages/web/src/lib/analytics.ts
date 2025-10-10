// Advanced Analytics System
interface UserSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: PageView[];
  events: UserEvent[];
  deviceInfo: DeviceInfo;
  location?: GeolocationCoordinates;
}

interface PageView {
  url: string;
  timestamp: number;
  timeSpent: number;
  referrer?: string;
  scrollDepth: number;
}

interface UserEvent {
  type: 'click' | 'scroll' | 'form_interaction' | 'content_edit' | 'ai_suggestion' | 'publish' | 'save';
  element?: string;
  timestamp: number;
  metadata?: Record<string, any>;
  value?: string | number;
}

interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  viewportSize: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  os: string;
  touchEnabled: boolean;
}

interface ContentAnalytics {
  contentId: string;
  views: number;
  uniqueViews: number;
  avgTimeSpent: number;
  bounceRate: number;
  conversionRate?: number;
  aiSuggestionsUsed: number;
  editsCount: number;
  publishCount: number;
  lastModified: number;
  authorId: string;
}

interface AIAnalytics {
  totalSuggestions: number;
  acceptedSuggestions: number;
  rejectedSuggestions: number;
  autoAppliedSuggestions: number;
  suggestionTypes: Record<string, number>;
  avgResponseTime: number;
  errorRate: number;
  userSatisfaction?: number;
}

class AnalyticsTracker {
  private currentSession: UserSession | null = null;
  private contentAnalytics: Map<string, ContentAnalytics> = new Map();
  private aiAnalytics: AIAnalytics = {
    totalSuggestions: 0,
    acceptedSuggestions: 0,
    rejectedSuggestions: 0,
    autoAppliedSuggestions: 0,
    suggestionTypes: {},
    avgResponseTime: 0,
    errorRate: 0
  };
  private sessionStartTime: number = 0;
  private lastPageView: PageView | null = null;

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    // Start new session
    this.startSession();

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseSession();
      } else {
        this.resumeSession();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);

      if (this.lastPageView) {
        this.lastPageView.scrollDepth = maxScrollDepth;
      }
    });

    // Track user interactions
    this.trackUserInteractions();
  }

  private startSession() {
    this.sessionStartTime = Date.now();
    this.currentSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: this.sessionStartTime,
      pageViews: [],
      events: [],
      deviceInfo: this.getDeviceInfo()
    };

    // Get user location (with permission)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (this.currentSession) {
            this.currentSession.location = position.coords;
          }
        },
        null,
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }

    this.trackPageView();
  }

  private pauseSession() {
    // Session continues but marked as inactive
    this.trackEvent('session_pause', {});
  }

  private resumeSession() {
    this.trackEvent('session_resume', {});
  }

  private endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;

      // Send session data to analytics service
      this.sendAnalyticsData('session', this.currentSession);
    }
  }

  private trackPageView() {
    const pageView: PageView = {
      url: window.location.href,
      timestamp: Date.now(),
      timeSpent: 0,
      referrer: document.referrer,
      scrollDepth: 0
    };

    if (this.lastPageView) {
      this.lastPageView.timeSpent = pageView.timestamp - this.lastPageView.timestamp;
    }

    this.lastPageView = pageView;

    if (this.currentSession) {
      this.currentSession.pageViews.push(pageView);
    }

    this.trackEvent('page_view', {
      url: pageView.url,
      referrer: pageView.referrer
    });
  }

  private trackUserInteractions() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const elementInfo = this.getElementInfo(target);

      this.trackEvent('click', {
        element: elementInfo.selector,
        text: elementInfo.text,
        elementType: target.tagName.toLowerCase(),
        x: event.clientX,
        y: event.clientY
      });
    });

    // Track form interactions
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.trackEvent('form_focus', {
          element: this.getElementInfo(target).selector,
          fieldType: target.tagName.toLowerCase(),
          fieldName: target.getAttribute('name') || target.getAttribute('id')
        });
      }
    });

    // Track content editing
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLElement;
      if (target.isContentEditable || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        this.trackEvent('content_edit', {
          element: this.getElementInfo(target).selector,
          contentLength: target.textContent?.length || (target as HTMLInputElement).value?.length || 0
        });
      }
    });
  }

  private getElementInfo(element: HTMLElement): { selector: string; text: string } {
    const getSelector = (el: HTMLElement): string => {
      if (el.id) return `#${el.id}`;
      if (el.className) return `${el.tagName.toLowerCase()}.${el.className.split(' ').join('.')}`;
      if (el.getAttribute('data-testid')) return `[data-testid="${el.getAttribute('data-testid')}"]`;

      let selector = el.tagName.toLowerCase();
      if (el.parentElement) {
        const siblings = Array.from(el.parentElement.children);
        const index = siblings.indexOf(el);
        if (siblings.length > 1) {
          selector += `:nth-child(${index + 1})`;
        }
      }
      return selector;
    };

    return {
      selector: getSelector(element),
      text: element.textContent?.substring(0, 100) || ''
    };
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
      userAgent: ua,
      screenResolution: `${screenWidth}x${screenHeight}`,
      viewportSize: `${viewportWidth}x${viewportHeight}`,
      deviceType: viewportWidth < 768 ? 'mobile' : viewportWidth < 1024 ? 'tablet' : 'desktop',
      browser: this.getBrowserName(ua),
      os: this.getOSName(ua),
      touchEnabled: 'ontouchstart' in window
    };
  }

  private getBrowserName(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOSName(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  // Public API methods
  trackEvent(type: UserEvent['type'], metadata: Record<string, any> = {}, value?: string | number) {
    const event: UserEvent = {
      type,
      timestamp: Date.now(),
      metadata,
      value
    };

    if (this.currentSession) {
      this.currentSession.events.push(event);
    }

    // Send real-time event data
    this.sendAnalyticsData('event', event);
  }

  trackContentInteraction(contentId: string, action: 'view' | 'edit' | 'publish' | 'save', metadata?: Record<string, any>) {
    let analytics = this.contentAnalytics.get(contentId);
    if (!analytics) {
      analytics = {
        contentId,
        views: 0,
        uniqueViews: 0,
        avgTimeSpent: 0,
        bounceRate: 0,
        aiSuggestionsUsed: 0,
        editsCount: 0,
        publishCount: 0,
        lastModified: Date.now(),
        authorId: metadata?.authorId || 'unknown'
      };
      this.contentAnalytics.set(contentId, analytics);
    }

    switch (action) {
      case 'view':
        analytics.views++;
        break;
      case 'edit':
        analytics.editsCount++;
        analytics.lastModified = Date.now();
        break;
      case 'publish':
        analytics.publishCount++;
        analytics.lastModified = Date.now();
        break;
    }

    this.trackEvent('content_interaction', {
      contentId,
      action,
      ...metadata
    });
  }

  trackAISuggestion(suggestionType: string, accepted: boolean, autoApplied: boolean = false, responseTime?: number) {
    this.aiAnalytics.totalSuggestions++;

    if (accepted) {
      this.aiAnalytics.acceptedSuggestions++;
    } else {
      this.aiAnalytics.rejectedSuggestions++;
    }

    if (autoApplied) {
      this.aiAnalytics.autoAppliedSuggestions++;
    }

    this.aiAnalytics.suggestionTypes[suggestionType] = (this.aiAnalytics.suggestionTypes[suggestionType] || 0) + 1;

    if (responseTime) {
      // Update rolling average
      const totalResponseTime = this.aiAnalytics.avgResponseTime * (this.aiAnalytics.totalSuggestions - 1);
      this.aiAnalytics.avgResponseTime = (totalResponseTime + responseTime) / this.aiAnalytics.totalSuggestions;
    }

    this.trackEvent('ai_suggestion', {
      type: suggestionType,
      accepted,
      autoApplied,
      responseTime
    });
  }

  trackAIError(error: string) {
    this.aiAnalytics.errorRate = (this.aiAnalytics.errorRate * this.aiAnalytics.totalSuggestions + 1) / (this.aiAnalytics.totalSuggestions + 1);

    this.trackEvent('ai_error', { error });
  }

  // Analytics data retrieval
  getSessionData(): UserSession | null {
    return this.currentSession;
  }

  getContentAnalytics(contentId?: string): ContentAnalytics[] {
    if (contentId) {
      const analytics = this.contentAnalytics.get(contentId);
      return analytics ? [analytics] : [];
    }
    return Array.from(this.contentAnalytics.values());
  }

  getAIAnalytics(): AIAnalytics {
    return { ...this.aiAnalytics };
  }

  getUserJourney(): PageView[] {
    return this.currentSession?.pageViews || [];
  }

  getUserEvents(timeRange?: { start: number; end: number }): UserEvent[] {
    let events = this.currentSession?.events || [];

    if (timeRange) {
      events = events.filter(event =>
        event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
      );
    }

    return events;
  }

  // Export analytics data
  exportAnalyticsData(): {
    session: UserSession | null;
    contentAnalytics: ContentAnalytics[];
    aiAnalytics: AIAnalytics;
  } {
    return {
      session: this.currentSession,
      contentAnalytics: Array.from(this.contentAnalytics.values()),
      aiAnalytics: this.aiAnalytics
    };
  }

  private sendAnalyticsData(type: string, data: any) {
    // In a real application, this would send data to your analytics service
    // For now, we'll store in localStorage for demonstration
    try {
      const existingData = JSON.parse(localStorage.getItem('analytics_data') || '[]');
      existingData.push({
        type,
        timestamp: Date.now(),
        data
      });

      // Keep only last 1000 events
      if (existingData.length > 1000) {
        existingData.splice(0, existingData.length - 1000);
      }

      localStorage.setItem('analytics_data', JSON.stringify(existingData));
    } catch (e) {
      console.warn('Failed to store analytics data:', e);
    }

    // Send to external analytics service (placeholder)
    console.log(`Analytics: ${type}`, data);
  }
}

// Create singleton instance
export const analyticsTracker = new AnalyticsTracker();

// Convenience functions
export const trackContentView = (contentId: string, metadata?: Record<string, any>) => {
  analyticsTracker.trackContentInteraction(contentId, 'view', metadata);
};

export const trackContentEdit = (contentId: string, metadata?: Record<string, any>) => {
  analyticsTracker.trackContentInteraction(contentId, 'edit', metadata);
};

export const trackContentPublish = (contentId: string, metadata?: Record<string, any>) => {
  analyticsTracker.trackContentInteraction(contentId, 'publish', metadata);
};

export const trackAISuggestionUsage = (type: string, accepted: boolean, autoApplied: boolean = false, responseTime?: number) => {
  analyticsTracker.trackAISuggestion(type, accepted, autoApplied, responseTime);
};

export const trackUserAction = (action: string, metadata?: Record<string, any>) => {
  analyticsTracker.trackEvent('custom_action' as any, metadata, action);
};