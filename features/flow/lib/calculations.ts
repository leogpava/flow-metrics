import { ActivityLevel, HealthMetrics, IMCClassification } from '@/types/flow';

export function calcularIMC(peso: number, alturaEm: number): number {
  const alturaM = alturaEm / 100;
  return Math.round((peso / (alturaM * alturaM)) * 10) / 10;
}

export function classificarIMC(imc: number): IMCClassification {
  if (imc < 18.5) return 'abaixo_peso';
  if (imc < 25) return 'normal';
  if (imc < 30) return 'sobrepeso';
  if (imc < 35) return 'obesidade_1';
  if (imc < 40) return 'obesidade_2';
  return 'obesidade_3';
}

export function calcularScore(imc: number, atividade: ActivityLevel): number {
  let imcPts = 0;

  if (imc >= 18.5 && imc < 25) {
    const center = 21.75;
    const distance = Math.abs(imc - center);
    imcPts = Math.round(50 - distance * 2);
  } else if (imc < 18.5) {
    imcPts = Math.round(Math.max(0, 30 - (18.5 - imc) * 5));
  } else {
    imcPts = Math.round(Math.max(0, 38 - (imc - 25) * 3));
  }

  const atividadePts: Record<ActivityLevel, number> = {
    sedentario: 10,
    leve: 25,
    moderado: 38,
    intenso: 47,
    muito_intenso: 50
  };

  const total = imcPts + atividadePts[atividade];
  return Math.min(100, Math.max(0, total));
}

export function classificarScore(score: number): HealthMetrics['scoreLevel'] {
  if (score < 30) return 'critico';
  if (score < 55) return 'atencao';
  if (score < 75) return 'bom';
  return 'otimo';
}

export const imcLabels: Record<IMCClassification, { label: string; color: string }> = {
  abaixo_peso: { label: 'Abaixo do peso', color: '#f5a623' },
  normal: { label: 'Peso normal', color: '#2dd4a0' },
  sobrepeso: { label: 'Sobrepeso', color: '#f5a623' },
  obesidade_1: { label: 'Obesidade I', color: '#f06292' },
  obesidade_2: { label: 'Obesidade II', color: '#f06292' },
  obesidade_3: { label: 'Obesidade III', color: '#f06292' }
};

export const atividadeLabels: Record<ActivityLevel, { label: string; sublabel: string }> = {
  sedentario: { label: 'Sedentário', sublabel: 'Quase sem exercício' },
  leve: { label: 'Levemente ativo', sublabel: '1-2x por semana' },
  moderado: { label: 'Moderadamente ativo', sublabel: '3-4x por semana' },
  intenso: { label: 'Muito ativo', sublabel: '5-6x por semana' },
  muito_intenso: { label: 'Atleta', sublabel: 'Diário ou 2x/dia' }
};

export const scoreLevelMeta: Record<
  HealthMetrics['scoreLevel'],
  { label: string; color: string; softClassName: string }
> = {
  critico: {
    label: 'Crítico',
    color: '#f06292',
    softClassName: 'bg-[rgba(240,98,146,0.16)] text-flow-danger'
  },
  atencao: {
    label: 'Atenção',
    color: '#f5a623',
    softClassName: 'bg-[rgba(245,166,35,0.18)] text-flow-warning'
  },
  bom: {
    label: 'Bom',
    color: '#6c63ff',
    softClassName: 'bg-[rgba(108,99,255,0.14)] text-flow-accent'
  },
  otimo: {
    label: 'Ótimo',
    color: '#2dd4a0',
    softClassName: 'bg-[rgba(45,212,160,0.16)] text-flow-success'
  }
};

export const fatoresAtividade: Record<ActivityLevel, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  muito_intenso: 1.9,
};

export function calcularTMB(
  peso: number,
  altura: number,
  idade: number,
  sexo: 'masculino' | 'feminino'
): number {
  const base = (10 * peso) + (6.25 * altura) - (5 * idade);
  const tmb = sexo === 'masculino' ? base + 5 : base - 161;
  return Math.round(tmb);
}

export function calcularGET(tmb: number, atividade: ActivityLevel): number {
  return Math.round(tmb * fatoresAtividade[atividade]);
}

export function calcularHidratacao(peso: number, atividade: ActivityLevel): number {
  const base = peso * 35;
  const extra = ['intenso', 'muito_intenso'].includes(atividade) ? 500 : 0;
  return Math.round((base + extra) / 100) / 10;
}

export function calcularPercentilIMC(imc: number, _idade: number): string {
  if (imc < 18.5) return 'abaixo de 10%';
  if (imc < 22) return 'top 25%';
  if (imc < 25) return 'top 40%';
  if (imc < 27) return 'top 55%';
  if (imc < 30) return 'top 70%';
  return 'top 85%';
}

export function labelPercentil(imc: number): { texto: string; contexto: string } {
  if (imc < 18.5) return { texto: 'abaixo de 10%', contexto: 'da população brasileira adulta' };
  if (imc < 22) return { texto: 'top 25%', contexto: 'melhor que 75% dos adultos' };
  if (imc < 25) return { texto: 'top 40%', contexto: 'melhor que 60% dos adultos' };
  if (imc < 27) return { texto: 'top 55%', contexto: 'na média da população' };
  if (imc < 30) return { texto: 'top 70%', contexto: 'acima da média' };
  return { texto: 'top 85%', contexto: 'abaixo de 85% dos adultos' };
}
