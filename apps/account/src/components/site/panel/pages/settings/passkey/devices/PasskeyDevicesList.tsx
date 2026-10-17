'use client';

import { useFindPasskeysQuery } from '@/lib/redux/features/endpoints/auth/passkey/authPasskeyApi';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Badge } from '@repo/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@repo/ui/components/item';
import { Skeleton } from '@repo/ui/components/skeleton';
import { format } from 'date-fns';
import { AlertCircleIcon, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import PasskeyRemoveAction from './PasskeyRemoveAction';

const PasskeyDevicesList = () => {
  const { data, isError, isLoading } = useFindPasskeysQuery();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Passkeys</CardTitle>
        <CardDescription>
          Create passkeys on your devices, or you can create a passkey on your
          security key.{' '}
          <Link
            href="https://myaccount.google.com/signinoptions/passkeys?rapt=AEjHL4OfuQz7gMNeQj4N-vHfsOj6tWVMzqi7rwtm_BpdW9XiKFF_Szw_7thtWBRTSP_em_WJW_6hZL-KBd1oYCLabLSOrhwLltmEizeKVPTjGg3zsd9gSm8&utm_source=google-account&utm_medium=web&utm_campaign=passkeys-screen&continue=https%3A%2F%2Fmyaccount.google.com%2Fsecurity%3Futm_source%3DOGB%26utm_medium%3Dapp%26rapt%3DAEjHL4OfuQz7gMNeQj4N-vHfsOj6tWVMzqi7rwtm_BpdW9XiKFF_Szw_7thtWBRTSP_em_WJW_6hZL-KBd1oYCLabLSOrhwLltmEizeKVPTjGg3zsd9gSm8"
            className="underline"
          >
            Learn more
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Item size="xs" key={i}>
                <ItemContent>
                  <Skeleton className="w-40 h-5" />
                  <Skeleton className="w-20 h-5 mt-2" />
                </ItemContent>
                <ItemActions>
                  <Skeleton className="w-20 h-8" />
                </ItemActions>
              </Item>
            ))
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Request Failed</AlertTitle>
              <AlertDescription>
                We couldn’t load the data. Please check your connection and try
                again.
              </AlertDescription>
            </Alert>
          ) : (
            data?.payload.passkeys.map((item, i) => (
              <React.Fragment key={i}>
                <Item className="p-0">
                  <ItemMedia variant="icon">
                    <Fingerprint />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="capitalize">
                      {item.os} <Badge variant="outline">{item.browser}</Badge>
                    </ItemTitle>
                    <ItemDescription>
                      {item.lastUsed && (
                        <span>
                          Last used{' '}
                          {format(new Date(item.lastUsed), 'MMM d, yyyy')} -
                        </span>
                      )}{' '}
                      <span>Uses {item.counter} - </span>
                      {item.createdAt && (
                        <span>
                          Created{' '}
                          {format(new Date(item.createdAt), 'MMM d, yyyy')}
                        </span>
                      )}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <PasskeyRemoveAction id={item._id} />
                  </ItemActions>
                  <ItemFooter>
                    <div className="flex items-center gap-2">
                      {item.transports.map((transports, j) => (
                        <Badge className="capitalize" key={j}>
                          {transports}
                        </Badge>
                      ))}
                    </div>
                  </ItemFooter>
                </Item>
                {i !== data.payload.passkeys.length - 1 && <ItemSeparator />}
              </React.Fragment>
            ))
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

export default PasskeyDevicesList;
