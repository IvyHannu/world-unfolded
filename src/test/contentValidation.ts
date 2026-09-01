import {
  DISCOVERY_ITEM_TYPES,
  DISCOVERY_LAYERS,
  INTEREST_TAGS,
  LOCALITY_TYPES,
  REGIONS,
} from '@/content/vocabularies';
import type { CuratedCollection, Destination, DiscoveryItem, ImageAsset } from '@/types';
import { isValidCoordinate } from '@/utils/coordinates';
import { isValidPracticalInformation } from '@/utils/verification';

export interface ContentSet {
  destinations: readonly Destination[];
  discoveryItems: readonly DiscoveryItem[];
  images: readonly ImageAsset[];
  curatedCollections: readonly CuratedCollection[];
}

const hasDuplicates = (values: readonly string[]) => new Set(values).size !== values.length;
const inVocabulary = <T extends string>(value: string, vocabulary: readonly T[]): value is T => vocabulary.includes(value as T);
const complete = (value: string) => value.trim().length > 0;

export function validateContent(content: ContentSet): string[] {
  const errors: string[] = [];
  const destinationIds = new Set(content.destinations.map(({ id }) => id));
  const itemIds = new Set(content.discoveryItems.map(({ id }) => id));
  const imageIds = new Set(content.images.map(({ id }) => id));

  if (content.destinations.length !== 7) errors.push(`Expected 7 destinations, received ${content.destinations.length}.`);
  if (content.discoveryItems.length !== 35) errors.push(`Expected 35 discovery items, received ${content.discoveryItems.length}.`);

  if (hasDuplicates(content.destinations.map(({ id }) => id))) errors.push('Destination IDs must be unique.');
  if (hasDuplicates(content.discoveryItems.map(({ id }) => id))) errors.push('Discovery item IDs must be unique.');
  if (hasDuplicates(content.images.map(({ id }) => id))) errors.push('Image IDs must be unique.');

  for (const destination of content.destinations) {
    if (!inVocabulary(destination.region, REGIONS)) errors.push(`${destination.id}: invalid region.`);
    if (!inVocabulary(destination.localityType, LOCALITY_TYPES)) errors.push(`${destination.id}: invalid locality type.`);
    if (destination.interestTags.some((tag) => !inVocabulary(tag, INTEREST_TAGS))) errors.push(`${destination.id}: invalid interest tag.`);
    if (destination.layerTags.some((layer) => !inVocabulary(layer, DISCOVERY_LAYERS))) errors.push(`${destination.id}: invalid layer tag.`);
    if (!imageIds.has(destination.heroImageId)) errors.push(`${destination.id}: missing hero image.`);
    for (const nearbyId of destination.nearbyDestinationIds) {
      if (!destinationIds.has(nearbyId) || nearbyId === destination.id) errors.push(`${destination.id}: invalid nearby destination ${nearbyId}.`);
    }
    for (const layer of DISCOVERY_LAYERS) {
      const count = content.discoveryItems.filter((item) => item.destinationId === destination.id && item.layer === layer).length;
      if (count !== 1) errors.push(`${destination.id}: expected 1 ${layer} item, received ${count}.`);
    }
  }

  for (const item of content.discoveryItems) {
    if (!destinationIds.has(item.destinationId)) errors.push(`${item.id}: missing destination.`);
    if (!inVocabulary(item.layer, DISCOVERY_LAYERS)) errors.push(`${item.id}: invalid layer.`);
    if (!inVocabulary(item.type, DISCOVERY_ITEM_TYPES)) errors.push(`${item.id}: invalid type.`);
    if (item.interestTags.some((tag) => !inVocabulary(tag, INTEREST_TAGS))) errors.push(`${item.id}: invalid interest tag.`);
    if (item.location && !isValidCoordinate(item.location)) errors.push(`${item.id}: invalid coordinates.`);
    if (item.practicalInformation?.officialVisitorUrl && !item.practicalInformation.officialVisitorUrl.startsWith('https://')) errors.push(`${item.id}: official visitor URL must use HTTPS.`);
    if (item.imageIds.length === 0) errors.push(`${item.id}: requires an image.`);
    for (const imageId of item.imageIds) if (!imageIds.has(imageId)) errors.push(`${item.id}: missing image ${imageId}.`);
    if (item.practicalInformation && !isValidPracticalInformation(item.practicalInformation)) errors.push(`${item.id}: invalid practical information.`);
  }

  for (const image of content.images) {
    if (![image.id, image.url, image.creatorName, image.creatorAttribution, image.licenseOrTerms, image.licenseUrl, image.representedSubjectId, image.altText, image.sourceUrl].every(complete)) errors.push(`${image.id}: incomplete attribution.`);
    if (!image.url.startsWith('https://') || !image.sourceUrl.startsWith('https://') || !image.licenseUrl.startsWith('https://')) errors.push(`${image.id}: image and license URLs must use HTTPS.`);
    if (typeof image.changeNoticeRequired !== 'boolean' || typeof image.shareAlikeRequired !== 'boolean') errors.push(`${image.id}: incomplete reuse requirements.`);
    if (!destinationIds.has(image.representedSubjectId) && !itemIds.has(image.representedSubjectId)) errors.push(`${image.id}: represented subject does not exist.`);
  }

  for (const collection of content.curatedCollections) {
    for (const destinationId of collection.destinationIds) if (!destinationIds.has(destinationId)) errors.push(`${collection.id}: missing destination ${destinationId}.`);
  }
  return errors;
}

export function assertValidContent(content: ContentSet): void {
  const errors = validateContent(content);
  if (errors.length) throw new Error(`Content validation failed:\n${errors.join('\n')}`);
}
