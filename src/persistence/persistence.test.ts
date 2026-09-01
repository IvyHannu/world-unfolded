import { createSafeStorage, STORAGE_KEYS, STORAGE_SCHEMA_VERSION, type RawStateStorage } from './storage';
import { createPassportStore, getPassportCounters, migratePassport } from '@/state/passportStore';
import { createProfileStore, migrateProfile } from '@/state/profileStore';
import { createSavedStore, migrateSaved } from '@/state/savedStore';
import { destinations } from '@/content/contentIndex';

function memoryStorage(initial: Record<string, string> = {}): RawStateStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return { data, getItem: (name) => data[name] ?? null, setItem: (name, value) => { data[name] = value; }, removeItem: (name) => { delete data[name]; } };
}

const flushPersistence = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Phase 5 persisted stores', () => {
  it('restores Profile preferences in a fresh store instance', async () => {
    const memory = memoryStorage();
    const first = createProfileStore(createSafeStorage(memory));
    first.getState().setInterests(['culture', 'food']);
    first.getState().setPreferredRegions(['north_africa']);
    first.getState().setLayerInterests(['hidden']);
    first.getState().setTextScale('large');
    first.getState().setReduceMotion(true);
    await flushPersistence();

    const restarted = createProfileStore(createSafeStorage(memory));
    await restarted.persist.rehydrate();
    expect(restarted.getState()).toEqual(expect.objectContaining({ interests: ['culture', 'food'], preferredRegions: ['north_africa'], layerInterests: ['hidden'], accessibilityPreferences: { textScale: 'large', reduceMotion: true } }));
    expect(JSON.parse(memory.data[STORAGE_KEYS.profile]).version).toBe(STORAGE_SCHEMA_VERSION);
  });

  it('restores Saved and Want to Go records and structurally prevents duplicates', async () => {
    const memory = memoryStorage();
    const first = createSavedStore(createSafeStorage(memory));
    first.getState().setStatus('table-mountain', 'discoveryItem', 'saved', '2026-01-01T00:00:00.000Z');
    first.getState().setStatus('table-mountain', 'discoveryItem', 'wantToGo', '2026-01-02T00:00:00.000Z');
    first.getState().setStatus('bali', 'destination', 'saved', '2026-01-03T00:00:00.000Z');
    await flushPersistence();

    const restarted = createSavedStore(createSafeStorage(memory));
    await restarted.persist.rehydrate();
    expect(restarted.getState().records).toHaveLength(2);
    expect(restarted.getState().records).toContainEqual(expect.objectContaining({ subjectId: 'table-mountain', status: 'wantToGo' }));
    expect(restarted.getState().records).toContainEqual(expect.objectContaining({ subjectId: 'bali', status: 'saved' }));
  });

  it('restores Passport records while deriving counters rather than storing them', async () => {
    const memory = memoryStorage();
    const first = createPassportStore(createSafeStorage(memory));
    first.getState().markVisited('bali', '2026-01-04T00:00:00.000Z');
    await flushPersistence();

    const restarted = createPassportStore(createSafeStorage(memory));
    await restarted.persist.rehydrate();
    expect(restarted.getState().visitedRecords).toHaveLength(1);
    expect(getPassportCounters(restarted.getState().visitedRecords, destinations)).toEqual({ countriesVisited: 1, destinationsVisited: 1 });
    expect(memory.data[STORAGE_KEYS.passport]).not.toMatch(/countriesVisited|destinationsVisited/);
  });

  it('falls back safely when stored JSON is corrupted', async () => {
    const memory = memoryStorage({ [STORAGE_KEYS.profile]: '{broken json', [STORAGE_KEYS.saved]: '{broken json', [STORAGE_KEYS.passport]: '{broken json' });
    const profile = createProfileStore(createSafeStorage(memory));
    const saved = createSavedStore(createSafeStorage(memory));
    const passport = createPassportStore(createSafeStorage(memory));
    await Promise.all([profile.persist.rehydrate(), saved.persist.rehydrate(), passport.persist.rehydrate()]);
    expect(profile.getState()).toEqual(expect.objectContaining({ interests: [], preferredRegions: [], hydrated: true }));
    expect(saved.getState()).toEqual(expect.objectContaining({ records: [], hydrated: true }));
    expect(passport.getState()).toEqual(expect.objectContaining({ visitedRecords: [], hydrated: true }));
  });

  it('migrates and sanitizes legacy or invalid schema values', () => {
    expect(migrateProfile({ interestIds: ['culture', 'invalid'], preferredRegionIds: ['north_africa'], layerInterestIds: ['nature'], accessibilityPreferences: { textScale: 'large', reduceMotion: true } })).toEqual({ interests: ['culture'], preferredRegions: ['north_africa'], layerInterests: ['nature'], accessibilityPreferences: { textScale: 'large', reduceMotion: true } });
    expect(migrateSaved({ records: [{ subjectId: 'same', subjectType: 'destination', status: 'saved', dateAdded: 'one' }, { subjectId: 'same', subjectType: 'destination', status: 'wantToGo', dateAdded: 'two' }, { bad: true }] }).records).toEqual([{ subjectId: 'same', subjectType: 'destination', status: 'wantToGo', dateAdded: 'two' }]);
    expect(migratePassport({ visitedRecords: [{ destinationId: 'bali', dateMarkedVisited: 'date' }, { nope: true }] }).visitedRecords).toEqual([{ destinationId: 'bali', dateMarkedVisited: 'date', stampId: 'stamp-bali' }]);
  });
});
