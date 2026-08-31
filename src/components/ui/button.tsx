import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/tokens';

import { AppText } from './app-text';
import { Tappable } from './tappable';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({ disabled = false, label, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Tappable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.base, variant === 'primary' ? styles.primary : styles.secondary]}
    >
      <AppText typographyRole="label" style={disabled ? styles.disabledLabel : styles.label}>{label}</AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', borderRadius: radius.md, borderWidth: 2, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  primary: { backgroundColor: colors.primaryAction, borderColor: colors.brand },
  secondary: { backgroundColor: colors.surface, borderColor: colors.brand },
  label: { color: colors.primaryActionText },
  disabledLabel: { color: colors.disabledText },
});
