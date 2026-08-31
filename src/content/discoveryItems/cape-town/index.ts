import type { DiscoveryItem } from '@/types';

export const capeTownDiscoveryItems: DiscoveryItem[] = [
  {
    id: 'table-mountain', destinationId: 'cape-town', layer: 'iconic', type: 'natural_site', name: 'Table Mountain',
    description: 'The flat-topped mountain anchors Cape Town’s skyline and forms part of Table Mountain National Park, a protected landscape within the exceptionally diverse Cape Floristic Region.',
    culturalSignificance: 'Khoekhoe communities knew the mountain as Hoerikwaggo, often translated as “Mountain in the Sea”; that older name places the landmark within a history that predates colonial Cape Town.',
    location: { latitude: -33.9628, longitude: 18.4098 }, imageIds: ['table-mountain-image'], interestTags: ['nature', 'mountains', 'adventure', 'photography'],
    practicalInformation: { practicalGuidance: 'Weather can change quickly; consult the cableway’s official status before travelling.', verification: { kind: 'linked-to-source', sourceName: 'Table Mountain Aerial Cableway', sourceUrl: 'https://www.tablemountain.net/' } },
  },
  {
    id: 'va-waterfront', destinationId: 'cape-town', layer: 'iconic', type: 'attraction', name: 'V&A Waterfront',
    description: 'A working harbour redeveloped as a mixed waterfront district, bringing shops, museums, public spaces, ferries, and active port infrastructure together at the edge of Table Bay.',
    location: { latitude: -33.9036, longitude: 18.4207 }, imageIds: ['waterfront-image'], interestTags: ['architecture', 'culture', 'food', 'photography'],
  },
  {
    id: 'kalk-bay-harbour', destinationId: 'cape-town', layer: 'hidden', type: 'hidden_place', name: 'Kalk Bay Harbour',
    description: 'This small False Bay harbour remains a working fishing place, with boats landing catches beside a compact neighbourhood of cafés, galleries, and older seaside buildings.',
    culturalSignificance: 'The harbour reflects generations of fishing livelihoods around False Bay rather than functioning only as a scenic stop.',
    location: { latitude: -34.127, longitude: 18.4491 }, imageIds: ['kalk-bay-image'], interestTags: ['culture', 'food', 'history', 'photography'],
  },
  {
    id: 'companys-garden', destinationId: 'cape-town', layer: 'hidden', type: 'hidden_place', name: "Company’s Garden",
    description: 'A long public garden in the city centre, now linking museums, archives, historic buildings, and shaded walking paths below Table Mountain.',
    culturalSignificance: 'The garden began as a Dutch East India Company provisioning garden; its present calm sits within the colonial history that transformed the Cape and dispossessed Indigenous communities.',
    location: { latitude: -33.9278, longitude: 18.4169 }, imageIds: ['companys-garden-image'], interestTags: ['history', 'nature', 'architecture'],
  },
  {
    id: 'district-six-museum', destinationId: 'cape-town', layer: 'culture', type: 'attraction', name: 'District Six Museum',
    description: 'A community-rooted museum preserving memories of District Six and the people forcibly removed after the area was declared for white occupation under apartheid.',
    culturalSignificance: 'Oral histories, maps, photographs, and personal objects centre former residents and connect forced removal to continuing questions of restitution and belonging.',
    location: { latitude: -33.9277, longitude: 18.4237 }, imageIds: ['district-six-image'], interestTags: ['culture', 'history'],
    practicalInformation: { openingHours: 'Monday–Saturday, 09:00–16:00; confirm before visiting.', verification: { kind: 'verified', sourceName: 'District Six Museum — Museum Information', sourceUrl: 'https://www.districtsix.co.za/museum-information/', lastVerifiedDate: '2026-08-31' } },
  },
  {
    id: 'bo-kaap-cultural-landscape', destinationId: 'cape-town', layer: 'culture', type: 'cultural_practice', name: 'Bo-Kaap Cultural Landscape',
    description: 'Bo-Kaap is a living residential neighbourhood on Signal Hill, recognised for Cape Muslim heritage, mosques, steep streets, and brightly painted homes.',
    culturalSignificance: 'Its history is connected to enslaved and exiled people brought from East Africa, South and Southeast Asia, and to generations who sustained religious, culinary, and community traditions at the Cape.',
    location: { latitude: -33.9208, longitude: 18.4145 }, imageIds: ['bo-kaap-image'], interestTags: ['culture', 'history', 'architecture', 'photography'],
  },
  {
    id: 'cape-malay-cooking', destinationId: 'cape-town', layer: 'taste', type: 'food_experience', name: 'Cape Malay Cooking',
    description: 'Cape Malay cooking brings together aromatic spices, sweet-and-savoury combinations, pickles, breads, curries, and festive foods developed over generations in Cape Muslim communities.',
    culturalSignificance: 'The tradition carries histories of enslavement, adaptation, faith, family knowledge, and exchange; it should not be reduced to a single dish or treated as a generic national cuisine.',
    imageIds: ['cape-malay-food-image'], interestTags: ['food', 'culture', 'history'],
  },
  {
    id: 'cape-town-gatsby', destinationId: 'cape-town', layer: 'taste', type: 'food_experience', name: 'The Cape Town Gatsby',
    description: 'A Gatsby is an oversized Cape Town sandwich built for sharing, typically packed with hot chips and combinations that vary by shop and neighbourhood.',
    culturalSignificance: 'Associated especially with working-class communities on the Cape Flats, the Gatsby is a local street-food form whose generosity and adaptability are central to its identity.',
    imageIds: ['gatsby-image'], interestTags: ['food', 'culture'],
  },
  {
    id: 'boulders-beach', destinationId: 'cape-town', layer: 'nature', type: 'natural_site', name: 'Boulders Beach',
    description: 'Sheltered coves and granite boulders form part of Table Mountain National Park’s marine protected area and support a land-based colony of critically endangered African penguins.',
    location: { latitude: -34.1972, longitude: 18.4513 }, imageIds: ['boulders-image'], interestTags: ['nature', 'wildlife', 'beaches', 'photography'],
    practicalInformation: { accessibilityNotes: 'SANParks describes a wooden boardwalk to the penguin colony, ramped visitor-centre access, and wheelchair-user ablutions; some routes are steep and may require assistance.', officialVisitorUrl: 'https://www.sanparks.org/parks/table-mountain/what-to-do/attractions/boulders-penguin-colony', verification: { kind: 'linked-to-source', sourceName: 'SANParks — Table Mountain National Park accessibility information', sourceUrl: 'https://www.sanparks.org/parks/table-mountain/useful-information/people-with-disabilities' } },
  },
  {
    id: 'cape-point', destinationId: 'cape-town', layer: 'nature', type: 'natural_site', name: 'Cape Point',
    description: 'Cape Point lies in the Cape of Good Hope section of Table Mountain National Park, where steep cliffs, ocean views, fynbos, and exposed coastal weather define the southern peninsula.',
    culturalSignificance: 'It is often incorrectly called Africa’s southernmost point; Cape Agulhas holds that distinction. Cape Point remains significant for maritime history and conservation.',
    location: { latitude: -34.3568, longitude: 18.4975 }, imageIds: ['cape-point-image'], interestTags: ['nature', 'adventure', 'history', 'photography'],
    practicalInformation: { openingHours: 'Seasonal gate hours apply; use the official park information before travelling.', officialVisitorUrl: 'https://www.sanparks.org/parks/table-mountain/what-to-do/attractions/cape-of-good-hope-cape-point', verification: { kind: 'linked-to-source', sourceName: 'SANParks — Cape of Good Hope & Cape Point', sourceUrl: 'https://www.sanparks.org/parks/table-mountain/what-to-do/attractions/cape-of-good-hope-cape-point' } },
  },
];
