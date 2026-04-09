'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface GlassCardProps {
  children?: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export function GlassCard({
  children,
  className,
  padding = 'md',
  hover = false
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn('glass-surface min-w-0 max-w-full overflow-x-clip shadow-glass', paddingMap[padding], className)}
    >
      {children}
    </motion.div>
  );
}

