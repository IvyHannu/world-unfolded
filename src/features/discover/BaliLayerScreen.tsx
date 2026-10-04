import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Tappable } from '@/components/ui';
import type { DiscoveryLayer } from '@/content/vocabularies';
import type { DiscoveryItem } from '@/types';
import { discoveryLayerColors, fontFamilies, palette, radius, spacing } from '@/tokens';

const layerNames: Record<DiscoveryLayer, string> = {
  iconic: 'Iconic',
  hidden: 'Hidden',
  culture: 'Culture',
  taste: 'Taste',
  nature: 'Nature',
};

const layerHeroImages: Record<DiscoveryLayer, number> = {
  iconic: require('../../../assets/images/bali-layer-iconic.jpg'),
  hidden: require('../../../assets/images/bali-layer-hidden.jpg'),
  culture: require('../../../assets/images/bali-layer-galungan .jpg'),
  taste: require('../../../assets/images/bali-layer-taste.jpg'),
  nature: require('../../../assets/images/bali-sidemen-valley.jpg'),
};

const storyImages = new Map<string, number>([
  ['tanah-lot', require('../../../assets/images/bali-tanah-lot.jpg')],
  ['tenganan', require('../../../assets/images/bali-tenganan-village.jpg')],
  ['subak', require('../../../assets/images/bali-layer-barong dance.jpg')],
  ['babi-guling', require('../../../assets/images/bali-babi-guling.jpg')],
  ['mount-batur', require('../../../assets/images/bali-mount-batur.jpg')],
]);

const layerDescriptions: Record<DiscoveryLayer, string> = {
  iconic: 'Landmarks, ceremonies and places that shape Bali’s shared identity.',
  hidden: 'Quiet corners and living communities worth discovering with care.',
  culture: 'Living traditions, performance and craft carried across generations.',
  taste: 'Local flavours, foodways and the stories shared around the table.',
  nature: 'Volcanic peaks, green valleys and the landscapes that shape island life.',
};

interface BaliLayerScreenProps {
  items: readonly DiscoveryItem[];
  layer: DiscoveryLayer;
  onBack: () => void;
  onOpenItem: (id: string) => void;
}

