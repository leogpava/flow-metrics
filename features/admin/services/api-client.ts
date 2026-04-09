'use client';

interface DateRangeParams {
  startDate: string;
  endDate: string;
}

const ADMIN_SESSION_KEY = 'admin-session';

function getAdminAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { accessToken?: string };
    return parsed.accessToken ?? null;
  } catch {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

function buildDateSearchParams(range: DateRangeParams) {
  return new URLSearchParams({
    startDate: range.startDate,
    endDate: range.endDate,
  });
}

export async function fetchAdminJson<T>(pathname: string, params: URLSearchParams | DateRangeParams) {
  const searchParams = params instanceof URLSearchParams ? params : buildDateSearchParams(params);
  const token = getAdminAccessToken();

  const response = await fetch(`${pathname}?${searchParams.toString()}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload.error === 'string'
        ? payload.error
        : `Falha ao carregar ${pathname}`;
    throw new Error(message);
  }

  return payload as T;
}
