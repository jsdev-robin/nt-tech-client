'use client';

import { useConfirmEmailChangeMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import {
  ConfirmEmailChangeInput,
  ZAuthSchema,
} from '@/validations/ZAuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, buttonVariants } from '@repo/ui/components/button';
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
import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ConfirmEmailChange = ({ token }: { token: string }) => {
  const [confirmEmailChange, { isLoading }] = useConfirmEmailChangeMutation();
  const form = useForm<ConfirmEmailChangeInput>({
    resolver: zodResolver(ZAuthSchema.confirmEmailChange),
    mode: 'onChange',
    defaultValues: {
      code: '',
      token: token,
    },
  });

  async function onSubmit(data: ConfirmEmailChangeInput) {
    await toast.promise(
      confirmEmailChange(data)
        .unwrap()
        .then((res) => {
          return res;
        }),
      {
        loading: 'Updating your email...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
  }

  return (
    <section className="flex h-screen w-full items-center justify-center">
      <div className="w-68.5">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
              <CardDescription>
                Confirm your email change by verifying your current address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <FieldSet>
                  <FieldGroup>
                    <Controller
                      name="code"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="otp">OTP</FieldLabel>
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
                          <FieldDescription>
                            Enter the 6-digit code sent to your current email.
                          </FieldDescription>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Field orientation="horizontal">
                      <Link
                        href="/dashboard/settings/email"
                        className={cn(
                          buttonVariants({ variant: 'destructive' }),
                        )}
                      >
                        Cancel
                      </Link>
                      <Button disabled={isLoading}>
                        {isLoading && <Spinner />}Change Email
                      </Button>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  );
};

export default ConfirmEmailChange;
