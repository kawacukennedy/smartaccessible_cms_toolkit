
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllOfflineContent } from '@/lib/db/indexedDB';

interface OfflineContextType {
  isOffline: boolean;
  pendingSyncCount: number;
  setPendingSyncCount: React.Dispatch<React.SetStateAction<number>>;
  setIsOffline: React.Dispatch<React.SetStateAction<boolean>>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Initialize offline status and pending sync count
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
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
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline, pendingSyncCount, setPendingSyncCount, setIsOffline }}>
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
