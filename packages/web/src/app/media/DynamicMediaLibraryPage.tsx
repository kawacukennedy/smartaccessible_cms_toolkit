'use client';

import React, { useState, useEffect } from 'react';
import { Upload, SortAsc, Filter, Search, Replace, Trash2, Edit, X } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  altText: string;
  size: string;
  url: string;
}

interface MediaToolbarProps {
  onUpload: () => void;
  onSort: (criteria: string) => void;
  onFilter: (criteria: string) => void;
  onSearch: (term: string) => void;
}

const MediaToolbar: React.FC<MediaToolbarProps> = ({ onUpload, onSort, onFilter, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-3">
        <button className="flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-opacity-80" onClick={onUpload}>
          <Upload size={18} className="mr-2" /> Upload
        </button>
        <div className="relative">
          <button className="flex items-center px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => onSort('name')}>
            <SortAsc size={18} className="mr-2" /> Sort
          </button>
          {/* Dropdown for sort options */}
        </div>
        <div className="relative">
          <button className="flex items-center px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => onFilter('all')}>
            <Filter size={18} className="mr-2" /> Filter
          </button>
          {/* Dropdown for filter options */}
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          className="w-64 px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-primary focus:border-primary pl-10"
          placeholder="Search media..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

interface MediaGridProps {
  mediaItems: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaItems, onSelectMedia }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaItems.map((item) => (
        <div className="col" key={item.id} onClick={() => onSelectMedia(item)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200">
            <img src={item.url} className="w-full h-40 object-cover" alt={item.altText} />
            <div className="p-3">
              <h6 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.filename}</h6>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.size}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface MediaPreviewPanelProps {
  selectedMedia: MediaItem | null;
  onReplace: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
  onEditAlt: (item: MediaItem, newAlt: string) => void;
  onClose: () => void;
}

const MediaPreviewPanel: React.FC<MediaPreviewPanelProps> = ({ selectedMedia, onReplace, onDelete, onEditAlt, onClose }) => {
  const [altText, setAltText] = useState(selectedMedia?.altText || '');

  useEffect(() => {
    setAltText(selectedMedia?.altText || '');
  }, [selectedMedia]);

  if (!selectedMedia) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Select an item to preview</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-bold text-lg">Preview</h5>
        <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}><X size={20} /></button>
      </div>
      <img src={selectedMedia.url} alt={selectedMedia.altText} className="w-full h-48 object-cover rounded-md mb-4" />
      <h6 className="font-semibold text-gray-900 dark:text-gray-100">{selectedMedia.filename}</h6>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Size: {selectedMedia.size}</p>
      <div className="mb-4">
        <label htmlFor="altText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alt Text</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          id="altText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
      </div>
      <div className="flex justify-between space-x-2 mt-auto">
        <button className="px-3 py-2 rounded-md bg-warning text-white hover:bg-opacity-80 flex-grow" onClick={() => onReplace(selectedMedia)}><Replace size={16} className="inline-block mr-1" /> Replace</button>
        <button className="px-3 py-2 rounded-md bg-error text-white hover:bg-red-700 flex-grow" onClick={() => onDelete(selectedMedia)}><Trash2 size={16} className="inline-block mr-1" /> Delete</button>
        <button className="px-3 py-2 rounded-md bg-info text-white hover:bg-opacity-80 flex-grow" onClick={() => onEditAlt(selectedMedia, altText)}><Edit size={16} className="inline-block mr-1" /> Save Alt</button>
      </div>
    </div>
  );
};

const DynamicMediaLibraryPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: '1', filename: 'image1.jpg', altText: 'A beautiful landscape', size: '1.2 MB', url: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Image1' },
    { id: '2', filename: 'image2.png', altText: 'A serene beach', size: '800 KB', url: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Image2' },
    { id: '3', filename: 'video1.mp4', altText: 'A short video clip', size: '5.5 MB', url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Video1' },
    { id: '4', filename: 'image3.jpeg', altText: 'City skyline', size: '1.5 MB', url: 'https://via.placeholder.com/150/FFFF00/000000?text=Image3' },
    { id: '5', filename: 'image4.gif', altText: 'Animated GIF', size: '300 KB', url: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Image4' },
  ]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const handleUpload = () => {
    alert('Simulating upload...');
  };

  const handleSort = (criteria: string) => {
    alert(`Simulating sort by: ${criteria}`);
  };

  const handleFilter = (criteria: string) => {
    alert(`Simulating filter by: ${criteria}`);
  };

  const handleSearch = (term: string) => {
    console.log(`Searching for: ${term}`);
  };

  const handleReplace = (item: MediaItem) => {
    alert(`Simulating replace for: ${item.filename}`);
  };

  const handleDelete = (item: MediaItem) => {
    if (confirm(`Are you sure you want to delete ${item.filename}?`)) {
      setMediaItems(mediaItems.filter(media => media.id !== item.id));
      setSelectedMedia(null);
      alert(`${item.filename} deleted.`);
    }
  };

  const handleEditAlt = (item: MediaItem, newAlt: string) => {
    setMediaItems(mediaItems.map(media => media.id === item.id ? { ...media, altText: newAlt } : media));
    alert(`Alt text for ${item.filename} updated to: ${newAlt}`);
  };

  return (
    <div className="container mx-auto mt-4 p-4 h-full">
      <h1 className="text-3xl font-bold mb-6">Media Library</h1>
      <MediaToolbar
        onUpload={handleUpload}
        onSort={handleSort}
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-3/4 pr-4">
          <MediaGrid mediaItems={mediaItems} onSelectMedia={setSelectedMedia} />
        </div>
        <div className="w-full md:w-1/4 pl-4">
          <MediaPreviewPanel
            selectedMedia={selectedMedia}
            onReplace={handleReplace}
            onDelete={handleDelete}
            onEditAlt={handleEditAlt}
            onClose={() => setSelectedMedia(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicMediaLibraryPage;
