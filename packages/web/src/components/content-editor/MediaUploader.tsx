import React, { useState, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { trackEvent } from '@/lib/telemetry';

export interface MediaUploaderProps {
  onUploadComplete: (file: { id: string; name: string; altText?: string; }) => void;
}

interface UploadableFile {
  file: File;
  id: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'success' | 'failed' | 'generating-alt' | 'alt-generated';
  altText?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete }) => {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const { addNotification } = useNotifications();

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadableFile[] = Array.from(fileList).map(file => ({
      file,
      id: `${file.name}-${Date.now()}`,
      progress: 0,
      status: 'pending',
    }));

    // Validation
    const validFiles = newFiles.filter(f => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm'];
      if (!allowedTypes.includes(f.file.type)) {
        addNotification({ displayType: 'toast', style: 'error', message: `${f.file.name} has invalid type.` });
        return false;
      }
      if (f.file.size > 50 * 1024 * 1024) { // 50MB limit
        addNotification({ displayType: 'toast', style: 'error', message: `${f.file.name} is too large.` });
        return false;
      }
      return true;
    });

    if (validFiles.length > 20) {
      addNotification({ displayType: 'toast', style: 'error', message: 'Maximum 20 files at once.' });
      validFiles.splice(20);
    }

    setFiles(prev => [...prev, ...validFiles]);
    validFiles.forEach(simulateUpload);
  };

  const simulateUpload = (uploadableFile: UploadableFile) => {
    setFiles(prev => prev.map(f => f.id === uploadableFile.id ? { ...f, status: 'uploading' } : f));

    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === uploadableFile.id && f.progress < 100) {
          return { ...f, progress: f.progress + 10 };
        }
        return f;
      }));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      const success = Math.random() > 0.2;
      setFiles(prev => prev.map(f => {
        if (f.id === uploadableFile.id) {
          const updatedFile = { ...f, progress: 100, status: (success ? 'success' : 'failed') as UploadableFile['status'] };
          if (success) {
            onUploadComplete({ id: updatedFile.id, name: updatedFile.file.name, altText: updatedFile.altText });
          }
          return updatedFile;
        }
        return f;
      }));
      addNotification({ displayType: 'toast', style: success ? 'success' : 'error', message: `${uploadableFile.file.name} ${success ? 'uploaded' : 'failed'}.` });
    }, 2200);
  };

  const handleGenerateAltText = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'generating-alt' } : f));
    addNotification({ displayType: 'toast', style: 'info', message: `Generating alt text...` });

    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return { ...f, status: 'alt-generated', altText: `A descriptive alt text for ${f.file.name}` };
        }
        return f;
      }));
      addNotification({ displayType: 'toast', style: 'success', message: `Alt text generated.` });
    }, 1500);
  };

  const handleAltTextChange = (fileId: string, altText: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, altText } : f));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    handleFiles(e.dataTransfer.files);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        const fileList = { length: files.length, item: (i: number) => files[i] } as FileList;
        handleFiles(fileList);
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className="mb-3">
      <div
        className="border-dashed p-4 text-center mb-3"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{ borderWidth: '2px' }}
      >
        <p>Drag & drop files here, or click to select files</p>
        <input
          type="file"
          id="mediaUpload"
          multiple
          onChange={onFileChange}
          className="d-none"
        />
        <label htmlFor="mediaUpload" className="btn btn-outline-primary">Browse Files</label>
      </div>
      {files.length > 0 && (
        <div>
          <h6>Uploads</h6>
          {files.map(f => (
            <div key={f.id} className="mb-2">
              <div className="d-flex justify-content-between">
                <span className="text-truncate" style={{ maxWidth: '70%' }}>{f.file.name}</span>
                <span>{f.status}</span>
              </div>
              <div className="progress mb-2">
                <div
                  className={`progress-bar ${f.status === 'success' || f.status === 'alt-generated' ? 'bg-success' : f.status === 'failed' ? 'bg-danger' : ''}`}
                  role="progressbar"
                  style={{ width: `${f.progress}%` }}
                  aria-valuenow={f.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              {f.status === 'success' && (
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleGenerateAltText(f.id)}>Generate Alt Text</button>
              )}
              {(f.status === 'alt-generated' || f.altText) && (
                <input
                  type="text"
                  className="form-control form-control-sm mt-2"
                  value={f.altText || ''}
                  onChange={(e) => handleAltTextChange(e.target.value, f.id)}
                  placeholder="Generated alt text"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;