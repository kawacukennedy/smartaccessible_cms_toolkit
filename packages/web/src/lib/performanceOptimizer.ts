// Performance Optimization Utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private observers: PerformanceObserver[] = [];
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Initialize performance monitoring
  initialize(): void {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      this.observeLCP();

      // Monitor First Input Delay (FID)
      this.observeFID();

      // Monitor Cumulative Layout Shift (CLS)
      this.observeCLS();

      // Monitor long tasks
      this.observeLongTasks();
    }

    // Monitor memory usage
    this.monitorMemoryUsage();

    // Monitor network requests
    this.monitorNetworkRequests();
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('LCP', lastEntry.startTime);
        console.log('LCP:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('LCP observation not supported');
    }
  }

  private observeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.set('FID', entry.processingStart - entry.startTime);
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FID observation not supported');
    }
  }

  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.set('CLS', clsValue);
        console.log('CLS:', clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('CLS observation not supported');
    }
  }

  private observeLongTasks(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', entry.duration, 'ms');
            this.metrics.set(`long-task-${Date.now()}`, entry.duration);
          }
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('Long task observation not supported');
    }
  }

  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.set('memory-used', memory.usedJSHeapSize);
        this.metrics.set('memory-total', memory.totalJSHeapSize);
        this.metrics.set('memory-limit', memory.jsHeapSizeLimit);

        // Warn if memory usage is high
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          console.warn('High memory usage:', usagePercent.toFixed(1) + '%');
        }
      }, 10000); // Check every 10 seconds
    }
  }

  private monitorNetworkRequests(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.duration > 1000) { // Requests slower than 1s
            console.warn('Slow network request:', entry.name, entry.duration, 'ms');
          }
        });
      });
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    }
  }

  // Get current performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Measure function execution time
  measureExecutionTime<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    console.log(`${label} took ${duration.toFixed(2)}ms`);
    this.metrics.set(`execution-${label}`, duration);

    return result;
  }

  // Async function execution time measurement
  async measureAsyncExecutionTime<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    console.log(`${label} took ${duration.toFixed(2)}ms`);
    this.metrics.set(`async-execution-${label}`, duration);

    return result;
  }

  // Cleanup observers
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now();

  React.useEffect(() => {
    const mountTime = performance.now() - startTime;
    console.log(`${componentName} mounted in ${mountTime.toFixed(2)}ms`);

    return () => {
      const unmountTime = performance.now();
      console.log(`${componentName} will unmount after ${(unmountTime - startTime).toFixed(2)}ms total`);
    };
  }, [componentName, startTime]);

  const measureRender = React.useCallback((label: string) => {
    const renderTime = performance.now() - startTime;
    console.log(`${componentName} ${label} render: ${renderTime.toFixed(2)}ms`);
  }, [componentName, startTime]);

  return { measureRender };
};

// Lazy loading utilities
export const lazyLoad = {
  // Lazy load images
  image: (src: string, options: IntersectionObserverInit = {}): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;

      // Use Intersection Observer for lazy loading
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.unobserve(entry.target);
            }
          });
        }, { rootMargin: '50px', ...options });

        // We need to observe the image element, but it's not in DOM yet
        // This is a simplified version - in practice, you'd observe a placeholder
      }
    });
  },

  // Lazy load components
  component: <T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>
  ): React.LazyExoticComponent<T> => {
    return React.lazy(importFn);
  },

  // Preload resources
  preload: (src: string, as: string = 'image'): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;
    document.head.appendChild(link);
  }
};

// Bundle optimization utilities
export const bundleOptimizer = {
  // Code splitting hints
  splitPoint: (moduleId: string) => {
    // This is a hint for webpack to create a split point
    // In practice, you'd use React.lazy or dynamic imports
    return moduleId;
  },

  // Dynamic import with error boundary
  loadModule: async <T>(importFn: () => Promise<T>): Promise<T> => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Failed to load module:', error);
      throw error;
    }
  },

  // Service worker for caching
  registerServiceWorker: async (scriptURL: string): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(scriptURL);
        console.log('Service worker registered:', registration);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }
};

// Memory management utilities
export const memoryManager = {
  // Force garbage collection (development only)
  forceGC: (): void => {
    if (process.env.NODE_ENV === 'development' && 'gc' in window) {
      (window as any).gc();
    }
  },

  // Monitor for memory leaks
  watchForLeaks: (componentName: string): (() => void) => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    let maxMemory = initialMemory;

    const interval = setInterval(() => {
      const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
      maxMemory = Math.max(maxMemory, currentMemory);

      const growth = currentMemory - initialMemory;
      if (growth > 10 * 1024 * 1024) { // 10MB growth
        console.warn(`${componentName} potential memory leak detected:`, growth, 'bytes');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  },

  // Cleanup event listeners
  createCleanupFunction: (element: HTMLElement, event: string, handler: EventListener): (() => void) => {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
  }
};

// Network optimization utilities
export const networkOptimizer = {
  // Debounce API calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle API calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Cache API responses
  createCache: <T>(): {
    get: (key: string) => T | undefined;
    set: (key: string, value: T, ttl?: number) => void;
    clear: () => void;
  } => {
    const cache = new Map<string, { value: T; expiry?: number }>();

    return {
      get: (key: string) => {
        const item = cache.get(key);
        if (item && (!item.expiry || item.expiry > Date.now())) {
          return item.value;
        }
        cache.delete(key);
        return undefined;
      },
      set: (key: string, value: T, ttl?: number) => {
        cache.set(key, {
          value,
          expiry: ttl ? Date.now() + ttl : undefined
        });
      },
      clear: () => cache.clear()
    };
  },

  // Retry failed requests
  retryRequest: async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError!;
  }
};

// React optimization hooks
export const useOptimizedState = <T>(initialValue: T) => {
  const [state, setState] = React.useState(initialValue);

  const optimizedSetState = React.useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function' ? (value as Function)(prev) : value;
      // Only update if value actually changed
      return Object.is(prev, newValue) ? prev : newValue;
    });
  }, []);

  return [state, optimizedSetState] as const;
};

export const useOptimizedEffect = (
  effect: React.EffectCallback,
  deps?: React.DependencyList
) => {
  const prevDeps = React.useRef<React.DependencyList>();

  React.useEffect(() => {
    const hasChanged = !prevDeps.current ||
      !deps ||
      deps.length !== prevDeps.current.length ||
      deps.some((dep, i) => !Object.is(dep, prevDeps.current![i]));

    if (hasChanged) {
      prevDeps.current = deps;
      return effect();
    }
  }, deps);
};

// Image optimization utilities
export const imageOptimizer = {
  // Generate responsive image sources
  generateSrcSet: (baseUrl: string, widths: number[]): string => {
    return widths
      .map(width => `${baseUrl}?w=${width} ${width}w`)
      .join(', ');
  },

  // WebP support detection
  supportsWebP: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  },

  // Lazy load images with intersection observer
  createLazyImage: (
    src: string,
    options: {
      rootMargin?: string;
      threshold?: number;
      placeholder?: string;
    } = {}
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                img.src = src;
                observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: options.rootMargin || '50px',
            threshold: options.threshold || 0.1
          }
        );

        // For demo purposes, we'll just load immediately
        // In practice, you'd observe a placeholder element
        img.src = src;
      } else {
        // Fallback for browsers without IntersectionObserver
        img.src = src;
      }
    });
  }
};