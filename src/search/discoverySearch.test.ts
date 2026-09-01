import type { Destination, DiscoveryItem } from '@/types';
import { capeTown } from '@/content/destinations/cape-town';
import { capeTownDiscoveryItems } from '@/content/discoveryItems/cape-town';

import { searchAndFilterContent } from './discoverySearch';

describe('searchAndFilterContent', () => {
  it('matches destination names case-insensitively', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems, 'CAPE town')).toContainEqual({ kind: 'destination', destination: capeTown }));
  it('matches discovery item names', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems, 'District Six')[0]).toMatchObject({ kind: 'item', item: { id: 'district-six-museum' } }));
  it('returns all content for an empty query', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems)).toHaveLength(11));
  it('returns no results for an unmatched query', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems, 'not-a-real-place')).toEqual([]));
  it('applies a single layer filter', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems, '', { layer: 'hidden' }).map((result) => result.kind === 'item' ? result.item.layer : 'destination')).toEqual(['hidden', 'hidden']));
  it('intersects country and interest filters', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems, '', { country: 'South Africa', interest: 'wildlife' })).toHaveLength(1));
  it('intersects region, category, and search', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems, 'Boulders', { region: 'southern_africa', layer: 'nature' })).toHaveLength(1));
  it('does not return incompatible items', () => expect(searchAndFilterContent([capeTown], capeTownDiscoveryItems, '', { continent: 'Europe' })).toEqual([]));

  it('works with future destination fixtures', () => {
    const fixture: Destination = { ...capeTown, id: 'fixture', name: 'Fixture', country: 'Nigeria', region: 'west_africa' };
    const item: DiscoveryItem = { ...capeTownDiscoveryItems[0], id: 'fixture-item', destinationId: 'fixture', name: 'Fixture discovery' };
    expect(searchAndFilterContent([fixture], [item], 'fixture')).toHaveLength(2);
  });
});
