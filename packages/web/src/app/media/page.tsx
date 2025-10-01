'use client';

import dynamic from 'next/dynamic';

const DynamicMediaLibraryPage = dynamic(() => import('./DynamicMediaLibraryPage'), { ssr: false });

const MediaLibraryPage: React.FC = () => {
  return (
    <DynamicMediaLibraryPage />
  );
};

export default MediaLibraryPage;