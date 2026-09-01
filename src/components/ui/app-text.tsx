import type { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, typography, type TypographyRole } from '@/tokens';
import { useProfileStore } from '@/state/profileStore';

interface AppTextProps extends ComponentProps<typeof Text> {
  typographyRole?: TypographyRole;
}

export function AppText({ typographyRole = 'body', style, ...props }: AppTextProps) {
  const textScale = useProfileStore((state) => state.accessibilityPreferences.textScale);
  return <Text {...props} style={[styles.base, typography[textScale][typographyRole], style]} />;
}

const styles = StyleSheet.create({
  base: { color: colors.textPrimary },
});
