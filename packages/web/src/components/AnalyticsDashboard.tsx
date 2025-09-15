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

      {/* Filtering Options */}
      <div className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="filterSelect" className="form-label">Filter by:</label>
            <select id="filterSelect" className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="content">Content</option>
              <option value="users">Users</option>
              <option value="ai">AI</option>
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="dateRangeSelect" className="form-label">Date Range:</label>
            <select id="dateRangeSelect" className="form-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row">
        {metrics.map((metric, index) => (
          <div key={index} className="col-md-4 mb-3">
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

      <h2 className="mt-4">Interactive Charts (Placeholder)</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">Content Version Changes Over Time</div>
            <div className="card-body" onMouseEnter={() => handleChartHover('Content Version Changes')}>
              <p>A simple bar chart representation.</p>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, borderBottom: '1px solid #ccc', paddingBottom: 5 }}>
                <div style={{ height: '80%', width: '15%', backgroundColor: 'blue' }}></div>
                <div style={{ height: '60%', width: '15%', backgroundColor: 'blue' }}></div>
                <div style={{ height: '90%', width: '15%', backgroundColor: 'blue' }}></div>
                <div style={{ height: '50%', width: '15%', backgroundColor: 'blue' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.8em', marginTop: 5 }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">AI Suggestions Acceptance Rate</div>
            <div className="card-body" onMouseEnter={() => handleChartHover('AI Suggestions Acceptance')}>
              <p>A simple pie chart representation.</p>
              <div style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'conic-gradient(green 0% 70%, gray 70% 100%)', margin: 'auto' }}></div>
              <p className="text-center mt-2">70% Accepted</p>
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
