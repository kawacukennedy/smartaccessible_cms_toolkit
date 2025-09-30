'use client';

import React from 'react';

const Footer: React.FC = () => {
  // Placeholder for dynamic content
  const lastSaved = "Just now";
  const environment = "Development";
  const buildVersion = "v1.0.0-alpha";

  return (
    <footer className="app-footer bg-light text-dark mt-auto py-2 px-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <span className="me-3">Last saved: {lastSaved}</span>
        <span className="badge bg-secondary me-3">{environment}</span>
        <span className="text-muted">Build: {buildVersion}</span>
      </div>
      <div>
        <a href="#" className="text-dark me-3">Docs</a>
        <a href="#" className="text-dark">Support</a>
      </div>
      {/* ARIA live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        className="visually-hidden"
      ></div>
    </footer>
  );
};

export default Footer;
