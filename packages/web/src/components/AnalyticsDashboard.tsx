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

const AnalyticsDashboard: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [metrics, setMetrics] = useState(initialMockMetrics);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          if (typeof metric.value === 'number') {
            return { ...metric, value: Math.min(100, metric.value + Math.floor(Math.random() * 5)) }; // Increment by 0-4
          }
          return metric;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleChartHover = (chartName: string) => {
    console.log(`Hovering over ${chartName} chart.`);
    // In a real app, this would show a tooltip or highlight data points
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
    // In a real app, this would trigger a data export
  };

  return (
    <div className="container-fluid py-3">
      <h1>Analytics Dashboard</h1>
      <p>Overview of key performance indicators for your CMS.</p>

      {/* Filters Bar */}
      <div className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="dateRangeSelect" className="form-label">Date Range:</label>
            <select id="dateRangeSelect" className="form-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="today">Today</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="segmentSelect" className="form-label">Segment Select:</label> {/* Changed label and id */}
            <select id="segmentSelect" className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Segments</option>
              <option value="new_users">New Users</option>
              <option value="returning_users">Returning Users</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        {metrics.map((metric, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-3"> {/* Adjusted responsive classes */}
            <div className="card h-100">
              <div className="card-header">{metric.name}</div>
              <div className="card-body">
                {typeof metric.value === 'object' ? (
                  Object.entries(metric.value).map(([key, val]) => (
                    <p key={key} className="card-text">{key}: {val}{metric.unit}</p>
                  ))
                ) : (
                  <h3 className="card-title">{metric.value}{metric.unit}</h3>
                )}
                <p className="card-text text-muted">{metric.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-4">Charts</h2> {/* Changed heading */}
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4 mb-3"> {/* Adjusted responsive classes */}
          <div className="card h-100">
            <div className="card-header">Traffic Over Time</div> {/* Changed title */}
            <div className="card-body" onMouseEnter={() => handleChartHover('Traffic Over Time')}>
              <p>Placeholder for Line Chart.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-4 mb-3"> {/* Adjusted responsive classes */}
          <div className="card h-100">
            <div className="card-header">Top Performing Content</div> {/* Changed title */}
            <div className="card-body" onMouseEnter={() => handleChartHover('Top Performing Content')}>
              <p>Placeholder for Bar Chart.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-4 mb-3"> {/* Adjusted responsive classes */}
          <div className="card h-100">
            <div className="card-header">Audience Segments</div> {/* Changed title */}
            <div className="card-body" onMouseEnter={() => handleChartHover('Audience Segments')}>
              <p>Placeholder for Pie Chart.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Export Functionality */}
      <div className="mt-4">
        <h2>Report Export</h2>
        <button className="btn btn-success me-2" onClick={() => handleExport('CSV')}>Export CSV</button>
        <button className="btn btn-danger" onClick={() => handleExport('PDF')}>Export PDF</button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
