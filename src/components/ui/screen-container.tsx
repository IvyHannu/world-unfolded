import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/tokens';

interface ScreenContainerProps { children: ReactNode; scroll?: boolean; testID?: string }

export function ScreenContainer({ children, scroll = true, testID }: ScreenContainerProps) {
  const content = <View style={styles.content}>{children}</View>;
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea} testID={testID}>
      {scroll ? <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { alignSelf: 'center', flex: 1, maxWidth: layout.contentMaxWidth, paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, width: '100%' },
});
