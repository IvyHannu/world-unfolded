export const SEMANTIC_COLOR_ROLES = [
  'background',
  'surface',
  'surfaceElevated',
  'textPrimary',
  'textSecondary',
  'border',
  'accent',
  'accentContrast',
  'focus',
  'success',
  'warning',
  'error',
] as const;

export type SemanticColorRole = (typeof SEMANTIC_COLOR_ROLES)[number];
