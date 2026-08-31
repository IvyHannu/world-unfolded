export const BREAKPOINT_ROLES = ['mobile', 'webDemo'] as const;

export type BreakpointRole = (typeof BREAKPOINT_ROLES)[number];

export const breakpoints: Record<BreakpointRole, number> = {
  mobile: 0,
  webDemo: 768,
};

export const layout = {
  contentMaxWidth: 1120,
  readingMaxWidth: 720,
} as const;
