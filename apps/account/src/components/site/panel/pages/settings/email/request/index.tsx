'use client';

import { useRequestEmailChangeMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import useMe from '@/lib/redux/hooks/useMe';
import {
  RequestEmailChangeInput,
  ZAuthSchema,
} from '@/validations/ZAuthSchema';
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
import Heading from '@repo/ui/components/heading';
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import EmailSecurityInfo from './EmailSecurityInfo';

const RequestEmailChange = () => {
  const me = useMe();
  const [requestEmailChange, { isLoading }] = useRequestEmailChangeMutation();
  const form = useForm<RequestEmailChangeInput>({
    resolver: zodResolver(ZAuthSchema.requestEmailChange),
    mode: 'onChange',
    defaultValues: {
      newEmail: '',
      confirmEmail: '',
      password: 'Passw0rd!',
    },
  });

  async function onSubmit(data: RequestEmailChangeInput) {
    await toast.promise(
      requestEmailChange(data)
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
      <div className="wrapper @container/d">
        <div className="space-y-4">
          <Heading as="h6">Email Change</Heading>
          <div className="grid gap-4 grid-cols-1 @xl/d:grid-cols-12">
            <div className="@xl/d:col-span-7 @5xl/d:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Change Email Address</CardTitle>
                  <CardDescription>
                    Update your email address to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldSet>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="currentEmail">
                            Current Email
                          </FieldLabel>
                          <Input
                            id="currentEmail"
                            type="email"
                            value={me?.profile.email}
                            readOnly
                          />
                          <FieldDescription>
                            This is your currently registered email address
                          </FieldDescription>
                        </Field>
                        <Controller
                          name="newEmail"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="newEmail">
                                New Email Address
                              </FieldLabel>
                              <Input
                                {...field}
                                id="newEmail"
                                aria-invalid={fieldState.invalid}
                                type="email"
                              />
                              <FieldDescription>
                                Enter the new email address you want to use
                              </FieldDescription>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="confirmEmail"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="confirmEmail">
                                Confirm New Email
                              </FieldLabel>
                              <Input
                                {...field}
                                id="confirmEmail"
                                aria-invalid={fieldState.invalid}
                                type="email"
                              />
                              <FieldDescription>
                                Re-enter your new email to confirm
                              </FieldDescription>
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
                              <FieldLabel htmlFor="password">
                                Current Password
                              </FieldLabel>
                              <Input
                                {...field}
                                id="password"
                                aria-invalid={fieldState.invalid}
                                type="password"
                              />
                              <FieldDescription>
                                Verify your identity by entering your current
                                password
                              </FieldDescription>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Field>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Spinner />}
                            Confirm
                          </Button>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="@xl/d:col-span-5 @5xl/d:col-span-4">
              <EmailSecurityInfo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestEmailChange;
