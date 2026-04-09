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
  // Suporte a ambas as nomenclaturas (title/subtitle e label/sublabel)
  const displayLabel = label || title;
  const displaySublabel = sublabel || subtitle;

  return (
    <GlassCard padding="md" className="h-full">
      <div className="mb-4 flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/45">
            <Icon className="h-5 w-5 text-flow-accent" />
          </div>
        )}
        <span className="text-sm font-medium text-flow-text-soft">{displayLabel}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <p className={cn('text-xl font-semibold text-flow-text', valueClassName)}>{value}</p>
        {unit && <span className="text-sm text-flow-text-muted">{unit}</span>}
      </div>

      {classification && (
        <p className={cn('mt-1 text-sm font-medium', classificationColor ? `text-[${classificationColor}]` : '')}>
          {classification}
        </p>
      )}

      {displaySublabel && <p className={cn('mt-1 text-sm text-flow-text-muted', subtitleClassName)}>{displaySublabel}</p>}

      {extra && <div className="mt-2">{extra}</div>}
    </GlassCard>
  );
}

