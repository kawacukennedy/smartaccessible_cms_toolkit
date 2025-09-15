'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <nav
      className={`sidebar offcanvas offcanvas-start bg-light ${isSidebarOpen ? 'show' : ''}`}
      tabIndex={-1}
      id="sidebarOffcanvas"
      aria-labelledby="sidebarOffcanvasLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">Menu</h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={toggleSidebar}
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/" className="nav-link active" onClick={toggleSidebar}>
              {t('dashboard')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/content" className="nav-link" onClick={toggleSidebar}>
              {t('content')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/ai-tools" className="nav-link" onClick={toggleSidebar}>
              {t('ai_tools')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/analytics" className="nav-link" onClick={toggleSidebar}>
              {t('analytics')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/media" className="nav-link" onClick={toggleSidebar}>
              {t('media')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/settings" className="nav-link" onClick={toggleSidebar}>
              {t('settings')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
