import type { CuratedCollection } from '@/types';
import { v1Destinations } from './destinations/v1';
import { v1DiscoveryItems } from './discoveryItems/v1';
import { v1Images } from './images/v1';

export const destinations = v1Destinations;
export const discoveryItems = v1DiscoveryItems.map((item) => ({ ...item, imageIds: [`${item.id}-image`] }));
export const images = v1Images;
export const curatedCollections: CuratedCollection[] = [
  { id: 'v1-seven-destinations', title: 'Seven places, five ways to look', destinationIds: v1Destinations.map(({ id }) => id) },
];

export const contentIndex = { destinations, discoveryItems, images, curatedCollections } as const;
