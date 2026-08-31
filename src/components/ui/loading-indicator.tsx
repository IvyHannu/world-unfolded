import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/tokens';

import { AppText } from './app-text';

interface LoadingIndicatorProps { label?: string }

export function LoadingIndicator({ label = 'Loading' }: LoadingIndicatorProps) {
  return (
    <View accessibilityLabel={label} accessibilityRole="progressbar" style={styles.container}>
      <ActivityIndicator color={colors.brand} />
      <AppText>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ container: { alignItems: 'center', gap: spacing.sm, justifyContent: 'center', padding: spacing.lg } });
