export const TYPOGRAPHY_ROLES = ['display', 'heading', 'title', 'body', 'label', 'caption'] as const;

export type TypographyRole = (typeof TYPOGRAPHY_ROLES)[number];

export const TYPE_SCALE_NAMES = ['default', 'large'] as const;

export type TypeScaleName = (typeof TYPE_SCALE_NAMES)[number];
