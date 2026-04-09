'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Ruler, UserRound, Weight } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartCard } from '@/features/admin/components/ChartCard';
import { EmptyState } from '@/features/admin/components/EmptyState';
import { ErrorState } from '@/features/admin/components/ErrorState';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton';
import { MetricCard } from '@/features/admin/components/MetricCard';
import { SectionHeader } from '@/features/admin/components/SectionHeader';
import { fetchAdminJson } from '@/features/admin/services/api-client';
import type { AdminDateRange, AdminDemographicsResponse } from '@/features/admin/types/dashboard';
import { getDefaultAdminDateRange } from '@/features/admin/utils/date';
import { formatDateTime, formatDecimal, formatNumber } from '@/features/admin/utils/format';

const COLORS = ['#c4b5fd', '#93c5fd', '#86efac', '#fdba74', '#fda4af'];

export default function AdminDemographicsPage() {
  const [range, setRange] = useState<AdminDateRange>(getDefaultAdminDateRange());
  const [data, setData] = useState<AdminDemographicsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAdminJson<AdminDemographicsResponse>('/api/admin/demographics', range);
        if (active) setData(response);
      } catch (fetchError) {
        if (active) setError(fetchError instanceof Error ? fetchError.message : 'Falha ao carregar a análise demográfica.');
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
        <SectionHeader eyebrow="Demografia" title="Perfil da base" description="Distribuições demográficas e medidas físicas da base registrada." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
        <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
        <EmptyState title="Sem dados demográficos no período" message="Amplie o intervalo para recuperar a composição da base de usuários." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Demografia" title="Perfil da base" description="Distribuições demográficas e medidas físicas da base registrada." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
      <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
      {error ? <ErrorState title="Dados parciais" message={error} /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Usuários analisados" value={formatNumber(data.summary.totalUsers)} description="Total de sessões com dados demográficos válidos." icon={UserRound} tone="purple" />
        <MetricCard title="Peso médio" value={`${formatDecimal(data.summary.averageWeight, 1)} kg`} description="Peso médio informado nas sessões do período." icon={Weight} tone="green" />
        <MetricCard title="Altura média" value={`${formatDecimal(data.summary.averageHeight, 1)} cm`} description="Altura média registrada nas sessões do período." icon={Ruler} tone="blue" />
        <MetricCard title="Faixa de peso" value={`${formatDecimal(data.measurements.weight.min, 0)}-${formatDecimal(data.measurements.weight.max, 0)} kg`} description="Amplitude observada de peso na base filtrada." icon={BarChart3} tone="orange" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Distribuição por sexo" description="Volume de sessões por segmento de sexo.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.distributions.byGender}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="count" radius={[10, 10, 0, 0]}>{data.distributions.byGender.map((entry, index) => <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Distribuição por faixa etária" description="Volume de sessões por grupo de idade.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.distributions.byAgeRange}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="count" radius={[10, 10, 0, 0]}>{data.distributions.byAgeRange.map((entry, index) => <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <ChartCard title="Nível de atividade" description="Composição da base por rotina de atividade física declarada.">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data.distributions.byActivity}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Bar dataKey="count" radius={[10, 10, 0, 0]}>{data.distributions.byActivity.map((entry, index) => <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
