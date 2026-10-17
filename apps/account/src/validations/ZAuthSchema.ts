import { isStrongPassword } from 'validator';
import { z } from 'zod';

const signup = z
  .object({
    familyName: z
      .string()
      .nonempty('Family name is required')
      .min(2, { error: 'Family name must be at least 2 characters' })
      .max(32, { error: 'Family name cannot exceed 32 characters' }),
    givenName: z
      .string()
      .nonempty('Given name is required')
      .min(2, { error: 'Given name must be at least 2 characters' })
      .max(32, { error: 'Given name cannot exceed 32 characters' }),
    email: z.email('Enter a valid email address'),
    password: z
      .string()
      .nonempty('Password is required')
      .refine((val) => isStrongPassword(val), {
        error:
          'Password must include uppercase, lowercase, number & special character',
      }),
    passwordConfirm: z.string().nonempty('Password confirmation is required'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    error: 'Passwords do not match',
  });

const verify = z.object({
  token: z.jwt().nonempty('Token is required'),
  otp: z.string().min(6, {
    error: 'Your one-time password must be 6 characters.',
  }),
});

const signin = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().nonempty('Password is required'),
  remember: z.boolean().optional(),
});

const signoutSession = z.object({
  token: z.string({ error: 'Token must be string' }).optional(),
});

const forgotPassword = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
});

const resetPassword = z
  .object({
    token: z.string().optional(),
    newPassword: z
      .string()
      .nonempty('Password is required')
      .refine((val) => isStrongPassword(val), {
        error:
          'Password must include uppercase, lowercase, number & special character',
      }),
    confirmNewPassword: z
      .string()
      .nonempty('Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    error: 'Passwords do not match',
  });

const passkeySignin = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
});

const changePassword = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ error: 'Current password is required' }),
    newPassword: z
      .string()
      .nonempty({ error: "'Password is required'" })
      .refine((val) => isStrongPassword(val), {
        error:
          'Password must include uppercase, lowercase, number & special character',
      }),
    confirmNewPassword: z
      .string()
      .nonempty({ error: 'Password confirmation is required' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    error: 'Passwords do not match',
  });

const profile = z.object({
  profile: z.object({
    familyName: z.string().optional(),
    givenName: z.string().optional(),
    avatar: z
      .object({
        public_id: z.string().optional(),
        url: z.string().optional(),
      })
      .optional(),
  }),
});

const generateChangeEmail = z
  .object({
    newEmail: z.email('Enter a valid email address'),
    confirmEmail: z.email('Enter a valid email address'),
    password: z.string().nonempty('Password is required'),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    path: ['confirmEmail'],
    message: 'Emails do not match',
  });

const verifyChangeEmail = z.object({
  code: z.string(),
  token: z.string(),
});

const requestEmailChange = z
  .object({
    newEmail: z.email('Enter a valid email address'),
    confirmEmail: z.email('Enter a valid email address'),
    password: z.string().nonempty('Password is required'),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    path: ['confirmEmail'],
    message: 'Emails do not match',
  });

const confirmEmailChange = z.object({
  code: z.string(),
  token: z.string(),
});

const reauth = z.object({
  password: z.string().nonempty('Password is required'),
});

export type SignupInput = z.infer<typeof signup>;
export type VerifyInput = z.infer<typeof verify>;
export type SigninInput = z.infer<typeof signin>;
export type SignoutSessionInput = z.infer<typeof signoutSession>;
export type ForgotPasswordInput = z.infer<typeof forgotPassword>;
export type ResetPasswordInput = z.infer<typeof resetPassword>;
export type PasskeySigninInput = z.infer<typeof passkeySignin>;
export type ChangePasswordInput = z.infer<typeof changePassword>;
export type ProfileInput = z.infer<typeof profile>;
export type GenerateChangeEmailInput = z.infer<typeof generateChangeEmail>;
export type VerifyChangeEmailInput = z.infer<typeof verifyChangeEmail>;
export type RequestEmailChangeInput = z.infer<typeof requestEmailChange>;
export type ConfirmEmailChangeInput = z.infer<typeof confirmEmailChange>;
export type ReauthInput = z.infer<typeof reauth>;

export const ZAuthSchema = {
  signup,
  verify,
  signin,
  signoutSession,
  forgotPassword,
  resetPassword,
  passkeySignin,
  changePassword,
  profile,
  generateChangeEmail,
  verifyChangeEmail,
  requestEmailChange,
  confirmEmailChange,
  reauth,
} as const;
