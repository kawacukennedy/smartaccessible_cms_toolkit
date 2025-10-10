let telemetryEnabled: boolean | null = null;
let performanceObserver: PerformanceObserver | null = null;

interface PerformanceBudget {
  metric: string;
  threshold: number;
  unit: 'ms' | 'bytes' | 'count';
}

const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  { metric: 'FCP', threshold: 1800, unit: 'ms' }, // First Contentful Paint
  { metric: 'LCP', threshold: 2500, unit: 'ms' }, // Largest Contentful Paint
  { metric: 'FID', threshold: 100, unit: 'ms' },  // First Input Delay
  { metric: 'CLS', threshold: 0.1, unit: 'count' }, // Cumulative Layout Shift
  { metric: 'TTFB', threshold: 800, unit: 'ms' },  // Time to First Byte
  { metric: 'bundle-size', threshold: 500000, unit: 'bytes' }, // 500KB bundle size
];

export const initializeTelemetry = async () => {
  // In a real application, this would involve checking a config file or user preferences
  // For now, we'll simulate asking for consent once.
  if (telemetryEnabled === null) {
    // For web, this would be replaced by a UI component (e.g., a modal or banner) asking for consent.
    // For demonstration, we'll log a message.
    console.log('Web Telemetry: User consent required. (Simulated: Consent assumed for now)');
    telemetryEnabled = true; // Assume consent for now in this simulated environment

    if (telemetryEnabled) {
      initializePerformanceMonitoring();
    }
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (telemetryEnabled) {
    console.log(`Web Telemetry: Tracking event: ${eventName}` + (properties ? ` with properties: ${JSON.stringify(properties)}` : ''));
    // In a real application, this would send data to a telemetry service
  } else {
    // console.log(`Web Telemetry: disabled, not tracking event: ${eventName}`);
  }
};

export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  if (!telemetryEnabled) return;

  console.log(`Web Performance: ${metric} = ${value}${unit}`);

  // Check against budgets
  const budget = PERFORMANCE_BUDGETS.find(b => b.metric === metric);
  if (budget) {
    const isOverBudget = unit === budget.unit && value > budget.threshold;
    if (isOverBudget) {
      console.warn(`Web Performance Alert: ${metric} exceeded budget! ${value}${unit} > ${budget.threshold}${budget.unit}`);
      trackEvent('performance_budget_exceeded', {
        metric,
        value,
        unit,
        threshold: budget.threshold,
        exceededBy: value - budget.threshold
      });
    }
  }

  // In a real application, send to monitoring service
};

export const trackLatency = (operation: string, startTime: number, endTime?: number) => {
  const duration = endTime ? endTime - startTime : performance.now() - startTime;
  trackPerformance(`${operation}_latency`, duration, 'ms');
};

export const startLatencyTracking = (operation: string): (() => void) => {
  const startTime = performance.now();
  return () => trackLatency(operation, startTime);
};

const initializePerformanceMonitoring = () => {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint
      performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            trackPerformance('LCP', entry.startTime);
          }
        }
      });
      performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackPerformance('FID', (entry as any).processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        trackPerformance('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (e) {
      console.warn('Performance monitoring not fully supported');
    }
  }

  // Monitor page load metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        trackPerformance('TTFB', navigation.responseStart - navigation.requestStart);
        trackPerformance('domContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        trackPerformance('loadComplete', navigation.loadEventEnd - navigation.loadEventStart);
      }

      // Check bundle size (approximate)
      if ('performance' in window && 'getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const jsResources = resources.filter(r => r.name.includes('.js'));
        const totalSize = jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        trackPerformance('bundle-size', totalSize, 'bytes');
      }
    }, 0);
  });

  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            trackEvent('long_task_detected', {
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long tasks not supported in all browsers
    }
  }
};

export const cleanupPerformanceMonitoring = () => {
  if (performanceObserver) {
    performanceObserver.disconnect();
    performanceObserver = null;
  }
};
