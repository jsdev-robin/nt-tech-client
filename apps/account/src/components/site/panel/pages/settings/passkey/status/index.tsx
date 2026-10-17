'use client';

import useMe from '@/lib/redux/hooks/useMe';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Badge } from '@repo/ui/components/badge';
import { buttonVariants } from '@repo/ui/components/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import Heading from '@repo/ui/components/heading';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@repo/ui/components/item';
import Text from '@repo/ui/components/text';
import { cn } from '@repo/ui/lib/utils';
import {
  CircleSmall,
  Fingerprint,
  FingerprintPattern,
  InfoIcon,
  ScanFace,
  Shield,
  ShieldCheck,
  Usb,
} from 'lucide-react';
import Link from 'next/link';

const passkeyMethods = [
  {
    title: 'Fingerprint',
    description: 'Touch ID / sensor',
    icon: FingerprintPattern,
  },
  {
    title: 'Face ID',
    description: 'Camera recognition',
    icon: ScanFace,
  },
  {
    title: 'Security key',
    description: 'USB / NFC device',
    icon: Usb,
  },
];

const PasskeyRegisterGuide = () => {
  const me = useMe();

  return (
    <section>
      <div className="container w-full md:max-w-2xl">
        <div className="space-y-4">
          <Heading as="h6">Passkey</Heading>
          <Text variant="small">
            With passkeys, you can securely sign in to your Account using just
            your fingerprint, face, screen lock or security key. Passkeys and
            security keys can also be used as a second step when signing in with
            your password. Make sure that you keep your screen locks private and
            security keys safe, so that only you can use them.
          </Text>
          <Card>
            <CardHeader>
              <CardTitle>Register a passkey</CardTitle>
              <CardDescription>
                Choose your authentication method below, then follow the prompt
                on your device.
              </CardDescription>
              {me?.auth.passkey.isEnabled && (
                <CardAction>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                    <CircleSmall data-icon="inline-start" />
                    Active
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ItemGroup className="grid grid-cols-3">
                  {passkeyMethods.map((method) => (
                    <Item key={method.title} variant="outline">
                      <ItemHeader>
                        <method.icon />
                      </ItemHeader>
                      <ItemContent>
                        <ItemTitle>{method.title}</ItemTitle>
                        <ItemDescription>{method.description}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                  {me?.auth?.passkey?.isEnabled ? (
                    <Item className="col-span-full" variant="muted">
                      <ItemMedia variant="icon">
                        <ShieldCheck className="text-primary" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>Passkey is active</ItemTitle>
                        <ItemDescription>
                          You can already sign in on this device without a
                          password.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  ) : (
                    <Item className="col-span-full" variant="muted">
                      <ItemMedia variant="icon">
                        <Shield />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>No passkey set up yet</ItemTitle>
                        <ItemDescription>
                          Add one to sign in faster on this device.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  )}
                </ItemGroup>
                <Link
                  href="/settings/passkeys/devices"
                  className={cn(buttonVariants(), 'w-full')}
                >
                  <Fingerprint />
                  {me?.auth.passkey.isEnabled
                    ? 'Manage devices'
                    : 'Register Passkey'}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Alert>
            <InfoIcon />
            <AlertTitle>Your data stays safe</AlertTitle>
            <AlertDescription>
              Passkeys use public-key cryptography. Your private key never
              leaves your device. Even if this server is breached, your passkey
              can&apos;t be stolen.
              <br />
              <br />
              With passkeys you don&apos;t need to remember complex passwords.
              We recommend your device&apos;s unlock methods like fingerprint
              add Face ID for added security.
              <br />
              <br />
              To know more about adding adn removing passkeys{' '}
              <Link
                href="/help"
                target="_blank"
                className="underline text-primary"
              >
                Click here
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
};

export default PasskeyRegisterGuide;
