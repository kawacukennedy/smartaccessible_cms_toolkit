'use client';

import dynamic from 'next/dynamic';

const DynamicOnboardingPage = dynamic(() => import('./DynamicOnboardingPage'), { ssr: false });

export default function OnboardingPage() {
  return <DynamicOnboardingPage />;
}