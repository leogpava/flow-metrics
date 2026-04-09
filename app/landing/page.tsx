'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { FlowLogo } from '@/components/layout/FlowLogo';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillButton } from '@/components/ui/PillButton';

const badges = [
  { icon: UserRoundCheck, label: 'Sem cadastro' },
  { icon: Download, label: 'Sem instalação' },
  { icon: ShieldCheck, label: '100% privado' }
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-[100dvh] flex-col px-5 pb-8 pt-6 text-white sm:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mx-auto w-full max-w-6xl">
        <FlowLogo light />
      </motion.div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center text-center">
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-[40px] font-normal leading-none text-white/80 drop-shadow-[0_12px_30px_rgba(30,24,78,0.16)]">
          Sua saúde em
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="mt-2 text-[48px] font-bold leading-none text-white drop-shadow-[0_16px_34px_rgba(30,24,78,0.18)]">
          3 minutos.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: 0.35 }} className="mt-5 max-w-md text-base text-white/70">
          Análise personalizada + relatório no e-mail. Grátis.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
          <PillButton onClick={() => router.push('/flow/dados')} className="h-14 min-w-[250px] px-10" icon={<ArrowRight className="h-4 w-4" />}>
            Começar agora
          </PillButton>
        </motion.div>
      </div>

      <div className="mx-auto grid w-full max-w-4xl gap-3 sm:grid-cols-3">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div key={badge.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.6 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}>
              <GlassCard className="flex items-center justify-center gap-2 border-white/70 bg-[rgba(255,255,255,0.42)] text-sm text-flow-text shadow-[0_14px_40px_rgba(36,32,78,0.12)]" padding="sm">
                <Icon className="h-4 w-4 text-flow-accent" />
                <span>{badge.label}</span>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
