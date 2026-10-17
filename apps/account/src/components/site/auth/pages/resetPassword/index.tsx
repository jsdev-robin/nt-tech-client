'use client';

import { useResetPasswordMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import { ResetPasswordInput, ZAuthSchema } from '@/validations/ZAuthSchema';
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
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ResetPassword = ({ token }: { token: string }) => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const form = useForm<z.infer<typeof ZAuthSchema.resetPassword>>({
    resolver: zodResolver(ZAuthSchema.resetPassword),
    mode: 'onChange',
    defaultValues: {
      newPassword: 'Passw0rd!',
      confirmNewPassword: 'Passw0rd!',
      token: token,
    },
  });

  async function onSubmit(data: ResetPasswordInput) {
    await toast.promise(
      resetPassword(data)
        .unwrap()
        .then((res) => {
          window.location.href = '/sign-in';
          return res;
        }),
      {
        loading: 'Updating your password...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
  }

  return (
    <section>
      <div className="container max-w-md flex justify-center select-none">
        <div className="flex flex-col gap-6 w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Reset your password</CardTitle>
                <CardDescription>
                  Choose a strong, secure password to protect your account.
                  Enter your new password below and confirm it to complete the
                  reset process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    <Controller
                      name="newPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="password">
                            New Password
                          </FieldLabel>
                          <Input
                            {...field}
                            id="password"
                            aria-invalid={fieldState.invalid}
                            placeholder="*********"
                            type="password"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="confirmNewPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="passwordConfirm">
                            Confirm new password
                          </FieldLabel>
                          <Input
                            {...field}
                            id="passwordConfirm"
                            aria-invalid={fieldState.invalid}
                            type="password"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Field>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && <Spinner />}
                        Reset Password
                      </Button>
                      <FieldDescription className="text-center">
                        Remembered your password? <a href="/sign-in">Sign in</a>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
