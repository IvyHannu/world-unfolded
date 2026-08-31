export const BREAKPOINT_ROLES = ['mobile', 'webDemo'] as const;

export type BreakpointRole = (typeof BREAKPOINT_ROLES)[number];
