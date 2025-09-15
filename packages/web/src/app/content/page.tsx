'use client';

import React, { useState, useEffect } from 'react';
import { ContentBlock } from '@/lib/db/schema';
import Link from 'next/link'; // Import Link

interface ContentTableProps {
  contentBlocks: ContentBlock[];
}

const ContentTable: React.FC<ContentTableProps> = ({ contentBlocks }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Locale</th>
            <th>Version</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentBlocks.map((block) => (
            <tr key={block.id}>
              <td>{block.id}</td>
              <td>{block.type}</td>
              <td>{block.locale}</td>
              <td>{block.version}</td>
              <td>
                <Link href={`/content-editor?id=${block.id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                <button className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ContentPage: React.FC = () => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]); // Changed to array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        // Assuming the API returns an array of content blocks
        setContentBlocks(data.contentBlocks || []); // Adjust based on actual API response
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const filteredContentBlocks = contentBlocks.filter(block =>
    block.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    block.locale.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Content Management</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/content-editor" className="btn btn-success">Create New Content</Link>
      </div>
      {filteredContentBlocks.length > 0 ? (
        <ContentTable contentBlocks={filteredContentBlocks} />
      ) : (
        <div className="alert alert-info">No content blocks found.</div>
      )}
    </div>
  );
};

export default ContentPage;
