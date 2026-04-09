'use client';

import { useEffect, useState } from 'react';
import { HeartPulse, Star, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartCard } from '@/features/admin/components/ChartCard';
import { EmptyState } from '@/features/admin/components/EmptyState';
import { ErrorState } from '@/features/admin/components/ErrorState';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton';
import { MetricCard } from '@/features/admin/components/MetricCard';
import { SectionHeader } from '@/features/admin/components/SectionHeader';
import { fetchAdminJson } from '@/features/admin/services/api-client';
import type { AdminDateRange, AdminHealthResponse } from '@/features/admin/types/dashboard';
import { getDefaultAdminDateRange } from '@/features/admin/utils/date';
import { formatDateTime, formatDecimal, formatNumber } from '@/features/admin/utils/format';

const COLORS = ['#c4b5fd', '#93c5fd', '#86efac', '#fdba74', '#fda4af'];

export default function AdminHealthPage() {
  const [range, setRange] = useState<AdminDateRange>(getDefaultAdminDateRange());
  const [data, setData] = useState<AdminHealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAdminJson<AdminHealthResponse>('/api/admin/health', range);
        if (active) setData(response);
      } catch (fetchError) {
        if (active) setError(fetchError instanceof Error ? fetchError.message : 'Falha ao carregar a análise de saúde.');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [range.endDate, range.startDate]);

  if (!data && isLoading) return <LoadingSkeleton />;
  if (error && !data) return <ErrorState message={error} />;
  if (!data) return null;

  if (data.summary.totalUsers === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader eyebrow="Saúde" title="Saúde da base" description="Tendências de IMC e score por faixas demográficas." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
        <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
        <EmptyState title="Sem dados de saúde no período" message="Ajuste o filtro de datas para carregar tendências e comparativos." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Saúde" title="Saúde da base" description="Tendências de IMC e score por faixas demográficas." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
      <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
      {error ? <ErrorState title="Dados parciais" message={error} /> : null}
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard title="Usuários analisados" value={formatNumber(data.summary.totalUsers)} description="Base com sessão válida no período filtrado." icon={Users} tone="purple" />
        <MetricCard title="IMC médio" value={formatDecimal(data.summary.averageIMC, 1)} description="Consolidação do IMC calculado nas sessões registradas." icon={HeartPulse} tone="orange" />
        <MetricCard title="Score médio" value={formatDecimal(data.summary.averageScore, 1)} description="Nível médio de saúde percebida segundo o score do produto." icon={Star} tone="green" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Tendência de IMC" description="Comportamento diário do IMC médio no período.">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.charts.imcTrend}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Tendência de score" description="Média diária do score FlowMetrics nas sessões concluídas.">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.charts.scoreTrend}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Saúde por sexo" description="Comparativo de score médio por segmento de sexo.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.segments.byGender}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="averageScore" radius={[10, 10, 0, 0]}>{data.segments.byGender.map((entry, index) => <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Saúde por faixa etária" description="Comparativo de IMC médio por grupo de idade.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.segments.byAgeRange}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="averageIMC" radius={[10, 10, 0, 0]}>{data.segments.byAgeRange.map((entry, index) => <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
