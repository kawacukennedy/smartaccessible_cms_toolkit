'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Search,
  Filter,
  Tag,
  Download,
  Trash2,
  Edit3,
  CheckSquare,
  Square,
  Grid,
  List,
  MoreVertical,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Settings,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { mediaProcessor, processMediaBatch, searchMediaFiles, bulkTagMedia } from '@/lib/mediaProcessor';
import { trackEvent } from '@/lib/telemetry';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  metadata: any;
  tags: string[];
  altText?: string;
  thumbnail?: string;
  processed: boolean;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  processingErrors?: string[];
}

const AdvancedMediaLibrary: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '' as '' | 'image' | 'video' | 'audio' | 'document',
    tags: [] as string[],
    processed: '' as '' | 'processed' | 'unprocessed'
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [processingBatch, setProcessingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    total: number;
    completed: number;
    failed: number;
  } | null>(null);

  // Load media files (mock data for demonstration)
  useEffect(() => {
    const mockFiles: MediaFile[] = [
      {
        id: '1',
        name: 'hero-banner.jpg',
        url: '/media/hero-banner.jpg',
        type: 'image',
        size: 2048000,
        metadata: { width: 1920, height: 1080, format: 'jpg' },
        tags: ['hero', 'banner', 'landscape', 'high-resolution'],
        altText: 'Hero banner image for website',
        thumbnail: '/media/hero-banner_thumb.jpg',
        processed: true,
        processingStatus: 'completed'
      },
      {
        id: '2',
        name: 'product-demo.mp4',
        url: '/media/product-demo.mp4',
        type: 'video',
        size: 15728640,
        metadata: { duration: 120, format: 'mp4', width: 1920, height: 1080 },
        tags: ['product', 'demo', 'video', 'multimedia'],
        processed: true,
        processingStatus: 'completed'
      },
      {
        id: '3',
        name: 'background-music.mp3',
        url: '/media/background-music.mp3',
        type: 'audio',
        size: 5242880,
        metadata: { duration: 180, format: 'mp3', bitrate: 320 },
        tags: ['music', 'background', 'audio', 'multimedia'],
        processed: false,
        processingStatus: 'pending'
      }
    ];
    setMediaFiles(mockFiles);
  }, []);

  const handleFileSelect = useCallback((fileId: string, selected: boolean) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(fileId);
      } else {
        newSet.delete(fileId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  }, [selectedFiles, mediaFiles]);

  const handleBatchProcess = useCallback(async () => {
    const filesToProcess = mediaFiles.filter(f => selectedFiles.has(f.id));
    if (filesToProcess.length === 0) return;

    setProcessingBatch(true);
    setBatchProgress({ total: filesToProcess.length, completed: 0, failed: 0 });

    try {
      const result = await processMediaBatch(filesToProcess, {
        generateThumbnails: true,
        optimizeImages: true,
        extractMetadata: true,
        generateAltText: true,
        smartTagging: true,
        ocrText: true,
        transcription: true,
        compressionLevel: 'medium'
      });

      setBatchProgress({
        total: result.totalFiles,
        completed: result.processedFiles,
        failed: result.failedFiles
      });

      // Update files with processed data
      setMediaFiles(prev => prev.map(file => {
        const processedFile = filesToProcess.find(f => f.id === file.id);
        return processedFile || file;
      }));

      trackEvent('batch_processing_completed', {
        totalFiles: result.totalFiles,
        processedFiles: result.processedFiles,
        sizeReduction: result.totalSizeReduction
      });

    } catch (error) {
      console.error('Batch processing failed:', error);
      trackEvent('batch_processing_failed', { error: (error as Error).message });
    } finally {
      setProcessingBatch(false);
      setTimeout(() => setBatchProgress(null), 3000);
    }
  }, [selectedFiles, mediaFiles]);

  const handleBulkTag = useCallback(async () => {
    const filesToTag = mediaFiles.filter(f => selectedFiles.has(f.id));
    const newTags = prompt('Enter tags (comma-separated):');
    if (!newTags) return;

    const tags = newTags.split(',').map(t => t.trim()).filter(t => t);
    await bulkTagMedia(filesToTag, tags);

    setMediaFiles(prev => prev.map(file => {
      if (selectedFiles.has(file.id)) {
        return { ...file, tags: [...new Set([...file.tags, ...tags])] };
      }
      return file;
    }));

    trackEvent('bulk_tagging_completed', { fileCount: filesToTag.length, tags });
  }, [selectedFiles, mediaFiles]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      // Reset to all files
      return;
    }

    try {
      const results = await searchMediaFiles(searchQuery, {
        type: filters.type || undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined
      });
      setMediaFiles(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [searchQuery, filters]);

  const filteredFiles = mediaFiles.filter(file => {
    if (filters.type && file.type !== filters.type) return false;
    if (filters.processed === 'processed' && !file.processed) return false;
    if (filters.processed === 'unprocessed' && file.processed) return false;
    if (filters.tags.length > 0 && !filters.tags.every(tag => file.tags.includes(tag))) return false;
    return true;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} />;
      case 'video': return <Video size={20} />;
      case 'audio': return <Music size={20} />;
      case 'document': return <FileText size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="advanced-media-library">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Advanced Media Library</h5>
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Search and Filters */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search media files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-secondary" onClick={handleSearch}>
                  <Search size={16} />
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm"
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="document">Documents</option>
                </select>
                <select
                  className="form-select form-select-sm"
                  value={filters.processed}
                  onChange={(e) => setFilters(prev => ({ ...prev, processed: e.target.value as any }))}
                >
                  <option value="">All Files</option>
                  <option value="processed">Processed</option>
                  <option value="unprocessed">Unprocessed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.size > 0 && (
            <div className="alert alert-info d-flex justify-content-between align-items-center">
              <span>{selectedFiles.size} files selected</span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleBatchProcess}
                  disabled={processingBatch}
                >
                  {processingBatch ? 'Processing...' : 'Batch Process'}
                </button>
                <button className="btn btn-sm btn-secondary" onClick={handleBulkTag}>
                  <Tag size={14} className="me-1" />
                  Bulk Tag
                </button>
                <button className="btn btn-sm btn-danger">
                  <Trash2 size={14} className="me-1" />
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Batch Progress */}
          {batchProgress && (
            <div className="alert alert-info">
              <div className="d-flex justify-content-between mb-2">
                <span>Processing batch...</span>
                <span>{batchProgress.completed + batchProgress.failed}/{batchProgress.total}</span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${(batchProgress.completed / batchProgress.total) * 100}%` }}
                />
                <div
                  className="progress-bar bg-danger"
                  style={{ width: `${(batchProgress.failed / batchProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Media Files Display */}
          {viewMode === 'grid' ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
              {filteredFiles.map(file => (
                <div key={file.id} className="col">
                  <div className={`card h-100 ${selectedFiles.has(file.id) ? 'border-primary' : ''}`}>
                    <div className="card-body p-3">
                      <div className="d-flex align-items-start mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input me-2 mt-1"
                          checked={selectedFiles.has(file.id)}
                          onChange={(e) => handleFileSelect(file.id, e.target.checked)}
                        />
                        <div className="flex-grow-1">
                          {getFileIcon(file.type)}
                          <h6 className="card-title mb-1 text-truncate" title={file.name}>
                            {file.name}
                          </h6>
                        </div>
                      </div>

                      {file.thumbnail && (
                        <div className="text-center mb-2">
                          <img
                            src={file.thumbnail}
                            alt={file.altText || file.name}
                            className="img-thumbnail"
                            style={{ maxHeight: '100px', maxWidth: '100%' }}
                          />
                        </div>
                      )}

                      <div className="small text-muted mb-2">
                        <div>{formatFileSize(file.size)}</div>
                        {file.metadata.width && file.metadata.height && (
                          <div>{file.metadata.width} × {file.metadata.height}</div>
                        )}
                        {file.metadata.duration && (
                          <div>{Math.round(file.metadata.duration / 60)}:{(file.metadata.duration % 60).toString().padStart(2, '0')}</div>
                        )}
                      </div>

                      <div className="mb-2">
                        {file.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="badge bg-secondary me-1 mb-1">
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 3 && (
                          <span className="badge bg-light text-dark">+{file.tags.length - 3}</span>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${
                          file.processingStatus === 'completed' ? 'bg-success' :
                          file.processingStatus === 'processing' ? 'bg-warning' :
                          file.processingStatus === 'failed' ? 'bg-danger' : 'bg-secondary'
                        }`}>
                          {file.processingStatus}
                        </span>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            <MoreVertical size={14} />
                          </button>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href={file.url} target="_blank" rel="noopener noreferrer">
                              <Download size={14} className="me-2" />
                              Download
                            </a></li>
                            <li><a className="dropdown-item" href="#">
                              <Edit3 size={14} className="me-2" />
                              Edit
                            </a></li>
                            <li><a className="dropdown-item text-danger" href="#">
                              <Trash2 size={14} className="me-2" />
                              Delete
                            </a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Tags</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(file => (
                    <tr key={file.id} className={selectedFiles.has(file.id) ? 'table-active' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedFiles.has(file.id)}
                          onChange={(e) => handleFileSelect(file.id, e.target.checked)}
                        />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getFileIcon(file.type)}
                          <span className="ms-2">{file.name}</span>
                        </div>
                      </td>
                      <td><span className="text-capitalize">{file.type}</span></td>
                      <td>{formatFileSize(file.size)}</td>
                      <td>
                        {file.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="badge bg-secondary me-1">
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 2 && (
                          <span className="badge bg-light text-dark">+{file.tags.length - 2}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          file.processingStatus === 'completed' ? 'bg-success' :
                          file.processingStatus === 'processing' ? 'bg-warning' :
                          file.processingStatus === 'failed' ? 'bg-danger' : 'bg-secondary'
                        }`}>
                          {file.processingStatus}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-secondary">
                            <Download size={14} />
                          </button>
                          <button className="btn btn-outline-secondary">
                            <Edit3 size={14} />
                          </button>
                          <button className="btn btn-outline-danger">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="text-center py-5">
              <Upload size={48} className="text-muted mb-3" />
              <h5>No media files found</h5>
              <p className="text-muted">Upload some files or adjust your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedMediaLibrary;