'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NewPageModal from './NewPageModal';
import { FilePlus, LayoutTemplate, Filter, FileText, CheckCircle, Calendar, Type, Newspaper, Presentation, Box, Wifi, WifiOff, Repeat } from 'lucide-react';

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
        <h5 className="text-lg font-bold">{isSidebarOpen ? 'Menu' : ''}</h5>
      </div>
      <div className="flex-grow p-4 space-y-6">
        <div>
          <h6 className="text-xs font-bold uppercase text-gray-500">Quick Actions</h6>
          <div className="mt-2 space-y-2">
            <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setShowNewPageModal(true)}>
              <FilePlus size={20} />
              {isSidebarOpen && <span className="ml-2">New Page</span>}
            </button>
            <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <LayoutTemplate size={20} />
              {isSidebarOpen && <span className="ml-2">New Template</span>}
            </button>
          </div>
        </div>
        <div>
          <h6 className="text-xs font-bold uppercase text-gray-500">Filters</h6>
          <ul className="mt-2 space-y-2">
            <li><Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><FileText size={20} />{isSidebarOpen && <span className="ml-2">Drafts</span>}</Link></li>
            <li><Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><CheckCircle size={20} />{isSidebarOpen && <span className="ml-2">Published</span>}</Link></li>
            <li><Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><Calendar size={20} />{isSidebarOpen && <span className="ml-2">Scheduled</span>}</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="text-xs font-bold uppercase text-gray-500">Content Types</h6>
          <ul className="mt-2 space-y-2">
            <li><Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><Type size={20} />{isSidebarOpen && <span className="ml-2">Article</span>}</Link></li>
            <li><Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><Newspaper size={20} />{isSidebarOpen && <span className="ml-2">Blog Post</span>}</Link></li>
            <li><Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><Presentation size={20} />{isSidebarOpen && <span className="ml-2">Landing Page</span>}</Link></li>
            <li><Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"><Box size={20} />{isSidebarOpen && <span className="ml-2">Product</span>}</Link></li>
          </ul>
        </div>
      </div>
      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 flex items-center ${status.color}`}>
        {status.icon}
        {isSidebarOpen && <span className="ml-2 text-sm">{status.text}</span>}
      </div>
      <NewPageModal
        show={showNewPageModal}
        onClose={() => setShowNewPageModal(false)}
        onCreate={handleCreatePage}
      />
    </aside>
  );
};

export default Sidebar;