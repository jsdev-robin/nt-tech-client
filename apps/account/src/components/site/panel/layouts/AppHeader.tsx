import { SidebarTrigger } from '@repo/ui/components/sidebar';

const AppHeader = () => {
  return (
    <header className="border-b border-border flex justify-between shrink-0 items-center gap-2 transition-[width,height] ease-linear h-12 px-4">
      <SidebarTrigger />
    </header>
  );
};

export default AppHeader;
