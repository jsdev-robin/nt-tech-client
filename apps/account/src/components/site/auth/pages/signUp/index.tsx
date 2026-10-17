'use client';

import { useSignupMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import { SignupInput, ZAuthSchema } from '@/validations/ZAuthSchema';
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
  FieldSet,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { GitHub, Gmail } from 'react-icon-svgl';
import { toast } from 'sonner';

const SignUp = () => {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const form = useForm<SignupInput>({
    resolver: zodResolver(ZAuthSchema.signup),
    mode: 'onChange',
    defaultValues: {
      familyName: '',
      givenName: '',
      email: '',
      password: 'Passw0rd!',
      passwordConfirm: 'Passw0rd!',
    },
  });

  async function onSubmit(data: SignupInput) {
    await toast.promise(
      signup(data)
        .unwrap()
        .then((res) => {
          router.push('/verify');
          return res;
        }),
      {
        loading: 'Please wait...',
        success: (res) => res?.message,
        error: (err) => err?.data?.message || 'Internal Server Error',
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
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information below to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup className="grid sm:grid-cols-2">
                    <Controller
                      name="familyName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="familyName">
                            Family Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="familyName"
                            aria-invalid={fieldState.invalid}
                            placeholder="Jsdev"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="givenName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="givenName">
                            Given name
                          </FieldLabel>
                          <Input
                            {...field}
                            id="givenName"
                            aria-invalid={fieldState.invalid}
                            placeholder="Robin"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
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
                      name="passwordConfirm"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="passwordConfirm">
                            Confirm Password
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
                        Sign up
                      </Button>
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
                    </Field>
                    <Field>
                      <FieldDescription className="text-center">
                        Already have an account?{' '}
                        <Link href="/sign-in">Sign in</Link>
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

export default SignUp;
