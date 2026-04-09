'use client';

import { motion } from 'framer-motion';
import { Activity, ArrowRight, Droplets, Flame, Scale, Sparkles, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { IMCScaleBar } from '@/components/ui/IMCScaleBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { PillButton } from '@/components/ui/PillButton';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { StepTransition } from '@/components/ui/StepTransition';
import { WaterDropsIndicator } from '@/components/ui/WaterDropsIndicator';
import { atividadeLabels, imcLabels, scoreLevelMeta } from '@/features/flow/lib/calculations';
import { useFlowHydrated, useFlowStore } from '@/features/flow/hooks/useFlowStore';

function LoadingResult() {
  return <GlassCard className="min-h-[520px] animate-pulse bg-white/35" />;
}

function MetricGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-3">
      <p className="break-words pr-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-flow-text-muted [overflow-wrap:anywhere]">
        {label}
      </p>
      <div className="grid min-w-0 grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

export default function ResultadoPage() {
  const router = useRouter();
  const hydrated = useFlowHydrated();
  const userData = useFlowStore((state) => state.userData);
  const metrics = useFlowStore((state) => state.metrics);

  useEffect(() => {
    if (!hydrated) return;
    if (!metrics || !userData.nome) {
      router.replace('/flow/dados');
    }
  }, [hydrated, metrics, router, userData.nome]);

  if (!hydrated || !metrics || !userData.nome || !userData.atividade) {
    return <LoadingResult />;
  }

  const imcMeta = imcLabels[metrics.imcClassification];
  const activityMeta = atividadeLabels[userData.atividade];
  const scoreMeta = scoreLevelMeta[metrics.scoreLevel];

  return (
    <div className="min-w-0 max-w-full space-y-4 overflow-x-clip">
      <GlassCard className="max-h-[calc(100dvh-122px)] max-w-full overflow-x-clip overflow-y-auto p-5 sm:p-8">
        <StepTransition delay={0} className="min-w-0 space-y-1">
          <h1 className="break-words text-[clamp(1.25rem,6vw,1.375rem)] font-bold leading-tight text-flow-text [overflow-wrap:anywhere]">
            Olá, {userData.nome}!
          </h1>
          <p className="mt-1 break-words text-[14px] leading-6 text-flow-text-soft [overflow-wrap:anywhere]">Aqui está sua análise completa.</p>
        </StepTransition>

        <StepTransition delay={0.2} className="mt-8 flex min-w-0 flex-col items-center text-center">
          <div className="max-w-full">
            <ScoreRing score={metrics.score}>
              <div className="flex min-w-0 flex-col items-center px-2">
                <span className="text-[clamp(2.75rem,12vw,3.25rem)] font-bold leading-none text-flow-text">{metrics.score}</span>
                <span className="mt-2 text-sm text-flow-text-soft">pontos</span>
              </div>
            </ScoreRing>
          </div>
          <div
            className={`mt-5 inline-flex max-w-full break-words rounded-full px-4 py-2 text-center text-sm font-semibold leading-5 [overflow-wrap:anywhere] ${scoreMeta.softClassName}`}
          >
            {scoreMeta.label}
          </div>
        </StepTransition>

        <StepTransition delay={0.5} className="mt-8">
          <MetricGroup label="MÉTRICAS PRINCIPAIS">
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.45 }}>
              <MetricCard icon={Scale} label="IMC" value={metrics.imc.toFixed(1)} classification={imcMeta.label} extra={<IMCScaleBar imc={metrics.imc} />} />
            </motion.div>
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58, duration: 0.45 }}>
              <MetricCard icon={Activity} label="Atividade" value={activityMeta.label} sublabel={activityMeta.sublabel} />
            </motion.div>
          </MetricGroup>
        </StepTransition>

        <StepTransition delay={0.7} className="mt-8">
          <MetricGroup label="METABOLISMO">
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.45 }}>
              <MetricCard icon={Flame} label="TMB" value={metrics.tmb.toLocaleString('pt-BR')} unit="kcal/dia" sublabel="queimadas em repouso" />
            </motion.div>
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78, duration: 0.45 }}>
              <MetricCard icon={Zap} label="Gasto diário" value={metrics.get.toLocaleString('pt-BR')} unit="kcal/dia" sublabel="para manter seu peso" />
            </motion.div>
          </MetricGroup>
        </StepTransition>

        <StepTransition delay={0.85} className="mt-8">
          <MetricGroup label="BEM-ESTAR">
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.45 }}>
              <MetricCard
                icon={Droplets}
                label="Hidratação"
                value={`${metrics.hidratacao.toFixed(1)} L`}
                sublabel="necessário por dia"
                extra={<WaterDropsIndicator litros={metrics.hidratacao} />}
              />
            </motion.div>
            <motion.div className="min-w-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.93, duration: 0.45 }}>
              <MetricCard icon={Users} label="Percentil IMC" value={metrics.percentilIMC} sublabel={metrics.percentilContexto} />
            </motion.div>
          </MetricGroup>
        </StepTransition>

        <StepTransition delay={1} className="mt-8">
          <GlassCard className="border-l-[3px] border-l-flow-accent bg-white/55" padding="md">
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold text-flow-accent">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span className="break-words [overflow-wrap:anywhere]">Insight FlowMetrics</span>
            </div>
            <p className="mt-3 break-words text-[15px] leading-7 text-flow-text-soft [overflow-wrap:anywhere]">{metrics.insight}</p>
          </GlassCard>
        </StepTransition>

        <StepTransition delay={1.1} className="mt-8">
          <PillButton fullWidth onClick={() => router.push('/flow/email')} icon={<ArrowRight className="h-4 w-4" />}>
            Receber meu relatório completo
          </PillButton>
        </StepTransition>
      </GlassCard>
    </div>
  );
}
