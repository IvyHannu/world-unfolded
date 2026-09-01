import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

import { DISCOVERY_LAYERS, INTEREST_TAGS, REGIONS, type DiscoveryLayer, type InterestTag, type Region } from '@/content/vocabularies';
import { allowedValues, asyncStorage, isRecord, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/persistence/storage';
import type { UserProfile } from '@/types';

export interface ProfileStoreState extends UserProfile { hydrated: boolean }
export interface ProfileStoreActions {
  setInterests: (interests: InterestTag[]) => void;
  setPreferredRegions: (regions: Region[]) => void;
  setLayerInterests: (layers: DiscoveryLayer[]) => void;
  setTextScale: (textScale: UserProfile['accessibilityPreferences']['textScale']) => void;
  setReduceMotion: (reduceMotion: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}
export type ProfileStoreShape = ProfileStoreState & ProfileStoreActions;

export const defaultProfile: UserProfile = { interests: [], preferredRegions: [], layerInterests: [], accessibilityPreferences: { reduceMotion: false, textScale: 'default' } };

export function migrateProfile(persisted: unknown): UserProfile {
  if (!isRecord(persisted)) return defaultProfile;
  const accessibility = isRecord(persisted.accessibilityPreferences) ? persisted.accessibilityPreferences : {};
  return {
    interests: allowedValues(persisted.interests ?? persisted.interestIds, INTEREST_TAGS),
    preferredRegions: allowedValues(persisted.preferredRegions ?? persisted.preferredRegionIds, REGIONS),
    layerInterests: allowedValues(persisted.layerInterests ?? persisted.layerInterestIds, DISCOVERY_LAYERS),
    accessibilityPreferences: {
      reduceMotion: accessibility.reduceMotion === true,
      textScale: accessibility.textScale === 'large' ? 'large' : 'default',
    },
  };
}

export function createProfileStore(storage = asyncStorage) {
  return create<ProfileStoreShape>()(persist(
    (set) => ({
      ...defaultProfile,
      hydrated: false,
      setInterests: (interests) => set({ interests: allowedValues(interests, INTEREST_TAGS) }),
      setPreferredRegions: (preferredRegions) => set({ preferredRegions: allowedValues(preferredRegions, REGIONS) }),
      setLayerInterests: (layerInterests) => set({ layerInterests: allowedValues(layerInterests, DISCOVERY_LAYERS) }),
      setTextScale: (textScale) => set((state) => ({ accessibilityPreferences: { ...state.accessibilityPreferences, textScale } })),
      setReduceMotion: (reduceMotion) => set((state) => ({ accessibilityPreferences: { ...state.accessibilityPreferences, reduceMotion } })),
      setHydrated: (hydrated) => set({ hydrated }),
      reset: () => set({ ...defaultProfile }),
    }),
    {
      name: STORAGE_KEYS.profile,
      version: STORAGE_SCHEMA_VERSION,
      storage: storage as PersistStorage<ProfileStoreShape>,
      skipHydration: true,
      partialize: ({ interests, preferredRegions, layerInterests, accessibilityPreferences }) => ({ interests, preferredRegions, layerInterests, accessibilityPreferences }) as ProfileStoreShape,
      migrate: (persisted) => migrateProfile(persisted) as ProfileStoreShape,
      merge: (persisted, current) => ({ ...current, ...migrateProfile(persisted) }),
      onRehydrateStorage: () => (state, error) => {
        if (error) useProfileStore.setState({ ...defaultProfile, hydrated: true });
        else state?.setHydrated(true);
      },
    },
  ));
}

export const useProfileStore = createProfileStore();
