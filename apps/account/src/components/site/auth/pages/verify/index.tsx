'use client';

import { useVerifyMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import { useAppSelector } from '@/lib/redux/hooks/hooks';
import { RootState } from '@/lib/redux/store';
import { VerifyInput, ZAuthSchema } from '@/validations/ZAuthSchema';
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
  FieldSet,
} from '@repo/ui/components/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@repo/ui/components/input-otp';
import { Spinner } from '@repo/ui/components/spinner';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const Verify = () => {
  const [verify, { isLoading }] = useVerifyMutation();
  const { token } = useAppSelector((store: RootState) => store.auth);
  const form = useForm<VerifyInput>({
    resolver: zodResolver(ZAuthSchema.verify),
    defaultValues: {
      otp: '',
      token: token,
    },
  });

  async function onSubmit(data: VerifyInput) {
    await toast.promise(
      verify(data)
        .unwrap()
        .then((res) => {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = '/sign-in';
          return res;
        }),
      {
        loading: 'Verifying your account...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message || 'Internal Server Error',
      },
    );
  }

  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="w-68.5">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Enter verification code</CardTitle>
              <CardDescription>
                We sent a 6-digit code to your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldSet>
                <FieldGroup>
                  <Controller
                    name="otp"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <InputOTP maxLength={6} id="otp" {...field}>
                          <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Spinner />}
                      Verify
                    </Button>
                    <FieldDescription className="text-center">
                      Didn&apos;t receive the code?{' '}
                      <a href="/sign-up">Resend</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  );
};

export default Verify;
