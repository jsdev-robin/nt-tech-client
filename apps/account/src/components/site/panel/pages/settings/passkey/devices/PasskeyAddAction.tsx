'use client';

import {
  useGenerateRegistrationMutation,
  useVerifyRegistrationMutation,
} from '@/lib/redux/features/endpoints/auth/passkey/authPasskeyApi';
import { Button } from '@repo/ui/components/button';
import { Spinner } from '@repo/ui/components/spinner';
import { startRegistration } from '@simplewebauthn/browser';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const PasskeyAddAction = () => {
  const [generateRegistration, { data, isLoading }] =
    useGenerateRegistrationMutation();
  const [verifyRegistration] = useVerifyRegistrationMutation();
  const router = useRouter();

  const handleStart = async () => {
    await toast.promise(
      generateRegistration()
        .unwrap()
        .then((res) => res),
      {
        loading: 'Please wait...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
  };

  useEffect(() => {
    if (data?.payload) {
      (async () => {
        try {
          const response = await startRegistration({
            optionsJSON: data.payload,
          });

          if (response) {
            await toast.promise(
              verifyRegistration({
                response: response,
              })
                .unwrap()
                .then((res) => {
                  router.refresh();
                  return res;
                }),
              {
                loading: 'Completing registration...',
                success: (res) => res?.message,
                error: (err) => err?.data?.message || 'Internal Server Error.',
              },
            );
          }
        } catch (error) {
          if (error instanceof DOMException) {
            if (error.name === 'NotAllowedError') return;
            if (error.name === 'SecurityError') {
              toast.error(
                'Passkey setup was cancelled or the domain is invalid',
              );
              return;
            }
          }
          toast.warning('Passkey setup was cancelled');
        }
      })();
    }
  }, [data?.payload, router, verifyRegistration]);

  return (
    <Button onClick={handleStart} disabled={isLoading}>
      {isLoading ? <Spinner /> : <Plus />}
      Create a passkey
    </Button>
  );
};

export default PasskeyAddAction;
