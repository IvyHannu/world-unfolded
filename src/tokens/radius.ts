export const RADIUS_ROLES = ['none', 'sm', 'md', 'lg', 'pill'] as const;

export type RadiusRole = (typeof RADIUS_ROLES)[number];

export const radius: Record<RadiusRole, number> = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};
