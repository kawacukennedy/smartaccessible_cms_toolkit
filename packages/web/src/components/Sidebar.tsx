'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {

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
            <Link href="/dashboard" className="nav-link" onClick={toggleSidebar}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/content" className="nav-link" onClick={toggleSidebar}>
              Content
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/accessibility" className="nav-link" onClick={toggleSidebar}>
              Accessibility
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/preview" className="nav-link" onClick={toggleSidebar}>
              Preview
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/ai-assistant" className="nav-link" onClick={toggleSidebar}>
              AI Assistant
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/analytics" className="nav-link" onClick={toggleSidebar}>
              Analytics
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/settings" className="nav-link" onClick={toggleSidebar}>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
