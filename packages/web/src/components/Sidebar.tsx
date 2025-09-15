'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-light sidebar">
      <div className="position-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link href="/" className="nav-link active">
              {t('dashboard')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/content" className="nav-link">
              {t('content')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/content-editor" className="nav-link">
              {t('content_editor')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/ai-suggestions" className="nav-link">
              {t('ai_suggestions')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/variations" className="nav-link">
              {t('variations')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/analytics" className="nav-link">
              {t('analytics')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/notifications" className="nav-link">
              {t('notifications')}
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/settings" className="nav-link">
              {t('settings')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
