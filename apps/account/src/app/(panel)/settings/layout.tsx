import AppHeader from '@/components/site/panel/layouts/AppHeader';
import { AppSidebar } from '@/components/site/panel/layouts/AppsSdebar';
import { SidebarInset, SidebarProvider } from '@repo/ui/components/sidebar';
import { cookies } from 'next/headers';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 56)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="overflow-hidden" id="dashboard-layout">
        <AppHeader />
        <main className="p-4 space-y-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
