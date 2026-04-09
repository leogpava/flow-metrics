import { HealthMetrics, UserData } from '@/types/flow';

async function requestJson(input: RequestInfo, init: RequestInit) {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? 'Falha na comunicacao com a API interna.');
  }

  return response.json();
}

export async function saveSession(sessionId: string, userData: UserData, metrics: HealthMetrics) {
  try {
    await requestJson('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ sessionId, userData, metrics })
    });
  } catch (error) {
    console.error('Session save error:', error);
  }
}

export async function saveEmail(sessionId: string, email: string): Promise<void> {
  try {
    await requestJson('/api/sessions', {
      method: 'PATCH',
      body: JSON.stringify({ sessionId, email })
    });
  } catch (error) {
    console.error('Email save error:', error);
  }
}

// Nova função para marcar como enviado
export async function markEmailSent(sessionId: string): Promise<void> {
  try {
    await requestJson('/api/sessions', {
      method: 'PATCH',
      body: JSON.stringify({ sessionId, emailSent: true })
    });
  } catch (error) {
    console.error('Supabase markEmailSent error:', error);
  }
}

export async function saveNps(sessionId: string, nps: number) {
  try {
    await requestJson('/api/sessions', {
      method: 'PATCH',
      body: JSON.stringify({ sessionId, nps })
    });
  } catch (error) {
    console.error('NPS save error:', error);
  }
}
