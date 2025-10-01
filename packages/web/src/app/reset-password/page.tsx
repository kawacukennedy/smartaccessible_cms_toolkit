'use client';

import dynamic from 'next/dynamic';

const DynamicResetPasswordPage = dynamic(() => import('./DynamicResetPasswordPage'), { ssr: false });

const ResetPasswordPage: React.FC = () => {
  return (
    <DynamicResetPasswordPage />
  );
};

export default ResetPasswordPage;