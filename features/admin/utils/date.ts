import type { AdminDateRange } from '@/features/admin/types/dashboard';

export interface DatePreset {
  key: '7d' | '30d' | '90d' | 'all';
  label: string;
  startDate: Date;
  endDate: Date;
}

export function endOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

export function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function getAdminDatePresets() {
  const today = endOfDay(new Date());

  const buildPreset = (key: DatePreset['key'], label: string, days: number) => {
    const start = startOfDay(new Date(today));
    start.setDate(start.getDate() - days + 1);

    return {
      key,
      label,
      startDate: start,
      endDate: today,
    } satisfies DatePreset;
  };

  return [
    buildPreset('7d', '7 dias', 7),
    buildPreset('30d', '30 dias', 30),
    buildPreset('90d', '90 dias', 90),
    {
      key: 'all',
      label: 'Todo o período',
      startDate: new Date('2024-01-01T00:00:00.000Z'),
      endDate: today,
    } satisfies DatePreset,
  ];
}

export function getDefaultAdminDateRange(): AdminDateRange {
  const preset = getAdminDatePresets()[1];
  return {
    startDate: preset.startDate.toISOString(),
    endDate: preset.endDate.toISOString(),
  };
}

export function parseAdminDateRange(input: {
  startDate?: string | null;
  endDate?: string | null;
}) {
  const fallback = getDefaultAdminDateRange();
  const startDate = input.startDate ? new Date(input.startDate) : new Date(fallback.startDate);
  const endDate = input.endDate ? new Date(input.endDate) : new Date(fallback.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Período inválido.');
  }

  const normalizedStart = startOfDay(startDate);
  const normalizedEnd = endOfDay(endDate);

  if (normalizedStart > normalizedEnd) {
    throw new Error('A data inicial não pode ser maior que a data final.');
  }

  return {
    startDate: normalizedStart,
    endDate: normalizedEnd,
  };
}

export function getPreviousRange(startDate: Date, endDate: Date) {
  const duration = endDate.getTime() - startDate.getTime();
  const previousEnd = new Date(startDate.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - duration);

  return {
    startDate: startOfDay(previousStart),
    endDate: endOfDay(previousEnd),
  };
}
