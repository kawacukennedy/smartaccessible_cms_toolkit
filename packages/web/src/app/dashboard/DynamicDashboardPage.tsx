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

const DynamicDashboardPage: React.FC = () => {
  const recentContent = [
    { id: 1, title: 'Welcome Page', status: 'published', lastModified: '2023-10-01' },
    { id: 2, title: 'About Us', status: 'draft', lastModified: '2023-09-28' },
    { id: 3, title: 'Services', status: 'published', lastModified: '2023-09-25' },
  ];

  const accessibilityScore = 85;
  const aiSuggestions = [
    { id: 1, title: 'Add alt text to image', confidence: 'high' },
    { id: 2, title: 'Improve heading structure', confidence: 'medium' },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Recent Content */}
        <div className="bg-white dark:bg-background_dark rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Recent Content</h3>
          <ul className="space-y-2">
            {recentContent.map(item => (
              <li key={item.id} className="flex justify-between items-center">
                <span className="text-sm">{item.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${item.status === 'published' ? 'bg-success text-white' : 'bg-warning text-white'}`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Accessibility Score */}
        <div className="bg-white dark:bg-background_dark rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Accessibility Score</h3>
          <div className="text-3xl font-bold text-primary mb-2">{accessibilityScore}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${accessibilityScore}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">History graph placeholder</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-background_dark rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-opacity-80">Create</button>
            <button className="w-full px-4 py-2 bg-accent text-white rounded hover:bg-opacity-80">Scan</button>
            <button className="w-full px-4 py-2 bg-success text-white rounded hover:bg-opacity-80">Preview</button>
            <button className="w-full px-4 py-2 bg-danger text-white rounded hover:bg-opacity-80">Deploy</button>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white dark:bg-background_dark rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">AI Suggestions</h3>
          <ul className="space-y-2">
            {aiSuggestions.map(suggestion => (
              <li key={suggestion.id} className="text-sm">
                <div className="flex justify-between">
                  <span>{suggestion.title}</span>
                  <span className={`text-xs px-2 py-1 rounded ${suggestion.confidence === 'high' ? 'bg-success text-white' : 'bg-warning text-white'}`}>
                    {suggestion.confidence}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DynamicDashboardPage;
