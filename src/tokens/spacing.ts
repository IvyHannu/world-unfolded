export const SPACING_ROLES = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export type SpacingRole = (typeof SPACING_ROLES)[number];

export const spacing: Record<SpacingRole, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};
