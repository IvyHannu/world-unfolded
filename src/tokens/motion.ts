export const MOTION_ROLES = ['none', 'quick', 'standard', 'deliberate'] as const;

export type MotionRole = (typeof MOTION_ROLES)[number];
