'use client';

import { useConfirmTwoFaMutation } from '@/lib/redux/features/endpoints/auth/twoFa/twoFaAuthApi';
import { ConfirmTwoFaInput, ZTwoFaSchema } from '@/validations/ZTwoFaSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@repo/ui/components/input-group';
import { Spinner } from '@repo/ui/components/spinner';
import { useCopyToClipboard } from '@repo/ui/hooks/use-copy-to-clipboard';
import { Check, Copy, QrCodeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const TwoFaSetupConfirm = ({ secret }: { secret: string | undefined }) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const router = useRouter();
  const [confirm2Fa, { isLoading }] = useConfirmTwoFaMutation();

  const form = useForm<ConfirmTwoFaInput>({
    resolver: zodResolver(ZTwoFaSchema.confirm),
    mode: 'onChange',
    defaultValues: {
      token: '',
      secret: '',
    },
  });
  async function onSubmit(data: ConfirmTwoFaInput) {
    await toast.promise(
      confirm2Fa(data)
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

  useEffect(() => {
    if (secret) {
      form.setValue('secret', secret);
    }
  }, [form, secret]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Manual entry key</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  <QrCodeIcon />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                value={new Array(24).fill('*').join('') + secret?.slice(-4)}
                readOnly
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  aria-label="Copy"
                  title="Copy"
                  size="icon-xs"
                  onClick={() => {
                    copyToClipboard(secret ?? '');
                  }}
                >
                  {isCopied ? <Check /> : <Copy />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Controller
            name="token"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="token">
                  Verify the code from the app
                </FieldLabel>
                <Input
                  {...field}
                  id="token"
                  type="password"
                  placeholder="******"
                  maxLength={6}
                  required
                  autoComplete="off"
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
              Verify and Enable
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default TwoFaSetupConfirm;
