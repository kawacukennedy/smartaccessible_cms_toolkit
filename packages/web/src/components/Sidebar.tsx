'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NewPageModal from './NewPageModal'; // Import the new page modal

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const [showNewPageModal, setShowNewPageModal] = useState(false);

  const handleCreatePage = (title: string, slug: string, template: string) => {
    console.log(`Creating page: Title - ${title}, Slug - ${slug}, Template - ${template}`);
    // In a real app, this would trigger page creation logic
    setShowNewPageModal(false);
  };

  return (
    <nav
      className={`sidebar offcanvas offcanvas-start bg-light ${isSidebarOpen ? 'show' : ''} app-sidebar`}
      tabIndex={-1}
      id="sidebarOffcanvas"
      aria-labelledby="sidebarOffcanvasLabel"
      role="navigation"
      aria-label="Main Sidebar"
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
              <button className="btn btn-primary" type="button" onClick={() => setShowNewPageModal(true)}>
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

            {/* Filters */}
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
              <span>Filters</span>
            </h6>
            <ul className="navbar-nav flex-column mb-2">
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-file-earmark-text me-2"></i> Drafts
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-check-circle me-2"></i> Published
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-calendar-event me-2"></i> Scheduled
                </Link>
              </li>
            </ul>

            {/* Content Types */}
            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
              <span>Content Types</span>
            </h6>
            <ul className="navbar-nav flex-column mb-2">
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-file-earmark-richtext me-2"></i> Article
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-newspaper me-2"></i> Blog Post
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-layout-text-window-reverse me-2"></i> Landing Page
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#" className="nav-link">
                  <i className="bi bi-box me-2"></i> Product
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

      <NewPageModal
        show={showNewPageModal}
        onClose={() => setShowNewPageModal(false)}
        onCreate={handleCreatePage}
      />
    </nav>
  );
};

export default Sidebar;
