import { StyleSheet } from 'react-native';

import { spacing } from '@/tokens';

import { AppText } from './app-text';
import { ScreenContainer } from './screen-container';

interface PlaceholderScreenProps {
  title: string;
}

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <ScreenContainer>
      <AppText accessibilityRole="header" typographyRole="heading">{title}</AppText>
      <AppText style={styles.context}>Application shell — feature content arrives in a later approved phase.</AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ context: { marginTop: spacing.sm } });
