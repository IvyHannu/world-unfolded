import type { PracticalInformation, VerificationRecord } from '@/types';

const isHttpsUrl = (value: unknown): value is string => typeof value === 'string' && value.startsWith('https://');
const isNonEmpty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export function isValidVerificationRecord(record: unknown): record is VerificationRecord {
  if (!record || typeof record !== 'object' || !('kind' in record)) return false;
  const candidate = record as Record<string, unknown>;
  if (candidate.kind === 'not-applicable') return true;
  if (candidate.kind === 'linked-to-source') return isNonEmpty(candidate.sourceName) && isHttpsUrl(candidate.sourceUrl);
  if (candidate.kind === 'verified') {
    return isNonEmpty(candidate.sourceName) && isHttpsUrl(candidate.sourceUrl)
      && isNonEmpty(candidate.lastVerifiedDate) && /^\d{4}-\d{2}-\d{2}$/.test(candidate.lastVerifiedDate)
      && !Number.isNaN(Date.parse(`${candidate.lastVerifiedDate}T00:00:00Z`));
  }
  return false;
}

export function isValidPracticalInformation(info: PracticalInformation): boolean {
  if ((info.openingHours || info.accessibilityNotes) && info.verification.kind === 'not-applicable') return false;
  return isValidVerificationRecord(info.verification);
}
