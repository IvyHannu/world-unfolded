export const RADIUS_ROLES = ['none', 'sm', 'md', 'lg', 'pill'] as const;

export type RadiusRole = (typeof RADIUS_ROLES)[number];
