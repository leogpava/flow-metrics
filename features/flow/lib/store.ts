'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import { FlowState, HealthMetrics, UserData } from '@/types/flow';

interface FlowStore extends FlowState {
  setUserData: (data: Partial<UserData>) => void;
  setMetrics: (metrics: HealthMetrics) => void;
  setEmail: (email: string) => void;
  setEmailSent: (sent: boolean) => void;
  setInsight: (insight: string) => void;
  nextStep: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const initialState: FlowState = {
  step: 0,
  userData: {},
  metrics: null,
  email: '',
  emailSent: false,
  sessionId: uuidv4()
};

export const useFlowStore = create<FlowStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUserData: (data) => set((state) => ({ userData: { ...state.userData, ...data } })),
      setMetrics: (metrics) => set({ metrics }),
      setEmail: (email) => set({ email }),
      setEmailSent: (emailSent) => set({ emailSent }),
      setInsight: (insight) => set((state) => ({
        metrics: state.metrics ? { ...state.metrics, insight } : null
      })),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      setStep: (step) => set({ step }),
      reset: () =>
        set({
          ...initialState,
          sessionId: uuidv4()
        })
    }),
    {
      name: 'flowmetrics-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        step: state.step,
        userData: state.userData,
        metrics: state.metrics,
        email: state.email,
        emailSent: state.emailSent,
        sessionId: state.sessionId
      })
    }
  )
);

