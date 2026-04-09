'use client';

import { LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { adminLogout } from '@/features/admin/lib/auth-client';

interface NavbarProps {
  userName?: string;
  onMenuClick?: () => void;
}

export function Navbar({ userName = 'Admin', onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const result = await adminLogout();

    if (result.success) {
      router.replace('/admin/login');
      return;
    }

    alert(`Erro ao encerrar a sessão: ${result.error}`);
    setIsLoading(false);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            aria-label="Abrir navegação"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Administração</p>
            <h1 className="text-sm font-semibold text-slate-900">Painel analítico FlowMetrics</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
