import { NextResponse } from 'next/server';

import { getSupabaseServerClient, isSupabaseServerConfigured } from '@/lib/supabase/server';

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Supabase server env ausente.' }, { status: 500 });
  }

  const body = await request.json();
  const { sessionId, userData, metrics } = body;

  if (!sessionId || !userData || !metrics) {
    return NextResponse.json({ error: 'Payload invalido para salvar sessao.' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Cliente Supabase indisponivel.' }, { status: 500 });
  }

  const { error } = await supabase.from('sessions').upsert({
    id: sessionId,
    nome: userData.nome,
    sexo: userData.sexo,
    idade: userData.idade,
    peso: userData.peso,
    altura: userData.altura,
    atividade: userData.atividade,
    imc: metrics.imc,
    score: metrics.score,
    tmb: metrics.tmb,
    get_total: metrics.get,
    hidratacao: metrics.hidratacao,
    percentil: metrics.percentilIMC,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: 'Supabase server env ausente.' }, { status: 500 });
  }

  const body = await request.json();
  const { sessionId, email, emailSent, nps } = body;

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId obrigatorio.' }, { status: 400 });
  }

  const updatePayload: Record<string, string | number | boolean> = {};

  if (typeof email === 'string') {
    updatePayload.email = email;
  }

  if (typeof emailSent === 'boolean') {
    updatePayload.email_sent = emailSent;
  }

  if (typeof nps === 'number') {
    updatePayload.nps = nps;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Cliente Supabase indisponivel.' }, { status: 500 });
  }

  const { error } = await supabase.from('sessions').update(updatePayload).eq('id', sessionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}


