'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface PillButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function PillButton({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  disabled,
  icon,
  ...props
}: PillButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold transition duration-200',
        fullWidth && 'w-full',
        variant === 'primary' &&
          'border border-white/30 bg-[rgba(108,99,255,0.90)] text-white shadow-[0_14px_34px_rgba(108,99,255,0.24)] hover:brightness-105',
        variant === 'secondary' &&
          'border border-white/80 bg-white/30 text-flow-text backdrop-blur-md hover:bg-white/50',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span>{children}</span>
      {icon}
    </motion.button>
  );
}

