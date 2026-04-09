'use client';

import Image from 'next/image';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { adminLogin, isAdminAuthenticated } from '@/features/admin/lib/auth-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const authenticated = await isAdminAuthenticated();
        if (active && authenticated) {
          router.replace('/admin');
          return;
        }
      } finally {
        if (active) {
          setIsChecking(false);
        }
      }
    }

    void checkAuth();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await adminLogin(email, password);

    if (result.success) {
      router.replace('/admin');
      return;
    }

    setError(result.error ?? 'Não foi possível iniciar a sessão.');
    setIsLoading(false);
  };

  if (isChecking) {
    return <div className="min-h-screen bg-[#f6f7fb]" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.05fr,0.95fr]">
        <section className="hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_45%,#ecfeff_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Image src="/flowmetricslogo.png" alt="FlowMetrics" width={28} height={28} className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">FlowMetrics</p>
                <p className="text-xs text-slate-500">Admin analytics</p>
              </div>
            </div>
            <p className="mt-12 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Wellness SaaS</p>
            <h1 className="mt-3 max-w-md text-4xl font-semibold tracking-tight text-slate-900">Painel administrativo para leitura executiva da operação.</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">Acesse métricas de saúde, engajamento e comportamento da base com uma interface clara, estável e pronta para uso diário do time.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Clareza</p>
              <p className="mt-2 text-sm font-medium text-slate-800">KPIs e gráficos com leitura rápida.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Segurança</p>
              <p className="mt-2 text-sm font-medium text-slate-800">Acesso restrito aos logins existentes no Auth.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Consistência</p>
              <p className="mt-2 text-sm font-medium text-slate-800">Português legível e estados robustos.</p>
            </div>
          </div>
        </section>

        <section className="p-8 sm:p-10 lg:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Acesso administrativo</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Entrar no painel</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Use uma conta válida criada no Supabase Auth para abrir o dashboard.</p>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm text-slate-600">
              <span className="mb-2 block font-medium">E-mail</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-slate-400">
                <Mail className="h-4 w-4 text-slate-400" />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@empresa.com" className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400" required />
              </div>
            </label>
            <label className="block text-sm text-slate-600">
              <span className="mb-2 block font-medium">Senha</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-slate-400">
                <Lock className="h-4 w-4 text-slate-400" />
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha administrativa" className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400" required />
              </div>
            </label>

            {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button type="submit" disabled={isLoading} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60">
              {isLoading ? 'Entrando...' : 'Entrar no admin'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
