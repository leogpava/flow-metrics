import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { AdminSessionRow } from '@/features/admin/types/dashboard';
import { formatDateTime, formatDecimal, getActivityLabel, getIMCTone } from '@/features/admin/utils/format';

interface SessionsTableProps {
  sessions: AdminSessionRow[];
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function SessionsTable({ sessions, page, totalPages, total, onPageChange }: SessionsTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Sessão</th>
              <th className="px-5 py-4 font-medium">Perfil</th>
              <th className="px-5 py-4 font-medium">Saúde</th>
              <th className="px-5 py-4 font-medium">Engajamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
            {sessions.map((session) => (
              <tr key={session.id} className="align-top">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{session.nome}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(session.created_at)}</p>
                  <p className="mt-2 text-xs text-slate-400">ID {session.id.slice(0, 8)}</p>
                </td>
                <td className="px-5 py-4">
                  <p>{session.idade} anos</p>
                  <p className="mt-1 text-slate-500">{session.sexo === 'masculino' ? 'Masculino' : 'Feminino'}</p>
                  <p className="mt-1 text-slate-500">{getActivityLabel(session.atividade)}</p>
                  <p className="mt-1 text-slate-500">{formatDecimal(session.peso, 1)} kg • {session.altura} cm</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getIMCTone(session.imc)}`}>
                    IMC {formatDecimal(session.imc, 1)}
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-900">Score {session.score}</p>
                  <p className="mt-1 text-slate-500">TMB {session.tmb ?? 0} kcal • GET {session.get_total ?? 0} kcal</p>
                  <p className="mt-1 text-slate-500">Hidratação {session.hidratacao ?? 0} L • {session.percentil ?? 'Sem percentil'}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">{session.email ?? 'E-mail não informado'}</p>
                  <p className="mt-1 text-slate-500">Envio {session.email_sent ? 'confirmado' : 'pendente'}</p>
                  <p className="mt-1 text-slate-500">NPS {session.nps ?? 'sem resposta'}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Total filtrado: <span className="font-medium text-slate-900">{total}</span></p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="px-3 text-slate-600">Página {page} de {totalPages}</span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
