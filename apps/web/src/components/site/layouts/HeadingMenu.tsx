'use client';

import { useSignoutMutation } from '@/services/api/endpoints/auth/core/authApi';
import useMe from '@/services/api/hooks/useMe';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const HeadingMenu = () => {
  const me = useMe();
  const [signout, { isLoading }] = useSignoutMutation();
  const router = useRouter();

  async function onLogout() {
    await toast.promise(
      signout()
        .unwrap()
        .then((res) => {
          router.replace(`${process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN}/sign-in`);
          router.refresh();
          return res;
        }),
      {
        loading: 'Signing out...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src={me?.profile?.avatar?.url}
            alt={me?.profile?.displayName}
          />
          <AvatarFallback>
            {me?.profile?.givenName?.[0]}
            {me?.profile?.familyName?.[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`${process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN}/settings/profile`}
            >
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`${process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN}/settings`}>
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={isLoading}
            onSelect={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeadingMenu;
