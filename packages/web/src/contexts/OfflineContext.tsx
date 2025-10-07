
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAllOfflineContent } from '@/lib/db/indexedDB';

interface OfflineContextType {
  isOffline: boolean;
  pendingSyncCount: number;
  setPendingSyncCount: React.Dispatch<React.SetStateAction<number>>;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
  syncPendingContent: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const syncPendingContent = useCallback(async () => {
    if (isOffline) return;

    const pendingContent = await getAllOfflineContent();
    const toSync = pendingContent.filter(item => item.status === 'pending_sync');

    for (const item of toSync) {
      try {
        // Simulate sync to server
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, content: item.content }),
        });
        // If success, delete from IndexedDB
        // await deleteContentFromIndexedDB(item.id);
        setPendingSyncCount(prev => prev - 1);
      } catch (error) {
        // Handle conflict or retry
      }
    }
  }, [isOffline]);

  // Initialize offline status and pending sync count
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncPendingContent(); // Auto-sync when coming online
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOffline(!navigator.onLine); // Set initial status

    const getInitialPendingCount = async () => {
      const allOffline = await getAllOfflineContent();
      setPendingSyncCount(allOffline.filter(item => item.status === 'pending_sync').length);
    };
    getInitialPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingContent]);

  return (
    <OfflineContext.Provider value={{ isOffline, pendingSyncCount, setPendingSyncCount, setIsOffline, syncPendingContent }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
