'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  children?: ReactNode;
}

function getScoreColor(score: number) {
  if (score < 40) return '#f06292';
  if (score < 60) return '#f5a623';
  return '#2dd4a0';
}

export function ScoreRing({
  score,
  size = 180,
  strokeWidth = 12,
  animated = true,
  children
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.30)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: animated ? 1.5 : 0, ease: 'easeOut' }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

