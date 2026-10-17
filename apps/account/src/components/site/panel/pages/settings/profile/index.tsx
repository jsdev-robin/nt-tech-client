'use client';

import { useUpdateProfileMutation } from '@/lib/redux/features/endpoints/auth/core/authApi';
import useMe from '@/lib/redux/hooks/useMe';
import { ProfileInput, ZAuthSchema } from '@/validations/ZAuthSchema';
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@repo/ui/components/input-group';
import { Spinner } from '@repo/ui/components/spinner';
import { Lock } from 'lucide-react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ProfileAvatar from './ProfileAvatar';

const Profile = () => {
  const me = useMe();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm<ProfileInput>({
    resolver: zodResolver(ZAuthSchema.profile),
    mode: 'onChange',
    defaultValues: {
      profile: {
        familyName: me?.profile.familyName ?? '',
        givenName: me?.profile.givenName ?? '',
        avatar: {
          public_id: '',
          url: me?.profile.avatar?.url ?? undefined,
        },
      },
    },
  });

  async function onSubmit(data: ProfileInput) {
    await toast.promise(updateProfile(data).unwrap(), {
      loading: 'Updating your profile...',
      success: (res) => res?.message,
      error: (err) => err?.data?.message || 'Internal Server Error',
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section>
          <div className="wrapper w-full md:max-w-2xl">
            <div className="space-y-4">
              <Heading as="h6">User Profile</Heading>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Display Name ({me?.profile.displayName})
                  </CardTitle>
                  <CardDescription>
                    Update your photo and personal details here. This
                    information will be visible to other members of your
                    workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ProfileAvatar />
                    <FieldGroup>
                      <FieldSet>
                        <FieldGroup>
                          <Controller
                            name="profile.familyName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="familyName">
                                  Family name
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="familyName"
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            name="profile.givenName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="givenName">
                                  Given Name{' '}
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="givenName"
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Field>
                            <FieldLabel>Email</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                defaultValue={me?.profile.email}
                                disabled
                              />
                              <InputGroupAddon>
                                <Lock />
                              </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                              This is where you will receive notification emails
                              for your current account
                            </FieldDescription>
                          </Field>
                          <Field>
                            <Button
                              type="submit"
                              className="max-w-max ml-auto"
                              disabled={!form.formState.isDirty || isLoading}
                            >
                              {isLoading && <Spinner />} Save
                            </Button>
                          </Field>
                        </FieldGroup>
                      </FieldSet>
                    </FieldGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </form>
    </FormProvider>
  );
};

export default Profile;
