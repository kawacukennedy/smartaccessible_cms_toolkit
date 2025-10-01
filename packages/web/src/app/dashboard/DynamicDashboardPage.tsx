'use client';

import React, { useState, useEffect } from 'react';

const initialMockMetrics = [
  { name: "AccessibilityScore", value: 85, unit: "%", description: "Overall accessibility score." },
  { name: "InclusivityScore", value: 92, unit: "%", description: "Overall inclusivity score." },
  { name: "ReadabilityScore", value: 78, unit: "Flesch-Kincaid", description: "Readability of content." },
  { name: "AI Suggestions Accepted %", value: 70, unit: "%", description: "Percentage of AI suggestions accepted by users." },
  { name: "ContentVersionChanges", value: 120, unit: "changes", description: "Number of content version changes." },
  { name: "UserActivityLogs", value: 500, unit: "logs", description: "Number of user activity logs." },
  { name: "NotificationDeliveryRate", value: 98, unit: "%", description: "Rate of successful notification delivery." },
  { name: "ThemeUsageStats", value: { light: 60, dark: 40 }, unit: "%", description: "Usage statistics for different themes." },
  { name: "SEOScore", value: 75, unit: "%", description: "Overall SEO score." },
  { name: "MediaOptimizationScore", value: 88, unit: "%", description: "Score for media optimization." },
  { name: "UndoRedoActions", value: 300, unit: "actions", description: "Number of undo/redo actions performed." },
  { name: "RealtimeSyncLatency", value: 50, unit: "ms", description: "Latency of real-time synchronization." },
  { name: "CacheHitRate", value: 95, unit: "%", description: "Cache hit rate." },
];

const DynamicDashboardPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [metrics, setMetrics] = useState(initialMockMetrics);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          if (typeof metric.value === 'number') {
            return { ...metric, value: Math.min(100, metric.value + Math.floor(Math.random() * 5)) };
          }
          return metric;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChartHover = (chartName: string) => {
    console.log(`Hovering over ${chartName} chart.`);
  };

  const handleExport = (format: string) => {
    const reportData = {
      timestamp: new Date().toISOString(),
      filter: filter,
      dateRange: dateRange,
      metrics: metrics,
      notes: `This is a mock ${format} report generated from the Analytics Dashboard.`, 
    };
    alert(`Simulating export to ${format}:
${JSON.stringify(reportData, null, 2)}`);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Overview of key performance indicators for your CMS.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="dateRangeSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</label>
          <select id="dateRangeSelect" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="today">Today</option>
          </select>
        </div>
        <div>
          <label htmlFor="segmentSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Segment Select:</label>
          <select id="segmentSelect" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Segments</option>
            <option value="new_users">New Users</option>
            <option value="returning_users">Returning Users</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="font-bold text-lg mb-2">{metric.name}</h3>
            {typeof metric.value === 'object' ? (
              Object.entries(metric.value).map(([key, val]) => (
                <p key={key} className="text-gray-600 dark:text-gray-400">{key}: {val}{metric.unit}</p>
              ))
            ) : (
              <p className="text-3xl font-bold text-primary">{metric.value}{metric.unit}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{metric.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-2">Traffic Over Time</h3>
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400" onMouseEnter={() => handleChartHover('Traffic Over Time')}>Placeholder for Line Chart.</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-2">Top Performing Content</h3>
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400" onMouseEnter={() => handleChartHover('Top Performing Content')}>Placeholder for Bar Chart.</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-2">Audience Segments</h3>
          <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400" onMouseEnter={() => handleChartHover('Audience Segments')}>Placeholder for Pie Chart.</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Report Export</h2>
        <button className="px-4 py-2 rounded-md bg-success text-white hover:bg-opacity-80 mr-2" onClick={() => handleExport('CSV')}>Export CSV</button>
        <button className="px-4 py-2 rounded-md bg-error text-white hover:bg-opacity-80" onClick={() => handleExport('PDF')}>Export PDF</button>
      </div>
    </div>
  );
};

export default DynamicDashboardPage;
