'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getCurrentAdminUser, isAdminAuthenticated } from '@/features/admin/lib/auth-client';

const AUTH_TIMEOUT_MS = 3000;

export function useAdminProtection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Awaited<ReturnType<typeof getCurrentAdminUser>>>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const authenticated = await Promise.race([
          isAdminAuthenticated(),
          new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(false), AUTH_TIMEOUT_MS);
          }),
        ]);

        if (cancelled) {
          return;
        }

        if (!authenticated) {
          router.replace('/admin/login');
          return;
        }

        const currentUser = await getCurrentAdminUser();

        if (cancelled) {
          return;
        }

        if (!currentUser) {
          router.replace('/admin/login');
          return;
        }

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Admin protection error:', error);
        if (!cancelled) {
          router.replace('/admin/login');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return { isLoading, isAuthenticated, user };
}

export const useAdminProtected = useAdminProtection;
