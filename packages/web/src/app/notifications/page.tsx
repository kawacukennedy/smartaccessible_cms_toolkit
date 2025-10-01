'use client';

import dynamic from 'next/dynamic';

const DynamicNotificationsPage = dynamic(() => import('./DynamicNotificationsPage'), { ssr: false });

const NotificationsPage: React.FC = () => {
  return <DynamicNotificationsPage />;
};

export default NotificationsPage;