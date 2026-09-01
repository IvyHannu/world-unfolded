import type { Destination } from '@/types';

import { rankDestinations, scoreDestination } from './scoring';

const base: Destination = { id: 'alpha', name: 'Alpha', country: 'A', continent: 'Africa', region: 'north_africa', localityType: 'city', culturalOverview: 'A', heroImageId: 'a', nearbyDestinationIds: [], interestTags: ['nature'], layerTags: ['nature'], editorialPriority: 10 };
const other: Destination = { ...base, id: 'beta', name: 'Beta', region: 'southeast_asia', interestTags: ['food'], layerTags: ['taste'], editorialPriority: 8 };

describe('personalization scoring', () => {
  it('adds interest matches', () => expect(scoreDestination(base, { interests: ['nature'], preferredRegions: [], layerInterests: [] })).toBeGreaterThan(scoreDestination(other, { interests: ['nature'], preferredRegions: [], layerInterests: [] })));
  it('adds preferred-region matches', () => expect(scoreDestination(other, { interests: [], preferredRegions: ['southeast_asia'], layerInterests: [] })).toBe(13));
  it('combines interests, region, and layers', () => expect(scoreDestination(other, { interests: ['food'], preferredRegions: ['southeast_asia'], layerInterests: ['taste'] })).toBe(18));
  it('uses editorial order without preferences', () => expect(rankDestinations([other, base], { interests: [], preferredRegions: [], layerInterests: [] }).map(({ id }) => id)).toEqual(['alpha', 'beta']));
  it('is not hardcoded to one destination', () => expect(rankDestinations([base, other], { interests: ['food'], preferredRegions: ['southeast_asia'], layerInterests: ['taste'] })[0].id).toBe('beta'));
});
