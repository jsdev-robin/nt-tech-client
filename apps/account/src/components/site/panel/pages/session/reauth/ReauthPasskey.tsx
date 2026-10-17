'use client';

import {
  useGeneratReauthenticationMutation,
  useVerifyReuthenticationMutation,
} from '@/lib/redux/features/endpoints/auth/passkey/authPasskeyApi';
import { Button } from '@repo/ui/components/button';
import { startAuthentication } from '@simplewebauthn/browser';
import { Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const ReauthPasskey = ({ url }: { url: string }) => {
  const [generatReauthentication, { data, isLoading }] =
    useGeneratReauthenticationMutation();
  const [verifyReuthentication] = useVerifyReuthenticationMutation();
  const router = useRouter();

  const handlerReauth = async () => {
    await toast.promise(
      generatReauthentication()
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
          const { options } = data.payload;
          const response = await startAuthentication({
            optionsJSON: options,
          });

          if (response) {
            await toast.promise(
              verifyReuthentication({
                response: response,
              })
                .unwrap()
                .then((res) => {
                  router.push(url);
                  router.refresh();
                  return res;
                }),
              {
                loading: 'Please wait...',
                success: (res) => res?.message,
                error: (err) => err?.data?.message,
              },
            );
          }
        } catch (error) {
          if (error instanceof DOMException) {
            if (error.name === 'NotAllowedError') return;
            if (error.name === 'SecurityError') {
              toast.error('Action was cancel');
              return;
            }
          }
          toast.warning('Passkey was cancelled');
        }
      })();
    }
  }, [data?.payload, router, url, verifyReuthentication]);

  return (
    <Button onClick={handlerReauth} disabled={isLoading}>
      <Fingerprint />
      Continue with a passkey
    </Button>
  );
};

export default ReauthPasskey;
