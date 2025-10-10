'use client';

import dynamic from 'next/dynamic';
import { CollaborationProvider } from '@/contexts/CollaborationContext';

const DynamicContentEditor = dynamic(() => import('@/components/ContentEditor'), { ssr: false });

const ContentEditorPage: React.FC = () => {
  return (
    <CollaborationProvider>
      <DynamicContentEditor />
    </CollaborationProvider>
  );
};

export default ContentEditorPage;
