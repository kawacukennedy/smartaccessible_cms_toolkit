'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Activity, Zap } from 'lucide-react';
import { trackPerformance, startLatencyTracking } from '@/lib/telemetry';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  status: 'good' | 'warning' | 'critical';
  timestamp: number;
}

interface PerformanceAlert {
  id: string;
  metric: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Monitor page load performance
    const loadEndTracking = startLatencyTracking('page_load');
    const handleLoad = () => {
      loadEndTracking();
    };
    window.addEventListener('load', handleLoad);

    // Monitor navigation timing
    const updateMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const newMetrics: PerformanceMetric[] = [
          {
            name: 'TTFB',
            value: navigation.responseStart - navigation.requestStart,
            unit: 'ms',
            threshold: 800,
            status: (navigation.responseStart - navigation.requestStart) > 800 ? 'critical' : 'good',
            timestamp: Date.now()
          },
          {
            name: 'DOM Content Loaded',
            value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            unit: 'ms',
            threshold: 1500,
            status: (navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) > 1500 ? 'warning' : 'good',
            timestamp: Date.now()
          },
          {
            name: 'Page Load Complete',
            value: navigation.loadEventEnd - navigation.loadEventStart,
            unit: 'ms',
            threshold: 3000,
            status: (navigation.loadEventEnd - navigation.loadEventStart) > 3000 ? 'critical' : 'good',
            timestamp: Date.now()
          }
        ];

        setMetrics(prev => [...prev.filter(m => !newMetrics.find(nm => nm.name === m.name)), ...newMetrics]);
      }
    };

    // Check metrics periodically
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial check

    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(interval);
    };
  }, []);

  // Listen for performance alerts (in a real app, this would come from a service)
  useEffect(() => {
    const handlePerformanceAlert = (event: CustomEvent) => {
      const alert: PerformanceAlert = {
        id: Date.now().toString(),
        metric: event.detail.metric,
        message: event.detail.message,
        severity: event.detail.severity || 'warning',
        timestamp: Date.now()
      };
      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    };

    window.addEventListener('performanceAlert', handlePerformanceAlert as EventListener);

    return () => {
      window.removeEventListener('performanceAlert', handlePerformanceAlert as EventListener);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-danger';
      default: return 'text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <Zap size={16} className="text-success" />;
      case 'warning': return <AlertTriangle size={16} className="text-warning" />;
      case 'critical': return <AlertTriangle size={16} className="text-danger" />;
      default: return <Activity size={16} className="text-muted" />;
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const hasCriticalAlerts = criticalAlerts.length > 0;

  return (
    <div className="performance-monitor">
      {/* Status Bar */}
      <div className="d-flex align-items-center justify-content-between p-2 bg-light border-bottom">
        <div className="d-flex align-items-center">
          <Activity size={16} className="me-2" />
          <span className="fw-bold">Performance</span>
          {hasCriticalAlerts && (
            <span className="badge bg-danger ms-2">
              {criticalAlerts.length} Critical
            </span>
          )}
        </div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Alerts Summary */}
      {alerts.length > 0 && (
        <div className="p-2 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Recent Alerts: {alerts.length}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={clearAlerts}>
              Clear All
            </button>
          </div>
          {alerts.slice(0, 3).map(alert => (
            <div key={alert.id} className={`alert alert-${alert.severity === 'critical' ? 'danger' : 'warning'} py-1 px-2 mt-1 mb-0`}>
              <small>
                <strong>{alert.metric}:</strong> {alert.message}
              </small>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Metrics */}
      {isExpanded && (
        <div className="p-3">
          <h6 className="mb-3">Performance Metrics</h6>

          <div className="row g-3">
            {metrics.map(metric => (
              <div key={metric.name} className="col-md-4">
                <div className="card h-100">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="card-title mb-0">{metric.name}</h6>
                      {getStatusIcon(metric.status)}
                    </div>
                    <div className="d-flex align-items-baseline">
                      <span className={`fw-bold fs-5 ${getStatusColor(metric.status)}`}>
                        {metric.value.toFixed(metric.unit === 'ms' ? 0 : 2)}
                      </span>
                      <span className="text-muted ms-1">{metric.unit}</span>
                    </div>
                    {metric.threshold && (
                      <small className="text-muted">
                        Budget: {metric.threshold}{metric.unit}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Tips */}
          <div className="mt-4">
            <h6>Optimization Tips</h6>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <TrendingUp size={14} className="me-2 text-primary" />
                    <small>Reduce bundle size by code splitting</small>
                  </li>
                  <li className="mb-2">
                    <TrendingUp size={14} className="me-2 text-primary" />
                    <small>Optimize images and use modern formats</small>
                  </li>
                  <li className="mb-2">
                    <TrendingUp size={14} className="me-2 text-primary" />
                    <small>Implement lazy loading for components</small>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <TrendingUp size={14} className="me-2 text-primary" />
                    <small>Use React.memo for expensive components</small>
                  </li>
                  <li className="mb-2">
                    <TrendingUp size={14} className="me-2 text-primary" />
                    <small>Implement virtual scrolling for large lists</small>
                  </li>
                  <li className="mb-2">
                    <TrendingUp size={14} className="me-2 text-primary" />
                    <small>Monitor Core Web Vitals regularly</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;