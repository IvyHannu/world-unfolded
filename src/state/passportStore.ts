import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

import { asyncStorage, isRecord, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/persistence/storage';
import type { Destination, VisitedRecord } from '@/types';

export interface PassportStoreState { visitedRecords: VisitedRecord[]; hydrated: boolean }
export interface PassportStoreActions {
  markVisited: (destinationId: string, dateMarkedVisited?: string) => void;
  removeVisited: (destinationId: string) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}
export type PassportStoreShape = PassportStoreState & PassportStoreActions;
export const defaultPassportState: PassportStoreState = { visitedRecords: [], hydrated: false };

export function migratePassport(persisted: unknown): Pick<PassportStoreState, 'visitedRecords'> {
  if (!isRecord(persisted) || !Array.isArray(persisted.visitedRecords)) return { visitedRecords: [] };
  const records = new Map<string, VisitedRecord>();
  for (const candidate of persisted.visitedRecords) {
    if (!isRecord(candidate) || typeof candidate.destinationId !== 'string' || !candidate.destinationId) continue;
    records.set(candidate.destinationId, {
      destinationId: candidate.destinationId,
      dateMarkedVisited: typeof candidate.dateMarkedVisited === 'string' ? candidate.dateMarkedVisited : new Date(0).toISOString(),
      stampId: typeof candidate.stampId === 'string' ? candidate.stampId : `stamp-${candidate.destinationId}`,
    });
  }
  return { visitedRecords: [...records.values()] };
}

export function getPassportCounters(records: readonly VisitedRecord[], destinations: readonly Destination[]) {
  const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
  const countries = new Set(records.map((record) => destinationById.get(record.destinationId)?.country).filter((country): country is string => Boolean(country)));
  return { countriesVisited: countries.size, destinationsVisited: new Set(records.map((record) => record.destinationId)).size };
}

export function createPassportStore(storage = asyncStorage) {
  return create<PassportStoreShape>()(persist(
    (set) => ({
      ...defaultPassportState,
      markVisited: (destinationId, dateMarkedVisited = new Date().toISOString()) => set((state) => ({ visitedRecords: [...state.visitedRecords.filter((record) => record.destinationId !== destinationId), { destinationId, dateMarkedVisited, stampId: `stamp-${destinationId}` }] })),
      removeVisited: (destinationId) => set((state) => ({ visitedRecords: state.visitedRecords.filter((record) => record.destinationId !== destinationId) })),
      setHydrated: (hydrated) => set({ hydrated }),
      reset: () => set({ visitedRecords: [] }),
    }),
    {
      name: STORAGE_KEYS.passport,
      version: STORAGE_SCHEMA_VERSION,
      storage: storage as PersistStorage<PassportStoreShape>,
      skipHydration: true,
      partialize: ({ visitedRecords }) => ({ visitedRecords }) as PassportStoreShape,
      migrate: (persisted) => migratePassport(persisted) as PassportStoreShape,
      merge: (persisted, current) => ({ ...current, ...migratePassport(persisted) }),
      onRehydrateStorage: () => (state, error) => {
        if (error) usePassportStore.setState({ ...defaultPassportState, hydrated: true });
        else state?.setHydrated(true);
      },
    },
  ));
}

export const usePassportStore = createPassportStore();
