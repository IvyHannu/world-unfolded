import type { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, typography, type TypographyRole } from '@/tokens';

interface AppTextProps extends ComponentProps<typeof Text> {
  typographyRole?: TypographyRole;
}

export function AppText({ typographyRole = 'body', style, ...props }: AppTextProps) {
  return <Text {...props} style={[styles.base, typography.default[typographyRole], style]} />;
}

const styles = StyleSheet.create({
  base: { color: colors.textPrimary },
});
