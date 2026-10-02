import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText, ContentImage, ScreenContainer, Tappable } from '@/components/ui';
import { destinations, discoveryItems } from '@/content/contentIndex';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS, type DiscoveryLayer } from '@/content/vocabularies';
import { rankDestinations } from '@/personalization/scoring';
import { useProfileStore } from '@/state/profileStore';
import { useSavedStore } from '@/state/savedStore';
import { elevation, radius, spacing } from '@/tokens';

interface Props { onExplore: () => void; onOpenDestination: (id: string) => void; onOpenLayer: (layer: DiscoveryLayer) => void; onOpenProfile: () => void }

const layerDetails: Record<DiscoveryLayer, { icon: keyof typeof Ionicons.glyphMap; label: string; note: string }> = {
  iconic: { icon: 'sparkles-outline', label: 'Iconic', note: 'Famous places with deeper stories.' },
  hidden: { icon: 'key-outline', label: 'Hidden', note: 'Quiet places worth finding.' },
  culture: { icon: 'people-outline', label: 'Culture', note: 'Traditions, rituals, and memory.' },
  taste: { icon: 'restaurant-outline', label: 'Taste', note: 'A place understood through food.' },
  nature: { icon: 'leaf-outline', label: 'Nature', note: 'Landscapes that shape local life.' },
};

const journalPalette = {
  sunsetVermilion: '#C94F3D',
  marigoldGold: '#E7A936',
  atlasBlue: '#3C6E8F',
  terracottaClay: '#B8643E',
  orchidViolet: '#8B5FBF',
  oliveGrove: '#6F8F55',
  shellPink: '#F3D8CF',
  sandstone: '#F6E8D6',
  cloudWhite: '#FFFDF8',
  carbonInk: '#20242C',
} as const;

const layerAccents: Record<DiscoveryLayer, string> = {
  iconic: journalPalette.marigoldGold,
  hidden: journalPalette.orchidViolet,
  culture: journalPalette.terracottaClay,
  taste: journalPalette.sunsetVermilion,
  nature: journalPalette.oliveGrove,
};

const cinematic = {
  deepNavy: '#031A2F',
  oceanNight: '#063B5C',
  cloudWhite: '#FFFDF8',
} as const;

const navyFade = (alpha: number) => `rgba(3, 26, 47, ${alpha})`;

const heroFade = [navyFade(0.7), navyFade(0.08), navyFade(0.52), navyFade(1)] as const;
const panelFade = [navyFade(0), navyFade(0.05), navyFade(0.52), navyFade(0.92)] as const;
const stageFade = [cinematic.oceanNight, cinematic.deepNavy] as const;

