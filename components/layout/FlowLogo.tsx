import Image from 'next/image';

import { cn } from '@/lib/utils';

interface FlowLogoProps {
  light?: boolean;
  compact?: boolean;
  className?: string;
}

export function FlowLogo({ light = false, compact = false, className }: FlowLogoProps) {
  const tone = light ? 'text-white' : 'text-flow-text';

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-[22px] border shadow-glow',
          compact ? 'h-11 w-11' : 'h-12 w-12',
        )}
      >
        <Image
          src="/flowmetricslogo.png"
          alt="FlowMetrics logo"
          fill
          sizes={compact ? '44px' : '48px'}
          className="object-cover"
          priority
        />
      </div>

      {!compact && (
        <div className="space-y-0.5">
          <span className={cn('block text-lg font-semibold tracking-tight', tone)}>FlowMetrics</span>
          <span
            className={cn(
              'block text-xs font-light tracking-[0.24em]',
              light ? 'text-white/75' : 'text-flow-text-muted'
            )}
          >
            HEALTH FLOW
          </span>
        </div>
      )}
    </div>
  );
}

