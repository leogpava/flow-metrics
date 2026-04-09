'use client';

import { useEffect, useState } from 'react';

import { useFlowStore } from '@/features/flow/lib/store';

export function useFlowHydrated() {
  const persistApi = typeof window !== 'undefined' ? useFlowStore.persist : undefined;
  const [hydrated, setHydrated] = useState(persistApi ? persistApi.hasHydrated() : true);

  useEffect(() => {
    if (!persistApi) {
      setHydrated(true);
      return;
    }

    const unsubscribeHydrate = persistApi.onHydrate(() => setHydrated(false));
    const unsubscribeFinishHydration = persistApi.onFinishHydration(() => setHydrated(true));

    if (!persistApi.hasHydrated()) {
      void persistApi.rehydrate();
    }

    return () => {
      unsubscribeHydrate();
      unsubscribeFinishHydration();
    };
  }, [persistApi]);

  return hydrated;
}

export { useFlowStore };


