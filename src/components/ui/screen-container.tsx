import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/tokens';

interface ScreenContainerProps { backgroundColor?: ViewStyle['backgroundColor']; children: ReactNode; scroll?: boolean; testID?: string }

export function ScreenContainer({ backgroundColor, children, scroll = true, testID }: ScreenContainerProps) {
  const content = <View style={styles.content}>{children}</View>;
  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={[styles.safeArea, backgroundColor ? { backgroundColor } : null]} testID={testID}>
      {scroll ? <ScrollView contentContainerStyle={styles.scrollContent} contentInsetAdjustmentBehavior="automatic">{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: spacing.sm },
  content: { alignSelf: 'center', flex: 1, maxWidth: layout.contentMaxWidth, paddingBottom: 184, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, width: '100%' },
});