export function BaliLayerScreen({ items, layer, onBack, onOpenItem }: BaliLayerScreenProps) {
  const insets = useSafeAreaInsets();
  const activeItem = items.find((item) => item.layer === layer)!;
  const relatedItems = items.filter((item) => item.id !== activeItem.id);

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <ExpoImage accessibilityLabel={`Bali ${layerNames[layer]} layer hero`} accessible contentFit="cover" source={layerHeroImages[layer]} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(3,26,47,0.46)', 'rgba(3,26,47,0.04)', 'rgba(3,26,47,0.86)']} locations={[0, 0.38, 1]} style={StyleSheet.absoluteFill} />
          <Tappable accessibilityLabel="Go back" accessibilityRole="button" focusStyle={styles.focusState} onPress={onBack} style={[styles.back, { top: insets.top + spacing.md }]}>
            <Ionicons color={palette.cloudWhite} name="chevron-back" size={22} />
          </Tappable>
          <View style={styles.wordmark}>
            <Ionicons color={palette.cloudWhite} name="sparkles" size={12} />
            <AppText style={styles.wordmarkText}>World Unfolded</AppText>
          </View>
          <View style={styles.heroCopy}>
            <View style={[styles.layerBadge, { backgroundColor: discoveryLayerColors[layer] }]}>
              <View style={[styles.layerDot, { backgroundColor: discoveryLayerColors[layer] }]} />
              <AppText style={styles.layerLabel}>{layerNames[layer]}</AppText>
            </View>
            <AppText accessibilityRole="header" style={styles.heroTitle}>{layerNames[layer]} Bali</AppText>
            <AppText style={styles.heroSubtitle}>{layerDescriptions[layer]}</AppText>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeading}>
            <AppText accessibilityRole="header" style={styles.sectionTitle}>{layerNames[layer]} in Bali</AppText>
            <View style={[styles.sectionAccent, { backgroundColor: discoveryLayerColors[layer] }]} />
          </View>
          <Tappable accessibilityLabel={`Open ${activeItem.name}`} accessibilityRole="link" focusStyle={styles.cardFocus} onPress={() => onOpenItem(activeItem.id)} style={styles.featureCard}>
            <ExpoImage accessible={false} contentFit="cover" source={storyImages.get(activeItem.id) ?? layerHeroImages[layer]} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(3,26,47,0.02)', 'rgba(3,26,47,0.16)', 'rgba(3,26,47,0.88)']} locations={[0, 0.46, 1]} style={StyleSheet.absoluteFill} />
            <View style={[styles.featureLayer, { backgroundColor: discoveryLayerColors[layer] }]}>
              <AppText style={styles.featureLayerText}>{layerNames[layer]}</AppText>
            </View>
            <View style={styles.featureCopy}>
              <AppText style={styles.featureTitle}>{activeItem.name}</AppText>
              <AppText numberOfLines={2} style={styles.featureDescription}>{activeItem.description}</AppText>
            </View>
            <View style={styles.featureArrow}><Ionicons color={palette.cloudWhite} name="arrow-forward" size={19} /></View>
          </Tappable>

          {relatedItems.length ? (
            <View style={styles.relatedSection}>
              <AppText accessibilityRole="header" style={styles.sectionTitle}>More to explore</AppText>
              <ScrollView accessibilityLabel="More Bali stories" contentContainerStyle={styles.relatedRail} horizontal showsHorizontalScrollIndicator={false}>
                {relatedItems.map((item) => (
                  <Tappable accessibilityLabel={`Open ${item.name}`} accessibilityRole="link" focusStyle={styles.cardFocus} key={item.id} onPress={() => onOpenItem(item.id)} style={styles.relatedCard}>
                    <ExpoImage accessible={false} contentFit="cover" source={storyImages.get(item.id) ?? layerHeroImages[item.layer]} style={StyleSheet.absoluteFill} />
                    <LinearGradient colors={['rgba(3,26,47,0.02)', 'rgba(3,26,47,0.86)']} style={StyleSheet.absoluteFill} />
                    <AppText numberOfLines={2} style={styles.relatedTitle}>{item.name}</AppText>
                    <View style={styles.relatedArrow}><Ionicons color={palette.cloudWhite} name="arrow-forward" size={16} /></View>
                  </Tappable>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.softCloudIvory, flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
  hero: { backgroundColor: palette.oceanBlue, height: 400, overflow: 'hidden', position: 'relative' },
  back: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.82)', borderColor: 'rgba(255,253,248,0.26)', borderRadius: radius.pill, borderWidth: 1, height: 42, justifyContent: 'center', left: spacing.md, position: 'absolute', width: 42 },
  wordmark: { alignItems: 'center', left: 72, position: 'absolute', right: 72, top: spacing.md },
  wordmarkText: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 17, lineHeight: 22 },
  heroCopy: { bottom: spacing.lg, gap: spacing.xs, left: spacing.md, position: 'absolute', right: spacing.md },
  layerBadge: { alignItems: 'center', alignSelf: 'flex-start', borderRadius: radius.pill, flexDirection: 'row', gap: 7, minHeight: 30, paddingHorizontal: spacing.sm },
  layerDot: { borderColor: palette.carbonInk, borderRadius: radius.pill, borderWidth: 1, height: 9, width: 9 },
  layerLabel: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 12 },
  heroTitle: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialBold, fontSize: 34, lineHeight: 40 },
  heroSubtitle: { color: palette.cloudWhite, fontSize: 13, lineHeight: 19, maxWidth: 330 },
  content: { gap: spacing.md, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  sectionTitle: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 21, lineHeight: 28 },
  sectionAccent: { borderRadius: radius.pill, height: 4, width: 24 },
  featureCard: { backgroundColor: palette.oceanBlue, borderRadius: radius.sm, height: 236, overflow: 'hidden', position: 'relative' },
  featureLayer: { borderRadius: radius.pill, left: spacing.sm, paddingHorizontal: spacing.sm, paddingVertical: 5, position: 'absolute', top: spacing.sm },
  featureLayerText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 11 },
  featureCopy: { bottom: spacing.md, left: spacing.md, position: 'absolute', right: 58 },
  featureTitle: { color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 22, lineHeight: 28 },
  featureDescription: { color: palette.cloudWhite, fontSize: 13, lineHeight: 19, marginTop: 2 },
  featureArrow: { alignItems: 'center', bottom: spacing.md, height: 34, justifyContent: 'center', position: 'absolute', right: spacing.md, width: 34 },
  relatedSection: { gap: spacing.xs },
  relatedRail: { gap: spacing.sm },
  relatedCard: { backgroundColor: palette.oceanBlue, borderRadius: radius.sm, height: 132, overflow: 'hidden', position: 'relative', width: 160 },
  relatedTitle: { bottom: spacing.sm, color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 14, left: spacing.sm, position: 'absolute', right: 36 },
  relatedArrow: { alignItems: 'center', bottom: spacing.xs, height: 28, justifyContent: 'center', position: 'absolute', right: spacing.xs, width: 28 },
  focusState: { borderColor: palette.goldenSun, borderWidth: 2 },
  cardFocus: { borderColor: palette.goldenSun, borderWidth: 2 },
});
