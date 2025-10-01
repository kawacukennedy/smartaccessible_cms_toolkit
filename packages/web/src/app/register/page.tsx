'use client';

import dynamic from 'next/dynamic';

const DynamicRegisterPage = dynamic(() => import('./DynamicRegisterPage'), { ssr: false });

const RegisterPage: React.FC = () => {
  return (
    <DynamicRegisterPage />
  );
};

export default RegisterPage;