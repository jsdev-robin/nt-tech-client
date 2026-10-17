'use client';

import { useSigninMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import { SigninInput, ZAuthSchema } from '@/validations/ZAuthSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import { Role } from '@repo/ui/constants/role';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { GitHub, Gmail } from 'react-icon-svgl';
import { toast } from 'sonner';
import SignInPasskey from './SignInPasskey';

const SignIn = () => {
  const [signin, { isLoading }] = useSigninMutation();
  const router = useRouter();
  const form = useForm<SigninInput>({
    resolver: zodResolver(ZAuthSchema.signin),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: 'Passw0rd!',
      remember: false,
    },
  });

  async function onSubmit(data: SigninInput) {
    await toast.promise(
      signin(data)
        .unwrap()
        .then((res) => {
          if (res.payload.isEnabled) {
            router.refresh();
            router.push('/two-factor/verify/app');
          } else if (
            !res.payload.isEnabled &&
            res.payload.role.includes(Role.ADMIN)
          ) {
            router.replace(
              `${process.env.NEXT_PUBLIC_ADMIN_ORIGIN}/dashboard/overview`,
            );
            router.refresh();
          } else if (
            !res.payload.isEnabled &&
            res.payload.role.includes(Role.OWNER)
          ) {
            router.replace(
              `${process.env.NEXT_PUBLIC_OWNER_ORIGIN}/dashboard/overview`,
            );
            router.refresh();
          } else {
            router.push('/settings');
            router.refresh();
          }
          return res;
        }),
      {
        loading: 'Signing in...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
  }

  return (
    <section>
      <div className="container max-w-md flex justify-center select-none">
        <div className="flex flex-col gap-6 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Sign in with your Github or Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Controller
                          name="password"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="password">
                                Password
                              </FieldLabel>
                              <Input
                                {...field}
                                id="password"
                                aria-invalid={fieldState.invalid}
                                type="password"
                                autoComplete="off"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="remember"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <Checkbox
                                id="me"
                                name={field.name}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <FieldLabel htmlFor="me">Remember me</FieldLabel>
                              <Link
                                href="/forgot-password"
                                className="ml-auto text-sm"
                              >
                                Forgot your password?
                              </Link>
                            </Field>
                          )}
                        />
                      </Field>
                      <Field>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Spinner />}
                          <LogIn />
                          Sign In
                        </Button>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </form>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <SignInPasskey />
                    </Field>
                    <FieldSeparator>Or continue with</FieldSeparator>
                    <Field>
                      <Button variant="outline" type="button">
                        <GitHub />
                        Continue with Github
                      </Button>
                      <Button variant="outline" type="button">
                        <Gmail />
                        Continue with Google
                      </Button>
                      <FieldDescription className="text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up">Sign up</Link>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
