'use client';

import React, { useState, useEffect } from 'react';
import { PerformanceOptimizer, usePerformanceMonitor } from '../lib/performanceOptimizer';

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceData, setPerformanceData] = useState<{
    fps: number[];
    memoryUsage: number[];
    timestamps: number[];
  }>({
    fps: [],
    memoryUsage: [],
    timestamps: []
  });

  usePerformanceMonitor('PerformanceDashboard');

  const optimizer = PerformanceOptimizer.getInstance();

  useEffect(() => {
    if (isMonitoring) {
      optimizer.initialize();

      // Update metrics every second
      const interval = setInterval(() => {
        const currentMetrics = optimizer.getMetrics();
        setMetrics(currentMetrics);

        // Collect performance data
        const now = Date.now();
        const fps = calculateFPS();
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

        setPerformanceData(prev => ({
          fps: [...prev.fps.slice(-59), fps], // Keep last 60 readings
          memoryUsage: [...prev.memoryUsage.slice(-59), memoryUsage],
          timestamps: [...prev.timestamps.slice(-59), now]
        }));
      }, 1000);

      return () => {
        clearInterval(interval);
        optimizer.destroy();
      };
    }
  }, [isMonitoring, optimizer]);

  const calculateFPS = (): number => {
    // Simple FPS calculation
    let fps = 60; // Default assumption
    if ('performance' in window && 'getEntriesByType' in performance) {
      const entries = performance.getEntriesByType('measure');
      if (entries.length > 1) {
        const lastEntry = entries[entries.length - 1];
        const secondLastEntry = entries[entries.length - 2];
        const frameTime = lastEntry.startTime - secondLastEntry.startTime;
        fps = 1000 / frameTime;
      }
    }
    return Math.round(fps);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    return ms.toFixed(2) + 'ms';
  };

  const getMetricColor = (value: number, thresholds: { good: number; warning: number }): string => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const runPerformanceTest = async () => {
    const results = await optimizer.measureAsyncExecutionTime(async () => {
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 100));

      // Test memory allocation
      const testArray = new Array(1000000).fill(0);
      testArray.length = 0; // Allow GC

      // Test DOM manipulation
      const testDiv = document.createElement('div');
      for (let i = 0; i < 1000; i++) {
        testDiv.appendChild(document.createElement('span'));
      }
      document.body.appendChild(testDiv);
      document.body.removeChild(testDiv);

      return 'test completed';
    }, 'performance-test');

    console.log('Performance test results:', results);
  };

  const clearMetrics = () => {
    setMetrics({});
    setPerformanceData({
      fps: [],
      memoryUsage: [],
      timestamps: []
    });
  };

  return (
    <div className="performance-dashboard max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Performance Dashboard
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded ${
              isMonitoring
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
          <button
            onClick={runPerformanceTest}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Run Test
          </button>
          <button
            onClick={clearMetrics}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Largest Contentful Paint (LCP)
          </h3>
          <p className={`text-2xl font-bold ${getMetricColor(metrics.LCP || 0, { good: 2500, warning: 4000 })}`}>
            {metrics.LCP ? formatTime(metrics.LCP) : 'Not measured'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Target: &lt; 2.5s
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            First Input Delay (FID)
          </h3>
          <p className={`text-2xl font-bold ${getMetricColor(metrics.FID || 0, { good: 100, warning: 300 })}`}>
            {metrics.FID ? formatTime(metrics.FID) : 'Not measured'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Target: &lt; 100ms
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cumulative Layout Shift (CLS)
          </h3>
          <p className={`text-2xl font-bold ${getMetricColor(metrics.CLS || 0, { good: 0.1, warning: 0.25 })}`}>
            {(metrics.CLS || 0).toFixed(3)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Target: &lt; 0.1
          </p>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Real-time Performance
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">FPS</span>
              <span className={`font-mono ${getMetricColor(performanceData.fps[performanceData.fps.length - 1] || 60, { good: 50, warning: 30 })}`}>
                {performanceData.fps[performanceData.fps.length - 1] || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Memory Used</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {formatBytes(performanceData.memoryUsage[performanceData.memoryUsage.length - 1] || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Observers</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {Object.keys(metrics).length}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Memory Information
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Used Heap</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {formatBytes(metrics['memory-used'] || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Heap</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {formatBytes(metrics['memory-total'] || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Heap Limit</span>
              <span className="font-mono text-gray-900 dark:text-white">
                {formatBytes(metrics['memory-limit'] || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts (Simplified) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Trends
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">FPS Over Time</h4>
            <div className="h-32 flex items-end space-x-1">
              {performanceData.fps.slice(-20).map((fps, index) => (
                <div
                  key={index}
                  className="bg-blue-500 flex-1 rounded-t"
                  style={{
                    height: `${Math.min((fps / 60) * 100, 100)}%`,
                    minHeight: '4px'
                  }}
                  title={`FPS: ${fps}`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Memory Usage Over Time</h4>
            <div className="h-32 flex items-end space-x-1">
              {performanceData.memoryUsage.slice(-20).map((usage, index) => {
                const maxUsage = Math.max(...performanceData.memoryUsage);
                const height = maxUsage > 0 ? (usage / maxUsage) * 100 : 0;
                return (
                  <div
                    key={index}
                    className="bg-green-500 flex-1 rounded-t"
                    style={{
                      height: `${height}%`,
                      minHeight: '4px'
                    }}
                    title={`Memory: ${formatBytes(usage)}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Long Tasks */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Long Tasks Detected
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          {Object.entries(metrics)
            .filter(([key]) => key.startsWith('long-task-'))
            .map(([key, duration]) => (
              <div key={key} className="flex justify-between py-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(parseInt(key.split('-')[2])).toLocaleTimeString()}
                </span>
                <span className="font-mono text-red-600">
                  {formatTime(duration)}
                </span>
              </div>
            ))}
          {Object.keys(metrics).filter(key => key.startsWith('long-task-')).length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No long tasks detected</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Performance Recommendations
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Keep LCP under 2.5 seconds for good user experience</li>
          <li>• Maintain FID under 100ms for responsive interactions</li>
          <li>• Keep CLS under 0.1 to prevent layout shifts</li>
          <li>• Monitor memory usage to prevent leaks</li>
          <li>• Optimize images and use lazy loading for better performance</li>
          <li>• Use code splitting to reduce initial bundle size</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceDashboard;