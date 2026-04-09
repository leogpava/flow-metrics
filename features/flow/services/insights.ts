import { ActivityLevel, IMCClassification } from '@/types/flow';

interface InsightInput {
  nome: string;
  sexo?: 'masculino' | 'feminino';
  imc: number;
  imcClassification: IMCClassification;
  atividade: ActivityLevel;
  score: number;
  scoreLevel?: string;
  tmb?: number;
  get?: number;
  hidratacao?: number;
  percentilIMC?: string;
}

const fallbackInsights: Record<string, string> = {
  otimo_normal:
    'Voce esta em uma boa faixa de saude. Manter a consistencia e o segredo para o proximo nivel.',
  bom_normal:
    'Seu peso esta saudavel. Adicionar um pouco mais de movimento a semana ja elevaria seu score significativamente.',
  bom_sobrepeso:
    'Sua atividade fisica compensa bem. Pequenas mudancas na alimentacao fariam uma grande diferenca no seu IMC.',
  atencao_normal:
    'Seu peso esta bem, mas o sedentarismo pesa no score. Caminhar 30 minutos, 3x por semana, ja mudaria muito.',
  atencao_sobrepeso:
    'Ha espaco para crescer. Comecar com movimentos leves e consistentes costuma trazer resultados rapidos.',
  critico_default:
    'Todo comeco conta. O mais importante e o primeiro passo, e voce ja deu esse passo ao fazer essa analise.',
  default:
    'Sua saude e um processo, nao um destino. Voce esta no caminho certo ao cuidar dela hoje.'
};

function getFallbackInsight(input: InsightInput) {
  const key = `${
    input.score >= 75 ? 'otimo' : input.score >= 55 ? 'bom' : input.score >= 30 ? 'atencao' : 'critico'
  }_${
    input.imcClassification === 'normal'
      ? 'normal'
      : input.imcClassification === 'sobrepeso'
        ? 'sobrepeso'
        : 'default'
  }`;

  return fallbackInsights[key] ?? fallbackInsights.default;
}

export async function gerarInsight(input: InsightInput): Promise<string> {
  try {
    const response = await fetch('/api/insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (response.ok) {
      const data = (await response.json()) as { insight?: string };
      if (data.insight) {
        return data.insight;
      }
    }
  } catch (error) {
    console.error('Groq insight fallback acionado:', error);
  }

  return getFallbackInsight(input);
}

