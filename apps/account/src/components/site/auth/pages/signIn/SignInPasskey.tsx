'use client';

import {
  useGenerateAuthenticationMutation,
  useVerifyAuthenticationMutation,
} from '@/lib/redux/features/endpoints/auth/passkey/authPasskeyApi';
import { PasskeySigninInput, ZAuthSchema } from '@/validations/ZAuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import { Role } from '@repo/ui/constants/role';
import { startAuthentication } from '@simplewebauthn/browser';
import { Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const SignInPasskey = () => {
  const [generateAuthentication, { data, isLoading }] =
    useGenerateAuthenticationMutation();
  const [verifyAuthentication] = useVerifyAuthenticationMutation();
  const router = useRouter();

  const form = useForm<PasskeySigninInput>({
    resolver: zodResolver(ZAuthSchema.passkeySignin),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: PasskeySigninInput) {
    await toast.promise(generateAuthentication(data).unwrap(), {
      loading: 'Please wait...',
      success: (res) => res?.message,
      error: (err) => err?.data?.message,
    });
  }

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
              verifyAuthentication({
                response: response,
              })
                .unwrap()
                .then((res) => {
                  if (res.payload.role.includes(Role.ADMIN)) {
                    router.replace(
                      `${process.env.NEXT_PUBLIC_ADMIN_ORIGIN}/dashboard/overview`,
                    );
                    router.refresh();
                  } else {
                    router.replace('/settings');
                    router.refresh();
                  }
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
              toast.error(
                'Passkey sign-in was cancelled or the domain is invalid',
              );
              return;
            }
          }
          toast.warning('Passkey sign-in was cancelled');
        }
      })();
    }
  }, [data?.payload, router, verifyAuthentication]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <Fingerprint className="stroke-primary" />
          Signin with passkey
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Secure Passkey Sign-In</DialogTitle>
          <DialogDescription>
            Sign in quickly and safely using a passkey. No passwords are
            required—just your secure device authentication. Passkeys provide
            stronger security and a faster login experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="passkey-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="passkey-email"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Field>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Spinner />}
                    Continue with Passkey
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPasskey;
