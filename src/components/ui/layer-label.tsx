import { StyleSheet, View } from 'react-native';

import type { DiscoveryLayer } from '@/content/vocabularies';
import { discoveryLayerColors, radius, spacing } from '@/tokens';

import { AppText } from './app-text';

const names: Record<DiscoveryLayer, string> = { iconic: 'Iconic', hidden: 'Hidden', culture: 'Culture', taste: 'Taste', nature: 'Nature' };

export function LayerLabel({ layer }: { layer: DiscoveryLayer }) {
  return (
    <View accessibilityLabel={`${names[layer]} discovery layer`} style={[styles.label, { borderLeftColor: discoveryLayerColors[layer] }]}>
      <AppText typographyRole="label">{names[layer]}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ label: { alignSelf: 'flex-start', borderLeftWidth: 5, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs } });
