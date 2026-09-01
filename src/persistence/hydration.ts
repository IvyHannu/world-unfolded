import { useEffect } from 'react';

import { usePassportStore } from '@/state/passportStore';
import { useProfileStore } from '@/state/profileStore';
import { useSavedStore } from '@/state/savedStore';

export function useStoreHydration() {
  const profileHydrated = useProfileStore((state) => state.hydrated);
  const savedHydrated = useSavedStore((state) => state.hydrated);
  const passportHydrated = usePassportStore((state) => state.hydrated);

  useEffect(() => {
    void Promise.all([
      useProfileStore.persist.rehydrate(),
      useSavedStore.persist.rehydrate(),
      usePassportStore.persist.rehydrate(),
    ]);
  }, []);

  return profileHydrated && savedHydrated && passportHydrated;
}
