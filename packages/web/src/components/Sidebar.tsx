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
            {/* Quick Actions */}
            <div className="d-grid gap-2 mb-4">
              <button className="btn btn-primary" type="button">
                <i className="bi bi-plus-circle me-2"></i> New Page
              </button>
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-file-earmark-plus me-2"></i> New Template
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input type="text" className="form-control" placeholder="Search sidebar..." aria-label="Search sidebar" />
            </div>

            {/* Navigation Items */}
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link href="#" className="nav-link active" aria-current="page">
                  <i className="bi bi-grid me-2"></i> Templates
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-journal-text me-2"></i> Drafts
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-file-earmark-richtext me-2"></i> Content Types
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/onboarding" className="nav-link">
                  <i className="bi bi-rocket-takeoff me-2"></i> Onboarding
                </Link>
              </li>
            </ul>

            {/* Live Sync Status Indicator */}
            <div className="mt-auto p-3 border-top">
              <span className="badge bg-success">
                <i className="bi bi-cloud-check me-2"></i> Online
              </span>
              <span className="text-muted ms-2">Last synced: Just now</span>
            </div>
          </div>
    </nav>
  );
};

export default Sidebar;