export function DiscoverScreen({ onExplore, onOpenDestination, onOpenLayer, onOpenProfile }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const interests = useProfileStore((state) => state.interests);
  const preferredRegions = useProfileStore((state) => state.preferredRegions);
  const layerInterests = useProfileStore((state) => state.layerInterests);
  const records = useSavedStore((state) => state.records);
  const setStatus = useSavedStore((state) => state.setStatus);
  const ranked = rankDestinations(destinations, { interests, preferredRegions, layerInterests });
  const featured = ranked[0];
  const hero = getImageById(featured.heroImageId);
  const saved = records.some(({ subjectId }) => subjectId === featured.id);
  const heroHeight = Math.min(560, Math.max(500, Math.round(windowHeight * 0.7)));

  return (
    <ScreenContainer backgroundColor={cinematic.deepNavy}>
      <View style={styles.canvas}>
        <LinearGradient colors={stageFade} pointerEvents="none" style={StyleSheet.absoluteFill} />

        <View style={[styles.hero, { height: heroHeight }]}>
          {hero ? <ContentImage height={heroHeight} image={hero} style={styles.heroImage} /> : null}
          <LinearGradient colors={heroFade} locations={[0, 0.3, 0.64, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />

          <View style={styles.heroTop}>
            <Tappable accessibilityLabel="Open Explore" accessibilityRole="button" onPress={onExplore} style={styles.heroControl}>
              <BlurView intensity={30} pointerEvents="none" style={StyleSheet.absoluteFill} tint="dark" />
              <Ionicons color={cinematic.cloudWhite} name="menu" size={24} />
            </Tappable>
            <AppText numberOfLines={1} typographyRole="heading" style={styles.wordmark}>World Unfolded</AppText>
            <Tappable accessibilityLabel="Open Profile and preferences" accessibilityRole="button" onPress={onOpenProfile} style={styles.heroControl}>
              <BlurView intensity={30} pointerEvents="none" style={StyleSheet.absoluteFill} tint="dark" />
              <Ionicons color={cinematic.cloudWhite} name="person-outline" size={23} />
            </Tappable>
          </View>

          <View style={styles.heroCopy}>
            <AppText accessibilityRole="header" typographyRole="display" style={styles.heroTitle}>Unfold somewhere unforgettable.</AppText>
            <AppText style={styles.heroSubtitle}>Seven destinations. Five ways to see beyond the postcard.</AppText>
          </View>

          <View style={styles.searchDock}>
            <Tappable accessibilityLabel="Search destinations and experiences" accessibilityRole="search" onPress={onExplore} style={styles.search}>
              <BlurView intensity={40} pointerEvents="none" style={StyleSheet.absoluteFill} tint="dark" />
              <Ionicons color={journalPalette.marigoldGold} name="search" size={20} />
              <AppText numberOfLines={1} style={styles.searchText}>Where speaks to you?</AppText>
              <View style={styles.searchArrow}>
                <Ionicons color={cinematic.cloudWhite} name="arrow-forward" size={18} />
              </View>
            </Tappable>
          </View>
        </View>

        <View style={styles.body}>
          <Section subtitle="Every destination unfolds through five distinct layers." title="Choose your way in" />
          <ScrollView accessibilityLabel="Five discovery layers" contentContainerStyle={styles.layerRail} horizontal showsHorizontalScrollIndicator={false} style={styles.railBleed}>
            {DISCOVERY_LAYERS.map((layer) => {
              const detail = layerDetails[layer];
              const accent = layerAccents[layer];
              const item = discoveryItems.find((candidate) => candidate.destinationId === featured.id && candidate.layer === layer);
              const image = item ? getImageById(item.imageIds[0]) : undefined;
              return (
                <Tappable key={layer} accessibilityLabel={`Open ${detail.label} Layer`} accessibilityRole="link" onPress={() => onOpenLayer(layer)} style={styles.layerCard}>
                  {image ? <ContentImage height={280} image={image} style={styles.cardImage} /> : null}
                  <LinearGradient colors={panelFade} locations={[0, 0.32, 0.6, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
                  <View style={styles.layerTop}>
                    <View style={[styles.layerIcon, { backgroundColor: accent }]}>
                      <Ionicons color={cinematic.cloudWhite} name={detail.icon} size={20} />
                    </View>
                  </View>
                  <View style={styles.layerCopy}>
                    <View style={[styles.layerRule, { backgroundColor: accent }]} />
                    <AppText numberOfLines={1} typographyRole="heading" style={styles.layerLabel}>{detail.label}</AppText>
                    <AppText numberOfLines={1} typographyRole="caption" style={styles.layerNote}>{detail.note}</AppText>
                  </View>
                </Tappable>
              );
            })}
          </ScrollView>

          <Section subtitle="A deeper look at a place picked from your interests." title="Featured Destination" />
          <View style={styles.featured}>
            <Tappable accessibilityLabel={`Open featured destination ${featured.name}`} accessibilityRole="link" onPress={() => onOpenDestination(featured.id)}>
              {hero ? <ContentImage height={340} image={hero} style={styles.featuredImage} /> : null}
            </Tappable>
            <LinearGradient colors={[navyFade(0.1), navyFade(0.24), navyFade(0.82)]} locations={[0, 0.4, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
            <View style={styles.featuredPanel}>
              <View style={styles.featuredTop}>
                <AppText numberOfLines={1} style={styles.featuredContinent}>{featured.continent}</AppText>
                <Tappable
                  accessibilityLabel={saved ? `Remove ${featured.name} from Saved` : `Save ${featured.name}`}
                  accessibilityRole="button"
                  onPress={() => saved ? useSavedStore.getState().remove(featured.id) : setStatus(featured.id, 'destination', 'saved')}
                  style={[styles.saveButton, saved && styles.saveButtonActive]}
                >
                  <Ionicons color={saved ? journalPalette.sunsetVermilion : cinematic.cloudWhite} name={saved ? 'heart' : 'heart-outline'} size={21} />
                </Tappable>
              </View>
              <AppText numberOfLines={2} typographyRole="heading" style={styles.featuredName}>{featured.name}, {featured.country}</AppText>
              <AppText numberOfLines={2} style={styles.featuredDescription}>{featured.culturalOverview}</AppText>
              <Tappable accessibilityLabel={`Explore ${featured.name}`} accessibilityRole="button" onPress={() => onOpenDestination(featured.id)} style={styles.storyButton}>
                <AppText style={styles.storyButtonText}>Enter the story</AppText>
                <Ionicons color={cinematic.cloudWhite} name="arrow-forward" size={18} />
              </Tappable>
            </View>
          </View>

          <Section subtitle="Places to keep close while you decide." title="Passport picks" />
          <ScrollView horizontal contentContainerStyle={styles.pickRail} showsHorizontalScrollIndicator={false} style={styles.railBleed}>
            {ranked.slice(1, 6).map((destination) => {
              const image = getImageById(destination.heroImageId);
              return (
                <Tappable key={destination.id} accessibilityLabel={`Open ${destination.name}`} accessibilityRole="link" onPress={() => onOpenDestination(destination.id)} style={styles.pickCard}>
                  {image ? <ContentImage height={196} image={image} style={styles.cardImage} /> : null}
                  <LinearGradient colors={panelFade} locations={[0, 0.38, 0.68, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
                  <View style={styles.pickCopy}>
                    <AppText numberOfLines={1} typographyRole="subheading" style={styles.pickName}>{destination.name}</AppText>
                    <AppText numberOfLines={1} style={styles.pickCountry}>{destination.country}</AppText>
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

interface SectionProps { subtitle: string; title: string }

function Section({ subtitle, title }: SectionProps) {
  return (
    <View style={styles.sectionIntro}>
      <AppText accessibilityRole="header" typographyRole="heading" style={styles.sectionTitle}>{title}</AppText>
      <AppText style={styles.sectionSubtitle}>{subtitle}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { backgroundColor: cinematic.deepNavy, flex: 1, marginHorizontal: -spacing.lg, marginTop: -(spacing.xl + spacing.sm), position: 'relative' },

  hero: { backgroundColor: cinematic.oceanNight, overflow: 'hidden', position: 'relative' },
  heroImage: { borderRadius: radius.none },
  heroTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', left: spacing.md, position: 'absolute', right: spacing.md, top: spacing.md },
  heroControl: { alignItems: 'center', backgroundColor: 'rgba(3, 26, 47, 0.34)', borderColor: 'rgba(255, 253, 248, 0.24)', borderRadius: radius.pill, borderWidth: 1, height: 48, justifyContent: 'center', overflow: 'hidden', width: 48 },
  wordmark: { color: cinematic.cloudWhite, flexShrink: 1, fontSize: 18, letterSpacing: 0.6, lineHeight: 24, textAlign: 'center' },
  heroCopy: { bottom: 108, gap: spacing.sm, left: spacing.lg, position: 'absolute', right: spacing.lg },
  heroTitle: { color: cinematic.cloudWhite, fontSize: 42, lineHeight: 48 },
  heroSubtitle: { color: cinematic.cloudWhite, fontSize: 15, lineHeight: 23, opacity: 0.86 },
  searchDock: { bottom: spacing.lg, left: spacing.lg, position: 'absolute', right: spacing.lg },
  search: { alignItems: 'center', backgroundColor: 'rgba(3, 26, 47, 0.34)', borderColor: 'rgba(255, 253, 248, 0.3)', borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, minHeight: 58, overflow: 'hidden', paddingLeft: spacing.md, paddingRight: 5 },
  searchText: { color: cinematic.cloudWhite, flex: 1, opacity: 0.92 },
  searchArrow: { alignItems: 'center', backgroundColor: journalPalette.sunsetVermilion, borderRadius: radius.pill, height: 46, justifyContent: 'center', width: 46 },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  sectionIntro: { gap: 2, marginBottom: spacing.md, marginTop: spacing.lg },
  sectionTitle: { color: cinematic.cloudWhite },
  sectionSubtitle: { color: cinematic.cloudWhite, fontSize: 14, lineHeight: 21, opacity: 0.66 },

  railBleed: { marginHorizontal: -spacing.lg },
  layerRail: { gap: spacing.md, paddingHorizontal: spacing.lg },
  layerCard: { backgroundColor: cinematic.oceanNight, borderRadius: radius.lg, height: 280, overflow: 'hidden', position: 'relative', width: 264 },
  cardImage: { borderRadius: radius.none },
  layerTop: { left: spacing.md, position: 'absolute', top: spacing.md },
  layerIcon: { alignItems: 'center', borderRadius: radius.pill, height: 40, justifyContent: 'center', width: 40 },
  layerCopy: { bottom: spacing.md, gap: 2, left: spacing.md, position: 'absolute', right: spacing.md },
  layerRule: { borderRadius: radius.pill, height: 2, marginBottom: 5, width: 20 },
  layerLabel: { color: cinematic.cloudWhite, fontSize: 24, lineHeight: 30 },
  layerNote: { color: cinematic.cloudWhite, opacity: 0.78 },

  featured: { borderRadius: radius.lg, minHeight: 340, overflow: 'hidden', position: 'relative' },
  featuredImage: { borderRadius: radius.none },
  featuredPanel: { backgroundColor: 'rgba(3, 26, 47, 0.52)', borderRadius: radius.md, bottom: 14, gap: spacing.sm, left: 14, padding: spacing.md, position: 'absolute', right: 14 },
  featuredTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  featuredContinent: { color: journalPalette.marigoldGold, flexShrink: 1, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase' },
  saveButton: { alignItems: 'center', backgroundColor: 'rgba(255, 253, 248, 0.14)', borderColor: 'rgba(255, 253, 248, 0.3)', borderRadius: radius.pill, borderWidth: 1, height: 48, justifyContent: 'center', width: 48 },
  saveButtonActive: { backgroundColor: 'rgba(255, 253, 248, 0.92)', borderColor: 'transparent' },
  featuredName: { color: cinematic.cloudWhite, fontSize: 26, lineHeight: 32 },
  featuredDescription: { color: cinematic.cloudWhite, fontSize: 14, lineHeight: 20, opacity: 0.82 },
  storyButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: journalPalette.sunsetVermilion, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginTop: 2, minHeight: 46, paddingHorizontal: spacing.md, ...elevation.raised },
  storyButtonText: { color: cinematic.cloudWhite, fontSize: 15, lineHeight: 21 },

  pickRail: { gap: spacing.md, paddingHorizontal: spacing.lg },
  pickCard: { backgroundColor: cinematic.oceanNight, borderRadius: radius.lg, height: 196, overflow: 'hidden', position: 'relative', width: 236 },
  pickCopy: { bottom: spacing.sm, gap: 1, left: spacing.md, position: 'absolute', right: spacing.md },
  pickName: { color: cinematic.cloudWhite, fontSize: 18, lineHeight: 24 },
  pickCountry: { color: cinematic.cloudWhite, fontSize: 11, letterSpacing: 1, opacity: 0.76, textTransform: 'uppercase' },
});
