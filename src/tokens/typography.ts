import type { TextStyle } from 'react-native';

export const TYPOGRAPHY_ROLES = ['display', 'heading', 'subheading', 'body', 'caption', 'label'] as const;

export type TypographyRole = (typeof TYPOGRAPHY_ROLES)[number];

export const TYPE_SCALE_NAMES = ['default', 'large'] as const;

export type TypeScaleName = (typeof TYPE_SCALE_NAMES)[number];

export const fontFamilies = {
  editorialRegular: 'PlayfairDisplay_400Regular',
  editorialBold: 'PlayfairDisplay_700Bold',
  uiRegular: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemibold: 'Inter_600SemiBold',
  uiBold: 'Inter_700Bold',
} as const;

type TypographyScale = Record<TypographyRole, TextStyle>;

export const typography: Record<TypeScaleName, TypographyScale> = {
  default: {
    display: { fontFamily: fontFamilies.editorialBold, fontSize: 42, lineHeight: 48, letterSpacing: -0.7 },
    heading: { fontFamily: fontFamilies.editorialBold, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
    subheading: { fontFamily: fontFamilies.uiSemibold, fontSize: 20, lineHeight: 28 },
    body: { fontFamily: fontFamilies.uiRegular, fontSize: 16, lineHeight: 24 },
    caption: { fontFamily: fontFamilies.uiRegular, fontSize: 13, lineHeight: 18 },
    label: { fontFamily: fontFamilies.uiSemibold, fontSize: 16, lineHeight: 22 },
  },
  large: {
    display: { fontFamily: fontFamilies.editorialBold, fontSize: 48, lineHeight: 56, letterSpacing: -0.7 },
    heading: { fontFamily: fontFamilies.editorialBold, fontSize: 36, lineHeight: 44, letterSpacing: -0.3 },
    subheading: { fontFamily: fontFamilies.uiSemibold, fontSize: 24, lineHeight: 32 },
    body: { fontFamily: fontFamilies.uiRegular, fontSize: 19, lineHeight: 29 },
    caption: { fontFamily: fontFamilies.uiRegular, fontSize: 16, lineHeight: 22 },
    label: { fontFamily: fontFamilies.uiSemibold, fontSize: 19, lineHeight: 26 },
  },
};
