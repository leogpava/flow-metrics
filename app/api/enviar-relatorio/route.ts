import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import { gerarHTMLEmail } from '@/features/flow/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[EMAIL API] Request body:', body);

    const {
      email,
      nome,
      sexo,
      idade,
      atividade,
      imc,
      imcClassification,
      score,
      scoreLevel,
      insight,
      tmb,
      get: getTotal,
      hidratacao,
      percentilIMC,
    } = body;

    console.log('[EMAIL API] Extracted variables:', { email, nome, sexo, tmb, getTotal, hidratacao, insight });

    if (!email || !email.includes('@')) {
      console.log('[EMAIL API] Invalid email:', email);
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
    }

    if (!insight) {
      console.log('[EMAIL API] Missing insight');
      return NextResponse.json({ error: 'Insight não foi gerado' }, { status: 400 });
    }

    console.log('[EMAIL API] Email validation passed');
    const htmlContent = gerarHTMLEmail({
      nome,
      score,
      scoreLevel,
      imc,
      imcClassification,
      atividade,
      tmb,
      getTotal,
      hidratacao,
      percentilIMC,
      insight,
    });

    console.log('[EMAIL API] Sending email via Resend...');
    console.log('[EMAIL API] From:', process.env.RESEND_FROM_EMAIL);
    console.log('[EMAIL API] To:', email);

    const { data, error } = await resend.emails.send({
      from: `FlowMetrics <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: `${nome}, seu relatório FlowMetrics chegou 🌊`,
      html: htmlContent,
    });

    if (error) {
      console.error('[EMAIL API] Resend error:', error);
      return NextResponse.json({ error: 'Falha ao enviar e-mail', details: error }, { status: 500 });
    }

    console.log('[EMAIL API] Email sent successfully:', data?.id);
    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (err) {
    console.error('[EMAIL API] API route error:', err);
    return NextResponse.json({ error: 'Erro interno', details: String(err) }, { status: 500 });
  }
}
