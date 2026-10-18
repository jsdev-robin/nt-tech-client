import Heading from '@repo/ui/components/heading';
import Link from 'next/link';
import HeadingMenu from './HeadingMenu';

const Header = () => {
  return (
    <header className="border-b border-border py-3">
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard/overview">
            <Heading as="h4">NT HELP</Heading>
          </Link>
          <HeadingMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
