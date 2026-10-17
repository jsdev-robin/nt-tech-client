import 'server-only';

import session from '@/lib/session';
import { COOKIES } from '@repo/ui/constants/cookie';
import { redirect } from 'next/navigation';
import React from 'react';

const TwoFaLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await session({
    cookieName: COOKIES.PENDING_2FA,
    key: process.env.ACTIVATION_SECRET,
  });

  return !token ? redirect('/sign-in') : <>{children}</>;
};

export default TwoFaLayout;
