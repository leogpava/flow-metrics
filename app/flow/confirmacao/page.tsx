'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Share2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CSSProperties, useEffect, useMemo, useState } from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { StepTransition } from '@/components/ui/StepTransition';
import { useFlowHydrated, useFlowStore } from '@/features/flow/hooks/useFlowStore';
import { saveNps } from '@/features/flow/services/session-client';
import { cn } from '@/lib/utils';

const particles = [
  { x: '-56px', y: '-68px', color: '#a8c8f8', delay: '0s' },
  { x: '18px', y: '-74px', color: '#c4b5f4', delay: '0.04s' },
  { x: '64px', y: '-28px', color: '#f0c4e8', delay: '0.08s' },
  { x: '72px', y: '18px', color: '#a8c8f8', delay: '0.12s' },
  { x: '28px', y: '68px', color: '#c4b5f4', delay: '0.16s' },
  { x: '-24px', y: '70px', color: '#f0c4e8', delay: '0.2s' },
  { x: '-68px', y: '22px', color: '#a8c8f8', delay: '0.24s' },
  { x: '-44px', y: '-24px', color: '#c4b5f4', delay: '0.28s' }
];

export default function ConfirmacaoPage() {
  const router = useRouter();
  const hydrated = useFlowHydrated();
  const userData = useFlowStore((state) => state.userData);
  const metrics = useFlowStore((state) => state.metrics);
  const email = useFlowStore((state) => state.email);
  const emailSent = useFlowStore((state) => state.emailSent);
  const sessionId = useFlowStore((state) => state.sessionId);
  const reset = useFlowStore((state) => state.reset);

  const [selectedNps, setSelectedNps] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!metrics || !userData.nome) {
      router.replace('/flow/dados');
      return;
    }
    if (!email || !emailSent) {
      router.replace('/flow/email');
    }
  }, [email, emailSent, hydrated, metrics, router, userData.nome]);

  const shareText = useMemo(() => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return `Fiz minha análise de saúde no FlowMetrics e tirei ${metrics?.score ?? 0} pontos! Testa você também: ${appUrl}`;
  }, [metrics?.score]);

  async function handleNpsSelect(value: number) {
    setSelectedNps(value);
    await saveNps(sessionId, value);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard error:', error);
    }
  }

  if (!hydrated || !metrics || !userData.nome || !email || !emailSent) {
    return <GlassCard className="min-h-[520px] animate-pulse bg-white/35" />;
  }

  return (
    <GlassCard className="relative max-h-[calc(100dvh-122px)] overflow-y-auto p-6 text-center sm:p-8">
      <div className="relative mx-auto flex w-fit items-center justify-center">
        {particles.map((particle) => (
          <span key={`${particle.x}-${particle.y}`} className="pointer-events-none absolute h-3 w-3 animate-particle rounded-full opacity-0" style={{ backgroundColor: particle.color, animationDelay: particle.delay, ['--x' as string]: particle.x, ['--y' as string]: particle.y } as CSSProperties} />
        ))}

        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6, type: 'spring', bounce: 0.35 }} className="flex h-20 w-20 items-center justify-center rounded-full border border-flow-success/70 bg-[rgba(45,212,160,0.20)] backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-flow-success">
            <Check className="h-7 w-7 text-white" />
          </div>
        </motion.div>
      </div>

      <StepTransition delay={0.3} className="mt-6 space-y-2">
        <h1 className="text-[28px] font-bold text-flow-text">Relatório enviado!</h1>
        <p className="text-base text-flow-text-soft">Chegará em até 2 minutos.</p>
      </StepTransition>

      <StepTransition delay={0.5} className="mt-6">
        <GlassCard className="bg-white/48" padding="md">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-flow-accent"><Sparkles className="h-4 w-4" />Participante FlowMetrics</div>
          <p className="mt-2 text-xs text-flow-text-muted">Experimento de saúde - {new Date().getFullYear()}</p>
        </GlassCard>
      </StepTransition>

      <StepTransition delay={0.7} className="mt-7">
        <p className="mx-auto max-w-sm text-sm font-medium text-flow-text">De 0 a 10, você recomendaria para um amigo?</p>
        <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-11">
          {Array.from({ length: 11 }, (_, value) => (
            <button key={value} onClick={() => void handleNpsSelect(value)} className={cn('h-11 rounded-full border text-sm font-semibold transition', selectedNps === value ? 'border-flow-accent bg-flow-accent text-white' : 'border-white/80 bg-white/28 text-flow-text')}>
              {value}
            </button>
          ))}
        </div>
      </StepTransition>

      <StepTransition delay={0.9} className="mt-7">
        <PillButton variant="secondary" fullWidth onClick={handleCopy} icon={<Share2 className="h-4 w-4" />}>
          {copied ? 'Copiado!' : 'Compartilhar resultado'}
        </PillButton>
      </StepTransition>

      <StepTransition delay={1} className="mt-5">
        <button onClick={() => { reset(); router.push('/flow/dados'); }} className="inline-flex items-center gap-2 text-sm font-medium text-flow-text-soft transition hover:text-flow-accent">
          Fazer nova análise
          <ArrowRight className="h-4 w-4" />
        </button>
      </StepTransition>
    </GlassCard>
  );
}
