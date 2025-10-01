'use client';

import dynamic from 'next/dynamic';

const DynamicProfilePage = dynamic(() => import('./DynamicProfilePage'), { ssr: false });

const ProfilePage: React.FC = () => {
  return (
    <DynamicProfilePage />
  );
};

export default ProfilePage;