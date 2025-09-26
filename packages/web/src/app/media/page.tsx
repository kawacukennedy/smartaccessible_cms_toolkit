'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <button className="btn btn-primary me-2" onClick={onUpload}>Upload</button>
        <div className="btn-group me-2">
          <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Sort</button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" onClick={() => onSort('name')}>Name</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => onSort('date')}>Date</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => onSort('size')}>Size</a></li>
          </ul>
        </div>
        <div className="btn-group">
          <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Filter</button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" onClick={() => onFilter('all')}>All</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => onFilter('images')}>Images</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => onFilter('videos')}>Videos</a></li>
          </ul>
        </div>
      </div>
      <input
        type="text"
        className="form-control w-25"
        placeholder="Search media..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

interface MediaGridProps {
  mediaItems: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ mediaItems, onSelectMedia }) => {
  return (
    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
      {mediaItems.map((item) => (
        <div className="col" key={item.id} onClick={() => onSelectMedia(item)}>
          <div className="card h-100 shadow-sm media-grid-item">
            <img src={item.url} className="card-img-top" alt={item.altText} style={{ height: '150px', objectFit: 'cover' }} />
            <div className="card-body">
              <h6 className="card-title text-truncate">{item.filename}</h6>
              <p className="card-text text-muted"><small>{item.size}</small></p>
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
      <div className="media-preview-panel border-start h-100 p-3 bg-light d-flex align-items-center justify-content-center">
        <p className="text-muted">Select an item to preview</p>
      </div>
    );
  }

  return (
    <div className="media-preview-panel border-start h-100 p-3 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Preview</h5>
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      </div>
      <img src={selectedMedia.url} alt={selectedMedia.altText} className="img-fluid mb-3" />
      <h6>{selectedMedia.filename}</h6>
      <p className="text-muted"><small>Size: {selectedMedia.size}</small></p>
      <div className="mb-3">
        <label htmlFor="altText" className="form-label">Alt Text</label>
        <input
          type="text"
          className="form-control"
          id="altText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-sm btn-warning" onClick={() => onReplace(selectedMedia)}>Replace</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(selectedMedia)}>Delete</button>
        <button className="btn btn-sm btn-info" onClick={() => onEditAlt(selectedMedia, altText)}>Save Alt</button>
      </div>
    </div>
  );
};

const MediaLibraryPage: React.FC = () => {
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
    // In a real app, open file dialog and upload
  };

  const handleSort = (criteria: string) => {
    alert(`Simulating sort by: ${criteria}`);
    // In a real app, sort mediaItems state
  };

  const handleFilter = (criteria: string) => {
    alert(`Simulating filter by: ${criteria}`);
    // In a real app, filter mediaItems state
  };

  const handleSearch = (term: string) => {
    console.log(`Searching for: ${term}`);
    // In a real app, filter mediaItems state based on search term
  };

  const handleReplace = (item: MediaItem) => {
    alert(`Simulating replace for: ${item.filename}`);
    // In a real app, open file dialog and replace
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
    <div className="container-fluid mt-4 h-100">
      <h1 className="mb-4">Media Library</h1>
      <MediaToolbar
        onUpload={handleUpload}
        onSort={handleSort}
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      <div className="row h-100">
        <div className="col-md-9 h-100">
          <MediaGrid mediaItems={mediaItems} onSelectMedia={setSelectedMedia} />
        </div>
        <div className="col-md-3 h-100">
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

export default MediaLibraryPage;
