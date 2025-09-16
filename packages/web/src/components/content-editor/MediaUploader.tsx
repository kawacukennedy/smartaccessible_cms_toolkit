import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext'; // Import useNotifications

const MediaUploader: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const { addNotification } = useNotifications();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadStatus('uploading');
      addNotification({ displayType: 'toast', style: 'info', message: `Uploading ${files.length} file(s)...` });

      // Simulate file upload
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        if (success) {
          setUploadStatus('success');
          addNotification({ displayType: 'toast', style: 'success', message: `Successfully uploaded ${files.length} file(s)!` });
        } else {
          setUploadStatus('failed');
          addNotification({ displayType: 'toast', style: 'error', message: `Failed to upload file(s). Retry?` });
        }
        setTimeout(() => setUploadStatus('idle'), 3000); // Reset status after 3 seconds
      }, 2000); // Simulate upload delay
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="mediaUpload" className="form-label">Media Uploader</label>
      <input
        className="form-control"
        type="file"
        id="mediaUpload"
        onChange={handleFileUpload}
        aria-label="Upload media files"
        multiple // Allow multiple file selection
      />
      {uploadStatus !== 'idle' && (
        <div role="status" aria-live="polite" className="mt-2 text-muted">
          {uploadStatus === 'uploading' && 'Media upload in progress…'}
          {uploadStatus === 'success' && 'Media upload complete.'}
          {uploadStatus === 'failed' && 'Media upload failed. Retry?'}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;