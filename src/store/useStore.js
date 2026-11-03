import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // State: false = user is new (show onboarding), true = onboarding completed
      hasCompletedOnboarding: false,

      // Action to mark onboarding as completed
      setHasCompletedOnboarding: (status = true) =>
        set({ hasCompletedOnboarding: status }),

      // Optional action to reset for testing or logging out
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
    }),
    {
      name: 'app-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);