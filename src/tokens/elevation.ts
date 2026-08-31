export const ELEVATION_ROLES = ['none', 'raised', 'overlay'] as const;

export type ElevationRole = (typeof ELEVATION_ROLES)[number];
