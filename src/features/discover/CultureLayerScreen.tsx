import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { useReducedMotion } from '@/accessibility/preferences';
import { AppText, Tappable } from '@/components/ui';
import type { DiscoveryLayer } from '@/content/vocabularies';
import { usePassportStore } from '@/state/passportStore';
import { useSavedStore } from '@/state/savedStore';
import { colors, discoveryLayerColors, fontFamilies, palette, radius, spacing } from '@/tokens';

const layers: { id: DiscoveryLayer; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'culture', label: 'Culture', icon: 'people' },
  { id: 'iconic', label: 'Iconic', icon: 'sunny' },
  { id: 'hidden', label: 'Hidden', icon: 'leaf' },
  { id: 'taste', label: 'Taste', icon: 'restaurant' },
  { id: 'nature', label: 'Nature', icon: 'leaf' },
];

const heroImage = require('../../../assets/images/bali-kecak-fire-dance.jpg');
const barongImage = require('../../../assets/images/bali-layer-barong dance.jpg');
const tengananImage = require('../../../assets/images/bali-tenganan-village.jpg');
const ceremoniesImage = require('../../../assets/images/bali-layer-galungan .jpg');
const uluwatuImage = require('../../../assets/images/bali-tanah-lot.jpg');
const ulunDanuImage = require('../../../assets/images/bali-ulun-danu.jpg');

interface CultureLayerScreenProps {
  onBack: () => void;
  onOpenItem: (id: string) => void;
  onOpenLayer: (layer: DiscoveryLayer) => void;
  onOpenTab: (tab: 'discover' | 'explore' | 'saved' | 'passport' | 'profile') => void;
}

