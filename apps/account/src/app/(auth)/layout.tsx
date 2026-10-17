import AuthHeader from '@/components/site/auth/layouts';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthHeader />
      <main className="py-6">{children}</main>
    </>
  );
};

export default AuthLayout;
