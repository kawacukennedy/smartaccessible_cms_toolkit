'use client';

import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [lastSaved, setLastSaved] = useState("Never");
  const environment = process.env.NEXT_PUBLIC_APP_ENV || "Development";
  const buildVersion = process.env.NEXT_PUBLIC_BUILD_HASH || "v1.0.0-alpha";

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-background_light dark:bg-background_dark text-gray-800 dark:text-gray-200 py-2 px-4 flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <span>Last saved: {lastSaved}</span>
        <span className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-xs font-semibold">{environment}</span>
        <span>Build: {buildVersion}</span>
      </div>
      <div className="flex items-center space-x-4">
        <a href="/docs" className="hover:text-primary">Docs</a>
        <a href="/support" className="hover:text-primary">Support</a>
      </div>
    </footer>
  );
};

export default Footer;