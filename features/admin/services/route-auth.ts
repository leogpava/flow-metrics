import { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

import { getSupabaseServerClient } from '@/lib/supabase/server';

export class AdminRouteAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export async function requireAdminUser(request: NextRequest): Promise<User> {
  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;

  if (!token) {
    throw new AdminRouteAuthError('Sessão administrativa ausente.', 401);
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    throw new AdminRouteAuthError('Supabase server não está configurado.', 500);
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new AdminRouteAuthError('Sessão administrativa inválida.', 401);
  }

  return data.user;
}
