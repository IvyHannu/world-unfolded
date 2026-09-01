import type { DiscoveryLayer, InterestTag, Region } from '@/content/vocabularies';
import type { DiscoveryItem, Destination } from '@/types';

export interface ExploreFilters {
  continent?: string;
  country?: string;
  interest?: InterestTag;
  layer?: DiscoveryLayer;
  region?: Region;
}

export type ExploreResult =
  | { kind: 'destination'; destination: Destination }
  | { kind: 'item'; destination: Destination; item: DiscoveryItem };

const normalize = (value: string) => value.trim().toLocaleLowerCase();
const includesQuery = (name: string, query: string) => normalize(name).includes(normalize(query));

export function searchAndFilterContent(destinations: readonly Destination[], items: readonly DiscoveryItem[], query = '', filters: ExploreFilters = {}): ExploreResult[] {
  const destinationById = new Map(destinations.map((destination) => [destination.id, destination]));
  const matchesDestination = (destination: Destination) =>
    (!filters.continent || destination.continent === filters.continent) &&
    (!filters.country || destination.country === filters.country) &&
    (!filters.region || destination.region === filters.region);

  const destinationResults: ExploreResult[] = destinations
    .filter((destination) => matchesDestination(destination))
    .filter((destination) => !filters.interest || destination.interestTags.includes(filters.interest))
    .filter((destination) => !filters.layer || destination.layerTags.includes(filters.layer))
    .filter((destination) => includesQuery(destination.name, query))
    .map((destination) => ({ kind: 'destination', destination }));

  const itemResults: ExploreResult[] = items.flatMap((item) => {
    const destination = destinationById.get(item.destinationId);
    if (!destination || !matchesDestination(destination)) return [];
    if (filters.interest && !item.interestTags.includes(filters.interest)) return [];
    if (filters.layer && item.layer !== filters.layer) return [];
    if (!includesQuery(item.name, query)) return [];
    return [{ kind: 'item' as const, destination, item }];
  });

  return [...destinationResults, ...itemResults];
}
