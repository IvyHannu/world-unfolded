export const palette = {
  sunsetVermilion: '#C94F3D',
  marigoldGold: '#E7A936',
  atlasBlue: '#3C6E8F',
  terracottaClay: '#B8643E',
  orchidViolet: '#8B5FBF',
  oliveGrove: '#6F8F55',
  shellPink: '#F3D8CF',
  sandstone: '#F6E8D6',
  cloudWhite: '#FFFDF8',
  carbonInk: '#20242C',
} as const;

export const colors = {
  background: palette.sandstone,
  surface: palette.cloudWhite,
  surfaceSubtle: palette.shellPink,
  surfaceElevated: palette.cloudWhite,
  textPrimary: palette.carbonInk,
  textSecondary: palette.atlasBlue,
  border: palette.atlasBlue,
  brand: palette.sunsetVermilion,
  primaryAction: palette.atlasBlue,
  primaryActionText: palette.cloudWhite,
  focus: palette.orchidViolet,
  successAccent: palette.oliveGrove,
  warningAccent: palette.marigoldGold,
  errorAccent: palette.sunsetVermilion,
  disabledSurface: palette.shellPink,
  disabledText: palette.carbonInk,
  overlay: 'rgba(32, 36, 44, 0.18)',
} as const;

export const discoveryLayerColors = {
  iconic: palette.marigoldGold,
  hidden: palette.orchidViolet,
  culture: palette.terracottaClay,
  taste: palette.sunsetVermilion,
  nature: palette.oliveGrove,
} as const;

export const SEMANTIC_COLOR_ROLES = Object.keys(colors) as (keyof typeof colors)[];

export type SemanticColorRole = (typeof SEMANTIC_COLOR_ROLES)[number];
