import React from 'react';

const MediaUploader: React.FC = () => {
  return (
    <div className="mb-3">
      <label htmlFor="mediaUpload" className="form-label">Media Uploader</label>
      <input className="form-control" type="file" id="mediaUpload" />
    </div>
  );
};

export default MediaUploader;
