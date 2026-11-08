import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      _hasHydrated: false, 

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setHasCompletedOnboarding: (status = true) =>
        set({ hasCompletedOnboarding: status }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
    }),
    {
      name: 'app-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);