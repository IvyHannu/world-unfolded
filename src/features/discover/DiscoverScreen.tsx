import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useReducedMotion } from '@/accessibility/preferences';
import { AppText, ContentImage, ScreenContainer, Tappable } from '@/components/ui';
import { destinations, discoveryItems } from '@/content/contentIndex';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS, type DiscoveryLayer } from '@/content/vocabularies';
import { rankDestinations } from '@/personalization/scoring';
import { useProfileStore } from '@/state/profileStore';
import { useSavedStore } from '@/state/savedStore';
import { discoveryLayerColors, elevation, fontFamilies, palette, radius, spacing } from '@/tokens';

interface Props {
  onExplore: () => void;
  onOpenDestination: (id: string) => void;
  onOpenLayer: (layer: DiscoveryLayer) => void;
  onOpenProfile: () => void;
}

const layerDetails: Record<DiscoveryLayer, { icon: keyof typeof Ionicons.glyphMap; label: string; note: string; imageAlt: string; eyebrow: string }> = {
  iconic: { icon: 'sparkles-outline', label: 'Iconic', note: 'Famous places with deeper stories.', imageAlt: 'Tanah Lot temple on Bali’s coast', eyebrow: 'TIMELESS PLACES' },
  hidden: { icon: 'leaf-outline', label: 'Hidden', note: 'Quiet places worth finding.', imageAlt: 'A waterfall tucked inside a Bali jungle', eyebrow: 'QUIET DISCOVERIES' },
  culture: { icon: 'people-outline', label: 'Culture', note: 'Traditions, rituals, and memory.', imageAlt: 'Balinese dancers performing a traditional ceremony', eyebrow: 'LIVING TRADITIONS' },
  taste: { icon: 'restaurant-outline', label: 'Taste', note: 'A place understood through food.', imageAlt: 'A Balinese meal shared at a table', eyebrow: 'FLAVORS OF PLACE' },
  nature: { icon: 'earth-outline', label: 'Nature', note: 'Landscapes that shape local life.', imageAlt: 'Green rice fields beneath Mount Batur', eyebrow: 'LAND & WILDERNESS' },
};

const layerImages: Record<DiscoveryLayer, number> = {
  iconic: require('../../../assets/images/bali-tanah-lot.jpg'),
  hidden: require('../../../assets/images/bali-tukad-cepung.jpg'),
  culture: require('../../../assets/images/bali-kecak-fire-dance.jpg'),
  taste: require('../../../assets/images/bali-layer-taste.jpg'),
  nature: require('../../../assets/images/bali-sidemen-valley.jpg'),
};

const baliHero = require('../../../assets/images/bali-destination-hero.jpg');
const baliFeatured = require('../../../assets/images/bali-layer-iconic.jpg');

const cinematic = {
  deepNavy: '#031A2F',
  oceanNight: '#063B5C',
  cloudWhite: palette.cloudWhite,
  coral: palette.sunsetVermilion,
} as const;

const navyFade = (alpha: number) => `rgba(3, 26, 47, ${alpha})`;
const heroFade = [navyFade(0.28), navyFade(0.16), navyFade(0.54), navyFade(0.94)] as const;
const cardFade = [navyFade(0), navyFade(0.06), navyFade(0.4), navyFade(0.9)] as const;

