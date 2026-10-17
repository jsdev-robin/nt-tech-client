'use client';

import { useFindTwoFaBackupQuery } from '@/lib/redux/features/endpoints/auth/twoFa/twoFaAuthApi';
import { Badge } from '@repo/ui/components/badge';
import { Button, buttonVariants } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@repo/ui/components/empty';
import Heading from '@repo/ui/components/heading';
import { Skeleton } from '@repo/ui/components/skeleton';
import { useCopyToClipboard } from '@repo/ui/hooks/use-copy-to-clipboard';
import { cn } from '@repo/ui/lib/utils';
import { ArrowLeft, Check, Copy, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TwoFaBackupAction from './TwoFaBackupAction';

const TwoFaBackup = () => {
  const { data, isLoading, isFetching } = useFindTwoFaBackupQuery();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const router = useRouter();

  const handleDownload = () => {
    if (data?.payload.codes) {
      const blob = new Blob([data?.payload.codes.join('\n')], {
        type: 'text/plain',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup-codes.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section>
      <div className="container w-full md:max-w-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => router.push('/settings/two-factor')}
            >
              <ArrowLeft />
            </Button>
            <Heading as="h6">Backup keys</Heading>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Your backup key</CardTitle>
              <CardDescription>
                Use these codes to sign in if you ever lose access to your
                authenticator app. Store them somewhere safe — they won&apos;t
                be shown again after you leave this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    {isLoading || isFetching ? (
                      [...Array(16)].map((_, idx) => (
                        <Skeleton
                          className="h-7 rounded-lg w-full bg-background"
                          key={idx}
                        />
                      ))
                    ) : data?.payload.codes?.length ? (
                      data.payload.codes.map((code, idx) => (
                        <Badge
                          key={idx}
                          className="w-full py-3.5"
                          variant="outline"
                        >
                          {idx + 1}
                          {'.'} {code}
                        </Badge>
                      ))
                    ) : (
                      <Empty className="w-full mx-auto col-span-full">
                        <EmptyHeader>
                          <EmptyTitle>Enable 2FA First!</EmptyTitle>
                          <EmptyDescription>
                            You need to activate your two-factor authentication
                            app before you can generate backup codes. Once 2FA
                            is active, you can create backup codes to secure
                            your account in case you lose access.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Link
                            href="/settings/two-factor"
                            className={cn(buttonVariants({}))}
                          >
                            Enable 2FA Now
                          </Link>
                        </EmptyContent>
                      </Empty>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      copyToClipboard(data?.payload.codes.join('\n') ?? '');
                    }}
                    disabled={isLoading}
                  >
                    {isCopied ? <Check /> : <Copy />}
                    {isCopied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={isLoading}
                  >
                    <Download />
                    Download
                  </Button>
                </div>
                <TwoFaBackupAction />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TwoFaBackup;
