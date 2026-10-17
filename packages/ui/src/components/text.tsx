'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-base leading-7',
      lead: 'text-xl leading-8 font-medium',
      small: 'text-sm leading-6',
      xs: 'text-xs leading-5',
      caption: 'text-xs leading-4 tracking-wide uppercase font-medium',
      code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
      label: 'text-sm font-medium leading-none',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    muted: {
      true: 'text-muted-foreground',
    },
    truncate: {
      true: 'truncate',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

type TextElement =
  'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small' | 'code';

interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: TextElement;
}

function Text({
  as: Tag = 'p',
  variant,
  weight,
  align,
  muted,
  truncate,
  className,
  children,
  ...rest
}: TextProps) {
  return (
    <Tag
      className={cn(
        textVariants({ variant, weight, align, muted, truncate }),
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Text;
