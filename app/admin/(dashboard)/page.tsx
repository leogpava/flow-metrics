'use client';

import { useEffect, useState } from 'react';
import { Activity, HeartPulse, Star, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartCard } from '@/features/admin/components/ChartCard';
import { EmptyState } from '@/features/admin/components/EmptyState';
import { ErrorState } from '@/features/admin/components/ErrorState';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton';
import { MetricCard } from '@/features/admin/components/MetricCard';
import { SectionHeader } from '@/features/admin/components/SectionHeader';
import { fetchAdminJson } from '@/features/admin/services/api-client';
import type { AdminDateRange, AdminOverviewResponse } from '@/features/admin/types/dashboard';
import { getDefaultAdminDateRange } from '@/features/admin/utils/date';
import { formatDateTime, formatDecimal, formatNumber, formatPercent } from '@/features/admin/utils/format';

const PIE_COLORS = ['#c4b5fd', '#93c5fd', '#86efac', '#fdba74', '#fda4af'];
const BAR_COLORS = ['#c4b5fd', '#93c5fd', '#86efac', '#fdba74', '#fda4af'];

export default function AdminDashboardPage() {
  const [range, setRange] = useState<AdminDateRange>(getDefaultAdminDateRange());
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAdminJson<AdminOverviewResponse>('/api/admin/dashboard', range);
        if (active) {
          setData(response);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : 'Falha ao carregar a visão geral.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
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

  if (data.metrics.totalUsers === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader eyebrow="Admin" title="Visão geral" description="Painel executivo com métricas centrais de aquisição, conclusão e saúde da base FlowMetrics." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
        <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
        <EmptyState title="Nenhuma sessão encontrada no período" message="Ajuste o intervalo de datas para visualizar métricas consolidadas do produto." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Admin" title="Visão geral" description="Painel executivo com métricas centrais de aquisição, conclusão e saúde da base FlowMetrics." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
      <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
      {error ? <ErrorState title="Dados parciais" message={error} /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Usuários no período" value={formatNumber(data.metrics.totalUsers)} description="Total de sessões registradas no intervalo selecionado." icon={Users} tone="purple" delta={data.deltas.totalUsers} />
        <MetricCard title="Taxa de conclusão" value={formatPercent(data.metrics.completionRate)} description="Sessões que chegaram a um score válido dentro do fluxo." icon={Activity} tone="green" delta={data.deltas.completionRate} />
        <MetricCard title="Score médio" value={formatDecimal(data.metrics.averageScore, 1)} description="Média do score FlowMetrics nas sessões concluídas." icon={Star} tone="blue" delta={data.deltas.averageScore} />
        <MetricCard title="IMC médio" value={formatDecimal(data.metrics.averageIMC, 1)} description="Indicador agregado da composição corporal do período." icon={HeartPulse} tone="orange" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.6fr,1fr]">
        <ChartCard title="Evolução do score médio" description="Leitura diária do score FlowMetrics nas sessões concluídas.">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.charts.scoreTrend}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Distribuição de IMC" description="Composição da base por faixas de IMC no período filtrado.">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.charts.imcDistribution} dataKey="value" nameKey="label" innerRadius={70} outerRadius={105} paddingAngle={3}>
                {data.charts.imcDistribution.map((entry, index) => <Cell key={entry.key} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr,0.8fr]">
        <ChartCard title="Níveis de atividade" description="Distribuição dos perfis de atividade informados nas sessões.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.charts.activityDistribution}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.charts.activityDistribution.map((entry, index) => <Cell key={entry.key} fill={BAR_COLORS[index % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Qualidade da base" description="Indicadores rápidos para leitura operacional do período.">
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">NPS médio</p><p className="mt-2 text-2xl font-semibold text-slate-900">{data.metrics.averageNPS === null ? 'Sem resposta' : formatDecimal(data.metrics.averageNPS, 1)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Taxa de e-mail enviado</p><p className="mt-2 text-2xl font-semibold text-slate-900">{formatPercent(data.metrics.emailSentRate)}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Usuários ativos em 7 dias</p><p className="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.metrics.activeUsersLast7Days)}</p></div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
