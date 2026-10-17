'use client';

import { useVerifyTwoFaBackupMutation } from '@/lib/redux/features/endpoints/auth/twoFa/twoFaAuthApi';
import {
  VerifyBackupTwoFaInput,
  ZTwoFaSchema,
} from '@/validations/ZTwoFaSchema';
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { Spinner } from '@repo/ui/components/spinner';
import { Role } from '@repo/ui/constants/role';
import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const TwoFaVerifyBackup = () => {
  const [verifyTwoFaBackup, { isLoading }] = useVerifyTwoFaBackupMutation();
  const router = useRouter();
  const form = useForm<VerifyBackupTwoFaInput>({
    resolver: zodResolver(ZTwoFaSchema.verifyBackup),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(data: VerifyBackupTwoFaInput) {
    await toast.promise(
      verifyTwoFaBackup(data)
        .unwrap()
        .then((res) => {
          if (res.payload.role.includes(Role.ADMIN)) {
            router.replace(
              `${process.env.NEXT_PUBLIC_ADMIN_ORIGIN}/dashboard/overview`,
            );
            router.refresh();
          } else if (res.payload.role.includes(Role.OWNER)) {
            router.replace(
              `${process.env.NEXT_PUBLIC_OWNER_ORIGIN}/dashboard/overview`,
            );
            router.refresh();
          } else {
            router.replace('/settings');
            router.refresh();
          }
          return res;
        }),
      {
        loading: 'Please wait..',
        success: (res) => res?.message,
        error: (err) => err?.data?.message,
      },
    );
  }

  return (
    <section>
      <div className="container max-w-md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Login with Recovery Code</CardTitle>
              <CardDescription>
                Can&apos;t access your authentication app? Use a backup recovery
                code to securely log in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldSet>
                <FieldGroup>
                  <Controller
                    name="code"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="code">
                          Verify the code from the app
                        </FieldLabel>
                        <Input {...field} autoComplete="off" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Spinner />} Verify Backup Code
                    </Button>
                    <Link
                      href="/two-factor/verify/app"
                      className={cn(buttonVariants({ variant: 'destructive' }))}
                    >
                      Use Authenticator App
                    </Link>
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

export default TwoFaVerifyBackup;
