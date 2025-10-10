'use client';

import React from 'react';
import AccessibilityDashboard from '../../components/AccessibilityDashboard';

const DynamicAccessibilityPage: React.FC = () => {
  return (
    <main className="container mx-auto py-8 px-4" id="main-content">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Advanced Accessibility Settings</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Configure comprehensive accessibility features including voice navigation, gesture support,
        and enhanced screen reader compatibility to make the application more accessible to all users.
      </p>

      <AccessibilityDashboard />

      <div className="mt-8 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Accessibility Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300">Voice Navigation</h3>
            <p className="text-blue-600 dark:text-blue-400">Control the app with voice commands</p>
          </div>
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300">Gesture Support</h3>
            <p className="text-blue-600 dark:text-blue-400">Navigate with touch gestures</p>
          </div>
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300">Screen Reader</h3>
            <p className="text-blue-600 dark:text-blue-400">Enhanced compatibility with screen readers</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DynamicAccessibilityPage;
