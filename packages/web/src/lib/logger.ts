// Comprehensive logging utility
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  category?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private minLevel: LogLevel = LogLevel.INFO;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();

    // Load configuration from environment or localStorage
    this.loadConfiguration();

    // Set up global error handler
    this.setupGlobalErrorHandler();

    // Set up performance monitoring
    this.setupPerformanceMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadConfiguration() {
    try {
      const config = localStorage.getItem('logger_config');
      if (config) {
        const parsed = JSON.parse(config);
        this.minLevel = parsed.minLevel || LogLevel.INFO;
        this.maxLogs = parsed.maxLogs || 1000;
      }
    } catch (e) {
      console.warn('Failed to load logger configuration:', e);
    }
  }

  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', 'global', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', 'global', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  private setupPerformanceMonitoring() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              this.warn('Long task detected', 'performance', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long tasks not supported in all browsers
      }
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    category?: string,
    metadata?: Record<string, any>,
    stackTrace?: string
  ): LogEntry {
    return {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level,
      message,
      category,
      sessionId: this.sessionId,
      metadata,
      stackTrace,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
  }

  private addLog(entry: LogEntry) {
    // Add to internal storage
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const levelName = LogLevel[entry.level];
      const prefix = `[${new Date(entry.timestamp).toISOString()}] ${levelName}`;
      const category = entry.category ? `[${entry.category}]` : '';

      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(`${prefix} ${category}`, entry.message, entry.metadata);
          break;
        case LogLevel.INFO:
          console.info(`${prefix} ${category}`, entry.message, entry.metadata);
          break;
        case LogLevel.WARN:
          console.warn(`${prefix} ${category}`, entry.message, entry.metadata);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(`${prefix} ${category}`, entry.message, entry.metadata, entry.stackTrace);
          break;
      }
    }

    // In a real application, send logs to monitoring service
    // this.sendToMonitoringService(entry);
  }

  private sendToMonitoringService(entry: LogEntry) {
    // Example implementation - replace with your monitoring service
    if (entry.level >= LogLevel.ERROR) {
      // Send critical errors immediately
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      }).catch(err => console.error('Failed to send log to service:', err));
    }
  }

  debug(message: string, category?: string, metadata?: Record<string, any>) {
    if (this.minLevel <= LogLevel.DEBUG) {
      this.addLog(this.createLogEntry(LogLevel.DEBUG, message, category, metadata));
    }
  }

  info(message: string, category?: string, metadata?: Record<string, any>) {
    if (this.minLevel <= LogLevel.INFO) {
      this.addLog(this.createLogEntry(LogLevel.INFO, message, category, metadata));
    }
  }

  warn(message: string, category?: string, metadata?: Record<string, any>) {
    if (this.minLevel <= LogLevel.WARN) {
      this.addLog(this.createLogEntry(LogLevel.WARN, message, category, metadata));
    }
  }

  error(message: string, category?: string, metadata?: Record<string, any>, error?: Error) {
    if (this.minLevel <= LogLevel.ERROR) {
      this.addLog(this.createLogEntry(
        LogLevel.ERROR,
        message,
        category,
        metadata,
        error?.stack
      ));
    }
  }

  fatal(message: string, category?: string, metadata?: Record<string, any>, error?: Error) {
    if (this.minLevel <= LogLevel.FATAL) {
      this.addLog(this.createLogEntry(
        LogLevel.FATAL,
        message,
        category,
        metadata,
        error?.stack
      ));
    }
  }

  // Performance logging
  time(label: string) {
    console.time(label);
    this.debug(`Started timing: ${label}`, 'performance');
  }

  timeEnd(label: string) {
    const startTime = performance.now();
    console.timeEnd(label);
    const duration = performance.now() - startTime;
    this.info(`Completed timing: ${label}`, 'performance', { duration });
  }

  // User action logging
  userAction(action: string, details?: Record<string, any>) {
    this.info(`User action: ${action}`, 'user', details);
  }

  // API logging
  apiCall(method: string, url: string, status?: number, duration?: number, error?: string) {
    const metadata = {
      method,
      url,
      status,
      duration,
      error
    };

    if (status && status >= 400) {
      this.error(`API call failed: ${method} ${url}`, 'api', metadata);
    } else {
      this.info(`API call: ${method} ${url}`, 'api', metadata);
    }
  }

  // Get logs for debugging
  getLogs(filter?: {
    level?: LogLevel;
    category?: string;
    since?: number;
    limit?: number;
  }): LogEntry[] {
    let filteredLogs = this.logs;

    if (filter?.level !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.level >= filter.level);
    }

    if (filter?.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filter.category);
    }

    if (filter?.since) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.since);
    }

    filteredLogs.sort((a, b) => b.timestamp - a.timestamp);

    if (filter?.limit) {
      filteredLogs = filteredLogs.slice(0, filter.limit);
    }

    return filteredLogs;
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Configuration
  setMinLevel(level: LogLevel) {
    this.minLevel = level;
    this.saveConfiguration();
  }

  setMaxLogs(maxLogs: number) {
    this.maxLogs = maxLogs;
    this.saveConfiguration();
  }

  private saveConfiguration() {
    try {
      localStorage.setItem('logger_config', JSON.stringify({
        minLevel: this.minLevel,
        maxLogs: this.maxLogs
      }));
    } catch (e) {
      console.warn('Failed to save logger configuration:', e);
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Convenience functions for common logging patterns
export const logAPIError = (error: any, context: string) => {
  logger.error(`API Error in ${context}`, 'api', {
    message: error.message,
    status: error.status,
    url: error.url,
    stack: error.stack
  });
};

export const logUserInteraction = (action: string, element: string, details?: Record<string, any>) => {
  logger.info(`User interaction: ${action} on ${element}`, 'ui', details);
};

export const logPerformance = (metric: string, value: number, unit: string = 'ms') => {
  logger.info(`Performance metric: ${metric}`, 'performance', { value, unit });
};

export const logSecurityEvent = (event: string, details: Record<string, any>) => {
  logger.warn(`Security event: ${event}`, 'security', details);
};