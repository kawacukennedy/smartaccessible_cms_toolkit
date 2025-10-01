'use client';

import dynamic from 'next/dynamic';

const DynamicLoginPage = dynamic(() => import('./DynamicLoginPage'), { ssr: false });

const LoginPage: React.FC = () => {
  return (
    <DynamicLoginPage />
  );
};

export default LoginPage;