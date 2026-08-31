import type { DiscoveryItemType, DiscoveryLayer, InterestTag, LocalityType, Region } from '@/content/vocabularies';

export interface Destination { id: string; name: string; country: string; continent: string; region: Region; localityType: LocalityType; culturalOverview: string; heroImageId: string; nearbyDestinationIds: string[]; interestTags: InterestTag[]; layerTags: DiscoveryLayer[]; editorialPriority: number }
export interface Coordinates { latitude: number; longitude: number }
export interface VerifiedInfo { kind: 'verified'; sourceName: string; sourceUrl: string; lastVerifiedDate: string }
export interface LinkedInfo { kind: 'linked-to-source'; sourceName: string; sourceUrl: string }
export interface NotApplicableInfo { kind: 'not-applicable' }
export type VerificationRecord = VerifiedInfo | LinkedInfo | NotApplicableInfo;
export interface PracticalInformation { openingHours?: string; accessibilityNotes?: string; practicalGuidance?: string; verification: VerificationRecord }
export interface DiscoveryItem { id: string; destinationId: string; layer: DiscoveryLayer; type: DiscoveryItemType; name: string; description: string; culturalSignificance?: string; location?: Coordinates; practicalInformation?: PracticalInformation; imageIds: string[]; interestTags: InterestTag[] }
export interface ImageAsset { id: string; url: string; source: 'unsplash' | 'pexels' | 'wikimedia_commons'; creatorName: string; licenseOrTerms: string; representedSubjectId: string; altText: string; sourceUrl: string }
export interface UserProfile { interests: InterestTag[]; preferredRegions: Region[]; layerInterests: DiscoveryLayer[]; accessibilityPreferences: { reduceMotion: boolean; textScale: 'default' | 'large' } }
export interface SavedItem { subjectId: string; subjectType: 'destination' | 'discoveryItem'; status: 'saved' | 'wantToGo'; dateAdded: string }
export interface VisitedRecord { destinationId: string; dateMarkedVisited: string; stampId: string }
export interface PassportStamp { id: string; destinationId: string; imageAssetId: string }
export interface CuratedCollection { id: string; title: string; destinationIds: string[] }
