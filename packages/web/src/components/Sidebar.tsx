'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NewPageModal from './NewPageModal';
import { FilePlus, LayoutTemplate, Filter, FileText, CheckCircle, Calendar, Type, Newspaper, Presentation, Box, Wifi, WifiOff, Repeat, Eye, BarChart, Settings } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncQueueCount, setSyncQueueCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleCreatePage = (title: string, slug: string, template: string) => {
    console.log(`Creating page: Title - ${title}, Slug - ${slug}, Template - ${template}`);
    setShowNewPageModal(false);
  };

  const getStatus = () => {
    if (!isOnline) return { text: 'Offline', icon: <WifiOff size={16} />, color: 'text-error' };
    if (syncQueueCount > 0) return { text: 'Syncing', icon: <Repeat size={16} />, color: 'text-warning' };
    return { text: 'Online', icon: <Wifi size={16} />, color: 'text-success' };
  };

  const status = getStatus();

  return (
    <aside className={`bg-background_light dark:bg-background_dark text-gray-800 dark:text-gray-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h5 className="text-lg font-bold">{isSidebarOpen ? 'Navigation' : ''}</h5>
      </div>
      <div className="flex-grow p-4 space-y-6">
        <nav>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><LayoutTemplate size={20} />{isSidebarOpen && <span className="ml-2">Dashboard</span>}</Link></li>
            <li><Link href="/content" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><FileText size={20} />{isSidebarOpen && <span className="ml-2">Content</span>}</Link></li>
            <li><Link href="/preview" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><Eye size={20} />{isSidebarOpen && <span className="ml-2">Preview</span>}</Link></li>
            <li><Link href="/analytics" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><BarChart size={20} />{isSidebarOpen && <span className="ml-2">Analytics</span>}</Link></li>
            <li><Link href="/settings" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><Settings size={20} />{isSidebarOpen && <span className="ml-2">Settings</span>}</Link></li>
          </ul>
        </nav>
      </div>
      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 flex items-center ${status.color}`}>
        {status.icon}
        {isSidebarOpen && <span className="ml-2 text-sm">{status.text}</span>}
      </div>
    </aside>
  );
};

export default Sidebar;