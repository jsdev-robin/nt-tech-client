'use client';

import { userAuthApi } from '@/lib/redux/features/endpoints/auth/core/authApi';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Loading from '../loading';

const Loader = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const profile = userAuthApi.endpoints.findProfile.useQuery();

  useEffect(() => {
    if (profile.isError) {
      router.push('/sign-in');
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
