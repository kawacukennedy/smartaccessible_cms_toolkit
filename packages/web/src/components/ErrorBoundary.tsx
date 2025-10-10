'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In a real application, send error to monitoring service
    this.logErrorToService(error, errorInfo);

    this.setState({
      errorInfo
    });
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    const errorReport = {
      id: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundary'
    };

    // Store in localStorage for debugging (in production, send to service)
    try {
      const existingErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingErrors.push(errorReport);
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      localStorage.setItem('errorLogs', JSON.stringify(existingErrors));
    } catch (e) {
      console.warn('Failed to store error log:', e);
    }

    // In a real app, you would send this to your error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    console.log('Error Report:', errorReport);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: ''
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const errorDetails = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n` +
      `Error: ${this.state.error?.message}\n` +
      `URL: ${window.location.href}\n` +
      `User Agent: ${navigator.userAgent}\n` +
      `Timestamp: ${new Date().toISOString()}`
    );

    // In a real app, this would open a bug report form or send to issue tracker
    window.open(`mailto:support@example.com?subject=Bug Report&body=${errorDetails}`, '_blank');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary d-flex align-items-center justify-content-center min-vh-100 bg-light">
          <div className="text-center p-4">
            <div className="mb-4">
              <AlertTriangle size={64} className="text-danger" />
            </div>

            <h1 className="h3 mb-3 text-dark">Oops! Something went wrong</h1>

            <p className="text-muted mb-4 max-w-md mx-auto">
              We encountered an unexpected error. Our team has been notified and is working to fix it.
            </p>

            <div className="error-details bg-white rounded p-3 mb-4 shadow-sm border">
              <h6 className="text-danger mb-2">Error Details</h6>
              <small className="text-muted d-block mb-1">
                <strong>Error ID:</strong> {this.state.errorId}
              </small>
              <small className="text-muted d-block mb-1">
                <strong>Message:</strong> {this.state.error?.message || 'Unknown error'}
              </small>
              <small className="text-muted d-block">
                <strong>Time:</strong> {new Date().toLocaleString()}
              </small>
            </div>

            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={this.handleRetry}
              >
                <RefreshCw size={16} className="me-2" />
                Try Again
              </button>

              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={this.handleGoHome}
              >
                <Home size={16} className="me-2" />
                Go Home
              </button>

              <button
                className="btn btn-outline-info d-flex align-items-center"
                onClick={this.handleReportBug}
              >
                <Bug size={16} className="me-2" />
                Report Bug
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-left">
                <summary className="text-muted small cursor-pointer">
                  Technical Details (Development Only)
                </summary>
                <pre className="mt-2 p-3 bg-dark text-light rounded small text-start overflow-auto" style={{ maxHeight: '200px' }}>
                  {this.state.error?.stack}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;