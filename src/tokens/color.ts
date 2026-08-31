export const palette = {
  richCoral: '#D85F5A',
  coralBloom: '#EE7B6A',
  goldenSaffron: '#F2B84B',
  mediterraneanSky: '#B8DDF2',
  imperialViolet: '#7663B8',
  softLavender: '#C6B9E2',
  dustyRose: '#D98FCC',
  palmGreen: '#5E9C76',
  mistBlush: '#F7EEF4',
  nightInk: '#1E2230',
  white: '#FFFFFF',
  coolNeutral: '#F4F5F8',
  coolBorder: '#D8DAE2',
  mutedInk: '#555B6C',
} as const;

export const colors = {
  background: palette.mistBlush,
  surface: palette.white,
  surfaceSubtle: palette.coolNeutral,
  surfaceElevated: palette.white,
  textPrimary: palette.nightInk,
  textSecondary: palette.mutedInk,
  border: palette.coolBorder,
  brand: palette.richCoral,
  primaryAction: palette.coralBloom,
  primaryActionText: palette.nightInk,
  focus: palette.imperialViolet,
  successAccent: palette.palmGreen,
  warningAccent: palette.goldenSaffron,
  errorAccent: palette.richCoral,
  disabledSurface: palette.coolNeutral,
  disabledText: palette.mutedInk,
  overlay: 'rgba(30, 34, 48, 0.18)',
} as const;

export const discoveryLayerColors = {
  iconic: palette.goldenSaffron,
  hidden: palette.imperialViolet,
  culture: palette.richCoral,
  taste: palette.dustyRose,
  nature: palette.palmGreen,
} as const;

export const SEMANTIC_COLOR_ROLES = Object.keys(colors) as (keyof typeof colors)[];

export type SemanticColorRole = (typeof SEMANTIC_COLOR_ROLES)[number];
