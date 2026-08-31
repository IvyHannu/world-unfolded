import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/tokens';

import { AppText } from './app-text';
import { Tappable } from './tappable';

interface ChipProps { label: string; selected: boolean; onPress: () => void; disabled?: boolean }

export function Chip({ disabled = false, label, onPress, selected }: ChipProps) {
  return (
    <Tappable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <AppText typographyRole="label">{selected ? `✓ ${label}` : label}</AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  chip: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.pill, borderWidth: 2, justifyContent: 'center', paddingHorizontal: spacing.md },
  selected: { backgroundColor: colors.primaryAction, borderColor: colors.brand },
});
