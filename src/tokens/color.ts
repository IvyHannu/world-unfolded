export const palette = {
  softCloudIvory: '#FFF8EF',
  cloudWhite: '#FFFDF8',
  atlasBlue: '#247BA0',
  tropicalSky: '#D7F3F4',
  sunsetCoral: '#FFD7C2',
  sunsetVermilion: '#C94F3D',
  carbonInk: '#20242C',
  softMist: '#F7FEFC',
  oceanBlue: '#1677A8',
  goldenSun: '#F2B84B',
  orchidViolet: '#8B5FBF',
  terracottaClay: '#B8643E',
  palmGreen: '#6F8F55',
} as const;

export const colors = {
  background: palette.softCloudIvory,
  surface: palette.cloudWhite,
  surfaceSubtle: palette.sunsetCoral,
  surfaceElevated: palette.cloudWhite,
  textPrimary: palette.carbonInk,
  textSecondary: palette.carbonInk,
  border: palette.atlasBlue,
  brand: palette.sunsetVermilion,
  primaryAction: '#BF4938',
  primaryActionText: palette.cloudWhite,
  focus: palette.atlasBlue,
  successAccent: palette.atlasBlue,
  warningAccent: palette.sunsetVermilion,
  errorAccent: palette.sunsetVermilion,
  disabledSurface: palette.sunsetCoral,
  disabledText: palette.carbonInk,
  overlay: 'rgba(32, 36, 44, 0.22)',
} as const;

export const discoveryLayerColors = {
  iconic: palette.goldenSun,
  hidden: palette.orchidViolet,
  culture: palette.terracottaClay,
  taste: palette.sunsetVermilion,
  nature: palette.palmGreen,
} as const;

export const SEMANTIC_COLOR_ROLES = Object.keys(colors) as (keyof typeof colors)[];
export type SemanticColorRole = (typeof SEMANTIC_COLOR_ROLES)[number];
