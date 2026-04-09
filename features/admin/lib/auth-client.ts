'use client';

import type { User } from '@supabase/supabase-js';

import { getSupabaseBrowserClient } from '@/lib/supabase/browser';

const AUTH_TIMEOUT_MS = 2000;
const ADMIN_SESSION_KEY = 'admin-session';

function getAdminSupabaseClient() {
  return getSupabaseBrowserClient();
}

function persistAdminSession(session: { access_token: string } | null, user: User | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session || !user) {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      accessToken: session.access_token,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  );
}

async function withTimeout<T>(promise: Promise<T>, fallback: T, timeoutMs = AUTH_TIMEOUT_MS) {
  const timeoutPromise = new Promise<T>((resolve) => {
    setTimeout(() => resolve(fallback), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

async function logAdminAction(adminId: string, action: string, details?: Record<string, unknown>) {
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    return;
  }

  try {
    await supabase.from('admin_audit_log').insert({
      admin_id: adminId,
      action,
      details: details ?? null,
    });
  } catch (error) {
    console.error('Admin audit log error:', error);
  }
}

export async function isAdminAuthenticated() {
  const user = await getCurrentAdminUser();
  return Boolean(user);
}

export async function adminLogin(email: string, password: string) {
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    return { success: false, error: 'Supabase não configurado.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }

    persistAdminSession(data.session, data.user);

    if (data.user) {
      await logAdminAction(data.user.id, 'admin_login', {
        email: data.user.email,
        timestamp: new Date().toISOString(),
      });
    }

    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return { success: false, error: message };
  }
}

export async function adminLogout() {
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    return { success: false, error: 'Supabase não configurado.' };
  }

  try {
    const user = await getCurrentAdminUser();
    const { error } = await supabase.auth.signOut();

    persistAdminSession(null, null);

    if (error) {
      return { success: false, error: error.message };
    }

    if (user) {
      await logAdminAction(user.id, 'admin_logout', {
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return { success: false, error: message };
  }
}

export async function getCurrentAdminUser(): Promise<User | null> {
  const supabase = getAdminSupabaseClient();

  if (!supabase) {
    return null;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      persistAdminSession(sessionData.session, sessionData.session.user);
      return sessionData.session.user;
    }

    const user = await withTimeout(
      supabase.auth.getUser().then(({ data }) => data.user),
      null
    );

    if (user) {
      persistAdminSession(sessionData.session ?? null, user);
      return user;
    }

    persistAdminSession(null, null);
    return null;
  } catch {
    persistAdminSession(null, null);
    return null;
  }
}
