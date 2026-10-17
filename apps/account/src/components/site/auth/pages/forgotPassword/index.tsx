'use client';

import { useForgotPasswordMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import { ForgotPasswordInput, ZAuthSchema } from '@/validations/ZAuthSchema';
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

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ZAuthSchema.forgotPassword),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    await toast.promise(
      forgotPassword(data)
        .unwrap()
        .then((res) => {
          form.reset();
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
    <section>
      <div className="container max-w-md flex justify-center select-none">
        <div className="flex flex-col gap-6 w-full">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Forgot your password?</CardTitle>
                <CardDescription>
                  Enter your registered email address below and we’ll send you a
                  link to reset your password securely.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <Input
                            {...field}
                            id="email"
                            aria-invalid={fieldState.invalid}
                            placeholder="jsdev.robin@gmail.com"
                            type="email"
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
                        Send Reset Link
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

export default ForgotPassword;
