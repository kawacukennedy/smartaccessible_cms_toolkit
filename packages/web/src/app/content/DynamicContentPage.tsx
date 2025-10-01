'use client';

import React, { useState, useEffect } from 'react';
import { ContentBlock } from '@/lib/db/schema';
import Link from 'next/link';

interface ContentTableProps {
  contentBlocks: ContentBlock[];
}

const ContentTable: React.FC<ContentTableProps> = ({ contentBlocks }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">ID</th>
            <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
            <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Locale</th>
            <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Version</th>
            <th className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentBlocks.map((block) => (
            <tr key={block.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">{block.id}</td>
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">{block.type}</td>
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">{block.locale}</td>
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">{block.version}</td>
              <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                <Link href={`/content-editor?id=${block.id}`} className="px-3 py-1 rounded-md bg-primary text-white hover:bg-opacity-80 mr-2">Edit</Link>
                <button className="px-3 py-1 rounded-md bg-error text-white hover:bg-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DynamicContentPage: React.FC = () => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        setContentBlocks(data.contentBlocks || []);
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
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-4 p-4">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          className="w-1/3 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Search content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/content-editor" className="px-4 py-2 rounded-md bg-success text-white hover:bg-opacity-80">Create New Content</Link>
      </div>
      {filteredContentBlocks.length > 0 ? (
        <ContentTable contentBlocks={filteredContentBlocks} />
      ) : (
        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-md" role="alert">No content blocks found.</div>
      )}
    </div>
  );
};

export default DynamicContentPage;
