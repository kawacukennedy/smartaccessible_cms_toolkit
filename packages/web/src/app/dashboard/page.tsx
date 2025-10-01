'use client';

import dynamic from 'next/dynamic';

const DynamicDashboardPage = dynamic(() => import('./DynamicDashboardPage'), { ssr: false });

export default function DashboardPage() {
  return (
    <main>
      <DynamicDashboardPage />
    </main>
  );
}