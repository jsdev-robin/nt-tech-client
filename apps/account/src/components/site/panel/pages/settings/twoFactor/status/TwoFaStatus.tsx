'use client';

import { buttonVariants } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@repo/ui/components/item';
import { cn } from '@repo/ui/lib/utils';
import { Clock, Lock, Phone, Shield } from 'lucide-react';
import Link from 'next/link';

const TwoFaGuide = () => {
  return (
    <section>
      <div className="wrapper max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              An authenticator app generates a new 6-digit code every 30
              seconds, so signing in needs your password and your phone — not
              just one or the other.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ItemGroup>
                <Item variant="muted">
                  <ItemMedia variant="icon">
                    <Lock />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Not Protected</ItemTitle>
                    <ItemDescription>
                      Your account currently relies on a password alone.
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item className="p-0">
                  <ItemMedia variant="icon">
                    <Shield />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Stronger than SMS codes</ItemTitle>
                    <ItemDescription>
                      Codes are generated on your device, so they can&apos;t be
                      intercepted or redirected.
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item className="p-0">
                  <ItemMedia variant="icon">
                    <Phone />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Works without a signal</ItemTitle>
                    <ItemDescription>
                      No SMS or data connection needed — codes work offline,
                      anywhere.
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item className="p-0">
                  <ItemMedia variant="icon">
                    <Clock />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Takes about 2 minutes</ItemTitle>
                    <ItemDescription>
                      Scan a code, confirm one 6-digit entry, and you&apos;re
                      done.
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="outline">
                  <ItemHeader>
                    <ItemDescription>What you&apos;ll need</ItemDescription>
                  </ItemHeader>
                  <ItemContent>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                      <li>
                        A phone with an authenticator app installed —{' '}
                        <Link
                          href="https://authenticator.app/"
                          target="_blank"
                          className="underline underline-offset-4"
                        >
                          Google Authenticator
                        </Link>
                        ,{' '}
                        <Link
                          href="https://authy.com/"
                          target="_blank"
                          className="underline underline-offset-4"
                        >
                          Authy
                        </Link>
                        ,{' '}
                        <Link
                          href="https://1password.com/"
                          target="_blank"
                          className="underline underline-offset-4"
                        >
                          1Password
                        </Link>
                        , or similar
                      </li>

                      <li>About 2 minutes, uninterrupted</li>
                    </ul>
                  </ItemContent>
                </Item>
              </ItemGroup>
              <ItemGroup className="has-data-[size=xs]:gap-0">
                <Item size="xs" className="p-0">
                  <ItemMedia variant="icon">01</ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      Scan the code with your authenticator app
                    </ItemTitle>
                  </ItemContent>
                </Item>
                <ItemSeparator />
                <Item size="xs" className="p-0">
                  <ItemMedia variant="icon">02</ItemMedia>
                  <ItemContent>
                    <ItemTitle>Enter the 6-digit code it generates</ItemTitle>
                  </ItemContent>
                </Item>
                <ItemSeparator />
                <Item size="xs" className="p-0">
                  <ItemMedia variant="icon">03</ItemMedia>
                  <ItemContent>
                    <ItemTitle>Save your backup key somewhere safe</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
              <Link
                href="/settings/two-factor/setup"
                className={cn(buttonVariants())}
              >
                Set Up Authenticator App
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TwoFaGuide;
