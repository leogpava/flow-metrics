'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, HeartPulse, LayoutDashboard, ListFilter, Users, X } from 'lucide-react';

const navItems = [
  { label: 'Visão geral', href: '/admin', icon: LayoutDashboard },
  { label: 'Saúde', href: '/admin/health', icon: HeartPulse },
  { label: 'Demografia', href: '/admin/demographics', icon: Users },
  { label: 'Engajamento', href: '/admin/engagement', icon: Activity },
  { label: 'Sessões', href: '/admin/sessions', icon: ListFilter },
] as const;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen ? <div className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden" onClick={onClose} /> : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">FlowMetrics</p>
              <p className="text-xs text-slate-500">Admin premium</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Fechar navegação"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">Wellness analytics</p>
          <p className="mt-1 text-xs text-slate-500">Painel operacional para acompanhamento clínico e executivo.</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#ecfeff_100%)] px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Diretriz</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">Leitura executiva</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Foco em métricas confiáveis, estados claros e períodos comparáveis.</p>
        </div>
      </aside>
    </>
  );
}
