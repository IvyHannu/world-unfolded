export const SPACING_ROLES = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

export type SpacingRole = (typeof SPACING_ROLES)[number];
