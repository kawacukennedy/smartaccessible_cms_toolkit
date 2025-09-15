import React from 'react';

const SEOPanel: React.FC = () => {
  return (
    <div>
      <h5>SEO Metadata</h5>
      <div className="mb-3">
        <label htmlFor="seoTitle" className="form-label">Title</label>
        <input type="text" className="form-control" id="seoTitle" />
      </div>
      <div className="mb-3">
        <label htmlFor="seoDescription" className="form-label">Description</label>
        <textarea className="form-control" id="seoDescription" rows={3}></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="seoKeywords" className="form-label">Keywords</label>
        <input type="text" className="form-control" id="seoKeywords" />
      </div>
    </div>
  );
};

export default SEOPanel;
