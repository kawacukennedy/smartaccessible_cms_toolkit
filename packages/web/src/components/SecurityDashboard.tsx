'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Users,
  Activity,
  Lock,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { auditLogger, AccessControl, type Permission, type Role } from '@/lib/security';

interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  activeUsers: number;
  failedLogins: number;
  auditLogsCount: number;
}

const SecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalRequests: 0,
    blockedRequests: 0,
    activeUsers: 0,
    failedLogins: 0,
    auditLogsCount: 0
  });

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role>('viewer');
  const [activeTab, setActiveTab] = useState<'overview' | 'rbac' | 'audit'>('overview');

  useEffect(() => {
    // Load security metrics (mock data for demonstration)
    setMetrics({
      totalRequests: 15420,
      blockedRequests: 127,
      activeUsers: 45,
      failedLogins: 8,
      auditLogsCount: auditLogger.getLogs().length
    });

    // Load recent audit logs
    const recentLogs = auditLogger.getLogs().slice(0, 50);
    setAuditLogs(recentLogs);
  }, []);

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'publisher': return 'bg-warning';
      case 'editor': return 'bg-info';
      case 'viewer': return 'bg-secondary';
      default: return 'bg-light';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <Lock size={16} />;
    if (action.includes('create') || action.includes('update')) return <CheckCircle size={16} />;
    if (action.includes('delete')) return <XCircle size={16} />;
    if (action.includes('rate_limit')) return <Ban size={16} />;
    return <Activity size={16} />;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="security-dashboard">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0 d-flex align-items-center">
            <Shield className="me-2" />
            Security Dashboard
          </h5>
        </div>

        <div className="card-body">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Activity size={14} className="me-1" />
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'rbac' ? 'active' : ''}`}
                onClick={() => setActiveTab('rbac')}
              >
                <Users size={14} className="me-1" />
                RBAC
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveTab('audit')}
              >
                <Eye size={14} className="me-1" />
                Audit Logs
              </button>
            </li>
          </ul>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <Activity className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{metrics.totalRequests.toLocaleString()}</h4>
                          <small>Total Requests</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-danger text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <Ban className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{metrics.blockedRequests}</h4>
                          <small>Blocked Requests</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <Users className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{metrics.activeUsers}</h4>
                          <small>Active Users</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <AlertTriangle className="me-3" size={24} />
                        <div>
                          <h4 className="mb-0">{metrics.failedLogins}</h4>
                          <small>Failed Logins</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Security Status</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <CheckCircle className="text-success me-2" size={20} />
                        <span>Rate limiting active</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <CheckCircle className="text-success me-2" size={20} />
                        <span>Input validation enabled</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <CheckCircle className="text-success me-2" size={20} />
                        <span>Audit logging active</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <CheckCircle className="text-success me-2" size={20} />
                        <span>RBAC system enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RBAC Tab */}
          {activeTab === 'rbac' && (
            <div>
              <div className="mb-4">
                <h6>Role-Based Access Control</h6>
                <p className="text-muted">Configure permissions for different user roles</p>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-header">
                      <select
                        className="form-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as Role)}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="publisher">Publisher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="card-body">
                      <h6 className={`badge ${getRoleColor(selectedRole)} mb-3`}>
                        {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                      </h6>
                      <div className="permissions-list">
                        {AccessControl.getRolePermissions(selectedRole).map((permission, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <CheckCircle className="text-success me-2" size={14} />
                            <small>{permission}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Permission Matrix</h6>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Permission</th>
                              <th>Viewer</th>
                              <th>Editor</th>
                              <th>Publisher</th>
                              <th>Admin</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              'content:read',
                              'content:create',
                              'content:update',
                              'content:publish',
                              'content:delete',
                              'media:upload',
                              'media:delete',
                              'user:manage',
                              'admin:full_access'
                            ].map(permission => (
                              <tr key={permission}>
                                <td><small>{permission}</small></td>
                                {(['viewer', 'editor', 'publisher', 'admin'] as Role[]).map(role => (
                                  <td key={role} className="text-center">
                                    {AccessControl.hasPermission(role, permission as Permission) ? (
                                      <CheckCircle className="text-success" size={14} />
                                    ) : (
                                      <XCircle className="text-muted" size={14} />
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Audit Logs ({auditLogs.length})</h6>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    const dataStr = auditLogger.exportLogs();
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                >
                  Export Logs
                </button>
              </div>

              <div className="audit-logs" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {auditLogs.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <Eye size={48} className="mb-3 opacity-50" />
                    <p>No audit logs available</p>
                  </div>
                ) : (
                  <div className="list-group">
                    {auditLogs.map(log => (
                      <div key={log.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                              {getActionIcon(log.action)}
                              <strong className="ms-2">{log.action}</strong>
                              <small className="text-muted ms-2">
                                {log.resource}
                              </small>
                            </div>
                            <div className="d-flex align-items-center text-muted small">
                              <Clock size={12} className="me-1" />
                              {formatTimestamp(log.timestamp)}
                              {log.userId && (
                                <>
                                  <span className="mx-2">•</span>
                                  User: {log.userId}
                                </>
                              )}
                              {log.ipAddress && (
                                <>
                                  <span className="mx-2">•</span>
                                  IP: {log.ipAddress}
                                </>
                              )}
                            </div>
                            {log.details && (
                              <div className="mt-2">
                                <details>
                                  <summary className="small text-muted">Details</summary>
                                  <pre className="small mt-1 bg-light p-2 rounded">
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </details>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;