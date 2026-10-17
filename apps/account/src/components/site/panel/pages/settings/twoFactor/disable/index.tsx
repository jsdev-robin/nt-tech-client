'use client';

import { useDisableTwoFaMutation } from '@/lib/redux/features/endpoints/auth/twoFa/twoFaAuthApi';
import { Alert, AlertDescription } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Field, FieldGroup, FieldLabel } from '@repo/ui/components/field';
import Heading from '@repo/ui/components/heading';
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const CONFIRM_PHRASE = 'TURN OFF';

const TwoFaDisable = () => {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText.trim().toUpperCase() === CONFIRM_PHRASE;
  const [disableTwoFa, { isLoading }] = useDisableTwoFaMutation();

  const handleTurnOff = async () => {
    if (!isConfirmed) return;
    router.refresh();

    await toast.promise(
      disableTwoFa()
        .unwrap()
        .then((res) => {
          router.push('/settings/two-factor');
          router.refresh();
          return res;
        }),
      {
        loading: 'Please wait...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
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
            <Heading as="h6">Turn off two-factor authentication</Heading>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Turn off two-factor authentication?</CardTitle>
              <CardDescription>
                This removes the extra verification step from your login. Anyone
                who knows your password alone will be able to sign in — please
                read before continuing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertDescription>
                      Your account becomes password-only. Codes from your
                      authenticator app will no longer be required to sign in.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertDescription>
                      All 8 unused backup codes will be invalidated immediately
                      and can&apos;t be used afterward.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertDescription>
                      You&apos;ll need to set up from scratch — a new QR code
                      and new backup codes — if you turn it back on later.
                    </AlertDescription>
                  </Alert>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel>
                      Type <span className="font-semibold">TURN OFF</span> to
                      confirm
                    </FieldLabel>
                    <Input
                      id="confirm-turn-off"
                      autoComplete="off"
                      placeholder="TURN OFF"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <Button
                      variant="destructive"
                      disabled={!isConfirmed || isLoading}
                      onClick={handleTurnOff}
                    >
                      {isLoading && <Spinner />}
                      Turn Off Two-Factor Authentication
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/settings/two-factor')}
                    >
                      Keep It On
                    </Button>
                  </Field>
                </FieldGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TwoFaDisable;
