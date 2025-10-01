'use client';

import dynamic from 'next/dynamic';

const DynamicAIAssistantPage = dynamic(() => import('./DynamicAIAssistantPage'), { ssr: false });

const AIAssistantPage: React.FC = () => {
  return (
    <DynamicAIAssistantPage />
  );
};

export default AIAssistantPage;