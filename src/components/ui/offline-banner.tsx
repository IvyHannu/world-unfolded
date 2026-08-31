import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/tokens';

import { AppText } from './app-text';

interface OfflineBannerProps { message?: string }

export function OfflineBanner({ message = 'You are offline. Remote images and maps may be unavailable.' }: OfflineBannerProps) {
  return (
    <View accessibilityLabel="Offline status" accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.banner}>
      <AppText typographyRole="label">Offline</AppText>
      <AppText typographyRole="caption">{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ banner: { backgroundColor: colors.surface, borderBottomColor: colors.warningAccent, borderBottomWidth: 4, gap: spacing.xs, padding: spacing.md } });
