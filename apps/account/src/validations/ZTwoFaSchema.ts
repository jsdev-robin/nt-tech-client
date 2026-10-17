import { z } from 'zod';

const confirm = z.object({
  token: z.string().nonempty('TOTP is required'),
  secret: z.string().nonempty('Secret is required'),
});

const verifyToken = z.object({
  token: z
    .string()
    .length(6, { error: 'Verification code must be exactly 6 digits' })
    .regex(/^\d+$/, { error: 'Verification code must contain only digits' }),
});

const verifyBackup = z.object({
  code: z.string().nonempty('Backup code is required'),
});

export type ConfirmTwoFaInput = z.infer<typeof confirm>;
export type VerifyTokenTwoFaInput = z.infer<typeof verifyToken>;
export type VerifyBackupTwoFaInput = z.infer<typeof verifyBackup>;

export const ZTwoFaSchema = {
  confirm,
  verifyToken,
  verifyBackup,
} as const;
