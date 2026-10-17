'use client';

import useMe from '@/lib/redux/hooks/useMe';
import { Button } from '@repo/ui/components/button';
import Heading from '@repo/ui/components/heading';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@repo/ui/components/item';
import Text from '@repo/ui/components/text';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasskeyAddAction from './PasskeyAddAction';
import PasskeyDevicesList from './PasskeyDevicesList';

const PasskeyDevices = () => {
  const router = useRouter();
  const me = useMe();

  return (
    <section>
      <div className="container w-full md:max-w-3xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => router.push('/settings/passkeys')}
            >
              <ArrowLeft />
            </Button>
            <Heading as="h6">Passkeys and security keys</Heading>
          </div>
          {me?.auth?.passkey?.isEnabled && (
            <Item variant="muted" size="default">
              <ItemMedia>
                <Shield />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>You’re all set!</ItemTitle>
                <ItemDescription>
                  You can now use your fingerprint, face or screen lock to sign
                  in on this device
                </ItemDescription>
              </ItemContent>
            </Item>
          )}
          <div className="space-y-2">
            <Text variant="small">
              With passkeys, you can securely sign in to your Account using just
              your fingerprint, face, screen lock or security key. Passkeys and
              security keys can also be used as a second step when signing in
              with your password. Make sure that you keep your screen locks
              private and security keys safe, so that only you can use them.
            </Text>
            <Text variant="small">
              Passkeys can be created on your devices or on security keys.{' '}
              <Link
                href="https://myaccount.google.com/signinoptions/passkeys?utm_source=google-account&utm_medium=web&utm_campaign=passkeys-screen&continue=https://myaccount.google.com/security?utm_source%3DOGB%26utm_medium%3Dapp&rapt=AEjHL4OfuQz7gMNeQj4N-vHfsOj6tWVMzqi7rwtm_BpdW9XiKFF_Szw_7thtWBRTSP_em_WJW_6hZL-KBd1oYCLabLSOrhwLltmEizeKVPTjGg3zsd9gSm8"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </Link>
            </Text>
          </div>
          <PasskeyAddAction />
          {me?.auth?.passkey?.isEnabled && <PasskeyDevicesList />}
        </div>
      </div>
    </section>
  );
};

export default PasskeyDevices;
