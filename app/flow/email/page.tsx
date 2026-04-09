'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle2, LoaderCircle, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { StepTransition } from '@/components/ui/StepTransition';
import { saveEmail, markEmailSent } from '@/features/flow/services/session-client';
import { useFlowHydrated, useFlowStore } from '@/features/flow/hooks/useFlowStore';

const reportItems = [
  'Score FlowMetrics completo',
  'Análise detalhada do IMC',
  'Recomendações personalizadas'
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EmailPage() {
  const router = useRouter();
  const hydrated = useFlowHydrated();
  const userData = useFlowStore((state) => state.userData);
  const metrics = useFlowStore((state) => state.metrics);
  const sessionId = useFlowStore((state) => state.sessionId);
  const storedEmail = useFlowStore((state) => state.email);
  const setEmail = useFlowStore((state) => state.setEmail);
  const setEmailSent = useFlowStore((state) => state.setEmailSent);

  const [email, setEmailInput] = useState(storedEmail || 'leogpava@gmail.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!metrics || !userData.nome) {
      router.replace('/flow/dados');
    }
  }, [hydrated, metrics, router, userData.nome]);

  useEffect(() => {
    setEmailInput(storedEmail || 'leogpava@gmail.com');
  }, [storedEmail]);

  const validEmail = useMemo(() => isValidEmail(email), [email]);

  async function handleSubmit() {
    if (!validEmail || loading || !metrics || !userData.nome) return;

    setLoading(true);
    setError(null);

    try {
      // Usar sempre leogpava@gmail.com para testes
      const targetEmail = 'leogpava@gmail.com';
      setEmail(targetEmail);

      // Salvar e-mail no Supabase primeiro
      await saveEmail(sessionId, targetEmail);

      // Chamar a API route de envio
      const response = await fetch('/api/enviar-relatorio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          nome: userData.nome,
          sexo: userData.sexo,
          idade: userData.idade,
          atividade: userData.atividade,
          imc: metrics.imc,
          imcClassification: metrics.imcClassification,
          score: metrics.score,
          scoreLevel: metrics.scoreLevel,
          insight: metrics.insight,
          tmb: metrics.tmb,
          get: metrics.get,
          hidratacao: metrics.hidratacao,
          percentilIMC: metrics.percentilIMC,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha no envio');
      }

      // Marcar como enviado no Supabase
      await markEmailSent(sessionId);

      setEmailSent(true);
      router.push('/flow/confirmacao');
    } catch (err) {
      console.error('Erro ao enviar e-mail:', err);
      setError('Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated || !metrics || !userData.nome) {
    return <GlassCard className="min-h-[520px] animate-pulse bg-white/35" />;
  }

  return (
    <GlassCard className="max-h-[calc(100dvh-122px)] overflow-y-auto p-6 sm:p-8">
      <StepTransition className="space-y-2">
        <h1 className="text-[26px] font-bold leading-tight text-flow-text">Seu relatório está pronto, {userData.nome}.</h1>
        <p className="text-base text-flow-text-soft">Onde devo enviar?</p>
      </StepTransition>

      <StepTransition delay={0.15} className="mt-6">
        <label className="relative block">
          <input
            type="email"
            value={email}
            disabled
            placeholder="seu@email.com"
            className="glass-input h-14 w-full rounded-[14px] px-5 pr-12 text-base text-flow-text outline-none transition focus:border-flow-accent opacity-60"
          />
          {validEmail && <Check className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-flow-success" />}
        </label>
        <p className="mt-2 text-xs text-flow-text-muted">Email de teste: leogpava@gmail.com</p>
      </StepTransition>

      <div className="mt-7 space-y-3">
        {reportItems.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-2xl bg-white/24 px-4 py-3"
          >
            <CheckCircle2 className="h-5 w-5 text-flow-success" />
            <span className="text-sm text-flow-text">{item}</span>
          </motion.div>
        ))}
      </div>

      <StepTransition delay={0.5} className="mt-7">
        <PillButton
          fullWidth
          disabled={!validEmail || loading}
          onClick={handleSubmit}
          icon={loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        >
          {loading ? 'Enviando...' : 'Enviar meu relatório'}
        </PillButton>
        {error && (
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-center text-[13px] text-red-400">{error}</motion.p>
        )}
      </StepTransition>

      <StepTransition delay={0.6} className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-flow-text-muted">
        <Lock className="h-4 w-4" />
        <span>Sem spam. Apenas este e-mail.</span>
      </StepTransition>
    </GlassCard>
  );
}
