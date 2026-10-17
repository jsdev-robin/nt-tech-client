'use client';

import { useReauthMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import useMe from '@/lib/redux/hooks/useMe';
import { ReauthInput, ZAuthSchema } from '@/validations/ZAuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ReauthPasskey from './ReauthPasskey';

const Reauth = ({ url }: { url: string }) => {
  const [reauth, { isLoading }] = useReauthMutation();
  const router = useRouter();
  const me = useMe();

  const form = useForm<ReauthInput>({
    resolver: zodResolver(ZAuthSchema.reauth),
    mode: 'onChange',
    defaultValues: {
      password: 'Passw0rd!',
    },
  });

  async function onSubmit(data: ReauthInput) {
    await toast.promise(
      reauth(data)
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

  return (
    <section className="fixed h-screen w-screen bg-background z-9999 top-0 bottom-0 left-0 right-0">
      <div className="w-full max-w-xs absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Confirm it&apos;s you</CardTitle>
            <CardDescription>
              Enter your password to continue. This session was verified for a
              short time, then it expires — eatery-account.jsdevs.xyz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          {...field}
                          id="password"
                          aria-invalid={fieldState.invalid}
                          type="password"
                          placeholder="Enter your password"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Spinner />}
                    Confirm
                  </Button>
                </Field>
                {me?.auth?.passkey?.isEnabled && (
                  <>
                    <FieldSeparator>Or continue with</FieldSeparator>
                    <Field>
                      <ReauthPasskey url={url} />
                    </Field>
                  </>
                )}
                <Field>
                  <FieldDescription className="text-center">
                    Tip: You are entering sudo mode. After you&apos;ve performed
                    a sudo-protected action, you&apos;ll only be asked to
                    re-authenticate again after a few hours of inactivity.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Reauth;
