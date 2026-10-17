'use client';

import { cva } from 'class-variance-authority';
import React from 'react';
import { cn } from '../lib/utils';

const headingVariants = cva('font-semibold', {
  variants: {
    as: {
      h1: 'text-4xl md:text-5xl lg:text-6xl',
      h2: 'text-3xl md:text-4xl lg:text-5xl',
      h3: 'text-2xl md:text-3xl lg:text-4xl',
      h4: 'text-xl md:text-2xl lg:text-3xl',
      h5: 'text-lg md:text-xl lg:text-2xl',
      h6: 'text-base md:text-lg lg:text-xl',
    },
  },
  defaultVariants: {
    as: 'h1',
  },
});

const displayVariants = cva('font-bold', {
  variants: {
    as: {
      h1: 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl',
      h2: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
      h3: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
      h4: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
      h5: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
      h6: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    },
  },
  defaultVariants: {
    as: 'h1',
  },
});

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  type?: 'heading' | 'display';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: React.ReactNode;
  asChild?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  type = 'heading',
  as = 'h1',
  children,
  asChild = false,
  className,
  ...rest
}) => {
  const variantClasses =
    type === 'heading' ? headingVariants({ as }) : displayVariants({ as });
  const Tag = as;

  return (
    <Tag
      className={cn(asChild ? className : variantClasses, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Heading;
