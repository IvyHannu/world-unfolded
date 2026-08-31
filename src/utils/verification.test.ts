import { isValidPracticalInformation, isValidVerificationRecord } from './verification';

describe('verification rules', () => {
  it('accepts a sourced and dated verified record', () => {
    expect(isValidVerificationRecord({ kind: 'verified', sourceName: 'Official source', sourceUrl: 'https://example.org/info', lastVerifiedDate: '2026-08-31' })).toBe(true);
  });
  it('accepts an official-source link without copied time-sensitive details', () => {
    expect(isValidVerificationRecord({ kind: 'linked-to-source', sourceName: 'Official source', sourceUrl: 'https://example.org/info' })).toBe(true);
  });
  it('accepts not-applicable only when no time-sensitive details are supplied', () => {
    expect(isValidPracticalInformation({ practicalGuidance: 'Bring water.', verification: { kind: 'not-applicable' } })).toBe(true);
    expect(isValidPracticalInformation({ openingHours: 'Sample hours', verification: { kind: 'not-applicable' } })).toBe(false);
  });
  it.each([
    { kind: 'verified', sourceName: '', sourceUrl: 'https://example.org', lastVerifiedDate: '2026-08-31' },
    { kind: 'verified', sourceName: 'Official', sourceUrl: 'http://example.org', lastVerifiedDate: '2026-08-31' },
    { kind: 'verified', sourceName: 'Official', sourceUrl: 'https://example.org', lastVerifiedDate: '31-08-2026' },
    { kind: 'linked-to-source', sourceName: 'Official' },
    { kind: 'linked-to-source', sourceName: 'Official', sourceUrl: 'http://example.org' },
  ])('rejects an incomplete or insecure record %#', (record) => expect(isValidVerificationRecord(record)).toBe(false));
});
