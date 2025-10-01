'use client';

import dynamic from 'next/dynamic';

const DynamicSettingsPage = dynamic(() => import('./DynamicSettingsPage'), { ssr: false });

const SettingsPage: React.FC = () => {
  return (
    <DynamicSettingsPage />
  );
};

export default SettingsPage;