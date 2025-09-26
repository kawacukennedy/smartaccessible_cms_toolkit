
import React from 'react';

const AccessibilityDashboard = () => {
  // Placeholder data for accessibility issues
  const issues = [
    { id: 1, severity: 'High', description: 'Image missing alt text', fixable: true },
    { id: 2, severity: 'Medium', description: 'Low contrast text', fixable: false },
    { id: 3, severity: 'Low', description: 'Link text is not descriptive', fixable: true },
    { id: 4, severity: 'High', description: 'Form input missing a label', fixable: true },
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
              Bulk Fix All ({issues.filter(i => i.fixable).length})
            </button>
          </div>
        </div>
        <ul className="space-y-3">
          {issues.map(issue => (
            <li key={issue.id} className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm font-semibold ${
                    issue.severity === 'High' ? 'text-red-500' :
                    issue.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {issue.severity} Priority
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{issue.description}</p>
                </div>
                <button className="text-sm text-blue-500 hover:underline">
                  Jump to Content
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityDashboard;
