'use client';

import dynamic from 'next/dynamic';

const DynamicContentEditor = dynamic(() => import('@/components/ContentEditor'), { ssr: false });

const ContentEditorPage: React.FC = () => {
  return (
    <DynamicContentEditor />
  );
};

export default ContentEditorPage;
