import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { ScrollView, Share, StyleSheet, useWindowDimensions, View, type ImageSourcePropType } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, ContentImage, ErrorState, ScreenContainer, Tappable } from '@/components/ui';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS, type DiscoveryLayer } from '@/content/vocabularies';
import { usePassportStore } from '@/state/passportStore';
import { useSavedStore } from '@/state/savedStore';
import { colors, discoveryLayerColors, fontFamilies, palette, radius, spacing } from '@/tokens';
import type { Destination, DiscoveryItem } from '@/types';

export type DestinationDockTab = 'discover' | 'explore' | 'saved' | 'passport' | 'profile';

export type DestinationSection = 'overview' | 'layers' | 'places';
type LayerIcon = keyof typeof Ionicons.glyphMap;

interface Props {
  section?: DestinationSection;
  destination?: Destination;
  items: readonly DiscoveryItem[];
  onBack: () => void;
  onOpenItem: (id: string) => void;
  onOpenLayer: (layer: DiscoveryLayer) => void;
  onSectionChange?: (section: DestinationSection) => void;
  onOpenTab: (tab: DestinationDockTab) => void;
}

const tabs: { id: DestinationSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'layers', label: 'Layers' },
  { id: 'places', label: 'Places' },
];

const layerDetails: Record<DiscoveryLayer, { icon: LayerIcon; note: string }> = {
  iconic: { icon: 'sunny-outline', note: 'Must-see landmarks and defining experiences.' },
  hidden: { icon: 'leaf-outline', note: 'Quieter places and lesser-known gems.' },
  culture: { icon: 'people-outline', note: 'Local traditions, food and everyday life.' },
  taste: { icon: 'restaurant-outline', note: 'Flavours that tell stories of place.' },
  nature: { icon: 'leaf-outline', note: 'Landscapes, wildlife and the outdoors.' },
};

const baliLayerImages: Record<DiscoveryLayer, number> = {
  iconic: require('../../../assets/images/bali-tanah-lot.jpg'),
  hidden: require('../../../assets/images/bali-tukad-cepung.jpg'),
  culture: require('../../../assets/images/bali-layer-galungan .jpg'),
  taste: require('../../../assets/images/bali-layer-taste.jpg'),
  nature: require('../../../assets/images/bali-sidemen-valley.jpg'),
};

const baliOverviewLayerImages: Record<DiscoveryLayer, number> = {
  ...baliLayerImages,
  culture: require('../../../assets/images/bali-kecak-fire-dance.jpg'),
};

const baliHero = require('../../../assets/images/bali-destination-hero.jpg');
const baliPlaces = [
  { itemId: 'tanah-lot', name: 'Tanah Lot', image: require('../../../assets/images/bali-tanah-lot.jpg') },
  { itemId: 'tenganan', name: 'Tenganan Village', image: require('../../../assets/images/bali-tenganan-village.jpg') },
  { itemId: 'mount-batur', name: 'Mount Batur', image: require('../../../assets/images/bali-mount-batur.jpg') },
  { itemId: 'nusa-penida', name: 'Nusa Penida', image: require('../../../assets/images/bali-hero discover.jpg') },
  { itemId: 'ulun-danu-beratan', name: 'Ulun Danu Beratan', image: require('../../../assets/images/bali-ulun-danu.jpg') },
  { itemId: 'uluwatu-temple', name: 'Uluwatu Temple', image: require('../../../assets/images/bali-kecak-fire-dance.jpg') },
] as const;

const baliStoryImages: Record<string, number> = {
  tenganan: require('../../../assets/images/bali-tenganan-village.jpg'),
  subak: require('../../../assets/images/bali-layer-barong dance.jpg'),
};

