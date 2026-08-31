import { Platform, type ViewStyle } from 'react-native';

export const ELEVATION_ROLES = ['none', 'raised', 'overlay'] as const;

export type ElevationRole = (typeof ELEVATION_ROLES)[number];

const nativeRaised: ViewStyle = {
  shadowColor: '#1E2230',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
};

const nativeOverlay: ViewStyle = {
  shadowColor: '#1E2230',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 18,
  elevation: 6,
};

export const elevation: Record<ElevationRole, ViewStyle> = {
  none: {},
  raised: Platform.select({ web: { boxShadow: '0 2px 8px rgba(30, 34, 48, 0.08)' }, default: nativeRaised }),
  overlay: Platform.select({ web: { boxShadow: '0 6px 18px rgba(30, 34, 48, 0.12)' }, default: nativeOverlay }),
};
