export const MOTION_ROLES = ['none', 'fast', 'base', 'slow'] as const;

export type MotionRole = (typeof MOTION_ROLES)[number];

export const motion: Record<MotionRole, number> = {
  none: 0,
  fast: 120,
  base: 220,
  slow: 360,
};
