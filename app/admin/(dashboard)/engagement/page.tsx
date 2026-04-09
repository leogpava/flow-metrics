'use client';

import { useEffect, useState } from 'react';
import { Mail, MessageSquare, SmilePlus, TrendingUp } from 'lucide-react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartCard } from '@/features/admin/components/ChartCard';
import { EmptyState } from '@/features/admin/components/EmptyState';
import { ErrorState } from '@/features/admin/components/ErrorState';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton';
import { MetricCard } from '@/features/admin/components/MetricCard';
import { SectionHeader } from '@/features/admin/components/SectionHeader';
import { fetchAdminJson } from '@/features/admin/services/api-client';
import type { AdminDateRange, AdminEngagementResponse } from '@/features/admin/types/dashboard';
import { getDefaultAdminDateRange } from '@/features/admin/utils/date';
import { formatDateTime, formatDecimal, formatNumber, formatPercent } from '@/features/admin/utils/format';

const COLORS = ['#86efac', '#fdba74', '#fda4af'];

export default function AdminEngagementPage() {
  const [range, setRange] = useState<AdminDateRange>(getDefaultAdminDateRange());
  const [data, setData] = useState<AdminEngagementResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAdminJson<AdminEngagementResponse>('/api/admin/engagement', range);
        if (active) setData(response);
      } catch (fetchError) {
        if (active) setError(fetchError instanceof Error ? fetchError.message : 'Falha ao carregar a análise de engajamento.');
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

  if (data.summary.totalSessions === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader eyebrow="Engajamento" title="Relacionamento e NPS" description="Leitura de resposta emocional, e-mail e satisfação no fluxo." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
        <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
        <EmptyState title="Sem dados de engajamento" message="Nenhuma sessão com indicadores de relacionamento foi encontrada no período selecionado." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Engajamento" title="Relacionamento e NPS" description="Leitura de resposta emocional, e-mail e satisfação no fluxo." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
      <FilterBar range={range} onRangeChange={setRange} isLoading={isLoading} />
      {error ? <ErrorState title="Dados parciais" message={error} /> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Sessões no período" value={formatNumber(data.summary.totalSessions)} description="Base total considerada para os indicadores de relacionamento." icon={MessageSquare} tone="purple" />
        <MetricCard title="Taxa de e-mail enviado" value={formatPercent(data.summary.emailSentRate)} description="Percentual de sessões com relatório enviado ao usuário." icon={Mail} tone="green" />
        <MetricCard title="Respondentes NPS" value={formatNumber(data.summary.npsRespondents)} description="Sessões com nota de NPS registrada no período." icon={SmilePlus} tone="blue" />
        <MetricCard title="NPS score" value={formatDecimal(data.summary.npsScore, 1)} description="Cálculo clássico: promotores menos detratores sobre o total de respostas." icon={TrendingUp} tone="orange" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Distribuição de NPS" description="Participação de promotores, neutros e detratores.">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={data.distribution} dataKey="value" nameKey="label" innerRadius={70} outerRadius={105} paddingAngle={3}>{data.distribution.map((entry, index) => <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Tendência de NPS" description="Evolução diária da nota média entre as respostas recebidas.">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.charts.npsTrend}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <ChartCard title="Entrega de e-mails" description="Percentual diário de relatórios enviados em relação às sessões concluídas.">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.charts.emailTrend}><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} /><YAxis stroke="#64748b" tickLine={false} axisLine={false} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
