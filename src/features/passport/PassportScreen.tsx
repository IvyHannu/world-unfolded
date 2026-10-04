import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';

import { useReducedMotion } from '@/accessibility/preferences';
import { AppText, ScreenContainer, Tappable } from '@/components/ui';
import { discoveryItems } from '@/content/contentIndex';
import { getDestinationById } from '@/content/selectors';
import { usePassportStore } from '@/state/passportStore';
import { colors, fontFamilies, palette, radius, spacing } from '@/tokens';
import type { Destination, VisitedRecord } from '@/types';

type PassportTab = 'Stamps' | 'Highlights' | 'Notes';
type ArtworkIcon = keyof typeof Ionicons.glyphMap;

const tabs: PassportTab[] = ['Stamps', 'Highlights', 'Notes'];
const PASSPORT_SANDSTONE = '#F6E8D6';
const journeyImages: Record<string, number> = {
  bali: require('../../../assets/images/bali-hero discover.jpg'),
  marrakech: require('../../../assets/images/explore-marrakech.jpg'),
  santorini: require('../../../assets/images/explore-santorini.jpg'),
  rome: require('../../../assets/images/explore-rome.jpg'),
  cappadocia: require('../../../assets/images/explore-cappadocia.jpg'),
  kyoto: require('../../../assets/images/explore-kyoto.jpg'),
  'rio-de-janeiro': require('../../../assets/images/explore-rio.jpg'),
};
const journeyCaptions: Record<string, string> = {
  bali: 'Watched the sunrise at Lempuyang. A moment of pure stillness.',
  kyoto: 'Cherry blossoms and quiet streets. Timeless in every way.',
};
const artworkByDestination: Record<string, { icon: ArtworkIcon; sky: string; sun: string; land: string; water: string }> = {
  bali: { icon: 'business-outline', sky: '#F3C985', sun: '#FFF0C6', land: '#55795A', water: '#70B8B1' },
  marrakech: { icon: 'sunny-outline', sky: '#E7A875', sun: '#FFE2A4', land: '#A85E43', water: '#5E7560' },
  santorini: { icon: 'home-outline', sky: '#82BFD0', sun: '#FFF1C5', land: '#F7EBDD', water: '#438BA2' },
  rome: { icon: 'business-outline', sky: '#E7B77B', sun: '#FFE6A9', land: '#A66B50', water: '#6D8A6A' },
  cappadocia: { icon: 'cloud-outline', sky: '#93B9C5', sun: '#FFE6A9', land: '#BF8060', water: '#67887D' },
  kyoto: { icon: 'leaf-outline', sky: '#A7C5A1', sun: '#F7D88D', land: '#657D5F', water: '#8A5949' },
  'rio-de-janeiro': { icon: 'sunny-outline', sky: '#8FC4B1', sun: '#FFE49E', land: '#47765C', water: '#438DA1' },
};

function dateLabel(date: string, options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? 'Date not recorded' : new Intl.DateTimeFormat(undefined, options).format(parsed);
}

