
import React from 'react';

const AccessibilityDashboard = () => {
  // Placeholder data for accessibility issues
  const issues = [
    {
      id: 'issue_1',
      severity: 'critical',
      rule: 'WCAG 2.1 AA 1.1.1',
      description: 'Image missing alternative text',
      selector: 'block_1',
      suggested_fix: { type: 'ai', payload: {} },
      status: 'open',
    },
    {
      id: 'issue_2',
      severity: 'high',
      rule: 'WCAG 2.1 AA 1.4.3',
      description: 'Text contrast below threshold',
      selector: 'block_2',
      suggested_fix: { type: 'rule_based', payload: {} },
      status: 'open',
    },
    {
      id: 'issue_3',
      severity: 'medium',
      rule: 'WCAG 2.1 AA 2.4.6',
      description: 'Heading structure not logical',
      selector: 'block_3',
      suggested_fix: { type: 'ai', payload: {} },
      status: 'open',
    },
  ];

  const aiScore = 78; // Placeholder AI Score

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Accessibility Dashboard</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">AI Score: <span className="font-bold text-blue-500">{aiScore}%</span></p>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Prioritize by Severity
            </button>
            <button className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
              Bulk Fix All
            </button>
          </div>
        </div>
        <ul className="space-y-3">
          {issues.map(issue => (
            <li key={issue.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm font-semibold ${
                    issue.severity === 'critical' ? 'text-red-600' :
                    issue.severity === 'high' ? 'text-red-500' :
                    issue.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {issue.severity.toUpperCase()} - {issue.rule}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{issue.description}</p>
                  <p className="text-xs text-gray-500">Selector: {issue.selector}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm text-blue-500 hover:underline">
                    Fix
                  </button>
                  <button className="text-sm text-gray-500 hover:underline">
                    Ignore
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityDashboard;
