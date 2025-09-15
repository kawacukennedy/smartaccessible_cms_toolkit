'use client';

import { useTranslation } from 'react-i18next';
import React from 'react'; // Import React

// Placeholder for MetricsGrid component
const MetricsGrid: React.FC = () => {
  return (
    <div className="row mb-4">
      <div className="col-12 col-md-6 col-lg-4 mb-3"> {/* Adjusted responsive classes */}
        <div className="card shadow-sm h-100 dashboard-card"> {/* Added dashboard-card class */}
          <div className="card-body">
            <h5 className="card-title">Total Articles</h5>
            <p className="card-text fs-2">256</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-4 mb-3"> {/* Adjusted responsive classes */}
        <div className="card shadow-sm h-100 dashboard-card"> {/* Added dashboard-card class */}
          <div className="card-body">
            <h5 className="card-title">AI Suggestions Applied</h5>
            <p className="card-text fs-2">87%</p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-4 mb-3"> {/* Adjusted responsive classes */}
        <div className="card shadow-sm h-100 dashboard-card"> {/* Added dashboard-card class */}
          <div className="card-body">
            <h5 className="card-title">Accessibility Score</h5>
            <p className="card-text fs-2">92</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder for ActivityFeed component
const ActivityFeed: React.FC = () => {
  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5>Recent Activity</h5>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>Alice</strong> Published Article
          </div>
          <small className="text-muted">2h ago</small>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>Bob</strong> Applied AI Suggestion
          </div>
          <small className="text-muted">4h ago</small>
        </li>
      </ul>
    </div>
  );
};


export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      <h1 className="mb-4">{t('dashboard')}</h1> {/* Changed to dashboard and added margin */}
      <MetricsGrid />
      <ActivityFeed />
    </main>
  );
}
