import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/tokens';

import { AppText } from './app-text';
import { Button } from './button';

interface FeedbackStateProps { title: string; message: string; actionLabel?: string; onAction?: () => void; tone: 'empty' | 'error' | 'success' }

export function FeedbackState({ actionLabel, message, onAction, title, tone }: FeedbackStateProps) {
  const role = tone === 'error' ? 'alert' : 'summary';
  return (
    <View accessibilityLabel={`${tone}: ${title}`} accessibilityRole={role} style={[styles.container, styles[tone]]}>
      <AppText accessibilityRole="header" typographyRole="subheading">{title}</AppText>
      <AppText style={styles.message}>{message}</AppText>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderLeftWidth: 5, borderRadius: radius.md, gap: spacing.sm, padding: spacing.lg },
  message: { color: colors.textSecondary },
  empty: { borderLeftColor: colors.focus },
  error: { borderLeftColor: colors.errorAccent },
  success: { borderLeftColor: colors.successAccent },
});
