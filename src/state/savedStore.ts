import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';

import { asyncStorage, isRecord, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/persistence/storage';
import type { SavedItem } from '@/types';

export interface SavedStoreState { records: SavedItem[]; hydrated: boolean }
export interface SavedStoreActions {
  setStatus: (subjectId: string, subjectType: SavedItem['subjectType'], status: SavedItem['status'], dateAdded?: string) => void;
  remove: (subjectId: string) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}
export type SavedStoreShape = SavedStoreState & SavedStoreActions;
export const defaultSavedState: SavedStoreState = { records: [], hydrated: false };

export function migrateSaved(persisted: unknown): Pick<SavedStoreState, 'records'> {
  if (!isRecord(persisted) || !Array.isArray(persisted.records)) return { records: [] };
  const records = new Map<string, SavedItem>();
  for (const candidate of persisted.records) {
    if (!isRecord(candidate) || typeof candidate.subjectId !== 'string' || !candidate.subjectId) continue;
    if (candidate.subjectType !== 'destination' && candidate.subjectType !== 'discoveryItem') continue;
    if (candidate.status !== 'saved' && candidate.status !== 'wantToGo') continue;
    records.set(candidate.subjectId, { subjectId: candidate.subjectId, subjectType: candidate.subjectType, status: candidate.status, dateAdded: typeof candidate.dateAdded === 'string' ? candidate.dateAdded : new Date(0).toISOString() });
  }
  return { records: [...records.values()] };
}

export function createSavedStore(storage = asyncStorage) {
  return create<SavedStoreShape>()(persist(
    (set) => ({
      ...defaultSavedState,
      setStatus: (subjectId, subjectType, status, dateAdded = new Date().toISOString()) => set((state) => ({ records: [...state.records.filter((record) => record.subjectId !== subjectId), { subjectId, subjectType, status, dateAdded }] })),
      remove: (subjectId) => set((state) => ({ records: state.records.filter((record) => record.subjectId !== subjectId) })),
      setHydrated: (hydrated) => set({ hydrated }),
      reset: () => set({ records: [] }),
    }),
    {
      name: STORAGE_KEYS.saved,
      version: STORAGE_SCHEMA_VERSION,
      storage: storage as PersistStorage<SavedStoreShape>,
      skipHydration: true,
      partialize: ({ records }) => ({ records }) as SavedStoreShape,
      migrate: (persisted) => migrateSaved(persisted) as SavedStoreShape,
      merge: (persisted, current) => ({ ...current, ...migrateSaved(persisted) }),
      onRehydrateStorage: () => (state, error) => {
        if (error) useSavedStore.setState({ ...defaultSavedState, hydrated: true });
        else state?.setHydrated(true);
      },
    },
  ));
}

export const useSavedStore = createSavedStore();
