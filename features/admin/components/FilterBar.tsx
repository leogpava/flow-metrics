import { CalendarRange } from 'lucide-react';

import type { AdminDateRange } from '@/features/admin/types/dashboard';
import { getAdminDatePresets } from '@/features/admin/utils/date';
import { formatDateInput, formatLongDateRange } from '@/features/admin/utils/format';

interface FilterBarProps {
  range: AdminDateRange;
  onRangeChange: (range: AdminDateRange) => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function FilterBar({ range, onRangeChange, isLoading = false, children }: FilterBarProps) {
  const presets = getAdminDatePresets();

  const handlePreset = (key: string) => {
    const preset = presets.find((item) => item.key === key);
    if (!preset) return;

    onRangeChange({
      startDate: preset.startDate.toISOString(),
      endDate: preset.endDate.toISOString(),
    });
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <CalendarRange className="h-4 w-4 text-slate-400" />
            <span>Período de análise</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{formatLongDateRange(range.startDate, range.endDate)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => handlePreset(preset.key)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
          <label className="text-sm text-slate-600">
            <span className="mb-1.5 block font-medium">Início</span>
            <input
              type="date"
              value={formatDateInput(new Date(range.startDate))}
              onChange={(event) =>
                onRangeChange({
                  ...range,
                  startDate: new Date(event.target.value).toISOString(),
                })
              }
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-slate-400"
            />
          </label>
          <label className="text-sm text-slate-600">
            <span className="mb-1.5 block font-medium">Fim</span>
            <input
              type="date"
              value={formatDateInput(new Date(range.endDate))}
              onChange={(event) =>
                onRangeChange({
                  ...range,
                  endDate: new Date(`${event.target.value}T23:59:59.999Z`).toISOString(),
                })
              }
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-slate-400"
            />
          </label>
        </div>
      </div>
      {children ? <div className="mt-5 border-t border-slate-100 pt-5">{children}</div> : null}
    </section>
  );
}
