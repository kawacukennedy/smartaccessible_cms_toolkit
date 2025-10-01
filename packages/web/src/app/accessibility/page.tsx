'use client';

import dynamic from 'next/dynamic';

const DynamicAccessibilityPage = dynamic(() => import('./DynamicAccessibilityPage'), { ssr: false });

const AccessibilityPage: React.FC = () => {
  return (
    <DynamicAccessibilityPage />
  );
};

export default AccessibilityPage;
