'use client';

import dynamic from 'next/dynamic';

const DynamicContentPage = dynamic(() => import('./DynamicContentPage'), { ssr: false });

const ContentPage: React.FC = () => {
  return (
    <DynamicContentPage />
  );
};

export default ContentPage;