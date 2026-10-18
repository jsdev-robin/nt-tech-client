'use client';

import Loading from '@/app/loading';
import { userAuthApi } from '@/services/api/endpoints/auth/core/authApi';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Loader = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const profile = userAuthApi.endpoints.findProfile.useQuery();

  useEffect(() => {
    if (profile.isError) {
      router.push(`${process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN}/sign-in`);
    }
  }, [profile.isError, router]);

  if (profile.isLoading) {
    return <Loading />;
  }

  if (profile.isError) {
    return null;
  }

  return children;
};

export default Loader;
