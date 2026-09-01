import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersistStorage, StorageValue } from 'zustand/middleware';

export const STORAGE_SCHEMA_VERSION = 1;

export const STORAGE_KEYS = {
  profile: 'world-unfolded:profile:v1',
  saved: 'world-unfolded:saved:v1',
  passport: 'world-unfolded:passport:v1',
} as const;

export function createSafeStorage(base: RawStateStorage = AsyncStorage): PersistStorage<unknown> {
  return {
    getItem: async (name) => {
      const raw = await base.getItem(name);
      if (!raw) return null;
      try { return JSON.parse(raw) as StorageValue<unknown>; } catch { return null; }
    },
    setItem: (name, value) => base.setItem(name, JSON.stringify(value)),
    removeItem: (name) => base.removeItem(name),
  };
}

export const asyncStorage = createSafeStorage();

export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

export function allowedValues<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((entry): entry is T => typeof entry === 'string' && allowed.includes(entry as T)))];
}

export interface RawStateStorage { getItem: (name: string) => string | null | Promise<string | null>; setItem: (name: string, value: string) => void | Promise<void>; removeItem: (name: string) => void | Promise<void> }
