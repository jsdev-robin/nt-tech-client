'use client';

import { Fingerprint, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@repo/ui/components/sidebar';
import { NavMain } from './NavMain';
import { SidebarTopHeader } from './SidebarTopHeader';

const data = {
  navSettings: [
    {
      title: 'User Profile',
      url: '/settings/profile',
      icon: User,
    },
    {
      title: 'Passkeys',
      url: '/settings/passkeys',
      icon: Fingerprint,
    },
    {
      title: 'Two Factor',
      url: '/settings/two-factor',
      icon: ShieldCheck,
    },
    {
      title: 'Change password',
      url: '/settings/password-change',
      icon: Lock,
    },
    {
      title: 'Email',
      url: '/settings/email',
      icon: Mail,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTopHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navSettings} label="Sign in & Security" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
