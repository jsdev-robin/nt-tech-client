'use client';

import { useRequestTwoFaQuery } from '@/lib/redux/features/endpoints/auth/twoFa/twoFaAuthApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import QRCode from 'react-qr-code';
import TwoFaSetupConfirm from './TwoFaSetupConfirm';

const TwoFaSetup = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useRequestTwoFaQuery(undefined, {
    pollingInterval: 100000,
  });

  useEffect(() => {
    if (isError) {
      router.replace('/sessions/reauth/settings/two-factor/setup');
    }
  }, [isError, router]);

  return (
    <section>
      <div className="wrapper max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Set up two-factor authentication</CardTitle>
            <CardDescription>
              Scan the QR code with your authenticator app, then enter the
              6-digit verification code it generates to link your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border bg-white p-4 size-50 mx-auto flex items-center justify-center">
                {isLoading ? (
                  <Skeleton className="size-40 rounded-md" />
                ) : (
                  data?.payload?.secret && (
                    <QRCode
                      value={data?.payload?.secret}
                      size={160}
                      level="M"
                    />
                  )
                )}
              </div>
              <TwoFaSetupConfirm secret={data?.payload?.secret} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TwoFaSetup;
