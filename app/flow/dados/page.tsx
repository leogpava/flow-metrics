'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SliderInput } from '@/components/ui/SliderInput';
import { atividadeLabels, calcularIMC, calcularScore, classificarIMC, classificarScore, calcularTMB, calcularGET, calcularHidratacao, labelPercentil } from '@/features/flow/lib/calculations';
import { gerarInsight } from '@/features/flow/services/insights';
import { saveSession } from '@/features/flow/services/session-client';
import { useFlowHydrated, useFlowStore } from '@/features/flow/hooks/useFlowStore';
import { ActivityLevel, HealthMetrics, UserData } from '@/types/flow';
import { cn } from '@/lib/utils';

const steps = ['identidade', 'idade', 'peso', 'altura', 'atividade'] as const;
const activityEntries = Object.entries(atividadeLabels) as [ActivityLevel, (typeof atividadeLabels)[ActivityLevel]][];

function LoadingState() {
  return <GlassCard className="flex min-h-[520px] items-center justify-center"><LoaderCircle className="h-8 w-8 animate-spin text-flow-accent" /></GlassCard>;
}

export default function DadosPage() {
  const router = useRouter();
  const hydrated = useFlowHydrated();
  const sessionId = useFlowStore((state) => state.sessionId);
  const storedUserData = useFlowStore((state) => state.userData);
  const setUserData = useFlowStore((state) => state.setUserData);
  const setMetrics = useFlowStore((state) => state.setMetrics);
  const setStep = useFlowStore((state) => state.setStep);

  const [step, setLocalStep] = useState(0);
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState<UserData['sexo'] | null>(null);
  const [idade, setIdade] = useState(28);
  const [peso, setPeso] = useState(70);
  const [altura, setAltura] = useState(170);
  const [atividade, setAtividade] = useState<ActivityLevel | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setNome(storedUserData.nome ?? '');
    setSexo(storedUserData.sexo ?? null);
    setIdade(storedUserData.idade ?? 28);
    setPeso(storedUserData.peso ?? 70);
    setAltura(storedUserData.altura ?? 170);
    setAtividade(storedUserData.atividade ?? null);
    setLocalStep(Math.min(useFlowStore.getState().step, steps.length - 1));
  }, [hydrated, storedUserData]);

  const canContinue = useMemo(() => {
    if (step === 0) return nome.trim().length > 0 && !!sexo;
    if (step === 4) return !!atividade;
    return true;
  }, [atividade, nome, sexo, step]);

  async function finalizeFlow() {
    if (!sexo || !atividade || !nome.trim()) return;
    setIsSaving(true);

    const userData: UserData = { nome: nome.trim(), sexo, idade, peso, altura, atividade };
    const imc = calcularIMC(peso, altura);
    const imcClassification = classificarIMC(imc);
    const score = calcularScore(imc, atividade);
    const scoreLevel = classificarScore(score);
    const insight = await gerarInsight({ nome: userData.nome, imc, imcClassification, atividade, score });
    const tmb = calcularTMB(peso, altura, idade, sexo);
    const get = calcularGET(tmb, atividade);
    const hidratacao = calcularHidratacao(peso, atividade);
    const { texto: percentilIMC, contexto: percentilContexto } = labelPercentil(imc);

    const metrics: HealthMetrics = { imc, imcClassification, score, scoreLevel, insight, tmb, get, hidratacao, percentilIMC, percentilContexto };

    setUserData(userData);
    setMetrics(metrics);
    setStep(steps.length);

    await saveSession(sessionId, userData, metrics);
    router.push('/flow/resultado');
  }

  function handleNext() {
    if (!canContinue || isSaving) return;
    if (step === steps.length - 1) {
      void finalizeFlow();
      return;
    }
    const next = step + 1;
    setLocalStep(next);
    setStep(next);
  }

  function handleBack() {
    if (step === 0 || isSaving) return;
    const previous = step - 1;
    setLocalStep(previous);
    setStep(previous);
  }

  if (!hydrated) {
    return <LoadingState />;
  }

  return (
    <GlassCard className="flex min-h-[520px] max-h-[calc(100dvh-122px)] flex-col overflow-y-auto p-0 sm:min-h-[560px]">
      <div className="p-4 pb-0 sm:p-6 sm:pb-0"><ProgressBar value={((step + 1) / steps.length) * 100} /></div>
      <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-6 sm:px-8 sm:pb-8">
        <div className="min-h-[320px] flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={steps[step]} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2"><h1 className="text-[32px] font-bold leading-tight text-flow-text">Olá! Como posso te chamar?</h1><p className="text-sm text-flow-text-soft">Vamos começar com o básico para personalizar sua leitura.</p></div>
                  <input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Seu primeiro nome" className="glass-input h-14 w-full rounded-2xl px-5 text-base text-flow-text outline-none transition focus:border-flow-accent" />
                  <div className="grid grid-cols-2 gap-3">{([{ value: 'masculino', label: 'Masculino' }, { value: 'feminino', label: 'Feminino' }] as const).map((option) => (
                    <motion.button key={option.value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setSexo(option.value)} className={cn('h-14 rounded-full border text-sm font-semibold transition', sexo === option.value ? 'border-white/40 bg-flow-accent text-white' : 'border-white/80 bg-white/20 text-flow-text')}>
                      {option.label}
                    </motion.button>
                  ))}</div>
                </div>
              )}
              {step === 1 && <div className="space-y-6"><div className="space-y-2"><h2 className="text-[32px] font-bold leading-tight text-flow-text">Quantos anos você tem, {nome || 'você'}?</h2><p className="text-sm text-flow-text-soft">Uma referência simples já basta.</p></div><SliderInput min={16} max={80} value={idade} onChange={setIdade} unit="anos" label="Sua idade" /></div>}
              {step === 2 && <div className="space-y-6"><div className="space-y-2"><h2 className="text-[32px] font-bold leading-tight text-flow-text">Qual é o seu peso aproximado?</h2><p className="text-sm text-flow-text-soft">Não precisa ser exato. Uma estimativa já funciona.</p></div><SliderInput min={40} max={150} step={0.5} value={peso} onChange={setPeso} unit="kg" label="Seu peso" hint="Não precisa ser exato - uma estimativa já funciona" /></div>}
              {step === 3 && <div className="space-y-6"><div className="space-y-2"><h2 className="text-[32px] font-bold leading-tight text-flow-text">E sua altura?</h2><p className="text-sm text-flow-text-soft">Essa medida ajuda a calcular seu IMC com mais precisão.</p></div><SliderInput min={140} max={210} value={altura} onChange={setAltura} unit="cm" label="Sua altura" /></div>}
              {step === 4 && <div className="space-y-6"><div className="space-y-2"><h2 className="text-[32px] font-bold leading-tight text-flow-text">Como você descreveria sua atividade física?</h2><p className="text-sm text-flow-text-soft">Escolha a opção que mais parece com sua rotina atual.</p></div><div className="space-y-3">{activityEntries.map(([key, item]) => (
                <motion.button key={key} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setAtividade(key)} className={cn('w-full rounded-[20px] border px-5 py-4 text-left transition', atividade === key ? 'border-flow-accent bg-[rgba(237,233,255,0.72)]' : 'border-white/80 bg-white/26')}>
                  <div className="text-base font-semibold text-flow-text">{item.label}</div><div className="mt-1 text-sm text-flow-text-soft">{item.sublabel}</div>
                </motion.button>
              ))}</div></div>}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {step > 0 && <PillButton variant="secondary" onClick={handleBack} className="sm:w-auto" icon={<ArrowLeft className="h-4 w-4" />}>Voltar</PillButton>}
          <PillButton onClick={handleNext} disabled={!canContinue || isSaving} fullWidth icon={isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}>
            {step === steps.length - 1 ? 'Gerar minha análise' : 'Próximo'}
          </PillButton>
        </div>
      </div>
    </GlassCard>
  );
}
