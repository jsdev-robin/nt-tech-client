'use client';

import React from 'react';
import Loader from './loading';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <Loader>{children}</Loader>;
};

export default DashboardLayout;
