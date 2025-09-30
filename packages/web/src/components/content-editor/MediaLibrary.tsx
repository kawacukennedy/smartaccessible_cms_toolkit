import React, { useState, useCallback } from 'react';
import MediaUploader from './MediaUploader';
import { trackEvent } from '@/lib/telemetry';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  status: 'uploaded' | 'generating-alt' | 'alt-generated' | 'failed';
}

const MediaLibrary = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: '1', name: 'image1.jpg', url: '/images/image1.jpg', altText: 'A placeholder image', status: 'uploaded' },
    { id: '2', name: 'image2.png', url: '/images/image2.png', altText: 'Another placeholder image', status: 'uploaded' },
  ]);

  const handleUploadComplete = useCallback((uploadedFile: { id: string; name: string; altText?: string; }) => {
    const newMediaItem: MediaItem = {
      id: uploadedFile.id,
      name: uploadedFile.name,
      url: `/uploads/${uploadedFile.name}`, // Simulate URL
      altText: uploadedFile.altText || '',
      status: 'uploaded',
    };
    setMediaItems(prev => [...prev, newMediaItem]);
    trackEvent('media_upload', { fileName: uploadedFile.name, status: 'success' });
  }, []);

  const handleGenerateAltText = useCallback((id: string) => {
    setMediaItems(prev => prev.map(item => item.id === id ? { ...item, status: 'generating-alt' } : item));
    // Simulate AI alt text generation
    setTimeout(() => {
      setMediaItems(prev => prev.map(item => {
        if (item.id === id) {
          const generatedAltText = `AI-generated alt text for ${item.name}`;
          trackEvent('ai_applied', { type: 'alt_text', mediaId: item.id });
          return { ...item, altText: generatedAltText, status: 'alt-generated' };
        }
        return item;
      }));
    }, 1500);
  }, []);

  return (
    <div className="card h-100">
      <div className="card-header">
        <h2 className="card-title">Media Library</h2>
      </div>
      <div className="card-body overflow-auto">
        <MediaUploader onUploadComplete={handleUploadComplete} />

        <h5 className="mt-4">Your Media</h5>
        {mediaItems.length === 0 ? (
          <p>No media items yet. Upload some!</p>
        ) : (
          <div className="row row-cols-3 g-3">
            {mediaItems.map(item => (
              <div key={item.id} className="col">
                <div className="card h-100">
                  <img src={item.url} className="card-img-top" alt={item.altText || item.name} style={{ height: '100px', objectFit: 'cover' }} />
                  <div className="card-body p-2">
                    <p className="card-text text-truncate"><small>{item.name}</small></p>
                    {item.status === 'uploaded' && (
                      <button className="btn btn-sm btn-outline-primary w-100" onClick={() => handleGenerateAltText(item.id)}>
                        Generate AI Alt Text
                      </button>
                    )}
                    {item.status === 'generating-alt' && (
                      <span className="badge bg-info w-100">Generating Alt Text...</span>
                    )}
                    {item.status === 'alt-generated' && (
                      <p className="text-muted text-sm mt-1">Alt: {item.altText}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
