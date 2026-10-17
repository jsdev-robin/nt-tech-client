'use client';

import { useChangePasswordMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import { ChangePasswordInput, ZAuthSchema } from '@/validations/ZAuthSchema';
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@repo/ui/components/field';
import Heading from '@repo/ui/components/heading';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@repo/ui/components/input-group';
import { Spinner } from '@repo/ui/components/spinner';
import Text from '@repo/ui/components/text';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import PasswordStrength from './PasswordStrength';

const PasswordChange = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(ZAuthSchema.changePassword),
    mode: 'onChange',
    defaultValues: {
      currentPassword: 'Passw0rd!',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  async function onSubmit(data: ChangePasswordInput) {
    await toast.promise(
      changePassword(data)
        .unwrap()
        .then((res) => {
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
    <section>
      <div className="wrapper w-full md:max-w-2xl">
        <FormProvider {...form}>
          <div className="space-y-4">
            <Heading as="h6">Password</Heading>
            <Text variant="small">
              <strong>You&apos;ll be signed out everywhere</strong> — including
              this device — once your password is changed, and you&apos;ll need
              to log back in with your new password.
            </Text>
            <Text variant="small">
              As an extra safety step,{' '}
              <strong>
                two-factor authentication and passkeys will be reset
              </strong>
              , so you&apos;ll need to set them up again.
            </Text>
            <Card>
              <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>
                  Choose a strong password you don&apos;t use anywhere else.
                  You&apos;ll stay signed in on this device.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldSet>
                    <FieldGroup>
                      <Controller
                        name="currentPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="currentPassword">
                              Current Password
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...field}
                                id="currentPassword"
                                aria-invalid={fieldState.invalid}
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter current password"
                              />
                              <InputGroupAddon align="inline-end">
                                {showCurrentPassword ? (
                                  <EyeIcon
                                    onClick={() =>
                                      setShowCurrentPassword(false)
                                    }
                                    className="cursor-pointer"
                                  />
                                ) : (
                                  <EyeOffIcon
                                    onClick={() => setShowCurrentPassword(true)}
                                    className="cursor-pointer"
                                  />
                                )}
                              </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="newPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="newPassword">
                              New password
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...field}
                                id="newPassword"
                                aria-invalid={fieldState.invalid}
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                              />
                              <InputGroupAddon align="inline-end">
                                {showNewPassword ? (
                                  <EyeIcon
                                    onClick={() => setShowNewPassword(false)}
                                    className="cursor-pointer"
                                  />
                                ) : (
                                  <EyeOffIcon
                                    onClick={() => setShowNewPassword(true)}
                                    className="cursor-pointer"
                                  />
                                )}
                              </InputGroupAddon>
                            </InputGroup>
                            <PasswordStrength name="newPassword" />
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
                            <FieldLabel htmlFor="confirmNewPassword">
                              Confirm wew password
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                {...field}
                                id="confirmNewPassword"
                                aria-invalid={fieldState.invalid}
                                type={
                                  showConfirmNewPassword ? 'text' : 'password'
                                }
                                placeholder="Re-enter new password"
                              />
                              <InputGroupAddon align="inline-end">
                                {showConfirmNewPassword ? (
                                  <EyeIcon
                                    onClick={() =>
                                      setShowConfirmNewPassword(false)
                                    }
                                    className="cursor-pointer"
                                  />
                                ) : (
                                  <EyeOffIcon
                                    onClick={() =>
                                      setShowConfirmNewPassword(true)
                                    }
                                    className="cursor-pointer"
                                  />
                                )}
                              </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Field>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Spinner />}Update Password
                        </Button>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </form>
              </CardContent>
            </Card>
          </div>
        </FormProvider>
      </div>
    </section>
  );
};

export default PasswordChange;
