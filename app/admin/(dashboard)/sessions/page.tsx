'use client';

import { useEffect, useMemo, useState } from 'react';

import { EmptyState } from '@/features/admin/components/EmptyState';
import { ErrorState } from '@/features/admin/components/ErrorState';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton';
import { SectionHeader } from '@/features/admin/components/SectionHeader';
import { SessionsTable } from '@/features/admin/components/SessionsTable';
import { fetchAdminJson } from '@/features/admin/services/api-client';
import type { AdminDateRange, AdminSessionsResponse } from '@/features/admin/types/dashboard';
import { getDefaultAdminDateRange } from '@/features/admin/utils/date';
import { formatDateTime } from '@/features/admin/utils/format';

export default function AdminSessionsPage() {
  const [range, setRange] = useState<AdminDateRange>(getDefaultAdminDateRange());
  const [sexo, setSexo] = useState('');
  const [atividade, setAtividade] = useState('');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AdminSessionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams({
      startDate: range.startDate,
      endDate: range.endDate,
      page: String(page),
      pageSize: '20',
    });

    if (sexo) searchParams.set('sexo', sexo);
    if (atividade) searchParams.set('atividade', atividade);
    if (minScore) searchParams.set('minScore', minScore);
    if (maxScore) searchParams.set('maxScore', maxScore);

    return searchParams;
  }, [atividade, maxScore, minScore, page, range.endDate, range.startDate, sexo]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAdminJson<AdminSessionsResponse>('/api/admin/sessions', params);
        if (active) setData(response);
      } catch (fetchError) {
        if (active) setError(fetchError instanceof Error ? fetchError.message : 'Falha ao carregar as sessões.');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [params]);

  if (!data && isLoading) return <LoadingSkeleton />;
  if (error && !data) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Sessões" title="Sessões detalhadas" description="Consulta operacional com filtros por sexo, atividade e score." meta={`Atualizado em ${formatDateTime(data.generatedAt)}`} />
      <FilterBar range={range} onRangeChange={(nextRange) => { setRange(nextRange); setPage(1); }} isLoading={isLoading}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm text-slate-600"><span className="mb-1.5 block font-medium">Sexo</span><select value={sexo} onChange={(event) => { setSexo(event.target.value); setPage(1); }} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-slate-400"><option value="">Todos</option><option value="masculino">Masculino</option><option value="feminino">Feminino</option></select></label>
          <label className="text-sm text-slate-600"><span className="mb-1.5 block font-medium">Atividade</span><select value={atividade} onChange={(event) => { setAtividade(event.target.value); setPage(1); }} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-slate-400"><option value="">Todas</option><option value="sedentario">Sedentário</option><option value="leve">Leve</option><option value="moderado">Moderado</option><option value="intenso">Intenso</option><option value="muito_intenso">Muito intenso</option></select></label>
          <label className="text-sm text-slate-600"><span className="mb-1.5 block font-medium">Score mínimo</span><input type="number" min="0" max="100" value={minScore} onChange={(event) => { setMinScore(event.target.value); setPage(1); }} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-slate-400" /></label>
          <label className="text-sm text-slate-600"><span className="mb-1.5 block font-medium">Score máximo</span><input type="number" min="0" max="100" value={maxScore} onChange={(event) => { setMaxScore(event.target.value); setPage(1); }} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-slate-400" /></label>
        </div>
      </FilterBar>
      {error ? <ErrorState title="Dados parciais" message={error} /> : null}
      {data.sessions.length === 0 ? <EmptyState title="Nenhuma sessão encontrada" message="Tente ampliar o período ou reduzir os filtros avançados." /> : <SessionsTable sessions={data.sessions} page={data.pagination.page} totalPages={data.pagination.totalPages} total={data.pagination.total} onPageChange={setPage} />}
    </div>
  );
}
