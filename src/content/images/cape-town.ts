import type { ImageAsset } from '@/types';

const commons = (filename: string) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;
const sourcePage = (filename: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename).replaceAll('%20', '_')}`;

const records: (Omit<ImageAsset, 'source' | 'url' | 'sourceUrl'> & { filename: string })[] = [
  { id: 'cape-town-hero', filename: 'Cape Town Mountain.jpg', creatorName: 'safaritravelplus', licenseOrTerms: 'CC0 1.0', representedSubjectId: 'cape-town', altText: 'Panoramic view of Cape Town beneath Table Mountain' },
  { id: 'table-mountain-image', filename: 'Cape Town - 2018-07-16 - Table Mountain - 7645.jpg', creatorName: 'Pierre-Selim Huard', licenseOrTerms: 'CC BY 4.0', representedSubjectId: 'table-mountain', altText: 'Table Mountain seen from Signal Hill' },
  { id: 'waterfront-image', filename: 'V&A waterfront, Cape Town 1.jpg', creatorName: 'Mike Peel', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'va-waterfront', altText: 'Boats and buildings at the V&A Waterfront' },
  { id: 'kalk-bay-image', filename: 'Kalk bay Harbour.jpg', creatorName: 'GrantsJ1', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'kalk-bay-harbour', altText: 'Fishing boats in Kalk Bay Harbour' },
  { id: 'companys-garden-image', filename: "Company's Garden Cape Town.jpg", creatorName: 'LKD2018', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'companys-garden', altText: "A shaded path through Company's Garden with Table Mountain beyond" },
  { id: 'district-six-image', filename: 'District Six Museum, Cape Town 2018 01.jpg', creatorName: 'Mike Peel', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'district-six-museum', altText: 'An interior display at the District Six Museum' },
  { id: 'bo-kaap-image', filename: 'Bo-Kaap Cape Malay Quarter Cape Town.jpg', creatorName: 'Barry Haynes', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'bo-kaap-cultural-landscape', altText: 'Colourful homes in Bo-Kaap beneath Table Mountain' },
  { id: 'cape-malay-food-image', filename: 'Cape Malay snacks.jpg', creatorName: 'Go2africa', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'cape-malay-cooking', altText: 'Cape Malay samosas and chilli poppers being prepared' },
  { id: 'gatsby-image', filename: 'Cape Town - Vegan Lekker Nuggy Gatsby in restaurant Lekker Vegan.jpg', creatorName: 'Romaine', licenseOrTerms: 'CC0 1.0', representedSubjectId: 'cape-town-gatsby', altText: 'A Cape Town-style Gatsby sandwich filled with chips' },
  { id: 'boulders-image', filename: 'Boulders Beach (01).jpg', creatorName: 'Moheen Reeyad', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'boulders-beach', altText: 'Granite boulders and sheltered water at Boulders Beach' },
  { id: 'cape-point-image', filename: 'Cape Point South Africa.jpg', creatorName: 'Pierre André Leclercq', licenseOrTerms: 'CC BY-SA 4.0', representedSubjectId: 'cape-point', altText: 'Cliffs and ocean at Cape Point' },
];

export const capeTownImages: ImageAsset[] = records.map(({ filename, ...record }) => ({
  ...record,
  source: 'wikimedia_commons',
  url: commons(filename),
  sourceUrl: sourcePage(filename),
}));
