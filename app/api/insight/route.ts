import { NextResponse } from 'next/server';

import { ActivityLevel, IMCClassification } from '@/types/flow';

interface InsightPayload {
  nome: string;
  imc: number;
  imcClassification: IMCClassification;
  atividade: ActivityLevel;
  score: number;
}

export async function POST(request: Request) {
  const groqApiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

  if (!groqApiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY ausente.' }, { status: 500 });
  }

  const payload = (await request.json()) as InsightPayload;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqApiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      max_tokens: 120,
      messages: [
        {
          role: 'system',
          content:
            'Voce e um assistente de saude educacional. Gere um insight curto em portugues do Brasil, acolhedor, claro e responsavel. Nao faca diagnostico medico e nao use tom alarmista. Nunca retorne a resposta entre aspas.'
        },
        {
          role: 'user',
          content: `Nome: ${payload.nome}\nIMC: ${payload.imc}\nClassificacao IMC: ${payload.imcClassification}\nAtividade: ${payload.atividade}\nScore: ${payload.score}\n\nEscreva 1 ou 2 frases com um insight personalizado, encorajador e pratico.`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: errorText }, { status: 500 });
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const insight = data.choices?.[0]?.message?.content?.trim();

  if (!insight) {
    return NextResponse.json({ error: 'Resposta vazia da Groq.' }, { status: 500 });
  }

  return NextResponse.json({ insight });
}