const baliQuickTags = ['Beaches', 'Temples', 'Culture'];
const dockTabs: { id: DestinationDockTab; label: string; icon: LayerIcon }[] = [
  { id: 'discover', label: 'Discover', icon: 'compass-outline' },
  { id: 'explore', label: 'Explore', icon: 'globe-outline' },
  { id: 'saved', label: 'Saved', icon: 'bookmark-outline' },
  { id: 'passport', label: 'Passport', icon: 'book-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
];

export function DestinationScreen({ section, destination, items, onBack, onOpenItem, onOpenLayer, onSectionChange, onOpenTab }: Props) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [localSection, setLocalSection] = useState<DestinationSection>('overview');
  const activeTab = section ?? localSection;
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const savedRecord = useSavedStore((state) => state.records.find((record) => record.subjectId === destination?.id));
  const setStatus = useSavedStore((state) => state.setStatus);
  const remove = useSavedStore((state) => state.remove);
  const visited = usePassportStore((state) => state.visitedRecords.some((record) => record.destinationId === destination?.id));
  const markVisited = usePassportStore((state) => state.markVisited);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [section]);

  if (!destination) {
    return <ScreenContainer><ErrorState actionLabel="Go back" message="This destination is not part of the approved content set." onAction={onBack} title="Destination unavailable" /></ScreenContainer>;
  }

  const destinationItems = items.filter((item) => item.destinationId === destination.id);
  const hero = getImageById(destination.heroImageId);
  const isBali = destination.id === 'bali';
  const isSaved = savedRecord?.status === 'saved';
  const isWantToGo = savedRecord?.status === 'wantToGo';
  const quickTags = isBali ? baliQuickTags : destination.interestTags.slice(0, 3).map((tag) => tag.replaceAll('_', ' '));
  const heroHeight = Math.min(480, Math.max(360, Math.round(windowHeight * 0.48)));
  const layerPreviewWidth = Math.min(190, Math.max(156, Math.round(windowWidth * 0.43)));
  const storyCardWidth = Math.floor((windowWidth - spacing.lg * 2 - spacing.sm) / 2);
  const placeItems = isBali
    ? baliPlaces.map(({ itemId, name, image }) => {
      const item = destinationItems.find((candidate) => candidate.id === itemId);
      return { name, item, source: image };
    })
    : destinationItems.slice(0, 3).map((item) => ({ layer: item.layer, name: item.name, item, source: imageSource(item.imageIds[0], destinationItems) }));
  const placeCardWidth = Math.floor((windowWidth - spacing.lg * 2 - spacing.sm) / 2);
  const storyItems = isBali
    ? destinationItems.filter((item) => ['tenganan', 'subak'].includes(item.id))
    : destinationItems.slice(-3).reverse();
  const storyCards = storyItems.map((item) => ({
    item,
    title: item.name,
    source: isBali ? baliStoryImages[item.id] ?? baliLayerImages[item.layer] : layerSource(item.layer, destinationItems, false),
    onPress: () => onOpenItem(item.id),
  }));
  const keyFacts = [
    { icon: 'location-outline' as const, label: 'Continent', value: destination.continent },
    { icon: 'calendar-outline' as const, label: 'Best time', value: isBali ? 'Apr – Oct' : 'Varies by region' },
    { icon: 'chatbubble-ellipses-outline' as const, label: 'Language', value: isBali ? 'Indonesian' : 'Local languages' },
    { icon: 'card-outline' as const, label: 'Currency', value: isBali ? 'IDR (Rp)' : 'Local currency' },
  ];

  const toggleSaved = () => {
    if (isSaved) remove(destination.id);
    else setStatus(destination.id, 'destination', 'saved');
  };
  const selectTab = (tab: DestinationSection) => {
    if (onSectionChange) onSectionChange(tab);
    else setLocalSection(tab);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.mainScroll}>
          <View style={[styles.hero, { height: heroHeight }]}>
            {isBali ? (
              <ExpoImage accessible={false} contentFit="cover" contentPosition={activeTab === 'overview' ? { left: '50%', top: '20%' } : undefined} source={baliHero} style={StyleSheet.absoluteFill} />
            ) : hero ? (
              <ContentImage height={390} image={hero} style={StyleSheet.absoluteFill} />
            ) : null}
            <LinearGradient
              colors={activeTab === 'overview'
                ? ['rgba(3,26,47,0.14)', 'rgba(3,26,47,0.06)', 'rgba(3,26,47,0.08)']
                : ['rgba(3,26,47,0.14)', 'rgba(3,26,47,0.08)', 'rgba(3,26,47,0.84)']}
              locations={[0, 0.43, 1]}
              style={StyleSheet.absoluteFill}
            />
            {activeTab === 'overview' ? <LinearGradient colors={['rgba(255,248,239,0)', palette.softCloudIvory]} pointerEvents="none" style={styles.heroBottomFade} /> : null}

            <View style={[styles.heroTop, { top: insets.top + spacing.md }]}>
              <DestinationTappable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.heroControl}>
                <Ionicons color={palette.cloudWhite} name="chevron-back" size={23} />
              </DestinationTappable>
              <View style={styles.wordmark}>
                <Ionicons color={palette.cloudWhite} name="sparkles" size={12} />
                <AppText style={styles.wordmarkText}>World Unfolded</AppText>
              </View>
              <View style={styles.heroActions}>
                <DestinationTappable accessibilityLabel={isSaved ? `Remove ${destination.name} from Saved from hero` : `Save ${destination.name} from hero`} accessibilityRole="button" onPress={toggleSaved} style={styles.heroControl}>
                  <Ionicons color={isSaved ? palette.sunsetVermilion : palette.cloudWhite} name={isSaved ? 'bookmark' : 'bookmark-outline'} size={21} />
                </DestinationTappable>
                <DestinationTappable accessibilityLabel={`Share ${destination.name}`} accessibilityRole="button" onPress={() => {
                  void Share.share({ message: `Explore ${destination.name}, ${destination.country} with World Unfolded.` }).catch((error: unknown) => {
                    console.error('Unable to share destination.', error);
                  });
                }} style={styles.heroControl}>
                  <Ionicons color={palette.cloudWhite} name="share-social-outline" size={21} />
                </DestinationTappable>
              </View>
            </View>

            <View style={styles.heroCopy}>
              <AppText accessibilityRole="header" style={styles.destinationTitle}>{destination.name}</AppText>
              <AppText style={styles.destinationCountry}>{destination.country}</AppText>
              <ScrollView contentContainerStyle={styles.quickTags} horizontal showsHorizontalScrollIndicator={false}>
                {(isBali ? ['Iconic', ...quickTags] : quickTags).map((tag, index) => (
                  <View key={tag} style={[styles.quickTag, index === 0 && styles.primaryQuickTag]}>
                    {index === 0 ? <Ionicons color={palette.carbonInk} name="sunny-outline" size={15} /> : null}
                    <AppText style={[styles.quickTagText, index === 0 && styles.primaryQuickTagText]}>{tag}</AppText>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          <>
            <ScrollView accessibilityLabel="Destination sections" contentContainerStyle={styles.sectionTabs} horizontal showsHorizontalScrollIndicator={false}>
              {tabs.map(({ id, label }) => (
                <DestinationTappable accessibilityLabel={`${label} destination tab`} accessibilityRole="tab" accessibilityState={{ selected: activeTab === id }} focusStyle={styles.tabFocusState} key={id} onPress={() => selectTab(id)} style={styles.sectionTab}>
                  <AppText style={[styles.sectionTabText, activeTab === id && styles.sectionTabTextActive]}>{label}</AppText>
                  {activeTab === id ? <View style={styles.sectionTabIndicator} /> : null}
                </DestinationTappable>
              ))}
            </ScrollView>

            {activeTab === 'overview' ? (
              <View style={[styles.content, styles.overviewContent]}>
                <View style={styles.facts}>
                  {keyFacts.map((fact) => (
                    <View key={fact.label} style={styles.fact}>
                      <Ionicons color={palette.carbonInk} name={fact.icon} size={21} />
                      <AppText style={styles.factLabel}>{fact.label}</AppText>
                      <AppText numberOfLines={1} style={styles.factValue}>{fact.value}</AppText>
                    </View>
                  ))}
                </View>

                <View style={styles.section}>
                  <AppText accessibilityRole="header" style={styles.sectionTitle}>About {destination.name}</AppText>
                  <AppText numberOfLines={aboutExpanded ? undefined : 4} style={styles.aboutText}>{destination.culturalOverview}</AppText>
                  <DestinationTappable accessibilityLabel={aboutExpanded ? 'Read less about destination' : 'Read more about destination'} accessibilityRole="button" onPress={() => setAboutExpanded((expanded) => !expanded)} style={styles.readMore}>
                    <AppText style={styles.readMoreText}>{aboutExpanded ? 'Read less' : 'Read more'}</AppText>
                    <Ionicons color={palette.carbonInk} name={aboutExpanded ? 'chevron-up' : 'chevron-down'} size={17} />
                  </DestinationTappable>
                </View>

                <View style={styles.section}>
                  <SectionHeading title="Explore by layer" />
                  <ScrollView accessibilityLabel="Explore Bali by layer" contentContainerStyle={styles.layerPreviewRail} horizontal showsHorizontalScrollIndicator={false}>
                    {DISCOVERY_LAYERS.map((layer) => (
                      <DestinationTappable accessibilityLabel={`Explore ${layer} layer`} accessibilityRole="link" key={layer} onPress={() => onOpenLayer(layer)} style={[styles.layerPreview, { width: layerPreviewWidth }]}>
                        <ExpoImage contentFit="cover" source={layerSource(layer, destinationItems, isBali, 'overview')} style={StyleSheet.absoluteFill} />
                        <LinearGradient colors={['rgba(3,26,47,0.02)', 'rgba(3,26,47,0.84)']} style={StyleSheet.absoluteFill} />
                        <View style={[styles.layerPreviewIcon, { backgroundColor: discoveryLayerColors[layer] }]}>
                          <Ionicons color={palette.carbonInk} name={layerDetails[layer].icon} size={19} />
                        </View>
                        <AppText style={styles.layerPreviewLabel}>{capitalize(layer)}</AppText>
                      </DestinationTappable>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.section}>
                  <SectionHeading onPress={() => selectTab('places')} title="Featured places" action="View all" />
                  <View accessibilityLabel="Featured places" style={styles.placeRail}>
                    {placeItems.map(({ name, item, source }) => (
                      <DestinationTappable accessibilityLabel={`Open ${name}`} accessibilityRole="link" key={name} onPress={() => item && onOpenItem(item.id)} style={[styles.placeCard, { width: placeCardWidth }]}>
                        <ExpoImage contentFit="cover" source={source} style={StyleSheet.absoluteFill} />
                        <LinearGradient colors={['rgba(3,26,47,0.02)', 'rgba(3,26,47,0.08)', 'rgba(3,26,47,0.82)']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
                        <AppText numberOfLines={2} style={styles.placeName}>{name}</AppText>
                        <Ionicons color={palette.cloudWhite} name="arrow-forward" size={20} style={styles.placeArrow} />
                      </DestinationTappable>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <SectionHeading onPress={() => selectTab('places')} title="Suggested stories" action="View all" />
                  <ScrollView accessibilityLabel="Suggested stories" contentContainerStyle={styles.storyRail} horizontal showsHorizontalScrollIndicator={false}>
                    {storyCards.map(({ item, title, source, onPress }) => (
                      <StoryCard key={item.id} onPress={onPress} source={source} title={title} width={storyCardWidth} />
                    ))}
                  </ScrollView>
                </View>

                <DestinationActions compact destination={destination} isSaved={isSaved} isWantToGo={isWantToGo} onMarkVisited={() => { if (!visited) markVisited(destination.id); }} onSave={toggleSaved} onWantToGo={() => setStatus(destination.id, 'destination', 'wantToGo')} visited={visited} />
              </View>
            ) : null}

            {activeTab === 'layers' ? (
              <View style={styles.content}>
                <View style={styles.layersIntro}>
                  <AppText accessibilityRole="header" style={styles.sectionTitle}>Explore {destination.name} by layer</AppText>
                  <AppText style={styles.subtitle}>Different perspectives, deeper stories.</AppText>
                </View>
                <View style={styles.layerCards}>
                  {DISCOVERY_LAYERS.map((layer) => (
                    <LayerCard destinationItems={destinationItems} isBali={isBali} key={layer} layer={layer} onPress={() => onOpenLayer(layer)} />
                  ))}
                </View>
              </View>
            ) : null}

            {activeTab === 'places' ? (
              <View style={styles.content}>
                <View style={styles.section}>
                  <SectionHeading title={`Places in ${destination.name}`} />
                  <View accessibilityLabel={`Places in ${destination.name}`} style={styles.placeGrid}>
                    {placeItems.map(({ item, name, source }) => item ? (
                      <DestinationTappable accessibilityLabel={`Open ${name}`} accessibilityRole="link" key={item.id} onPress={() => onOpenItem(item.id)} style={[styles.placeCard, { width: placeCardWidth }]}>
                        <ExpoImage contentFit="cover" source={source} style={StyleSheet.absoluteFill} />
                        <LinearGradient colors={['rgba(3,26,47,0)', 'rgba(3,26,47,0.72)']} locations={[0.28, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
                        <AppText numberOfLines={2} style={styles.placeName}>{name}</AppText>
                        <Ionicons color={palette.cloudWhite} name="arrow-forward" size={19} style={styles.placeArrow} />
                      </DestinationTappable>
                    ) : null)}
                  </View>
                </View>
              </View>
            ) : null}
          </>
        </ScrollView>

        <View pointerEvents="box-none" style={styles.dockPosition}>
          <BlurView accessibilityLabel="Primary navigation" accessibilityRole="tablist" intensity={68} style={styles.dock} tint="dark">
            {dockTabs.map(({ id, label, icon }) => (
              <DestinationTappable accessibilityLabel={`${label} tab`} accessibilityRole="tab" focusStyle={styles.dockFocusState} key={id} onPress={() => onOpenTab(id)} style={styles.dockTab}>
                <View style={styles.dockIcon}><Ionicons color={id === 'explore' ? palette.sunsetVermilion : palette.cloudWhite} name={icon} size={21} /></View>
                <AppText style={[styles.dockLabel, id === 'explore' && styles.dockLabelActive]}>{label}</AppText>
              </DestinationTappable>
            ))}
          </BlurView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SectionHeading({ action, onPress, title }: { action?: string; onPress?: () => void; title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <AppText accessibilityRole="header" style={styles.sectionTitle}>{title}</AppText>
      {action && onPress ? <DestinationTappable accessibilityLabel={`${action} ${title.toLowerCase()}`} accessibilityRole="button" onPress={onPress} style={styles.viewAll}><AppText style={styles.viewAllText}>{action}</AppText><Ionicons color={palette.carbonInk} name="arrow-forward" size={15} /></DestinationTappable> : null}
    </View>
  );
}

function DestinationTappable({ focusStyle, ...props }: ComponentProps<typeof Tappable>) {
  return <Tappable {...props} focusStyle={focusStyle ?? styles.focusState} focusVisibleOnly />;
}

function DestinationActions({ compact = false, destination, isSaved, isWantToGo, onMarkVisited, onSave, onWantToGo, visited }: {
  compact?: boolean;
  destination: Destination;
  isSaved: boolean;
  isWantToGo: boolean;
  onMarkVisited: () => void;
  onSave: () => void;
  onWantToGo: () => void;
  visited: boolean;
}) {
  return (
    <View style={[styles.actions, compact && styles.compactActions]}>
      <View style={styles.actionRow}>
        <DestinationTappable accessibilityLabel={`Mark ${destination.name} Want to Go`} accessibilityRole="button" onPress={onWantToGo} style={styles.wantAction}>
          <Ionicons color={palette.cloudWhite} name={isWantToGo ? 'checkmark' : 'heart-outline'} size={19} />
          <AppText style={styles.actionText}>Want to Go</AppText>
        </DestinationTappable>
        <DestinationTappable accessibilityLabel={isSaved ? `Remove ${destination.name} from Saved` : `Save ${destination.name}`} accessibilityRole="button" onPress={onSave} style={styles.saveAction}>
          <Ionicons color={palette.carbonInk} name={isSaved ? 'bookmark' : 'bookmark-outline'} size={19} />
          <AppText style={styles.saveActionText}>{isSaved ? 'Saved' : 'Save'}</AppText>
        </DestinationTappable>
      </View>
      <DestinationTappable accessibilityLabel={visited ? `${destination.name} visited in Passport` : `Mark ${destination.name} visited in Passport`} accessibilityRole="button" accessibilityState={{ checked: visited }} onPress={onMarkVisited} style={[styles.visitedAction, compact && styles.compactVisitedAction]}>
        <Ionicons color={colors.primaryAction} name={visited ? 'checkmark-circle' : 'ellipse-outline'} size={20} />
        <AppText style={styles.saveActionText}>{visited ? 'Visited in Passport' : 'Mark visited in Passport'}</AppText>
      </DestinationTappable>
    </View>
  );
}

function LayerCard({ destinationItems, isBali, layer, onPress }: { destinationItems: readonly DiscoveryItem[]; isBali: boolean; layer: DiscoveryLayer; onPress: () => void }) {
  const item = destinationItems.find((candidate) => candidate.layer === layer);
  return (
    <DestinationTappable accessibilityLabel={`Open ${capitalize(layer)} layer`} accessibilityRole="link" onPress={onPress} style={styles.layerCard}>
      <ExpoImage contentFit="cover" source={layerSource(layer, destinationItems, isBali)} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(3,26,47,0.04)', 'rgba(3,26,47,0.12)', 'rgba(3,26,47,0.86)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={[styles.layerCardIcon, { backgroundColor: discoveryLayerColors[layer] }]}><Ionicons color={palette.carbonInk} name={layerDetails[layer].icon} size={19} /></View>
      <View style={styles.layerCardCopy}>
        <AppText style={styles.layerCardTitle}>{capitalize(layer)}</AppText>
        <AppText numberOfLines={2} style={styles.layerCardNote}>{isBali ? layerDetails[layer].note : item?.description ?? layerDetails[layer].note}</AppText>
      </View>
      <View style={styles.layerCardArrow}><Ionicons color={palette.carbonInk} name="chevron-forward" size={20} /></View>
    </DestinationTappable>
  );
}

function StoryCard({ onPress, source, title, width }: { onPress: () => void; source: ImageSourcePropType; title: string; width?: number }) {
  return (
    <DestinationTappable accessibilityLabel={`Open ${title}`} accessibilityRole="link" onPress={onPress} style={[styles.storyCard, width ? { width } : null]}>
      <ExpoImage contentFit="cover" source={source} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(3,26,47,0.04)', 'rgba(3,26,47,0.76)']} style={StyleSheet.absoluteFill} />
      <AppText numberOfLines={2} style={styles.storyTitle}>{title}</AppText>
      <View style={styles.storyArrow}><Ionicons color={palette.cloudWhite} name="arrow-forward" size={17} /></View>
    </DestinationTappable>
  );
}

function layerSource(layer: DiscoveryLayer, destinationItems: readonly DiscoveryItem[], isBali: boolean, section: 'overview' | 'layers' = 'layers') {
  if (isBali) return section === 'overview' ? baliOverviewLayerImages[layer] : baliLayerImages[layer];
  const item = destinationItems.find((candidate) => candidate.layer === layer);
  const image = item ? getImageById(item.imageIds[0]) : undefined;
  return image ? { uri: image.url } : baliLayerImages[layer];
}

function imageSource(imageId: string, items: readonly DiscoveryItem[]): ImageSourcePropType {
  const item = items.find(({ imageIds }) => imageIds.includes(imageId));
  const image = item ? getImageById(item.imageIds[0]) : getImageById(imageId);
  return image ? { uri: image.url } : baliLayerImages.iconic;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.softCloudIvory, flex: 1 },
  screen: { flex: 1, position: 'relative' },
  scrollContent: { paddingBottom: 0 },
  mainScroll: { flex: 1, overflow: 'hidden' },
  hero: { backgroundColor: palette.oceanBlue, overflow: 'hidden', position: 'relative' },
  heroBottomFade: { bottom: -1, height: 128, left: 0, position: 'absolute', right: 0 },
  heroTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', left: spacing.md, position: 'absolute', right: spacing.md, top: spacing.md },
  heroControl: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.56)', borderRadius: radius.pill, height: 36, justifyContent: 'center', width: 36 },
  heroActions: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  wordmark: { alignItems: 'center', left: 55, position: 'absolute', right: 55 },
  wordmarkText: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 17, lineHeight: 22 },
  heroCopy: { bottom: 42, left: spacing.md, position: 'absolute', right: spacing.md },
  destinationTitle: { color: palette.cloudWhite, fontFamily: fontFamilies.editorialBold, fontSize: 42, lineHeight: 48 },
  destinationCountry: { color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 14, letterSpacing: 1.1, lineHeight: 19, textTransform: 'uppercase' },
  quickTags: { gap: spacing.xs, paddingTop: spacing.xs },
  quickTag: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.68)', borderColor: 'rgba(255,253,248,0.52)', borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: 5, justifyContent: 'center', minHeight: 32, paddingHorizontal: spacing.sm },
  quickTagText: { color: palette.cloudWhite, fontSize: 12 },
  primaryQuickTag: { backgroundColor: palette.goldenSun, borderColor: palette.goldenSun },
  primaryQuickTagText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold },
  sectionTabs: { borderBottomColor: 'rgba(32,36,44,0.1)', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minWidth: '100%', paddingHorizontal: spacing.lg },
  sectionTab: { alignItems: 'center', justifyContent: 'center', minHeight: 52, minWidth: 66, paddingHorizontal: spacing.xs, position: 'relative' },
  sectionTabText: { color: '#4F5661', fontSize: 12 },
  sectionTabTextActive: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold },
  sectionTabIndicator: { backgroundColor: palette.goldenSun, borderRadius: radius.pill, bottom: 5, height: 3, left: spacing.xs, position: 'absolute', right: spacing.xs },
  content: { gap: spacing.md, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  overviewContent: { paddingBottom: spacing.sm },
  facts: { backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, paddingVertical: spacing.sm },
  fact: { alignItems: 'center', borderRightColor: 'rgba(32,36,44,0.08)', borderRightWidth: 1, flex: 1, gap: 4, minWidth: 0, paddingHorizontal: 2 },
  factLabel: { color: '#5D6470', fontSize: 11, textAlign: 'center' },
  factValue: { color: palette.carbonInk, fontSize: 12, textAlign: 'center' },
  section: { gap: spacing.xs },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 21, lineHeight: 28 },
  subtitle: { color: '#4F5661', fontSize: 13, lineHeight: 19 },
  aboutText: { color: '#4F5661', fontSize: 14, lineHeight: 21 },
  readMore: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: spacing.xs, minHeight: 36 },
  readMoreText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 12 },
  layerPreviewRail: { gap: spacing.xs, paddingBottom: 2 },
  layerPreview: { backgroundColor: palette.oceanBlue, borderRadius: radius.sm, height: 194, overflow: 'hidden', position: 'relative' },
  layerPreviewIcon: { alignItems: 'center', borderRadius: radius.sm, height: 28, justifyContent: 'center', left: spacing.sm, position: 'absolute', top: spacing.sm, width: 28 },
  layerPreviewLabel: { bottom: spacing.sm, color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 15, left: spacing.sm, position: 'absolute' },
  viewAll: { alignItems: 'center', flexDirection: 'row', gap: 3, minHeight: 38, paddingLeft: spacing.sm },
  viewAllText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 12 },
  placeRail: { columnGap: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.sm },
  placeGrid: { columnGap: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.sm },
  placeCard: { backgroundColor: palette.oceanBlue, borderRadius: radius.sm, height: 154, overflow: 'hidden', position: 'relative' },
  placeName: { bottom: spacing.md, color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 16, left: spacing.md, lineHeight: 19, position: 'absolute', right: 44 },
  placeArrow: { bottom: spacing.md, position: 'absolute', right: spacing.md },
  storyRail: { gap: spacing.sm },
  storyCard: { backgroundColor: palette.oceanBlue, borderRadius: radius.sm, height: 132, overflow: 'hidden', position: 'relative', width: 166 },
  storyTitle: { bottom: spacing.sm, color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 13, left: spacing.sm, position: 'absolute', right: 38 },
  storyArrow: { alignItems: 'center', bottom: spacing.xs, height: 28, justifyContent: 'center', position: 'absolute', right: spacing.xs, width: 28 },
  actions: { gap: spacing.xs, paddingTop: spacing.xs },
  compactActions: { gap: 0, paddingTop: 0 },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  wantAction: { alignItems: 'center', backgroundColor: colors.primaryAction, borderRadius: radius.pill, flex: 1, flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 48 },
  actionText: { color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 13 },
  saveAction: { alignItems: 'center', backgroundColor: '#F2F3F3', borderRadius: radius.pill, flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 48, minWidth: 105 },
  saveActionText: { color: palette.carbonInk, fontFamily: fontFamilies.uiSemibold, fontSize: 13 },
  visitedAction: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: spacing.xs, minHeight: 44, paddingHorizontal: spacing.xs },
  compactVisitedAction: { minHeight: 32 },
  layersIntro: { gap: spacing.xs, paddingBottom: spacing.xs },
  layerCards: { gap: spacing.sm },
  layerCard: { backgroundColor: palette.oceanBlue, borderRadius: radius.sm, height: 184, overflow: 'hidden', position: 'relative' },
  layerCardIcon: { alignItems: 'center', borderRadius: radius.sm, height: 36, justifyContent: 'center', left: spacing.md, position: 'absolute', top: spacing.md, width: 36 },
  layerCardCopy: { bottom: spacing.md, left: spacing.md, position: 'absolute', right: 58 },
  layerCardTitle: { color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold, fontSize: 20, lineHeight: 26 },
  layerCardNote: { color: palette.cloudWhite, fontSize: 12, lineHeight: 17 },
  layerCardArrow: { alignItems: 'center', backgroundColor: 'rgba(255,253,248,0.94)', borderRadius: radius.pill, bottom: spacing.md, height: 34, justifyContent: 'center', position: 'absolute', right: spacing.md, width: 34 },
  dockPosition: { alignItems: 'center', flexShrink: 0, paddingBottom: spacing.xs },
  dock: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.88)', borderColor: 'rgba(253,251,247,0.22)', borderRadius: 36, borderWidth: 1, flexDirection: 'row', height: 70, maxWidth: 440, overflow: 'hidden', paddingHorizontal: spacing.xs, width: '94%' },
  dockTab: { alignItems: 'center', flex: 1, gap: 1, height: 64, justifyContent: 'center', minHeight: 48, minWidth: 48 },
  dockIcon: { alignItems: 'center', height: 32, justifyContent: 'center', width: 32 },
  dockLabel: { color: palette.cloudWhite, fontSize: 10, opacity: 0.82 },
  dockLabelActive: { color: palette.sunsetVermilion, opacity: 1 },
  focusState: { borderColor: palette.goldenSun, borderWidth: 2 },
  tabFocusState: { backgroundColor: 'rgba(231,169,54,0.14)', borderRadius: radius.sm },
  dockFocusState: { backgroundColor: 'rgba(231,169,54,0.14)', borderRadius: radius.md },
});
