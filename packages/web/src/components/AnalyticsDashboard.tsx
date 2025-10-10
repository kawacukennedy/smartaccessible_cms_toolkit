'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Edit3,
  Send,
  Sparkles,
  Clock,
  MousePointer,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Download,
  RefreshCw
} from 'lucide-react';
import { analyticsTracker, trackUserAction } from '@/lib/analytics';

interface AnalyticsData {
  session: any;
  contentAnalytics: any[];
  aiAnalytics: any;
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'ai'>('overview');

  useEffect(() => {
    loadAnalyticsData();
    trackUserAction('analytics_dashboard_view');
  }, [timeRange]);

  const loadAnalyticsData = () => {
    // In a real app, this would fetch from an analytics API
    // For now, we'll use the exported data
    const data = analyticsTracker.exportAnalyticsData();
    setAnalyticsData(data);
  };

  const getTimeRangeFilter = () => {
    const now = Date.now();
    const ranges = {
      '1h': now - (60 * 60 * 1000),
      '24h': now - (24 * 60 * 60 * 1000),
      '7d': now - (7 * 24 * 60 * 60 * 1000),
      '30d': now - (30 * 24 * 60 * 60 * 1000)
    };
    return { start: ranges[timeRange], end: now };
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const exportAnalytics = () => {
    const data = analyticsTracker.exportAnalyticsData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackUserAction('analytics_export');
  };

  if (!analyticsData) {
    return (
      <div className="analytics-dashboard">
        <div className="card">
          <div className="card-body text-center py-5">
            <RefreshCw className="spin mb-3" size={48} />
            <p>Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  const { session, contentAnalytics, aiAnalytics } = analyticsData;
  const timeFilter = getTimeRangeFilter();
  const filteredEvents = analyticsTracker.getUserEvents(timeFilter);

  return (
    <div className="analytics-dashboard">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0 d-flex align-items-center">
            <BarChart3 className="me-2" />
            Analytics Dashboard
          </h5>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button className="btn btn-sm btn-outline-primary" onClick={exportAnalytics}>
              <Download size={14} className="me-1" />
              Export
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <TrendingUp size={14} className="me-1" />
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                <Edit3 size={14} className="me-1" />
                Content
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={14} className="me-1" />
                Users
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'ai' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai')}
              >
                <Sparkles size={14} className="me-1" />
                AI Insights
              </button>
            </li>
          </ul>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Key Metrics */}
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <Eye className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{formatNumber(contentAnalytics.reduce((sum, c) => sum + c.views, 0))}</h4>
                          <small>Total Views</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <Edit3 className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{formatNumber(contentAnalytics.reduce((sum, c) => sum + c.editsCount, 0))}</h4>
                          <small>Total Edits</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-info text-white h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <Send className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{formatNumber(contentAnalytics.reduce((sum, c) => sum + c.publishCount, 0))}</h4>
                          <small>Publications</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-warning text-white h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <Sparkles className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{aiAnalytics.totalSuggestions}</h4>
                          <small>AI Suggestions</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Info */}
              {session && (
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Current Session</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <div className="d-flex align-items-center mb-2">
                              {getDeviceIcon(session.deviceInfo.deviceType)}
                              <span className="ms-2">{session.deviceInfo.deviceType}</span>
                            </div>
                            <small className="text-muted d-block">Device</small>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center mb-2">
                              <Globe size={16} className="me-2" />
                              <span>{session.deviceInfo.browser}</span>
                            </div>
                            <small className="text-muted d-block">Browser</small>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center mb-2">
                              <Clock size={16} className="me-2" />
                              <span>{formatDuration(session.duration || 0)}</span>
                            </div>
                            <small className="text-muted d-block">Duration</small>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex align-items-center mb-2">
                              <MousePointer size={16} className="me-2" />
                              <span>{session.events.length}</span>
                            </div>
                            <small className="text-muted d-block">Interactions</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content Analytics Tab */}
          {activeTab === 'content' && (
            <div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Content ID</th>
                      <th>Views</th>
                      <th>Edits</th>
                      <th>Publishes</th>
                      <th>Avg. Time</th>
                      <th>Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentAnalytics.map(content => (
                      <tr key={content.contentId}>
                        <td>
                          <code>{content.contentId.substring(0, 8)}...</code>
                        </td>
                        <td>{formatNumber(content.views)}</td>
                        <td>{content.editsCount}</td>
                        <td>{content.publishCount}</td>
                        <td>{formatDuration(content.avgTimeSpent)}</td>
                        <td>{new Date(content.lastModified).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Analytics Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">User Journey</h6>
                    </div>
                    <div className="card-body">
                      {session?.pageViews.map((view, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <small className="text-muted">{new Date(view.timestamp).toLocaleTimeString()}</small>
                            <div className="fw-bold small">{new URL(view.url).pathname}</div>
                          </div>
                          <div className="text-end">
                            <div className="small">{formatDuration(view.timeSpent)}</div>
                            <div className="small text-muted">{view.scrollDepth}% scroll</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Recent Events</h6>
                    </div>
                    <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {filteredEvents.slice(-20).map((event, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                          <div className="me-2">
                            {event.type === 'click' && <MousePointer size={14} />}
                            {event.type === 'content_edit' && <Edit3 size={14} />}
                            {event.type === 'page_view' && <Eye size={14} />}
                            {event.type === 'ai_suggestion' && <Sparkles size={14} />}
                          </div>
                          <div className="flex-grow-1">
                            <small className="fw-bold">{event.type}</small>
                            <div className="small text-muted">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Analytics Tab */}
          {activeTab === 'ai' && (
            <div>
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <Sparkles size={32} className="text-primary mb-2" />
                      <h4>{aiAnalytics.totalSuggestions}</h4>
                      <small className="text-muted">Total Suggestions</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="text-success mb-2">✓</div>
                      <h4>{aiAnalytics.acceptedSuggestions}</h4>
                      <small className="text-muted">Accepted</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <div className="text-warning mb-2">✗</div>
                      <h4>{aiAnalytics.rejectedSuggestions}</h4>
                      <small className="text-muted">Rejected</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <Clock size={32} className="text-info mb-2" />
                      <h4>{Math.round(aiAnalytics.avgResponseTime)}ms</h4>
                      <small className="text-muted">Avg Response</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Suggestion Types</h6>
                    </div>
                    <div className="card-body">
                      {Object.entries(aiAnalytics.suggestionTypes).map(([type, count]) => (
                        <div key={type} className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-capitalize">{type.replace('_', ' ')}</span>
                          <div className="progress flex-grow-1 mx-3" style={{ height: '8px' }}>
                            <div
                              className="progress-bar bg-primary"
                              style={{
                                width: `${(count / aiAnalytics.totalSuggestions) * 100}%`
                              }}
                            />
                          </div>
                          <span className="badge bg-secondary">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
