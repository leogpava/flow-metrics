'use client';

import { motion } from 'framer-motion';
import { Activity, ArrowRight, Droplets, Flame, Scale, Sparkles, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { PillButton } from '@/components/ui/PillButton';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { StepTransition } from '@/components/ui/StepTransition';
import { IMCScaleBar } from '@/components/ui/IMCScaleBar';
import { WaterDropsIndicator } from '@/components/ui/WaterDropsIndicator';
import { atividadeLabels, imcLabels, scoreLevelMeta } from '@/features/flow/lib/calculations';
import { useFlowHydrated, useFlowStore } from '@/features/flow/hooks/useFlowStore';

function LoadingResult() {
  return <GlassCard className="min-h-[520px] animate-pulse bg-white/35" />;
}

function MetricGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-flow-text-muted">{label}</p>
      <div className="grid grid-cols-2 gap-3">{children}</div>
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
    <div className="space-y-4">
      <GlassCard className="max-h-[calc(100dvh-122px)] overflow-y-auto p-6 sm:p-8">
        {/* Seção 1: Saudação */}
        <StepTransition delay={0} className="space-y-1">
          <h1 className="text-[22px] font-bold text-flow-text">Olá, {userData.nome}!</h1>
          <p className="mt-1 text-[14px] text-flow-text-soft">Aqui está sua análise completa.</p>
        </StepTransition>

        {/* Seção 2: Score Ring */}
        <StepTransition delay={0.2} className="mt-8 flex flex-col items-center text-center">
          <ScoreRing score={metrics.score}>
            <div className="flex flex-col items-center"><span className="text-[52px] font-bold leading-none text-flow-text">{metrics.score}</span><span className="mt-2 text-sm text-flow-text-soft">pontos</span></div>
          </ScoreRing>
          <div className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${scoreMeta.softClassName}`}>{scoreMeta.label}</div>
        </StepTransition>

        {/* Seção 3: MÉTRICAS PRINCIPAIS */}
        <StepTransition delay={0.5} className="mt-8">
          <MetricGroup label="MÉTRICAS PRINCIPAIS">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.45 }}>
              <MetricCard icon={Scale} label="IMC" value={metrics.imc.toFixed(1)} classification={imcMeta.label} extra={<IMCScaleBar imc={metrics.imc} />} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58, duration: 0.45 }}>
              <MetricCard icon={Activity} label="Atividade" value={activityMeta.label} sublabel={activityMeta.sublabel} />
            </motion.div>
          </MetricGroup>
        </StepTransition>

        {/* Seção 4: METABOLISMO */}
        <StepTransition delay={0.7} className="mt-8">
          <MetricGroup label="METABOLISMO">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.45 }}>
              <MetricCard icon={Flame} label="TMB" value={metrics.tmb.toLocaleString('pt-BR')} unit="kcal/dia" sublabel="queimadas em repouso" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78, duration: 0.45 }}>
              <MetricCard icon={Zap} label="Gasto diário" value={metrics.get.toLocaleString('pt-BR')} unit="kcal/dia" sublabel="para manter seu peso" />
            </motion.div>
          </MetricGroup>
        </StepTransition>

        {/* Seção 5: BEM-ESTAR */}
        <StepTransition delay={0.85} className="mt-8">
          <MetricGroup label="BEM-ESTAR">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.45 }}>
              <MetricCard icon={Droplets} label="Hidratação" value={`${metrics.hidratacao.toFixed(1)} L`} sublabel="necessário por dia" extra={<WaterDropsIndicator litros={metrics.hidratacao} />} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.93, duration: 0.45 }}>
              <MetricCard icon={Users} label="Percentil IMC" value={metrics.percentilIMC} sublabel={metrics.percentilContexto} />
            </motion.div>
          </MetricGroup>
        </StepTransition>

        {/* Seção 6: Insight */}
        <StepTransition delay={1} className="mt-8">
          <GlassCard className="border-l-[3px] border-l-flow-accent bg-white/55" padding="md">
            <div className="flex items-center gap-2 text-sm font-semibold text-flow-accent"><Sparkles className="h-4 w-4" />Insight FlowMetrics</div>
            <p className="mt-3 text-[15px] leading-7 text-flow-text-soft">{metrics.insight}</p>
          </GlassCard>
        </StepTransition>

        {/* Seção 7: CTA */}
        <StepTransition delay={1.1} className="mt-8">
          <PillButton fullWidth onClick={() => router.push('/flow/email')} icon={<ArrowRight className="h-4 w-4" />}>
            Receber meu relatório completo
          </PillButton>
        </StepTransition>
      </GlassCard>
    </div>
  );
}
