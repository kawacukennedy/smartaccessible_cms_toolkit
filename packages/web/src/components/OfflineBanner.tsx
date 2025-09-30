'use client';

import React from 'react';

interface OfflineBannerProps {
  isOnline: boolean;
  syncQueueCount: number; // Placeholder for actual count
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, syncQueueCount }) => {
  if (isOnline) {
    return null;
  }

  return (
    <div className="alert alert-warning text-center m-0 rounded-0" role="alert">
      <i className="bi bi-cloud-slash me-2"></i> You are currently offline. Changes will be synced when you reconnect.
      {syncQueueCount > 0 && (
        <span className="ms-2 badge bg-secondary">{syncQueueCount} pending changes</span>
      )}
    </div>
  );
};

export default OfflineBanner;
