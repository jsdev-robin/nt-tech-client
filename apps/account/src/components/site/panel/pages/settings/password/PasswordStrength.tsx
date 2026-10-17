'use client';

import { cn } from '@repo/ui/lib/utils';
import { CheckIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

type Rule = {
  key: 'length' | 'upper' | 'number' | 'symbol';
  label: string;
  test: (value: string) => boolean;
};

const RULES: Rule[] = [
  { key: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /[0-9]/.test(v) },
  { key: 'symbol', label: 'One symbol', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_META = [
  {
    label: 'Password strength',
    barClass: 'bg-border',
    textClass: 'text-muted-foreground',
  },
  { label: 'Weak', barClass: 'bg-destructive', textClass: 'text-destructive' },
  { label: 'Fair', barClass: 'bg-amber-500', textClass: 'text-amber-600' },
  { label: 'Good', barClass: 'bg-orange-500', textClass: 'text-orange-600' },
  {
    label: 'Strong',
    barClass: 'bg-emerald-500',
    textClass: 'text-emerald-600',
  },
] as const;

interface PasswordStrengthProps {
  name: string;
  className?: string;
}

export function PasswordStrength({ name, className }: PasswordStrengthProps) {
  const { control } = useFormContext();
  const value = useWatch({ control, name }) as string | undefined;
  const password = value ?? '';

  const metRules = useMemo(
    () =>
      new Set(
        RULES.filter((rule) => rule.test(password)).map((rule) => rule.key),
      ),
    [password],
  );

  const metCount = metRules.size;
  const strength = STRENGTH_META[password.length === 0 ? 0 : metCount];

  return (
    <div className={cn('space-y-2', className)}>
      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          {RULES.map((rule, index) => (
            <div
              key={rule.key}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                password.length === 0
                  ? 'bg-border'
                  : index < metCount
                    ? strength.barClass
                    : 'bg-border',
              )}
            />
          ))}
        </div>
        <p className={cn('text-xs font-medium', strength.textClass)}>
          {strength.label}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {RULES.map((rule) => {
          const met = metRules.has(rule.key);
          return (
            <li
              key={rule.key}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors',
                met ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
                  met
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-border text-transparent',
                )}
              >
                <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PasswordStrength;
