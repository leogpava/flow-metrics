import { ArrowDownRight, ArrowRight, ArrowUpRight, LucideIcon } from 'lucide-react';

import type { MetricDelta } from '@/features/admin/types/dashboard';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: 'purple' | 'blue' | 'green' | 'orange';
  delta?: MetricDelta | null;
}

const toneClasses = {
  purple: 'bg-violet-50 text-violet-700',
  blue: 'bg-sky-50 text-sky-700',
  green: 'bg-emerald-50 text-emerald-700',
  orange: 'bg-amber-50 text-amber-700',
} as const;

export function MetricCard({ title, value, description, icon: Icon, tone, delta }: MetricCardProps) {
  const deltaIcon =
    delta?.direction === 'up' ? ArrowUpRight : delta?.direction === 'down' ? ArrowDownRight : ArrowRight;
  const DeltaIcon = deltaIcon;
  const deltaColor =
    delta?.direction === 'up'
      ? 'text-emerald-700 bg-emerald-50'
      : delta?.direction === 'down'
        ? 'text-rose-700 bg-rose-50'
        : 'text-slate-600 bg-slate-100';

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta ? (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${deltaColor}`}>
            <DeltaIcon className="h-3.5 w-3.5" />
            {Math.abs(delta.value).toFixed(1)}{delta.direction === 'flat' ? ' pts' : '%'}
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}
