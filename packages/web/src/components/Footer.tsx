'use client';

import React from 'react';

const Footer: React.FC = () => {
  // These would typically come from a global state, context, or build process
  const [lastSaved, setLastSaved] = useState("Never");
  const environment = process.env.NEXT_PUBLIC_APP_ENV || "Development"; // Example: get from environment variable
  const buildVersion = process.env.NEXT_PUBLIC_BUILD_HASH || "v1.0.0-alpha"; // Example: get from environment variable

  // Simulate auto-updating last saved timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would listen to save events
      setLastSaved(new Date().toLocaleTimeString());
    }, 30000); // Update every 30 seconds for demonstration
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="app-footer bg-light text-dark mt-auto py-2 px-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <span className="me-3">Last saved: {lastSaved}</span>
        <span className="badge bg-secondary me-3">{environment}</span>
        <span className="text-muted">Build: {buildVersion}</span>
      </div>
      <div>
        <a href="/docs" className="text-dark me-3">Docs</a>
        <a href="/support" className="text-dark">Support</a>
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
