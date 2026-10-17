'use client';

import { useVerifyTwoFaTokenMutation } from '@/lib/redux/features/endpoints/auth/twoFa/twoFaAuthApi';
import {
  VerifyTokenTwoFaInput,
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

const TowFaVerifyToken = () => {
  const [verifyTwoFaToken, { isLoading }] = useVerifyTwoFaTokenMutation();
  const router = useRouter();
  const form = useForm<VerifyTokenTwoFaInput>({
    resolver: zodResolver(ZTwoFaSchema.verifyToken),
    mode: 'onChange',
    defaultValues: {
      token: '',
    },
  });

  async function onSubmit(data: VerifyTokenTwoFaInput) {
    await toast.promise(
      verifyTwoFaToken(data)
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
                <CardTitle>Verify Your Identity</CardTitle>
                <CardDescription>
                  Enter the code from your two-factor authentication app or
                  browser extension below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    <Controller
                      name="token"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="token">
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
                        {isLoading && <Spinner />}
                        Verify Code
                      </Button>

                      <Link
                        href="/two-factor/verify/backup"
                        className={cn(
                          buttonVariants({ variant: 'destructive' }),
                        )}
                      >
                        Use Backup Code
                      </Link>
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

export default TowFaVerifyToken;