export function CultureLayerScreen({ onBack, onOpenItem, onOpenLayer, onOpenTab }: CultureLayerScreenProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const heroMotion = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const savedRecord = useSavedStore((state) => state.records.find((record) => record.subjectId === 'bali'));
  const setStatus = useSavedStore((state) => state.setStatus);
  const removeSaved = useSavedStore((state) => state.remove);
  const visited = usePassportStore((state) => state.visitedRecords.some((record) => record.destinationId === 'bali'));
  const markVisited = usePassportStore((state) => state.markVisited);
  const heroHeight = Math.min(480, Math.max(360, Math.round(height * 0.48)));
  const isSaved = savedRecord?.status === 'saved';
  const isWantToGo = savedRecord?.status === 'wantToGo';
  const heroScale = heroMotion.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] });
  const heroPan = heroMotion.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  useEffect(() => {
    if (reduceMotion) return undefined;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(heroMotion, { toValue: 1, duration: 26000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(heroMotion, { toValue: 0, duration: 26000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [heroMotion, reduceMotion]);

  const toggleSaved = () => {
    if (isSaved) removeSaved('bali');
    else setStatus('bali', 'destination', 'saved');
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { height: heroHeight }]}>
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: heroScale }, { translateX: heroPan }] }]}>
              <ExpoImage accessibilityLabel="Bali Culture layer hero: Balinese cultural performance" accessible contentFit="cover" contentPosition={{ left: '50%', top: '34%' }} source={heroImage} style={StyleSheet.absoluteFill} />
            </Animated.View>
            <LinearGradient colors={['rgba(3,26,47,0.34)', 'rgba(3,26,47,0.08)', 'rgba(3,26,47,0.44)']} locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(255,248,239,0)', palette.softCloudIvory]} pointerEvents="none" style={styles.heroFade} />
            <View style={[styles.heroTop, { top: insets.top + spacing.sm }]}>
              <Tappable accessibilityLabel="Go back" accessibilityRole="button" focusStyle={styles.focusState} onPress={onBack} style={styles.control}>
                <Ionicons color={palette.cloudWhite} name="chevron-back" size={22} />
              </Tappable>
              <View accessibilityLabel="World Unfolded" style={styles.wordmark}>
                <Ionicons color={palette.cloudWhite} name="sparkles" size={12} />
                <AppText style={styles.wordmarkText}>World Unfolded</AppText>
              </View>
              <View style={styles.heroActions}>
                <Tappable accessibilityLabel={isSaved ? 'Remove Bali from Saved' : 'Save Bali'} accessibilityRole="button" focusStyle={styles.focusState} onPress={toggleSaved} style={styles.control}>
                  <Ionicons color={isSaved ? palette.sunsetVermilion : palette.cloudWhite} name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} />
                </Tappable>
                <Tappable accessibilityLabel="Share Bali" accessibilityRole="button" focusStyle={styles.focusState} onPress={() => {
                  void Share.share({ message: 'Explore Bali with World Unfolded.' }).catch((error: unknown) => {
                    console.error('Unable to share Bali.', error);
                  });
                }} style={styles.control}>
                  <Ionicons color={palette.cloudWhite} name="share-social-outline" size={20} />
                </Tappable>
              </View>
            </View>

            <View style={styles.heroCopy}>
              <View style={[styles.layerAccent, { backgroundColor: discoveryLayerColors.culture }]} />
              <AppText accessibilityRole="header" style={styles.heroTitle}>Culture Layer</AppText>
              <AppText style={styles.heroSubtitle}>Meet living traditions, shared rituals and local memory.</AppText>
            </View>
            <ScrollView accessibilityLabel="Switch discovery layer" contentContainerStyle={styles.layerRail} horizontal showsHorizontalScrollIndicator={false}>
              {layers.map(({ id, label, icon }) => {
                const active = id === 'culture';
                return (
                  <Tappable accessibilityLabel={`${label} layer`} accessibilityRole="button" accessibilityState={{ selected: active }} focusStyle={styles.focusState} key={id} onPress={() => onOpenLayer(id)} style={[styles.layerChip, active && styles.layerChipActive]}>
                    <Ionicons color={active ? palette.carbonInk : palette.cloudWhite} name={icon} size={16} />
                    <AppText style={[styles.layerChipText, active && styles.layerChipTextActive]}>{label}</AppText>
                  </Tappable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.content}>
            <View style={styles.intro}>
              <AppText accessibilityRole="header" style={styles.introTitle}>Bali through the Culture Layer</AppText>
              <AppText style={styles.introCopy}>Explore the rituals, performances, villages and shared traditions that shape everyday life across the island.</AppText>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <AppText accessibilityRole="header" style={styles.sectionTitle}>Stories in this layer</AppText>
                <Tappable accessibilityLabel="View all culture stories" accessibilityRole="button" onPress={() => scrollRef.current?.scrollToEnd({ animated: !reduceMotion })} style={styles.viewAll}>
                  <AppText style={styles.viewAllText}>View all</AppText>
                  <Ionicons color={palette.carbonInk} name="arrow-forward" size={15} />
                </Tappable>
              </View>
              <CultureCard
                description="A living tradition of good and evil."
                image={barongImage}
                onPress={() => onOpenItem('subak')}
                title="Barong Dance"
                variant="feature"
              />
            </View>

            <View style={styles.section}>
              <AppText accessibilityRole="header" style={styles.sectionTitle}>More stories</AppText>
              <View style={styles.cardGrid}>
                <CultureCard description="A traditional Bali Aga village." image={tengananImage} onPress={() => onOpenItem('tenganan')} title="Tenganan" />
                <CultureCard description="Rituals that shape daily life." image={ceremoniesImage} onPress={() => onOpenItem('subak')} title="Temple Ceremonies" />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <AppText accessibilityRole="header" style={styles.sectionTitle}>Places in this layer</AppText>
                <Tappable accessibilityLabel="View all culture places" accessibilityRole="button" onPress={() => scrollRef.current?.scrollToEnd({ animated: !reduceMotion })} style={styles.viewAll}>
                  <AppText style={styles.viewAllText}>View all</AppText>
                  <Ionicons color={palette.carbonInk} name="arrow-forward" size={15} />
                </Tappable>
              </View>
              <View style={styles.cardGrid}>
                <CultureCard description="Cliffside views and cultural performances." image={uluwatuImage} onPress={() => onOpenItem('tanah-lot')} title="Uluwatu Temple" />
                <CultureCard description="A serene temple on the lake." image={ulunDanuImage} onPress={() => onOpenItem('tanah-lot')} title="Ulun Danu Beratan" />
              </View>
            </View>

            <View style={styles.insight}>
              <Ionicons color={palette.sunsetVermilion} name="book-outline" size={30} />
              <AppText style={styles.insightText}>Culture is not just what you see, but what people live, share and pass on.</AppText>
            </View>

            <View style={styles.actions}>
              <View style={styles.actionRow}>
                <Tappable accessibilityLabel="Mark Bali Want to Go" accessibilityRole="button" onPress={() => setStatus('bali', 'destination', 'wantToGo')} style={styles.wantAction}>
                  <Ionicons color={palette.cloudWhite} name={isWantToGo ? 'checkmark' : 'heart'} size={19} />
                  <AppText style={styles.wantActionText}>Want to Go</AppText>
                </Tappable>
                <Tappable accessibilityLabel={isSaved ? 'Remove Bali from Saved' : 'Save Bali'} accessibilityRole="button" onPress={toggleSaved} style={styles.saveAction}>
                  <Ionicons color={palette.carbonInk} name={isSaved ? 'bookmark' : 'bookmark-outline'} size={19} />
                  <AppText style={styles.saveActionText}>{isSaved ? 'Saved' : 'Save'}</AppText>
                </Tappable>
              </View>
              <Tappable accessibilityLabel={visited ? 'Bali marked visited' : 'Mark Bali visited in Passport'} accessibilityRole="button" onPress={() => { if (!visited) markVisited('bali'); }} style={styles.visitedAction}>
                <Ionicons color={colors.primaryAction} name={visited ? 'checkmark-circle' : 'globe-outline'} size={20} />
                <AppText style={styles.visitedText}>{visited ? 'Visited in Passport' : 'Mark visited in Passport'}</AppText>
                {!visited ? <Ionicons color={palette.carbonInk} name="arrow-forward" size={17} /> : null}
              </Tappable>
            </View>
          </View>
        </ScrollView>

        <View pointerEvents="box-none" style={[styles.dockPosition, { bottom: insets.bottom > 0 ? spacing.xs : spacing.sm }]}>
          <BlurView accessibilityLabel="Primary navigation" accessibilityRole="tablist" intensity={68} style={styles.dock} tint="dark">
            <DockTab icon="compass-outline" label="Discover" onPress={() => onOpenTab('discover')} />
            <DockTab active icon="globe" label="Explore" onPress={() => onOpenTab('explore')} />
            <DockTab icon="bookmark-outline" label="Saved" onPress={() => onOpenTab('saved')} />
            <DockTab icon="book-outline" label="Passport" onPress={() => onOpenTab('passport')} />
            <DockTab icon="person-outline" label="Profile" onPress={() => onOpenTab('profile')} />
          </BlurView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function CultureCard({ description, image, onPress, title, variant = 'story' }: {
  description: string;
  image: number;
  onPress: () => void;
  title: string;
  variant?: 'feature' | 'story';
}) {
  const feature = variant === 'feature';
  return (
    <Tappable accessibilityLabel={`Open ${title}`} accessibilityRole="link" focusStyle={styles.cardFocus} onPress={onPress} style={[styles.card, feature ? styles.featureCard : styles.storyCard]}>
      <ExpoImage accessible={false} contentFit="cover" source={image} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(3,26,47,0.02)', 'rgba(3,26,47,0.76)']} locations={feature ? [0, 1] : [0, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.cardCopy}>
        <AppText numberOfLines={1} style={[styles.cardTitle, feature && styles.featureTitle]}>{title}</AppText>
        <AppText numberOfLines={2} style={styles.cardDescription}>{description}</AppText>
      </View>
      <Ionicons color={palette.cloudWhite} name="arrow-forward" size={feature ? 20 : 17} style={feature ? styles.featureArrow : styles.storyArrow} />
    </Tappable>
  );
}

function DockTab({ active = false, icon, label, onPress }: { active?: boolean; icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Tappable accessibilityLabel={`${label} tab`} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={styles.dockTab}>
      <View style={styles.dockIcon}><Ionicons color={active ? palette.sunsetVermilion : palette.cloudWhite} name={icon} size={20} /></View>
      <AppText style={[styles.dockLabel, active && styles.dockLabelActive]}>{label}</AppText>
    </Tappable>
  );
}

const darkNavy = '#031A2F';

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.softCloudIvory, flex: 1 },
  screen: { flex: 1, position: 'relative' },
  scrollContent: { paddingBottom: 100 },
  hero: { backgroundColor: darkNavy, overflow: 'hidden', position: 'relative' },
  heroFade: { bottom: -1, height: 110, left: 0, position: 'absolute', right: 0 },
  heroTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', left: spacing.md, position: 'absolute', right: spacing.md },
  control: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.62)', borderRadius: radius.pill, height: 40, justifyContent: 'center', width: 40 },
  heroActions: { flexDirection: 'row', gap: spacing.xs },
  wordmark: { alignItems: 'center', left: 62, position: 'absolute', right: 62 },
  wordmarkText: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 17, lineHeight: 22 },
  heroCopy: { bottom: 102, gap: spacing.xs, left: spacing.lg, position: 'absolute', right: spacing.lg },
  layerAccent: { borderRadius: radius.pill, height: 5, marginBottom: spacing.xs, width: 58 },
  heroTitle: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialBold, fontSize: 38, lineHeight: 44 },
  heroSubtitle: { color: palette.cloudWhite, fontSize: 15, lineHeight: 21, maxWidth: 330 },
  layerRail: { bottom: spacing.md, gap: spacing.sm, left: 0, paddingHorizontal: spacing.lg, position: 'absolute', right: 0 },
  layerChip: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.62)', borderColor: 'rgba(255,253,248,0.42)', borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: spacing.xs, minHeight: 40, paddingHorizontal: spacing.md },
  layerChipActive: { backgroundColor: palette.goldenSun, borderColor: palette.goldenSun },
  layerChipText: { color: palette.cloudWhite, fontSize: 13 },
  layerChipTextActive: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold },
  content: { gap: spacing.md, paddingBottom: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  intro: { gap: spacing.xs },
  introTitle: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 27, lineHeight: 33 },
  introCopy: { color: '#59616D', fontSize: 15, lineHeight: 21 },
  section: { gap: spacing.xs },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 25, lineHeight: 31 },
  viewAll: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, minHeight: 36 },
  viewAllText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 12 },
  card: { backgroundColor: darkNavy, borderRadius: radius.sm, overflow: 'hidden', position: 'relative' },
  featureCard: { height: 220, width: '100%' },
  storyCard: { flex: 1, height: 142 },
  cardGrid: { flexDirection: 'row', gap: spacing.sm },
  cardCopy: { bottom: spacing.sm, left: spacing.sm, position: 'absolute', right: 40 },
  cardTitle: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 17, lineHeight: 22 },
  featureTitle: { fontSize: 25, lineHeight: 31 },
  cardDescription: { color: palette.cloudWhite, fontSize: 12, lineHeight: 17, marginTop: 2 },
  featureArrow: { bottom: spacing.md, position: 'absolute', right: spacing.md },
  storyArrow: { bottom: spacing.sm, position: 'absolute', right: spacing.sm },
  cardFocus: { borderColor: palette.goldenSun, borderWidth: 2 },
  insight: { alignItems: 'center', backgroundColor: '#F9EBDD', borderRadius: radius.sm, flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  insightText: { color: palette.carbonInk, flex: 1, fontSize: 14, lineHeight: 20 },
  actions: { gap: spacing.xs },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  wantAction: { alignItems: 'center', backgroundColor: colors.primaryAction, borderRadius: radius.pill, flex: 1, flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 48 },
  wantActionText: { color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 13 },
  saveAction: { alignItems: 'center', backgroundColor: '#F2F0EC', borderRadius: radius.pill, flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 48, minWidth: 100 },
  saveActionText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 13 },
  visitedAction: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', gap: spacing.xs, minHeight: 42, paddingHorizontal: spacing.xs },
  visitedText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 13 },
  dockPosition: { alignItems: 'center', left: 0, position: 'absolute', right: 0 },
  dock: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.88)', borderColor: 'rgba(253,251,247,0.22)', borderRadius: 36, borderWidth: 1, flexDirection: 'row', height: 70, maxWidth: 440, overflow: 'hidden', paddingHorizontal: spacing.xs, width: '94%' },
  dockTab: { alignItems: 'center', flex: 1, gap: 1, height: 64, justifyContent: 'center', minWidth: 48 },
  dockIcon: { alignItems: 'center', height: 32, justifyContent: 'center', width: 32 },
  dockLabel: { color: palette.cloudWhite, fontSize: 10, opacity: 0.82 },
  dockLabelActive: { color: palette.sunsetVermilion, opacity: 1 },
  focusState: { borderColor: palette.goldenSun, borderWidth: 2 },
});
