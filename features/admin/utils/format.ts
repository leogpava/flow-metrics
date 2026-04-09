import type { MetricDelta } from '@/features/admin/types/dashboard';

export function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatDecimal(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 1) {
  return `${formatDecimal(value, fractionDigits)}%`;
}

export function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function formatLongDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return `${formatter.format(new Date(startDate))} a ${formatter.format(new Date(endDate))}`;
}

export function getDeltaDirection(value: number): MetricDelta['direction'] {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'flat';
}

export function getGenderLabel(value: string) {
  if (value === 'masculino') return 'Masculino';
  if (value === 'feminino') return 'Feminino';
  return value;
}

export function getActivityLabel(value: string) {
  const labels: Record<string, string> = {
    sedentario: 'Sedentário',
    leve: 'Leve',
    moderado: 'Moderado',
    intenso: 'Intenso',
    muito_intenso: 'Muito intenso',
  };

  return labels[value] ?? value;
}

export function getIMCTone(imc: number) {
  if (imc < 18.5) return 'text-sky-700 bg-sky-100';
  if (imc < 25) return 'text-emerald-700 bg-emerald-100';
  if (imc < 30) return 'text-amber-700 bg-amber-100';
  return 'text-rose-700 bg-rose-100';
}
