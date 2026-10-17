'use  client';

import useMe from '@/lib/redux/hooks/useMe';
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
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@repo/ui/components/item';
import Text from '@repo/ui/components/text';
import { cn } from '@repo/ui/lib/utils';
import { format } from 'date-fns';
import { CircleSmall, Clock, Key, Phone, Shield } from 'lucide-react';
import Link from 'next/link';

const TwoFaView = () => {
  const me = useMe();

  return (
    <section>
      <div className="wrapper max-w-2xl">
        <div className="space-y-4">
          <Heading as="h6">Authenticator app</Heading>
          <Text variant="small">
            Instead of waiting for text messages, get verification codes from an
            authenticator app. It works even if your phone is offline.
          </Text>
          <Text variant="small">
            First, download Google Authenticator from the{' '}
            <Link
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Play Store
            </Link>{' '}
            or the{' '}
            <Link
              href="https://apps.apple.com/app/google-authenticator/id388497605"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              iOS App Store
            </Link>
            .
          </Text>
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Your account is protected with an authenticator app. Manage your
                setup below.
              </CardDescription>
              <CardAction>
                <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                  <CircleSmall data-icon="inline-start" />
                  Protected
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex w-full flex-wrap gap-2">
                  <Badge variant="outline">
                    <Shield data-icon="inline-start" />
                    No SMS needed
                  </Badge>
                  <Badge variant="outline">
                    <Phone data-icon="inline-start" />
                    Works offline
                  </Badge>
                  <Badge variant="outline">
                    <Clock data-icon="inline-start" />
                    ~2 minutes
                  </Badge>
                </div>
                <ItemGroup className="border border-border rounded-md p-4 gap-0">
                  <Item className="p-0">
                    <ItemContent>
                      <ItemTitle>Method</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <ItemDescription>Authenticator app</ItemDescription>
                    </ItemActions>
                  </Item>
                  <ItemSeparator />
                  <Item className="p-0">
                    <ItemContent>
                      <ItemTitle>Activated</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <ItemDescription>
                        {me?.auth.twoFa.enabledAt &&
                          format(
                            new Date(me.auth.twoFa.enabledAt),
                            'MMM d, yyyy',
                          )}
                      </ItemDescription>
                    </ItemActions>
                  </Item>
                </ItemGroup>
                <Link
                  href="/settings/two-factor/backup"
                  className={cn(buttonVariants(), 'w-full')}
                >
                  <Key />
                  View Backup Key
                </Link>
                <Link
                  href="/settings/two-factor/disable"
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'block text-center',
                  )}
                >
                  Turn off two-factor authentication
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TwoFaView;
