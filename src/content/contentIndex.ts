import type { CuratedCollection } from '@/types';
import { capeTown } from './destinations/cape-town';
import { capeTownDiscoveryItems } from './discoveryItems/cape-town';
import { capeTownImages } from './images/cape-town';

export const destinations = [capeTown];
export const discoveryItems = [...capeTownDiscoveryItems];
export const images = [...capeTownImages];
export const curatedCollections: CuratedCollection[] = [
  { id: 'cape-town-pilot', title: 'Cape Town through five layers', destinationIds: ['cape-town'] },
];

export const contentIndex = { destinations, discoveryItems, images, curatedCollections } as const;
