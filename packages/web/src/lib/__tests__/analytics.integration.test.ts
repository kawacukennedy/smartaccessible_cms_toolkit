import { AnalyticsTracker } from '../analytics';

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Analytics Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
  });

  describe('AnalyticsTracker', () => {
    it('should initialize analytics tracker', () => {
      const tracker = new AnalyticsTracker();
      expect(tracker).toBeInstanceOf(AnalyticsTracker);
    });

    it('should track page views', async () => {
      const tracker = new AnalyticsTracker();
      await tracker.trackPageView('/dashboard', { userId: '123' });

      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/page-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: '/dashboard',
          timestamp: expect.any(Number),
          sessionId: expect.any(String),
          userId: '123',
        }),
      });
    });

    it('should track user interactions', async () => {
      const tracker = new AnalyticsTracker();
      await tracker.trackInteraction('button_click', {
        buttonId: 'save-btn',
        page: '/editor',
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'button_click',
          data: { buttonId: 'save-btn', page: '/editor' },
          timestamp: expect.any(Number),
          sessionId: expect.any(String),
        }),
      });
    });

    it('should track AI suggestions usage', async () => {
      const tracker = new AnalyticsTracker();
      await tracker.trackAISuggestion('accepted', {
        suggestionId: 'sug-123',
        type: 'accessibility',
        confidence: 0.85,
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/ai-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accepted',
          suggestionId: 'sug-123',
          type: 'accessibility',
          confidence: 0.85,
          timestamp: expect.any(Number),
          sessionId: expect.any(String),
        }),
      });
    });

    it('should track content editing sessions', async () => {
      const tracker = new AnalyticsTracker();
      const sessionId = await tracker.startContentEditingSession('block-123', {
        contentType: 'text',
        initialLength: 100,
      });

      expect(sessionId).toBeDefined();
      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: 'block-123',
          sessionType: 'content_editing',
          metadata: { contentType: 'text', initialLength: 100 },
          timestamp: expect.any(Number),
        }),
      });

      // End session
      await tracker.endContentEditingSession(sessionId, {
        finalLength: 150,
        changesCount: 5,
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/session/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          metadata: { finalLength: 150, changesCount: 5 },
          timestamp: expect.any(Number),
        }),
      });
    });

    it('should track user journey', async () => {
      const tracker = new AnalyticsTracker();

      await tracker.trackJourneyStep('onboarding_start', { step: 1 });
      await tracker.trackJourneyStep('onboarding_complete', { step: 5 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const tracker = new AnalyticsTracker();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(tracker.trackPageView('/test')).resolves.not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Analytics tracking failed:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should batch events when offline', async () => {
      // Mock navigator.onLine
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

      const tracker = new AnalyticsTracker();
      await tracker.trackPageView('/offline-page');

      // Should store in localStorage instead of sending immediately
      expect(window.localStorage.setItem).toHaveBeenCalled();

      // Restore online status
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    });

    it('should sync offline events when back online', async () => {
      const tracker = new AnalyticsTracker();

      // Mock offline events in storage
      const offlineEvents = [
        {
          endpoint: '/api/analytics/page-view',
          data: { page: '/offline-page', timestamp: Date.now() },
        },
      ];
      window.localStorage.getItem.mockReturnValue(JSON.stringify(offlineEvents));

      await tracker.syncOfflineEvents();

      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/page-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      });
    });

    it('should respect privacy settings', async () => {
      const tracker = new AnalyticsTracker({ enableTracking: false });
      await tracker.trackPageView('/private-page');

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should generate performance metrics', async () => {
      const tracker = new AnalyticsTracker();

      // Mock performance API
      const mockPerformance = {
        getEntriesByType: jest.fn(() => [
          {
            name: 'page-load',
            duration: 1500,
            startTime: 0,
          },
        ]),
      };
      Object.defineProperty(window, 'performance', { value: mockPerformance });

      await tracker.trackPerformanceMetrics();

      expect(mockFetch).toHaveBeenCalledWith('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('page-load'),
      });
    });
  });
});