function recordDate(record: VisitedRecord) {
  const parsed = Date.parse(record.dateMarkedVisited);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function PassportScreen({ onExplore }: { onExplore: () => void; onOpenDestination?: (id: string) => void }) {
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PassportTab>('Stamps');
  const featuredStampHasPlayed = useRef(false);
  const onFeaturedStampAnimationComplete = useCallback(() => { featuredStampHasPlayed.current = true; }, []);
  const records = usePassportStore((state) => state.visitedRecords);
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const counters = useMemo(() => {
    const countries = new Set(records.map((record) => getDestinationById(record.destinationId)?.country).filter((country): country is string => Boolean(country)));
    return { countriesVisited: countries.size, destinationsVisited: new Set(records.map((record) => record.destinationId)).size };
  }, [records]);
  const journey = useMemo(() => [...records].sort((left, right) => recordDate(right) - recordDate(left)), [records]);
  const featuredRecord = journey[0];
  const selectedRecord = records.find((record) => record.destinationId === selectedDestinationId);
  const selectedDestination = selectedRecord ? getDestinationById(selectedRecord.destinationId) : undefined;

  if (selectedDestination && selectedRecord) {
    return (
      <DestinationPassport
        activeTab={activeTab}
        destination={selectedDestination}
        onBack={() => { setSelectedDestinationId(null); setActiveTab('Stamps'); }}
        onSelectTab={setActiveTab}
        record={selectedRecord}
        records={records}
        width={width}
        onOpenDestination={setSelectedDestinationId}
      />
    );
  }

  const featuredDestination = featuredRecord ? getDestinationById(featuredRecord.destinationId) : undefined;

  return (
    <ScreenContainer backgroundColor={PASSPORT_SANDSTONE}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <AppText style={styles.brand}>World Unfolded</AppText>
          <View accessible={false} style={styles.headerPostmark}>
            <View style={styles.postmarkCircle}><Ionicons color={palette.terracottaClay} name="airplane" size={23} /></View>
            <View style={styles.headerPostmarkLines}><View style={styles.headerPostmarkLine} /><View style={styles.headerPostmarkLine} /><View style={styles.headerPostmarkLine} /></View>
          </View>
          <AppText accessibilityRole="header" style={styles.pageTitle}>Your Passport</AppText>
          <AppText style={styles.subtitle}>Your stories. Your way.</AppText>
        </View>

        <View accessibilityLabel="Passport visit counters" style={styles.counters}>
          <Counter icon="globe-outline" label="Countries visited" value={counters.countriesVisited} />
          <View style={styles.counterDivider} />
          <Counter icon="location-outline" label="Destinations visited" value={counters.destinationsVisited} />
        </View>

        {featuredRecord && featuredDestination ? (
          <Tappable accessibilityLabel={`Open ${featuredDestination.name} Passport`} accessibilityRole="button" onPress={() => { setSelectedDestinationId(featuredDestination.id); setActiveTab('Stamps'); }} style={styles.featuredCard}>
            <FeaturedPassportArtwork
              date={dateLabel(featuredRecord.dateMarkedVisited, { month: 'short', day: 'numeric', year: 'numeric' })}
              destinationCountry={featuredDestination.country}
              destinationId={featuredDestination.id}
              destinationName={featuredDestination.name}
              reduceMotion={reduceMotion}
              animateStamp={!featuredStampHasPlayed.current}
              onStampAnimationComplete={onFeaturedStampAnimationComplete}
            />
            <View style={styles.featuredCardCopy}>
              <View style={styles.featuredCopy}>
                <AppText style={styles.featuredTitle}>{featuredDestination.name}</AppText>
                <AppText style={styles.featuredLocation}>{featuredDestination.country}</AppText>
                <AppText style={styles.featuredCardDate}>{dateLabel(featuredRecord.dateMarkedVisited, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</AppText>
              </View>
              <View style={styles.featuredArrow}><Ionicons color={palette.terracottaClay} name="arrow-forward" size={18} /></View>
            </View>
          </Tappable>
        ) : null}

        <View style={styles.journeyHeader}>
          <View>
            <AppText accessibilityRole="header" style={styles.sectionTitle}>My Journey</AppText>
          </View>
          {journey.length > 0 ? <View style={styles.seeAll}><AppText style={styles.seeAllText}>See all</AppText><Ionicons color={palette.terracottaClay} name="chevron-forward" size={15} /></View> : null}
        </View>

        {journey.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStampArt}>
              <View style={styles.emptyPostmark}><View style={styles.postmarkLine} /><View style={styles.postmarkLine} /><View style={styles.postmarkLine} /></View>
              <View style={styles.emptyStamp}>
                <Ionicons color={palette.terracottaClay} name="globe-outline" size={55} />
                <AppText style={styles.emptyStampLabel}>WORLD UNFOLDED</AppText>
              </View>
              <View style={styles.emptyStampSeal}><Ionicons color={palette.terracottaClay} name="airplane" size={18} /></View>
            </View>
            <AppText accessibilityRole="header" style={styles.emptyTitle}>Nothing here yet</AppText>
            <AppText style={styles.emptyCopy}>Start exploring destinations, stories and{'\n'}experiences, then save them to your passport.</AppText>
            <Tappable accessibilityLabel="Start exploring" accessibilityRole="button" onPress={onExplore} style={styles.exploreButton}>
              <AppText style={styles.exploreButtonText}>Start exploring</AppText>
            </Tappable>
          </View>
        ) : (
          <View accessibilityLabel="My Journey timeline" style={styles.timeline}>
            {journey.map((record, index) => {
              const destination = getDestinationById(record.destinationId);
              if (!destination) return null;
              return (
                <View key={record.destinationId} style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    <View style={styles.timelineDot} />
                    {index < journey.length - 1 ? <View style={styles.timelineLine} /> : null}
                  </View>
                  <Tappable accessibilityLabel={`Open ${destination.name} memory`} accessibilityRole="button" onPress={() => { setSelectedDestinationId(destination.id); setActiveTab('Stamps'); }} style={styles.memoryCard}>
                    <View style={styles.memoryDateColumn}>
                      <AppText style={styles.memoryDay}>{dateLabel(record.dateMarkedVisited, { day: '2-digit' })}</AppText>
                      <AppText style={styles.memoryMonth}>{dateLabel(record.dateMarkedVisited, { month: 'short' }).toUpperCase()}</AppText>
                      <AppText style={styles.memoryYear}>{dateLabel(record.dateMarkedVisited, { year: 'numeric' })}</AppText>
                    </View>
                    <View style={styles.memoryCopy}>
                      <AppText style={styles.memoryTitle}>{destination.name}</AppText>
                      <AppText style={styles.memoryLocation}>{destination.country}</AppText>
                      {journeyCaptions[destination.id] ? <AppText numberOfLines={2} style={styles.memoryNote}>{journeyCaptions[destination.id]}</AppText> : null}
                    </View>
                    <ExpoImage accessibilityLabel={`${destination.name} travel photo`} contentFit="cover" source={journeyImages[destination.id] ?? journeyImages.bali} style={styles.memoryImage} />
                  </Tappable>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

function DestinationPassport({ activeTab, destination, onBack, onOpenDestination, onSelectTab, record, records, width }: {
  activeTab: PassportTab;
  destination: Destination;
  onBack: () => void;
  onOpenDestination: (id: string) => void;
  onSelectTab: (tab: PassportTab) => void;
  record: VisitedRecord;
  records: readonly VisitedRecord[];
  width: number;
}) {
  const items = discoveryItems.filter((item) => item.destinationId === destination.id);
  const stampWidth = Math.floor((Math.min(width - spacing.lg * 2, 680) - spacing.sm) / 2);
  return (
    <ScreenContainer backgroundColor={PASSPORT_SANDSTONE}>
      <View style={styles.screen}>
        <View style={styles.detailHero}>
          <PassportArtwork destinationId={destination.id} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(32,36,44,0.08)', 'rgba(32,36,44,0.04)', 'rgba(32,36,44,0.66)']} locations={[0, 0.42, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
          <Tappable accessibilityLabel="Back to Your Passport" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Ionicons color={palette.carbonInk} name="arrow-back" size={20} />
          </Tappable>
          <View style={styles.detailCopy}>
            <AppText style={styles.eyebrowLight}>DESTINATION PASSPORT</AppText>
            <AppText accessibilityRole="header" style={styles.detailTitle}>{destination.name}</AppText>
            <AppText style={styles.detailLocation}>{destination.country}  ·  Visited {dateLabel(record.dateMarkedVisited, { month: 'short', day: 'numeric', year: 'numeric' })}</AppText>
          </View>
          <View style={styles.detailStamp}>
            <Ionicons color={palette.cloudWhite} name="airplane" size={16} />
            <AppText style={styles.detailStampLabel}>{dateLabel(record.dateMarkedVisited, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</AppText>
          </View>
        </View>

        <View accessibilityLabel="Destination Passport sections" style={styles.tabBar}>
          {tabs.map((tab) => {
            const selected = activeTab === tab;
            return (
              <Tappable accessibilityLabel={`${tab} Passport tab`} accessibilityRole="tab" accessibilityState={{ selected }} key={tab} onPress={() => onSelectTab(tab)} style={[styles.tab, selected && styles.tabSelected]}>
                <AppText style={[styles.tabText, selected && styles.tabTextSelected]}>{tab}</AppText>
              </Tappable>
            );
          })}
        </View>

        {activeTab === 'Stamps' ? (
          <View>
            <View style={styles.sectionHeading}>
              <AppText style={styles.sectionTitle}>Journey stamps</AppText>
              <AppText style={styles.sectionSubtitle}>Collected along the way.</AppText>
            </View>
            <View accessibilityLabel="Journey stamp grid" style={styles.stampGrid}>
              {records.map((journeyRecord) => {
                const journeyDestination = getDestinationById(journeyRecord.destinationId);
                if (!journeyDestination) return null;
                const selected = journeyDestination.id === destination.id;
                return (
                  <Tappable accessibilityLabel={`${journeyDestination.name}, ${journeyDestination.country} Passport stamp`} accessibilityRole="button" key={journeyRecord.destinationId} onPress={() => onOpenDestination(journeyDestination.id)} style={[styles.stampTile, { width: stampWidth }, selected && styles.stampTileSelected]}>
                    <View style={styles.stampIllustration}>
                      <PassportArtwork destinationId={journeyDestination.id} size={28} style={StyleSheet.absoluteFill} />
                      <View style={styles.stampIllustrationRing}><Ionicons color={palette.terracottaClay} name="airplane" size={12} /></View>
                    </View>
                    <AppText numberOfLines={2} style={styles.stampName}>{journeyDestination.name}</AppText>
                    <AppText style={styles.stampCountry}>{journeyDestination.country}</AppText>
                    <View style={styles.stampTileRule} />
                    <AppText style={styles.stampDate}>{dateLabel(journeyRecord.dateMarkedVisited, { month: 'short', year: 'numeric' })}</AppText>
                  </Tappable>
                );
              })}
            </View>
          </View>
        ) : null}

        {activeTab === 'Highlights' ? (
          <View>
            <View style={styles.sectionHeading}>
              <AppText style={styles.sectionTitle}>Highlights</AppText>
              <AppText style={styles.sectionSubtitle}>Stories and places from {destination.name}.</AppText>
            </View>
            <View style={styles.highlightList}>
              {items.map((item) => {
                return (
                  <View key={item.id} style={styles.highlightCard}>
                    <PassportArtwork destinationId={destination.id} icon={highlightIcon(item.layer)} size={32} style={styles.highlightImage} />
                    <View style={styles.highlightCopy}>
                      <AppText style={styles.eyebrow}>{item.layer.toUpperCase()}</AppText>
                      <AppText style={styles.highlightTitle}>{item.name}</AppText>
                      <AppText numberOfLines={2} style={styles.highlightDescription}>{item.description}</AppText>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {activeTab === 'Notes' ? (
          <View style={styles.notes}>
            <Ionicons color={palette.atlasBlue} name="create-outline" size={26} />
            <AppText style={styles.sectionTitle}>Notes</AppText>
            <AppText style={styles.sectionSubtitle}>Your personal notes for {destination.name} will live here.</AppText>
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

function Counter({ icon, label, value }: { icon: ArtworkIcon; label: string; value: number }) {
  return (
    <View style={styles.counter}>
      <View style={styles.counterIcon}><Ionicons color={palette.atlasBlue} name={icon} size={18} /></View>
      <View style={styles.counterText}>
        <AppText style={styles.counterValue}>{value}</AppText>
        <AppText style={styles.counterLabel}>{label}</AppText>
      </View>
    </View>
  );
}

function highlightIcon(layer: string): ArtworkIcon {
  if (layer === 'nature') return 'leaf-outline';
  if (layer === 'taste') return 'restaurant-outline';
  if (layer === 'culture') return 'musical-notes-outline';
  if (layer === 'hidden') return 'compass-outline';
  return 'sparkles-outline';
}

function FeaturedPassportArtwork({ animateStamp, date, destinationCountry, destinationId, destinationName, onStampAnimationComplete, reduceMotion }: {
  animateStamp: boolean;
  date: string;
  destinationCountry: string;
  destinationId: string;
  destinationName: string;
  onStampAnimationComplete: () => void;
  reduceMotion: boolean;
}) {
  const pan = useRef(new Animated.Value(0)).current;
  const stampProgress = useRef(new Animated.Value(reduceMotion || !animateStamp ? 1 : 0)).current;
  const stampHasPlayed = useRef(!animateStamp);
  const panAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const stampAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const useNativeDriver = Platform.OS !== 'web';
  const translateX = pan.interpolate({ inputRange: [0, 1], outputRange: [2, -2] });
  const translateY = pan.interpolate({ inputRange: [0, 1], outputRange: [-0.5, 0.5] });
  const scale = pan.interpolate({ inputRange: [0, 1], outputRange: [1.005, 1.025] });
  const stampTranslateY = stampProgress.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });
  const stampRotation = stampProgress.interpolate({ inputRange: [0, 1], outputRange: ['12deg', '7deg'] });

  useEffect(() => {
    if (reduceMotion) {
      panAnimation.current?.stop();
      pan.setValue(0);
      stampAnimation.current?.stop();
      stampProgress.setValue(1);
      stampHasPlayed.current = true;
      onStampAnimationComplete();
      return;
    }

    panAnimation.current = Animated.loop(Animated.sequence([
      Animated.timing(pan, { toValue: 1, duration: 18000, easing: Easing.inOut(Easing.sin), useNativeDriver }),
      Animated.timing(pan, { toValue: 0, duration: 18000, easing: Easing.inOut(Easing.sin), useNativeDriver }),
    ]));
    panAnimation.current.start();

    if (!stampHasPlayed.current) {
      stampAnimation.current = Animated.timing(stampProgress, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      });
      stampAnimation.current.start(({ finished }) => {
        if (finished) {
          stampHasPlayed.current = true;
          onStampAnimationComplete();
        }
      });
    }

    return () => {
      panAnimation.current?.stop();
      stampAnimation.current?.stop();
    };
  }, [onStampAnimationComplete, pan, reduceMotion, stampProgress, useNativeDriver]);

  return (
    <View style={styles.featuredArtwork}>
      {destinationId === 'bali' ? (
        <Animated.View style={[StyleSheet.absoluteFill, styles.featuredPhoto, { transform: [{ translateX }, { translateY }, { scale }] }]}>
          <ExpoImage accessible={false} contentFit="cover" source={require('../../../assets/images/bali-ulun-danu.jpg')} style={StyleSheet.absoluteFill} />
        </Animated.View>
      ) : (
        <PassportArtwork destinationId={destinationId} style={StyleSheet.absoluteFill} />
      )}
      {destinationId === 'bali' ? (
        <>
          <View pointerEvents="none" style={styles.featuredWarmPrint} />
          <LinearGradient colors={['rgba(227,181,125,0.16)', 'rgba(246,232,214,0.07)', 'rgba(117,83,57,0.1)']} locations={[0, 0.58, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
          <LinearGradient colors={['rgba(246,232,214,0)', 'rgba(246,232,214,0.04)', 'rgba(246,232,214,0.92)', PASSPORT_SANDSTONE]} locations={[0, 0.56, 0.88, 1]} pointerEvents="none" style={styles.featuredPhotoFade} />
          <Animated.View pointerEvents="none" style={[styles.featuredParallax, { transform: [{ translateX: Animated.multiply(translateX, -0.45) }, { translateY: Animated.multiply(translateY, -0.45) }] }]}>
            {grainSpecks.map((speck, index) => <View key={index} style={[styles.grainSpeck, speck]} />)}
            <View style={styles.featuredMaskLine} />
            <View style={styles.featuredEdge} />
          </Animated.View>
        </>
      ) : null}
      <Animated.View
        accessibilityLabel={`${destinationName}, ${destinationCountry} Passport stamp`}
        accessibilityRole="image"
        style={[styles.featuredStamp, { opacity: stampProgress, transform: [{ translateY: stampTranslateY }, { rotate: stampRotation }] }]}
      >
        <View style={styles.featuredStampInner}>
          <View style={styles.featuredStampHeading}>
            <Ionicons color="#985C49" name="airplane" size={10} />
            <AppText style={styles.featuredStampLabel}>WORLD UNFOLDED</AppText>
          </View>
          <AppText style={styles.featuredStampPlace}>{destinationId === 'bali' ? 'BALI · INDONESIA' : `${destinationName.toUpperCase()} · ${destinationCountry.toUpperCase()}`}</AppText>
          <AppText style={styles.featuredStampDate}>{destinationId === 'bali' ? 'OCT 3 2026' : date.toUpperCase()}</AppText>
        </View>
      </Animated.View>
    </View>
  );
}

const grainSpecks = [
  { left: '5%', top: '18%' }, { left: '13%', top: '67%' }, { left: '21%', top: '35%' },
  { left: '32%', top: '81%' }, { left: '42%', top: '19%' }, { left: '53%', top: '61%' },
  { left: '63%', top: '37%' }, { left: '73%', top: '76%' }, { left: '84%', top: '26%' },
  { left: '93%', top: '59%' }, { left: '28%', top: '52%' }, { left: '58%', top: '88%' },
  { left: '8%', top: '89%' }, { left: '78%', top: '48%' }, { left: '47%', top: '44%' },
] as const;

function PassportArtwork({ destinationId, icon, size = 48, style }: { destinationId: string; icon?: ArtworkIcon; size?: number; style?: StyleProp<ViewStyle> }) {
  const artwork = artworkByDestination[destinationId] ?? artworkByDestination.bali;
  return (
    <View accessible={false} style={[styles.artwork, style]}>
      <LinearGradient colors={[artwork.sky, artwork.water]} style={StyleSheet.absoluteFill} />
      <View style={[styles.artworkSun, { backgroundColor: artwork.sun }]} />
      <View style={[styles.artworkCloud, styles.artworkCloudOne]} />
      <View style={[styles.artworkCloud, styles.artworkCloudTwo]} />
      <View style={[styles.artworkHill, styles.artworkHillBack, { backgroundColor: artwork.land }]} />
      <View style={[styles.artworkHill, styles.artworkHillFront, { backgroundColor: artwork.water }]} />
      <View style={styles.artworkIconWrap}>
        <Ionicons color="rgba(120,73,48,0.9)" name={icon ?? artwork.icon} size={size} />
      </View>
      <View style={styles.artworkFlightPath}><View style={styles.artworkFlightDot} /><View style={styles.artworkFlightDot} /><View style={styles.artworkFlightDot} /><View style={styles.artworkFlightDot} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { marginHorizontal: -spacing.lg, marginTop: -spacing.xl, paddingBottom: spacing.xl },
  header: { alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingTop: spacing.md, position: 'relative' },
  brand: { color: palette.carbonInk, fontSize: 13, marginBottom: spacing.sm },
  headerPostmark: { height: 68, position: 'absolute', right: spacing.lg, top: spacing.md, width: 92 },
  postmarkCircle: { alignItems: 'center', borderColor: 'rgba(184,100,62,0.75)', borderRadius: radius.pill, borderWidth: 1.2, height: 54, justifyContent: 'center', position: 'absolute', right: 4, top: 0, transform: [{ rotate: '8deg' }], width: 54 },
  headerPostmarkLines: { gap: 5, position: 'absolute', right: 0, top: 17, transform: [{ rotate: '-8deg' }] },
  headerPostmarkLine: { backgroundColor: 'rgba(184,100,62,0.7)', borderRadius: radius.pill, height: 1.5, width: 30 },
  pageTitle: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 35, lineHeight: 42 },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 0 },
  counters: { alignItems: 'center', backgroundColor: 'transparent', flexDirection: 'row', marginHorizontal: spacing.lg, marginTop: spacing.md, paddingVertical: spacing.sm },
  counter: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', paddingHorizontal: spacing.xs },
  counterIcon: { alignItems: 'center', borderColor: palette.atlasBlue, borderRadius: radius.pill, borderWidth: 1.2, height: 42, justifyContent: 'center', width: 42 },
  counterText: { gap: 0 },
  counterValue: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 26, lineHeight: 29 },
  counterLabel: { color: colors.textSecondary, fontSize: 10, lineHeight: 12 },
  counterDivider: { backgroundColor: 'rgba(184,100,62,0.4)', height: 48, width: 1 },
  featuredCard: { backgroundColor: PASSPORT_SANDSTONE, borderColor: 'rgba(132,91,55,0.2)', borderRadius: radius.md, borderWidth: 1, marginHorizontal: spacing.lg, marginTop: spacing.sm, overflow: 'hidden' },
  featuredArtwork: { height: 126, overflow: 'hidden', position: 'relative' },
  featuredPhotoFade: { ...StyleSheet.absoluteFillObject, top: '16%' },
  featuredPhoto: { height: '100%', left: 0, top: 0, width: '100%' },
  featuredWarmPrint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(150,105,73,0.11)' },
  featuredParallax: { ...StyleSheet.absoluteFillObject },
  grainSpeck: { backgroundColor: 'rgba(255,248,230,0.68)', borderRadius: radius.pill, height: 1, opacity: 0.2, position: 'absolute', width: 1 },
  featuredMaskLine: { backgroundColor: 'rgba(246,232,214,0.08)', bottom: -40, height: 76, left: '-8%', position: 'absolute', transform: [{ rotate: '-5deg' }], width: '116%' },
  featuredEdge: { borderColor: 'rgba(255,248,230,0.22)', borderRadius: 5, borderWidth: 0.75, bottom: 4, left: 4, position: 'absolute', right: 4, top: 4 },
  featuredStamp: { alignItems: 'center', backgroundColor: 'rgba(246,232,214,0.12)', borderColor: 'rgba(152,92,73,0.78)', borderRadius: 3, borderStyle: 'dashed', borderWidth: 1.2, height: 49, justifyContent: 'center', left: spacing.md, position: 'absolute', top: spacing.sm, transform: [{ rotate: '-4deg' }], width: 142 },
  featuredStampInner: { alignItems: 'center', borderColor: 'rgba(152,92,73,0.36)', borderRadius: 2, borderWidth: 0.6, height: 41, justifyContent: 'center', width: 134 },
  featuredStampHeading: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  featuredStampLabel: { color: 'rgba(133,76,58,0.82)', fontSize: 6, fontWeight: '700', letterSpacing: 1 },
  featuredStampPlace: { color: 'rgba(133,76,58,0.9)', fontFamily: fontFamilies.uiSemibold, fontSize: 8, letterSpacing: 0.55, marginTop: 2 },
  featuredStampDate: { color: 'rgba(133,76,58,0.85)', fontSize: 7, letterSpacing: 0.8, marginTop: 1 },
  featuredCardCopy: { alignItems: 'center', backgroundColor: PASSPORT_SANDSTONE, borderTopColor: 'rgba(132,91,55,0.15)', borderTopWidth: 1, flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between', minHeight: 57, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  featuredCopy: { flex: 1, gap: 1 },
  eyebrow: { color: palette.terracottaClay, fontSize: 8, fontWeight: '700', letterSpacing: 1.1 },
  eyebrowLight: { color: palette.cloudWhite, fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  featuredTitle: { color: palette.terracottaClay, fontFamily: fontFamilies.editorialBold, fontSize: 24, lineHeight: 27, textTransform: 'uppercase' },
  featuredLocation: { color: palette.terracottaClay, fontSize: 10, lineHeight: 14, textTransform: 'uppercase' },
  featuredCardDate: { color: palette.terracottaClay, fontSize: 10, lineHeight: 13 },
  featuredArrow: { alignItems: 'center', borderColor: 'rgba(184,100,62,0.4)', borderRadius: radius.pill, borderWidth: 1, height: 30, justifyContent: 'center', width: 30 },
  journeyHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: spacing.lg, marginTop: spacing.md },
  sectionTitle: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 22, lineHeight: 28 },
  sectionSubtitle: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 2 },
  seeAll: { alignItems: 'center', flexDirection: 'row', gap: 1 },
  seeAllText: { color: palette.terracottaClay, fontSize: 12 },
  journeyCount: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.82)', borderColor: 'rgba(184,100,62,0.3)', borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: 5, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  journeyCountText: { color: palette.terracottaClay, fontSize: 8, fontWeight: '700', letterSpacing: 0.7 },
  timeline: { marginHorizontal: spacing.lg, marginTop: spacing.xs },
  timelineRow: { flexDirection: 'row', gap: spacing.xs, minHeight: 94 },
  timelineRail: { alignItems: 'center', width: 12 },
  timelineDot: { backgroundColor: palette.sunsetVermilion, borderColor: '#F6E8D6', borderRadius: radius.pill, borderWidth: 2, height: 10, marginTop: spacing.md, width: 10 },
  timelineLine: { backgroundColor: 'rgba(32,36,44,0.2)', flex: 1, marginVertical: 2, width: 1 },
  memoryCard: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.55)', borderColor: 'rgba(132,91,55,0.1)', borderRadius: radius.sm, borderWidth: 1, flex: 1, flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs, minHeight: 88, padding: spacing.xs },
  memoryImage: { borderRadius: 5, height: 78, width: 88 },
  memoryDateColumn: { alignItems: 'center', borderRightColor: 'rgba(184,100,62,0.28)', borderRightWidth: 1, justifyContent: 'center', minHeight: 64, width: 39 },
  memoryDay: { color: palette.terracottaClay, fontFamily: fontFamilies.editorialBold, fontSize: 19, lineHeight: 21 },
  memoryMonth: { color: palette.terracottaClay, fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  memoryYear: { color: colors.textSecondary, fontSize: 8 },
  memoryCopy: { flex: 1, gap: 1 },
  memoryTitle: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 15, lineHeight: 18 },
  memoryLocation: { color: colors.textSecondary, fontSize: 10 },
  memoryNote: { color: colors.textSecondary, fontSize: 9, lineHeight: 12, marginTop: 2 },
  emptyState: { alignItems: 'center', justifyContent: 'center', minHeight: 360, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  emptyStampArt: { alignItems: 'center', height: 174, justifyContent: 'center', marginBottom: spacing.md, position: 'relative', width: 230 },
  emptyPostmark: { gap: 8, left: 6, position: 'absolute', top: 70, transform: [{ rotate: '-8deg' }] },
  postmarkLine: { backgroundColor: 'rgba(184,100,62,0.68)', borderRadius: radius.pill, height: 2, width: 68 },
  emptyStamp: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.5)', borderColor: 'rgba(184,100,62,0.74)', borderRadius: 8, borderStyle: 'dashed', borderWidth: 1.5, height: 122, justifyContent: 'center', transform: [{ rotate: '7deg' }], width: 122 },
  emptyStampLabel: { color: palette.terracottaClay, fontSize: 7, fontWeight: '700', letterSpacing: 1.1, marginTop: spacing.xs },
  emptyStampSeal: { alignItems: 'center', backgroundColor: '#F6E8D6', borderColor: 'rgba(184,100,62,0.78)', borderRadius: radius.pill, borderWidth: 1.5, bottom: 8, height: 47, justifyContent: 'center', position: 'absolute', right: 38, transform: [{ rotate: '-11deg' }], width: 47 },
  emptyTitle: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 23, marginBottom: spacing.xs },
  emptyCopy: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  exploreButton: { alignItems: 'center', backgroundColor: palette.carbonInk, borderRadius: radius.pill, justifyContent: 'center', marginTop: spacing.lg, minHeight: 48, paddingHorizontal: spacing.xl },
  exploreButtonText: { color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 13 },
  detailHero: { backgroundColor: palette.oceanBlue, height: 294, justifyContent: 'flex-end', overflow: 'hidden', padding: spacing.lg, position: 'relative' },
  backButton: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.86)', borderRadius: radius.pill, height: 42, justifyContent: 'center', left: spacing.md, position: 'absolute', top: spacing.md, width: 42 },
  detailCopy: { paddingBottom: spacing.xs, paddingRight: 120 },
  detailTitle: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialBold, fontSize: 30, lineHeight: 36 },
  detailLocation: { color: palette.cloudWhite, fontSize: 12, lineHeight: 18 },
  detailStamp: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.9)', borderColor: 'rgba(184,100,62,0.84)', borderRadius: radius.pill, borderWidth: 1.5, gap: 4, height: 88, justifyContent: 'center', padding: spacing.xs, position: 'absolute', right: spacing.md, top: spacing.md, transform: [{ rotate: '7deg' }], width: 88 },
  detailStampLabel: { color: palette.terracottaClay, fontSize: 7, fontWeight: '700', letterSpacing: 0.5 },
  tabBar: { backgroundColor: 'rgba(255,248,239,0.68)', borderBottomColor: 'rgba(132,91,55,0.2)', borderBottomWidth: 1, flexDirection: 'row', gap: spacing.lg, marginHorizontal: spacing.lg },
  tab: { alignItems: 'center', justifyContent: 'center', minHeight: 50, minWidth: 64 },
  tabSelected: { borderBottomColor: palette.terracottaClay, borderBottomWidth: 2 },
  tabText: { color: colors.textSecondary, fontSize: 13 },
  tabTextSelected: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold },
  sectionHeading: { marginHorizontal: spacing.lg, marginTop: spacing.lg },
  stampGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.md },
  stampTile: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.82)', borderColor: 'rgba(132,91,55,0.25)', borderRadius: radius.sm, borderStyle: 'dashed', borderWidth: 1, minHeight: 166, justifyContent: 'center', padding: spacing.sm },
  stampTileSelected: { borderColor: palette.terracottaClay, borderWidth: 1.5 },
  stampIllustration: { borderRadius: 6, height: 78, overflow: 'hidden', position: 'relative', width: '100%' },
  stampIllustrationRing: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.86)', borderColor: 'rgba(184,100,62,0.7)', borderRadius: radius.pill, borderWidth: 1, height: 27, justifyContent: 'center', position: 'absolute', right: 4, top: 4, width: 27 },
  stampName: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 13, marginTop: spacing.xs, textAlign: 'center' },
  stampCountry: { color: colors.textSecondary, fontSize: 10, textAlign: 'center' },
  stampTileRule: { backgroundColor: 'rgba(32,36,44,0.13)', height: 1, marginVertical: spacing.xs, width: '70%' },
  stampDate: { color: palette.terracottaClay, fontSize: 10, fontWeight: '600' },
  highlightList: { gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.md },
  highlightCard: { alignItems: 'center', backgroundColor: 'rgba(255,248,239,0.88)', borderColor: 'rgba(132,91,55,0.18)', borderRadius: radius.sm, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, minHeight: 90, overflow: 'hidden', padding: spacing.xs },
  highlightImage: { borderRadius: 5, height: 76, width: 88 },
  highlightCopy: { flex: 1, gap: 2 },
  highlightTitle: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 14 },
  highlightDescription: { color: colors.textSecondary, fontSize: 11, lineHeight: 15 },
  notes: { alignItems: 'center', gap: spacing.xs, justifyContent: 'center', minHeight: 230, paddingHorizontal: spacing.lg },
  artwork: { backgroundColor: '#F3C985', overflow: 'hidden', position: 'relative' },
  artworkSun: { borderRadius: radius.pill, height: 62, position: 'absolute', right: '18%', top: '12%', width: 62 },
  artworkCloud: { backgroundColor: 'rgba(255,248,230,0.66)', borderRadius: radius.pill, height: 9, position: 'absolute', width: 39 },
  artworkCloudOne: { left: '12%', top: '23%' },
  artworkCloudTwo: { left: '23%', top: '18%', transform: [{ scale: 0.7 }] },
  artworkHill: { borderRadius: 200, height: '62%', position: 'absolute', width: '86%' },
  artworkHillBack: { bottom: '-35%', left: '-18%', transform: [{ rotate: '-10deg' }] },
  artworkHillFront: { bottom: '-48%', right: '-18%', transform: [{ rotate: '12deg' }] },
  artworkIconWrap: { alignItems: 'center', justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: '35%' },
  artworkFlightPath: { flexDirection: 'row', gap: 5, left: 15, position: 'absolute', top: '51%', transform: [{ rotate: '-9deg' }] },
  artworkFlightDot: { backgroundColor: 'rgba(255,248,230,0.9)', borderRadius: radius.pill, height: 3, width: 3 },
});
