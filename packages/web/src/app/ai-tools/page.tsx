'use client';

import React from 'react';
import Link from 'next/link';

const AiToolsPage: React.FC = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">AI Tools</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">AI Content Suggestions</h5>
              <p className="card-text">Get intelligent suggestions to improve your content.</p>
              <Link href="/content-editor" className="btn btn-primary">Go to Content Editor</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Accessibility Audit</h5>
              <p className="card-text">Analyze your content for accessibility compliance.</p>
              <Link href="/accessibility-audit" className="btn btn-primary">Run Audit</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Content Variations</h5>
              <p className="card-text">Generate multiple variations of your content for A/B testing.</p>
              <Link href="/content-variations" className="btn btn-primary">Generate Variations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiToolsPage;
