import Header from '@/components/site/layouts/Header';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="space-y-4">{children}</main>
    </>
  );
};

export default DashboardLayout;
