// Mobile Performance Monitor - Adapted for React Native
import { InteractionManager, PerformanceObserver, Platform } from 'react-native';

interface PerformanceMetrics {
  // App startup metrics
  appStartTime: number;
  jsBundleLoadTime: number;
  timeToInteractive: number;

  // Runtime metrics
  fps: number;
  memoryUsage: number;
  cpuUsage?: number;

  // Network metrics
  networkRequests: number;
  networkErrors: number;
  averageResponseTime: number;

  // UI metrics
  renderTime: number;
  layoutTime: number;
  jsThreadTime: number;

  // Custom metrics
  customMetrics: Record<string, number>;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  entryType: string;
  metadata?: Record<string, any>;
}

class MobilePerformanceMonitor {
  private static instance: MobilePerformanceMonitor;
  private metrics: PerformanceMetrics;
  private entries: PerformanceEntry[] = [];
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];
  private startTime: number;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private fps: number = 60;

  private constructor() {
    this.startTime = Date.now();
    this.metrics = this.initializeMetrics();
    this.initializeMonitoring();
  }

  static getInstance(): MobilePerformanceMonitor {
    if (!MobilePerformanceMonitor.instance) {
      MobilePerformanceMonitor.instance = new MobilePerformanceMonitor();
    }
    return MobilePerformanceMonitor.instance;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      appStartTime: 0,
      jsBundleLoadTime: 0,
      timeToInteractive: 0,
      fps: 60,
      memoryUsage: 0,
      networkRequests: 0,
      networkErrors: 0,
      averageResponseTime: 0,
      renderTime: 0,
      layoutTime: 0,
      jsThreadTime: 0,
      customMetrics: {},
    };
  }

  private initializeMonitoring(): void {
    // Monitor FPS
    this.startFPSMonitoring();

    // Monitor memory usage
    this.startMemoryMonitoring();

    // Monitor network requests
    this.startNetworkMonitoring();

    // Monitor app startup
    this.measureAppStartup();

    // Set up periodic metrics collection
    setInterval(() => {
      this.collectMetrics();
    }, 5000); // Collect every 5 seconds
  }

  private startFPSMonitoring(): void {
    let lastTime = Date.now();
    let frameCount = 0;

    const measureFPS = () => {
      const currentTime = Date.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        this.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.metrics.fps = this.fps;
        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private startMemoryMonitoring(): void {
    // Memory monitoring is limited in React Native
    // We'll use a simple approximation
    setInterval(() => {
      // In a real implementation, you might use a native module
      // to get actual memory usage
      this.metrics.memoryUsage = Math.random() * 100 + 50; // Mock value
    }, 10000);
  }

  private startNetworkMonitoring(): void {
    // Network monitoring would typically be done with a custom XMLHttpRequest wrapper
    // or by using a library like axios interceptors
    // For this implementation, we'll track basic network stats
    this.metrics.networkRequests = 0;
    this.metrics.networkErrors = 0;
    this.metrics.averageResponseTime = 0;
  }

  private measureAppStartup(): void {
    // Measure time from app start to interactive
    InteractionManager.runAfterInteractions(() => {
      const interactiveTime = Date.now() - this.startTime;
      this.metrics.timeToInteractive = interactiveTime;

      this.addEntry({
        name: 'app_startup',
        startTime: this.startTime,
        duration: interactiveTime,
        entryType: 'app_startup',
        metadata: { phase: 'time_to_interactive' },
      });
    });
  }

  // Performance measurement methods
  startMeasure(name: string): void {
    this.addEntry({
      name,
      startTime: Date.now(),
      duration: 0,
      entryType: 'measure',
    });
  }

  endMeasure(name: string): number {
    const entry = this.entries.find(e => e.name === name && e.entryType === 'measure');
    if (entry) {
      entry.duration = Date.now() - entry.startTime;
      return entry.duration;
    }
    return 0;
  }

  measureExecutionTime<T>(fn: () => T, name: string): T {
    this.startMeasure(name);
    const result = fn();
    this.endMeasure(name);
    return result;
  }

  async measureAsyncExecutionTime<T>(fn: () => Promise<T>, name: string): Promise<T> {
    this.startMeasure(name);
    const result = await fn();
    this.endMeasure(name);
    return result;
  }

  // Custom metrics
  setCustomMetric(name: string, value: number): void {
    this.metrics.customMetrics[name] = value;
  }

  incrementCustomMetric(name: string, increment: number = 1): void {
    this.metrics.customMetrics[name] = (this.metrics.customMetrics[name] || 0) + increment;
  }

  // Network tracking
  trackNetworkRequest(url: string, method: string, startTime: number): void {
    this.metrics.networkRequests++;
  }

  trackNetworkResponse(url: string, statusCode: number, responseTime: number): void {
    if (statusCode >= 400) {
      this.metrics.networkErrors++;
    }

    // Update average response time
    const totalRequests = this.metrics.networkRequests;
    const currentAverage = this.metrics.averageResponseTime;
    this.metrics.averageResponseTime =
      (currentAverage * (totalRequests - 1) + responseTime) / totalRequests;
  }

  // UI performance tracking
  measureRenderTime(componentName: string, renderTime: number): void {
    this.metrics.renderTime = renderTime;
    this.addEntry({
      name: `render_${componentName}`,
      startTime: Date.now() - renderTime,
      duration: renderTime,
      entryType: 'render',
      metadata: { componentName },
    });
  }

  measureLayoutTime(layoutTime: number): void {
    this.metrics.layoutTime = layoutTime;
    this.addEntry({
      name: 'layout',
      startTime: Date.now() - layoutTime,
      duration: layoutTime,
      entryType: 'layout',
    });
  }

  // Entry management
  private addEntry(entry: PerformanceEntry): void {
    this.entries.push(entry);

    // Keep only recent entries (last 100)
    if (this.entries.length > 100) {
      this.entries = this.entries.slice(-100);
    }
  }

  getEntries(type?: string): PerformanceEntry[] {
    if (type) {
      return this.entries.filter(entry => entry.entryType === type);
    }
    return [...this.entries];
  }

  // Metrics collection
  private collectMetrics(): void {
    // Update observers with current metrics
    this.observers.forEach(observer => observer({ ...this.metrics }));
  }

  // Observer pattern
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Performance analysis
  analyzePerformance(): {
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // FPS analysis
    if (this.metrics.fps < 50) {
      issues.push('Low FPS detected');
      recommendations.push('Optimize animations and reduce render frequency');
      score -= 20;
    }

    // Memory analysis
    if (this.metrics.memoryUsage > 150) {
      issues.push('High memory usage');
      recommendations.push('Implement memory optimizations and garbage collection');
      score -= 15;
    }

    // Network analysis
    if (this.metrics.networkErrors > this.metrics.networkRequests * 0.1) {
      issues.push('High network error rate');
      recommendations.push('Implement retry logic and error handling');
      score -= 10;
    }

    if (this.metrics.averageResponseTime > 2000) {
      issues.push('Slow network responses');
      recommendations.push('Optimize API calls and implement caching');
      score -= 10;
    }

    // Render performance
    if (this.metrics.renderTime > 16) { // More than one frame at 60fps
      issues.push('Slow render performance');
      recommendations.push('Optimize component re-renders and use memoization');
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
    };
  }

  // Export data for analysis
  exportData(): {
    metrics: PerformanceMetrics;
    entries: PerformanceEntry[];
    analysis: ReturnType<MobilePerformanceMonitor['analyzePerformance']>;
  } {
    return {
      metrics: this.getMetrics(),
      entries: this.getEntries(),
      analysis: this.analyzePerformance(),
    };
  }

  // Reset monitoring
  reset(): void {
    this.entries = [];
    this.metrics = this.initializeMetrics();
    this.startTime = Date.now();
  }
}

export default MobilePerformanceMonitor;
export { PerformanceMetrics, PerformanceEntry };