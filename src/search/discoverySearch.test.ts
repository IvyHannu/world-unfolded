import { destinations, discoveryItems } from '@/content/contentIndex';
import { searchAndFilterContent } from './discoverySearch';

describe('searchAndFilterContent', () => {
  it('matches destination names case-insensitively', () => expect(searchAndFilterContent(destinations, discoveryItems, 'BALI')[0]).toMatchObject({ kind: 'destination', destination: { id: 'bali' } }));
  it('matches discovery item names', () => expect(searchAndFilterContent(destinations, discoveryItems, 'Gion Matsuri')[0]).toMatchObject({ kind: 'item', item: { id: 'gion-matsuri' } }));
  it('returns all V1 content for an empty query', () => expect(searchAndFilterContent(destinations, discoveryItems)).toHaveLength(42));
  it('returns no results for an unmatched query', () => expect(searchAndFilterContent(destinations, discoveryItems, 'not-a-real-place')).toEqual([]));
  it('applies a single layer filter', () => expect(searchAndFilterContent(destinations, discoveryItems, '', { layer: 'hidden' }).filter(({ kind }) => kind === 'item')).toHaveLength(7));
  it('intersects country and interest filters', () => expect(searchAndFilterContent(destinations, discoveryItems, '', { country: 'Brazil', interest: 'nature' }).length).toBeGreaterThan(0));
  it('intersects region, category, and search', () => expect(searchAndFilterContent(destinations, discoveryItems, 'Batur', { region: 'southeast_asia', layer: 'nature' })).toHaveLength(1));
  it('does not return incompatible items', () => expect(searchAndFilterContent(destinations, discoveryItems, 'Bali', { continent: 'Europe' })).toEqual([]));
});
