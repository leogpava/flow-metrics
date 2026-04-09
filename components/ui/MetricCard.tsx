import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  icon?: LucideIcon;
  label?: string;
  title?: string;
  value: string;
  subtitle?: string;
  sublabel?: string;
  classification?: string;
  classificationColor?: string;
  unit?: string;
  valueClassName?: string;
  subtitleClassName?: string;
  extra?: ReactNode;
}

export function MetricCard({
  icon: Icon,
  label,
  title,
  value,
  subtitle,
  sublabel,
  classification,
  classificationColor,
  unit,
  valueClassName,
  subtitleClassName,
  extra
}: MetricCardProps) {
  const displayLabel = label || title;
  const displaySublabel = sublabel || subtitle;

  return (
    <GlassCard padding="md" className="h-full min-w-0">
      <div className="mb-4 flex min-w-0 items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/45">
            <Icon className="h-5 w-5 text-flow-accent" />
          </div>
        )}
        <span className="min-w-0 break-words text-sm font-medium leading-5 text-flow-text-soft [overflow-wrap:anywhere]">
          {displayLabel}
        </span>
      </div>

      <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-1">
        <p
          className={cn(
            'min-w-0 break-words text-[clamp(1.05rem,4.8vw,1.25rem)] font-semibold leading-tight text-flow-text [overflow-wrap:anywhere]',
            valueClassName
          )}
        >
          {value}
        </p>
        {unit && <span className="break-words text-sm leading-5 text-flow-text-muted [overflow-wrap:anywhere]">{unit}</span>}
      </div>

      {classification && (
        <p className={cn('mt-1 break-words text-sm font-medium leading-5 [overflow-wrap:anywhere]', classificationColor ? `text-[${classificationColor}]` : '')}>
          {classification}
        </p>
      )}

      {displaySublabel && (
        <p className={cn('mt-1 break-words text-sm leading-5 text-flow-text-muted [overflow-wrap:anywhere]', subtitleClassName)}>
          {displaySublabel}
        </p>
      )}

      {extra && <div className="mt-2 min-w-0 max-w-full">{extra}</div>}
    </GlassCard>
  );
}
