import type { DiscoveryLayer, InterestTag, Region } from '@/content/vocabularies';
import type { Destination } from '@/types';

export interface PersonalizationInput {
  interests: readonly InterestTag[];
  preferredRegions: readonly Region[];
  layerInterests: readonly DiscoveryLayer[];
}

export const PERSONALIZATION_WEIGHTS = { interest: 3, region: 5, layer: 2 } as const;

export function hasPreferences(input: PersonalizationInput): boolean {
  return input.interests.length > 0 || input.preferredRegions.length > 0 || input.layerInterests.length > 0;
}

export function scoreDestination(destination: Destination, input: PersonalizationInput): number {
  const interestMatches = destination.interestTags.filter((tag) => input.interests.includes(tag)).length;
  const layerMatches = destination.layerTags.filter((layer) => input.layerInterests.includes(layer)).length;
  const regionMatch = input.preferredRegions.includes(destination.region) ? PERSONALIZATION_WEIGHTS.region : 0;
  return destination.editorialPriority + (interestMatches * PERSONALIZATION_WEIGHTS.interest) + regionMatch + (layerMatches * PERSONALIZATION_WEIGHTS.layer);
}

export function rankDestinations(destinations: readonly Destination[], input: PersonalizationInput): Destination[] {
  if (!hasPreferences(input)) return [...destinations].sort((a, b) => b.editorialPriority - a.editorialPriority || a.id.localeCompare(b.id));
  return [...destinations].sort((a, b) => scoreDestination(b, input) - scoreDestination(a, input) || b.editorialPriority - a.editorialPriority || a.id.localeCompare(b.id));
}
