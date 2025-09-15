'use client';

import React, { useState, useEffect } from 'react';
import { ContentBlock } from '@/lib/db/schema';

const ContentPage: React.FC = () => {
  const [contentBlock, setContentBlock] = useState<ContentBlock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        setContentBlock(data.sample);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contentBlock) {
    return <div>No content found.</div>;
  }

  return (
    <div>
      <h1>Content Block</h1>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{contentBlock.type}</h5>
          <p className="card-text">Locale: {contentBlock.locale}</p>
          <p className="card-text">Version: {contentBlock.version}</p>
          <pre>{JSON.stringify(contentBlock.content, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
