import { IMCClassification, ActivityLevel } from '@/types/flow';
import { atividadeLabels, imcLabels } from '@/features/flow/lib/calculations';

interface EmailTemplateInput {
  nome: string;
  score: number;
  scoreLevel: string;
  imc: number;
  imcClassification: IMCClassification;
  atividade: ActivityLevel;
  tmb: number;
  getTotal: number;
  hidratacao: number;
  percentilIMC: string;
  insight: string;
}

function scoreColor(scoreLevel: string): string {
  const map: Record<string, string> = {
    otimo: '#2dd4a0',
    bom: '#6c63ff',
    atencao: '#f5a623',
    critico: '#f06292',
  };
  return map[scoreLevel] ?? '#6c63ff';
}

function scorePercent(score: number): number {
  const circumference = 339.29;
  return circumference - (score / 100) * circumference;
}

export function gerarHTMLEmail(input: EmailTemplateInput): string {
  const { nome, score, scoreLevel, imc, imcClassification, atividade, tmb, getTotal, hidratacao, percentilIMC, insight } = input;

  const cor = scoreColor(scoreLevel);
  const imcInfo = imcLabels[imcClassification];
  const atividadeInfo = atividadeLabels[atividade];
  const offset = scorePercent(score);

  const metricColors = {
    purple: '#c4b5f4',
    blue: '#a8c8f8',
    pink: '#f0c4e8',
    green: '#2dd4a0',
  };

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu relatório FlowMetrics</title>
  <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Lexend Deca',Helvetica,Arial,sans-serif;background-color:#dde8f8;background-image:radial-gradient(ellipse at 20% 20%, #a8c8f8 0%, transparent 50%), radial-gradient(ellipse at 80% 10%, #c4b5f4 0%, transparent 45%), radial-gradient(ellipse at 60% 80%, #f0c4e8 0%, transparent 50%), radial-gradient(ellipse at 10% 80%, #b8d4f8 0%, transparent 45%);background-attachment:fixed;">
  <div style="max-width:600px;margin:0 auto;padding:40px 16px;">
    <div style="text-align:center;padding:16px 0 32px;">
      <div style="margin-bottom:16px;"><span style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1.5px;text-transform:uppercase;">FlowMetrics</span></div>
      <h1 style="margin:0;font-size:30px;font-weight:800;color:#1a1a2e;line-height:1.2;">Olá, ${nome}!</h1>
      <p style="margin:12px 0 0;font-size:16px;color:#5a5a7a;">Sua jornada de saúde continua. Veja sua análise completa:</p>
    </div>
    <div style="background:#ffffff;border-radius:24px;padding:48px 32px;margin-bottom:24px;text-align:center;box-shadow:0 12px 32px rgba(108, 99, 255, 0.08);">
      <svg width="160" height="160" viewBox="0 0 140 140" style="display:block;margin:0 auto 20px;">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#f0f0f8" stroke-width="12"/>
        <circle cx="70" cy="70" r="54" fill="none" stroke="${cor}" stroke-width="12" stroke-linecap="round" stroke-dasharray="339.29" stroke-dashoffset="${offset}" transform="rotate(-90 70 70)" />
        <text x="70" y="66" text-anchor="middle" font-family="'Lexend Deca',Helvetica,sans-serif" font-size="48" font-weight="900" fill="#1a1a2e">${score}</text>
        <text x="70" y="86" text-anchor="middle" font-family="'Lexend Deca',Helvetica,sans-serif" font-size="14" fill="#7a7a9a">pontos</text>
      </svg>
      <div style="display:inline-block;background:${cor}20;border-radius:100px;padding:8px 24px;margin-bottom:16px;">
        <span style="font-size:16px;font-weight:700;color:${cor};text-transform:uppercase;">${scoreLevel === 'otimo' ? 'Ótimo' : scoreLevel === 'bom' ? 'Bom' : scoreLevel === 'atencao' ? 'Atenção' : 'Crítico'}</span>
      </div>
      <p style="margin:0;font-size:16px;color:#5a5a7a;">FlowScore • Sua Pontuação Geral de Saúde</p>
    </div>
    <div style="margin-bottom:24px;">
      <div style="display:block;background:#ffffff;border-radius:20px;padding:28px 24px;margin-bottom:16px;box-shadow:0 8px 20px rgba(108, 99, 255, 0.03);"><p style="display:block;margin:0 0 8px;font-size:12px;color:#7a7a9a;text-transform:uppercase;letter-spacing:.1em;font-weight:700;"><span style="color:${metricColors.purple};font-weight:900;margin-right:6px;">■</span> IMC</p><p style="display:block;margin:0 0 4px;font-size:36px;font-weight:900;color:#1a1a2e;">${imc}</p><p style="display:block;margin:0;font-size:14px;font-weight:600;color:${imcInfo.color};">${imcInfo.label}</p></div>
      <div style="display:block;background:#ffffff;border-radius:20px;padding:28px 24px;margin-bottom:16px;box-shadow:0 8px 20px rgba(108, 99, 255, 0.03);"><p style="display:block;margin:0 0 8px;font-size:12px;color:#7a7a9a;text-transform:uppercase;letter-spacing:.1em;font-weight:700;"><span style="color:${metricColors.blue};font-weight:900;margin-right:6px;">■</span> NÍVEL DE ATIVIDADE</p><p style="display:block;margin:0 0 4px;font-size:20px;font-weight:900;color:#1a1a2e;line-height:1.2;">${atividadeInfo.label}</p><p style="display:block;margin:0;font-size:14px;color:#7a7a9a;">${atividadeInfo.sublabel}</p></div>
      <div style="display:block;background:#ffffff;border-radius:20px;padding:28px 24px;margin-bottom:16px;box-shadow:0 8px 20px rgba(108, 99, 255, 0.03);"><p style="display:block;margin:0 0 8px;font-size:12px;color:#7a7a9a;text-transform:uppercase;letter-spacing:.1em;font-weight:700;"><span style="color:${metricColors.pink};font-weight:900;margin-right:6px;">■</span> TAXA METABÓLICA</p><p style="display:block;margin:0 0 4px;font-size:32px;font-weight:900;color:#1a1a2e;">${tmb.toLocaleString('pt-BR')}</p><p style="display:block;margin:0;font-size:14px;color:#7a7a9a;">kcal em repouso/dia</p></div>
      <div style="display:block;background:#ffffff;border-radius:20px;padding:28px 24px;margin-bottom:16px;box-shadow:0 8px 20px rgba(108, 99, 255, 0.03);"><p style="display:block;margin:0 0 8px;font-size:12px;color:#7a7a9a;text-transform:uppercase;letter-spacing:.1em;font-weight:700;"><span style="color:${metricColors.purple};font-weight:900;margin-right:6px;">■</span> GASTO DIÁRIO ESTIMADO</p><p style="display:block;margin:0 0 4px;font-size:32px;font-weight:900;color:#1a1a2e;">${getTotal.toLocaleString('pt-BR')}</p><p style="display:block;margin:0;font-size:14px;color:#7a7a9a;">kcal/dia (com atividade)</p></div>
      <div style="display:block;background:#ffffff;border-radius:20px;padding:28px 24px;margin-bottom:16px;box-shadow:0 8px 20px rgba(108, 99, 255, 0.03);"><p style="display:block;margin:0 0 8px;font-size:12px;color:#7a7a9a;text-transform:uppercase;letter-spacing:.1em;font-weight:700;"><span style="color:${metricColors.blue};font-weight:900;margin-right:6px;">■</span> HIDRATAÇÃO DIÁRIA META</p><p style="display:block;margin:0 0 4px;font-size:36px;font-weight:900;color:#1a1a2e;">${hidratacao.toFixed(1)}L</p><p style="display:block;margin:0;font-size:14px;color:#7a7a9a;">água necessária/dia</p></div>
      <div style="display:block;background:#ffffff;border-radius:20px;padding:28px 24px;margin-bottom:16px;box-shadow:0 8px 20px rgba(108, 99, 255, 0.03);"><p style="display:block;margin:0 0 8px;font-size:12px;color:#7a7a9a;text-transform:uppercase;letter-spacing:.1em;font-weight:700;"><span style="color:${metricColors.green};font-weight:900;margin-right:6px;">■</span> PERCENTIL IMC</p><p style="display:block;margin:0 0 4px;font-size:24px;font-weight:900;color:#1a1a2e;">${percentilIMC}</p><p style="display:block;margin:0;font-size:14px;color:#7a7a9a;">vs. população brasileira</p></div>
    </div>
    <div style="background:#ffffff;border-radius:24px;padding:36px;margin-bottom:24px;box-shadow:0 12px 32px rgba(108, 99, 255, 0.06);"><p style="display:block;margin:0 0 16px;font-size:18px;font-weight:700;color:${metricColors.purple};text-transform:uppercase;letter-spacing:.05em;">Análise FlowMetrics IA</p><p style="display:block;margin:0;font-size:16px;color:#4a4a6a;line-height:1.9;">${insight}</p></div>
    <div style="text-align:center;padding:16px 0 32px;"><p style="margin:0 0 8px;font-size:14px;font-weight:700;color:${metricColors.purple};">FlowMetrics</p><p style="margin:0;font-size:14px;color:#5a5a7a;">Inovação em Saúde • Projeto Universitário</p><p style="margin:16px 0 0;font-size:11px;color:#b0b0c0;max-width:300px;margin-left:auto;margin-right:auto;">Este relatório é apenas informativo. Sempre consulte um profissional de saúde.</p></div>
  </div>
</body>
</html>
  `.trim();
}
