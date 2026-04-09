'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/30">
      <motion.div
        className="h-full rounded-full bg-flow-success"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