export function DiscoverScreen({ onExplore, onOpenDestination, onOpenLayer, onOpenProfile }: Props) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const interests = useProfileStore((state) => state.interests);
  const preferredRegions = useProfileStore((state) => state.preferredRegions);
  const layerInterests = useProfileStore((state) => state.layerInterests);
  const records = useSavedStore((state) => state.records);
  const setStatus = useSavedStore((state) => state.setStatus);
  const remove = useSavedStore((state) => state.remove);
  const ranked = rankDestinations(destinations, { interests, preferredRegions, layerInterests });
  const featured = ranked[0];
  const hero = getImageById(featured.heroImageId);
  const isBali = featured.id === 'bali';
  const saved = records.some(({ subjectId }) => subjectId === featured.id);
  const heroHeight = Math.min(500, Math.max(390, Math.round(windowHeight * 0.52)));
  const layerCardWidth = Math.min(200, Math.max(150, Math.round(windowWidth * 0.43)));
  const heroMotion = useRef(new Animated.Value(0)).current;
  const heroScale = heroMotion.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] });
  const heroPan = heroMotion.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  useEffect(() => {
    if (reduceMotion) return undefined;

    const animation = Animated.loop(Animated.sequence([
      Animated.timing(heroMotion, { toValue: 1, duration: 24000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(heroMotion, { toValue: 0, duration: 24000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [heroMotion, reduceMotion]);

  return (
    <ScreenContainer backgroundColor={cinematic.deepNavy} bottomPadding={104}>
      <View style={styles.canvas}>
        <View style={[styles.hero, { height: heroHeight }]}>
          {isBali ? (
            <Animated.Image
              accessible
              accessibilityLabel="Coastal cliffs and turquoise water in Bali"
              resizeMode="cover"
              source={baliHero}
              style={[styles.heroImage, { transform: [{ scale: heroScale }, { translateX: heroPan }] }]}
            />
          ) : hero ? <ContentImage height={heroHeight} image={hero} style={styles.heroImage} /> : null}
          <LinearGradient colors={heroFade} locations={[0, 0.34, 0.66, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />

          <View style={styles.heroTop}>
            <Tappable accessibilityLabel="Open Explore" accessibilityRole="button" onPress={onExplore} style={styles.heroControl}>
              <Ionicons color={cinematic.cloudWhite} name="menu" size={23} />
            </Tappable>
            <View style={styles.wordmark}>
              <Ionicons color={cinematic.cloudWhite} name="sparkles" size={13} />
              <AppText numberOfLines={1} style={styles.wordmarkText}>World Unfolded</AppText>
            </View>
            <Tappable accessibilityLabel="Open Profile and preferences" accessibilityRole="button" onPress={onOpenProfile} style={styles.heroControl}>
              <Ionicons color={cinematic.cloudWhite} name="person-outline" size={21} />
            </Tappable>
          </View>

          <View style={styles.heroCopy}>
            <AppText accessibilityRole="header" typographyRole="display" style={styles.heroTitle}>Unfold somewhere unforgettable.</AppText>
            <AppText style={styles.heroSubtitle}>Seven destinations. Five ways to see beyond the postcard.</AppText>
          </View>

          <View style={styles.searchDock}>
            <Tappable accessibilityLabel="Search destinations and experiences" accessibilityRole="search" onPress={onExplore} style={styles.search}>
              <Ionicons color={cinematic.cloudWhite} name="search" size={22} />
              <AppText numberOfLines={1} style={styles.searchText}>Where speaks to you?</AppText>
            </Tappable>
          </View>
        </View>

        <View style={styles.body}>
          <Section action="Swipe to explore all layers" subtitle="Different lenses. A deeper world." title="Choose your way in" />
          <ScrollView
            accessibilityLabel="Five discovery layers"
            contentContainerStyle={styles.layerRail}
            decelerationRate="fast"
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.railBleed}
          >
            {DISCOVERY_LAYERS.map((layer) => {
              const detail = layerDetails[layer];
              const item = discoveryItems.find((candidate) => candidate.destinationId === featured.id && candidate.layer === layer);
              const image = item ? getImageById(item.imageIds[0]) : undefined;
              const accent = discoveryLayerColors[layer];
              return (
                <Tappable
                  accessibilityHint={`${detail.note} ${isBali ? detail.imageAlt : image?.altText ?? ''}`.trim()}
                  accessibilityLabel={`Open ${detail.label} Layer`}
                  accessibilityRole="link"
                  key={layer}
                  onPress={() => onOpenLayer(layer)}
                  style={[styles.layerCard, { width: layerCardWidth }]}
                >
                  {isBali ? (
                    <ExpoImage accessible={false} contentFit="cover" source={layerImages[layer]} style={StyleSheet.absoluteFill} transition={reduceMotion ? 0 : 180} />
                  ) : image ? <ContentImage height={124} image={image} style={styles.cardImage} /> : null}
                  <LinearGradient colors={cardFade} locations={[0, 0.38, 0.68, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
                  <Ionicons color={accent} name={detail.icon} size={25} style={styles.layerIcon} />
                  <View style={styles.layerCopy}>
                    <AppText numberOfLines={1} style={styles.layerLabel}>{detail.label}</AppText>
                    <AppText numberOfLines={1} style={styles.layerNote}>{detail.eyebrow}</AppText>
                  </View>
                  <View pointerEvents="none" style={styles.cardArrow}>
                    <Ionicons color={accent} name="chevron-forward" size={17} />
                  </View>
                </Tappable>
              );
            })}
          </ScrollView>

          <Section action="" subtitle="" title="Featured Destination" />
          <View style={styles.featured}>
            <Tappable accessibilityLabel={`Open featured destination ${featured.name}`} accessibilityRole="link" onPress={() => onOpenDestination(featured.id)} style={StyleSheet.absoluteFill}>
              {isBali ? (
                <ExpoImage accessible={false} contentFit="cover" source={baliFeatured} style={StyleSheet.absoluteFill} transition={reduceMotion ? 0 : 180} />
              ) : hero ? <ContentImage height={154} image={hero} style={styles.featuredImage} /> : null}
            </Tappable>
            <LinearGradient colors={[navyFade(0.78), navyFade(0.48), navyFade(0.08)]} end={{ x: 1, y: 0.5 }} pointerEvents="none" start={{ x: 0, y: 0.5 }} style={StyleSheet.absoluteFill} />
            <View pointerEvents="box-none" style={styles.featuredPanel}>
              <AppText numberOfLines={1} style={styles.featuredEyebrow}>FEATURED DESTINATION</AppText>
              <AppText numberOfLines={1} typographyRole="heading" style={styles.featuredName}>{featured.name}, {featured.country}</AppText>
              <AppText numberOfLines={2} style={styles.featuredDescription}>{featured.culturalOverview}</AppText>
              <View style={styles.featuredActions}>
                <Tappable
                  accessibilityLabel={saved ? `Remove ${featured.name} from Saved` : `Save ${featured.name}`}
                  accessibilityRole="button"
                  onPress={() => saved ? remove(featured.id) : setStatus(featured.id, 'destination', 'saved')}
                  style={[styles.saveButton, saved && styles.saveButtonActive]}
                >
                  <Ionicons color={saved ? cinematic.coral : cinematic.cloudWhite} name={saved ? 'bookmark' : 'bookmark-outline'} size={18} />
                  <AppText style={styles.buttonText}>{saved ? 'Saved' : 'Save'}</AppText>
                </Tappable>
                <Tappable accessibilityLabel={`Explore ${featured.name}`} accessibilityRole="button" onPress={() => onOpenDestination(featured.id)} style={styles.storyButton}>
                  <AppText style={styles.buttonText}>Explore {featured.name}</AppText>
                  <Ionicons color={cinematic.cloudWhite} name="arrow-forward" size={17} />
                </Tappable>
              </View>
            </View>
          </View>

          <Section action="More destinations" subtitle="Handpicked places to spark your next chapter." title="Passport picks" />
          <ScrollView
            accessibilityLabel="Five passport picks"
            contentContainerStyle={styles.pickRail}
            decelerationRate="fast"
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.railBleed}
          >
            {ranked.slice(1, 6).map((destination) => {
              const image = getImageById(destination.heroImageId);
              return (
                <Tappable
                  accessibilityLabel={`Open ${destination.name}`}
                  accessibilityRole="link"
                  key={destination.id}
                  onPress={() => onOpenDestination(destination.id)}
                  style={styles.pickCard}
                >
                  {image ? <ContentImage height={118} image={image} style={styles.pickImage} /> : null}
                  <LinearGradient colors={cardFade} locations={[0, 0.36, 0.7, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
                  <View style={styles.pickCopy}>
                    <AppText numberOfLines={1} typographyRole="subheading" style={styles.pickName}>{destination.name}</AppText>
                    <AppText numberOfLines={1} style={styles.pickCountry}>{destination.country}</AppText>
                  </View>
                  <View pointerEvents="none" style={styles.pickArrow}>
                    <Ionicons color={cinematic.cloudWhite} name="chevron-forward" size={17} />
                  </View>
                </Tappable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </ScreenContainer>
  );
}

interface SectionProps {
  action: string;
  subtitle: string;
  title: string;
}

function Section({ action, subtitle, title }: SectionProps) {
  return (
    <View style={styles.sectionIntro}>
      <View style={styles.sectionHeading}>
        <AppText accessibilityRole="header" typographyRole="heading" style={styles.sectionTitle}>{title}</AppText>
        {action ? <View style={styles.sectionAction}>
          <AppText numberOfLines={1} style={styles.sectionActionText}>{action}</AppText>
          <Ionicons color={cinematic.cloudWhite} name="arrow-forward" size={16} />
        </View> : null}
      </View>
      {subtitle ? <AppText style={styles.sectionSubtitle}>{subtitle}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { backgroundColor: cinematic.deepNavy, flex: 1, marginHorizontal: -spacing.lg, marginTop: -(spacing.xl + spacing.sm), position: 'relative' },

  hero: { backgroundColor: cinematic.oceanNight, overflow: 'hidden', position: 'relative' },
  heroImage: { ...StyleSheet.absoluteFillObject, height: '108%', left: '-4%', top: '-4%', width: '108%' },
  heroTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', left: spacing.lg, position: 'absolute', right: spacing.lg, top: spacing.md },
  heroControl: { alignItems: 'center', height: 42, justifyContent: 'center', width: 42 },
  wordmark: { alignItems: 'center', flex: 1, gap: 2, justifyContent: 'center' },
  wordmarkText: { color: cinematic.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 19, lineHeight: 24, textAlign: 'center' },
  heroCopy: { bottom: 76, gap: spacing.xs, left: spacing.lg, position: 'absolute', right: spacing.lg },
  heroTitle: { color: cinematic.cloudWhite, fontSize: 32, lineHeight: 36, maxWidth: 300 },
  heroSubtitle: { color: cinematic.cloudWhite, fontSize: 13, lineHeight: 18, opacity: 0.9 },
  searchDock: { bottom: spacing.sm, left: spacing.lg, position: 'absolute', right: spacing.lg },
  search: { alignItems: 'center', backgroundColor: 'rgba(3, 26, 47, 0.42)', borderRadius: radius.md, flexDirection: 'row', gap: spacing.sm, minHeight: 48, paddingHorizontal: spacing.md },
  searchText: { color: cinematic.cloudWhite, flex: 1, opacity: 0.92 },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs },
  sectionIntro: { gap: 1, marginBottom: spacing.xs, marginTop: spacing.md },
  sectionHeading: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  sectionTitle: { color: cinematic.cloudWhite, flex: 1, fontFamily: fontFamilies.editorialRegular, fontSize: 22, lineHeight: 27 },
  sectionAction: { alignItems: 'center', flexDirection: 'row', flexShrink: 1, gap: spacing.xs, paddingTop: spacing.xs },
  sectionActionText: { color: cinematic.cloudWhite, flexShrink: 1, fontSize: 10, lineHeight: 14, opacity: 0.76, textAlign: 'right' },
  sectionSubtitle: { color: cinematic.cloudWhite, fontSize: 12, lineHeight: 16, opacity: 0.75 },

  railBleed: { marginHorizontal: -spacing.lg },
  layerRail: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  layerCard: { backgroundColor: cinematic.oceanNight, borderColor: 'rgba(255, 253, 248, 0.12)', borderRadius: radius.sm, borderWidth: 1, height: 116, overflow: 'hidden', position: 'relative' },
  cardImage: { borderRadius: radius.none },
  layerIcon: { bottom: 48, left: spacing.md, position: 'absolute' },
  layerCopy: { bottom: spacing.sm, left: spacing.md, position: 'absolute', right: 37 },
  layerLabel: { color: cinematic.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 20, lineHeight: 24 },
  layerNote: { color: cinematic.cloudWhite, fontSize: 9, letterSpacing: 0.8, lineHeight: 13, opacity: 0.82, textTransform: 'uppercase' },
  cardArrow: { alignItems: 'center', bottom: spacing.sm, height: 24, justifyContent: 'center', position: 'absolute', right: spacing.sm, width: 24 },

  featured: { backgroundColor: cinematic.oceanNight, borderRadius: radius.sm, height: 154, overflow: 'hidden', position: 'relative' },
  featuredImage: { borderRadius: radius.none },
  featuredPanel: { bottom: spacing.sm, gap: 2, left: spacing.md, position: 'absolute', right: spacing.md, top: spacing.sm },
  featuredEyebrow: { color: cinematic.cloudWhite, fontSize: 8, letterSpacing: 1.8, lineHeight: 11 },
  featuredName: { color: cinematic.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 21, lineHeight: 25 },
  featuredDescription: { color: cinematic.cloudWhite, fontSize: 10, lineHeight: 13, maxWidth: 280, opacity: 0.9 },
  featuredActions: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: 'auto' },
  saveButton: { alignItems: 'center', backgroundColor: 'rgba(3, 26, 47, 0.28)', borderRadius: radius.pill, flexDirection: 'row', gap: spacing.xs, height: 36, justifyContent: 'center', minWidth: 82, paddingHorizontal: spacing.sm },
  saveButtonActive: { backgroundColor: cinematic.cloudWhite },
  storyButton: { alignItems: 'center', backgroundColor: cinematic.coral, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.xs, height: 36, justifyContent: 'center', minWidth: 140, paddingHorizontal: spacing.md, ...elevation.raised },
  buttonText: { color: cinematic.cloudWhite, fontSize: 11, fontWeight: '600' },

  pickRail: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  pickCard: { backgroundColor: cinematic.oceanNight, borderColor: 'rgba(255, 253, 248, 0.12)', borderRadius: radius.sm, borderWidth: 1, height: 104, overflow: 'hidden', position: 'relative', width: 158 },
  pickImage: { borderRadius: radius.none },
  pickCopy: { bottom: spacing.xs, gap: 1, left: spacing.sm, position: 'absolute', right: 30 },
  pickName: { color: cinematic.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 17, lineHeight: 21 },
  pickCountry: { color: cinematic.cloudWhite, fontSize: 9, letterSpacing: 1.4, lineHeight: 13, opacity: 0.9, textTransform: 'uppercase' },
  pickArrow: { alignItems: 'center', bottom: spacing.xs, height: 24, justifyContent: 'center', position: 'absolute', right: spacing.xs, width: 24 },
});
