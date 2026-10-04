import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, ScreenContainer, Tappable } from '@/components/ui';
import { destinations, discoveryItems } from '@/content/contentIndex';
import { DISCOVERY_LAYERS, INTEREST_TAGS, REGIONS, type DiscoveryLayer, type InterestTag, type Region } from '@/content/vocabularies';
import { searchAndFilterContent, type ExploreFilters, type ExploreResult } from '@/search/discoverySearch';
import { fontFamilies, palette, radius, spacing } from '@/tokens';

interface ExploreScreenProps {
  onBack: () => void;
  onOpenDestination: (id: string) => void;
  onOpenItem: (id: string) => void;
  onOpenTab: (tab: 'discover' | 'saved' | 'passport' | 'profile') => void;
}

type SortOrder = 'popular' | 'alphabetical';
type ExploreLayer = DiscoveryLayer | 'all';

const display = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const destinationLayers: Record<string, DiscoveryLayer> = {
  bali: 'iconic',
  marrakech: 'culture',
  santorini: 'nature',
  rome: 'iconic',
  cappadocia: 'hidden',
  kyoto: 'culture',
  'rio-de-janeiro': 'nature',
};
const destinationImages: Record<string, number> = {
  bali: require('../../../assets/images/bali-layer-iconic.jpg'),
  marrakech: require('../../../assets/images/explore-marrakech.jpg'),
  santorini: require('../../../assets/images/explore-santorini.jpg'),
  rome: require('../../../assets/images/explore-rome.jpg'),
  cappadocia: require('../../../assets/images/explore-cappadocia.jpg'),
  kyoto: require('../../../assets/images/explore-kyoto.jpg'),
  'rio-de-janeiro': require('../../../assets/images/explore-rio.jpg'),
};
const layerIcons: Record<ExploreLayer, keyof typeof Ionicons.glyphMap> = {
  all: 'grid',
  iconic: 'sunny',
  hidden: 'leaf-outline',
  culture: 'people',
  taste: 'restaurant',
  nature: 'leaf',
};
const exploreLayerColors: Record<ExploreLayer, string> = {
  all: '#FFC44D',
  iconic: '#FFC44D',
  hidden: '#AD7AE8',
  culture: '#DF8056',
  taste: '#F06555',
  nature: '#91B66E',
};
const heroImage = require('../../../assets/images/explore-hero.jpg');
const continents = [...new Set(destinations.map(({ continent }) => continent))];
const deepNavy = '#031A2F';
const cloudWhite = palette.cloudWhite;
const darkFade = (alpha: number) => `rgba(3, 26, 47, ${alpha})`;
const heroFade = [darkFade(0.04), darkFade(0.1), darkFade(0.4), darkFade(0.74)] as const;
const cardFade = [darkFade(0), darkFade(0.02), darkFade(0.18), darkFade(0.64)] as const;

export function ExploreScreen({ onBack, onOpenDestination, onOpenItem, onOpenTab }: ExploreScreenProps) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [filters, setFilters] = useState<ExploreFilters>({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sort, setSort] = useState<SortOrder>('popular');
  const results = useMemo(
    () => searchAndFilterContent(destinations, discoveryItems, query, filters),
    [filters, query],
  );
  const orderedResults = useMemo(() => {
    if (sort === 'popular') return results;
    return [...results].sort((left, right) => resultName(left).localeCompare(resultName(right)));
  }, [results, sort]);
  const destinationResults = orderedResults.filter((result) => result.kind === 'destination');
  const itemResults = orderedResults.filter((result) => result.kind === 'item');
  const shownItemResults = query.trim() ? itemResults : [];
  const resultCount = destinationResults.length + shownItemResults.length;
  const cardWidth = Math.floor((width - spacing.lg * 2 - spacing.sm) / 2);
  const heroHeight = Math.min(480, Math.max(360, Math.round(height * 0.48)));

  const update = <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: current[key] === value ? undefined : value }));
  };
  const selectLayer = (layer: ExploreLayer) => {
    setFilters((current) => ({ ...current, layer: layer === 'all' || current.layer === layer ? undefined : layer }));
  };
  const clearAll = () => {
    setQuery('');
    setFilters({});
  };

  return (
    <ScreenContainer backgroundColor={deepNavy} bottomPadding={0} scroll={false}>
      <View style={styles.screen}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { height: heroHeight }]}>
            <ExpoImage accessible={false} contentFit="cover" source={heroImage} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={heroFade} locations={[0, 0.32, 0.68, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(3,26,47,0)', 'rgba(3,26,47,0.62)', deepNavy]} locations={[0, 0.56, 1]} pointerEvents="none" style={styles.heroBottomFade} />
            <View style={[styles.heroTop, { top: Math.max(spacing.sm, insets.top - spacing.xl) }]}>
              <Tappable accessibilityLabel="Back to Discover" accessibilityRole="button" onPress={onBack} style={styles.heroControl}>
                <Ionicons color={cloudWhite} name="chevron-back" size={22} />
              </Tappable>
              <View style={styles.wordmark}>
                <Ionicons color={cloudWhite} name="sparkles" size={13} />
                <AppText style={styles.wordmarkText}>World Unfolded</AppText>
              </View>
              <Tappable accessibilityLabel={searchOpen ? 'Close search' : 'Search destinations, places or experiences'} accessibilityRole="button" onPress={() => setSearchOpen((open) => !open)} style={styles.heroControl}>
                <Ionicons color={cloudWhite} name={searchOpen ? 'close' : 'search'} size={21} />
              </Tappable>
            </View>
            <View style={styles.heroCopy}>
              <AppText accessibilityRole="header" style={styles.heroTitle}>Explore</AppText>
              <AppText style={styles.heroSubtitle}>Destinations, places and stories curated by layer.</AppText>
            </View>
          </View>

          <View style={styles.content}>
            {searchOpen ? (
              <View style={styles.searchBox}>
                <Ionicons color="rgba(255,253,248,0.72)" name="search" size={19} />
                <TextInput
                  accessibilityLabel="Search destinations and discovery items"
                  autoFocus
                  onChangeText={setQuery}
                  placeholder="Search destinations, places or experiences"
                  placeholderTextColor="rgba(255,253,248,0.62)"
                  returnKeyType="search"
                  style={styles.searchInput}
                  value={query}
                />
                {query ? <Tappable accessibilityLabel="Clear search" accessibilityRole="button" onPress={() => setQuery('')}><Ionicons color={cloudWhite} name="close-circle" size={19} /></Tappable> : null}
              </View>
            ) : null}

            <ScrollView accessibilityLabel="Filter by discovery layer" contentContainerStyle={styles.layerRail} horizontal showsHorizontalScrollIndicator={false}>
              <LayerFilter active={!filters.layer} icon="all" label="All" onPress={() => selectLayer('all')} />
              {DISCOVERY_LAYERS.map((layer) => (
                <LayerFilter active={filters.layer === layer} icon={layer} key={layer} label={display(layer)} onPress={() => selectLayer(layer)} />
              ))}
            </ScrollView>

            <View style={styles.controls}>
              <Tappable accessibilityLabel="Cycle destination continent" accessibilityRole="button" onPress={() => setFilters((current) => {
                const currentIndex = current.continent ? continents.indexOf(current.continent) : -1;
                return { ...current, continent: continents[(currentIndex + 1) % (continents.length + 1)] };
              })} style={styles.control}>
                <Ionicons color={cloudWhite} name="location-outline" size={17} />
                <AppText numberOfLines={1} style={styles.controlText}>{filters.continent ?? 'Continent'}</AppText>
                <Ionicons color={cloudWhite} name="chevron-down" size={15} />
              </Tappable>
              <Tappable accessibilityLabel="Toggle filters" accessibilityRole="button" onPress={() => setFiltersExpanded((expanded) => !expanded)} style={styles.control}>
                <Ionicons color={cloudWhite} name="options-outline" size={17} />
                <AppText style={styles.controlText}>Filters</AppText>
              </Tappable>
              <Tappable accessibilityLabel={`Sort: ${sort === 'popular' ? 'Popular' : 'A to Z'}`} accessibilityRole="button" onPress={() => setSort((current) => current === 'popular' ? 'alphabetical' : 'popular')} style={styles.control}>
                <Ionicons color={cloudWhite} name="swap-vertical" size={17} />
                <AppText style={styles.controlText}>{sort === 'popular' ? 'Popular' : 'A–Z'}</AppText>
                <Ionicons color={cloudWhite} name="chevron-down" size={15} />
              </Tappable>
            </View>

            {filtersExpanded ? (
              <View style={styles.filterPanel}>
                <FilterGroup label="Continent">{continents.map((value) => <FilterChip key={value} label={value} onPress={() => update('continent', value)} selected={filters.continent === value} />)}</FilterGroup>
                <FilterGroup label="Region">{REGIONS.map((value) => <FilterChip key={value} label={display(value)} onPress={() => update('region', value as Region)} selected={filters.region === value} />)}</FilterGroup>
                <FilterGroup label="Interest">{INTEREST_TAGS.map((value) => <FilterChip key={value} label={display(value)} onPress={() => update('interest', value as InterestTag)} selected={filters.interest === value} />)}</FilterGroup>
                <FilterGroup label="Country">{destinations.map(({ country }) => <FilterChip key={country} label={country} onPress={() => update('country', country)} selected={filters.country === country} />)}</FilterGroup>
              </View>
            ) : null}

            <View style={styles.sectionHeading}>
              <AppText accessibilityRole="header" style={styles.sectionTitle}>{query || filters.layer || filters.region || filters.country || filters.continent || filters.interest ? 'Results' : 'Destinations'}</AppText>
              <AppText accessibilityLabel={`${results.length} ${results.length === 1 ? 'result' : 'results'}`} accessibilityRole="header" style={styles.count}>
                {shownItemResults.length ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'}` : `${destinationResults.length} destinations`}
              </AppText>
              <Tappable accessibilityLabel={query || Object.values(filters).some(Boolean) ? 'Clear search and filters' : 'View all destinations'} accessibilityRole="button" onPress={clearAll} style={styles.viewAll}>
                <AppText style={styles.viewAllText}>{query || Object.values(filters).some(Boolean) ? 'Clear' : 'View all'}</AppText>
                <Ionicons color={cloudWhite} name="arrow-forward" size={14} />
              </Tappable>
            </View>

            {destinationResults.length || shownItemResults.length ? (
              <>
                {destinationResults.length ? (
                  <View style={styles.grid}>
                    {destinationResults.map((result) => result.kind === 'destination' ? (
                      <DestinationCard
                        cardWidth={cardWidth}
                        destination={result.destination}
                        key={result.destination.id}
                        onPress={() => onOpenDestination(result.destination.id)}
                      />
                    ) : null)}
                  </View>
                ) : null}
                {shownItemResults.length ? (
                  <View style={[styles.grid, destinationResults.length ? styles.itemGrid : null]}>
                    {shownItemResults.map((result) => result.kind === 'item' ? (
                      <DiscoveryCard
                        cardWidth={cardWidth}
                        key={result.item.id}
                        onPress={() => onOpenItem(result.item.id)}
                        result={result}
                      />
                    ) : null)}
                  </View>
                ) : null}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons color={palette.goldenSun} name="compass-outline" size={26} />
                <AppText accessibilityRole="header" style={styles.emptyTitle}>No matching discoveries</AppText>
                <AppText style={styles.emptyCopy}>Try another name or remove an active filter.</AppText>
                <Tappable accessibilityLabel="Clear search and filters" accessibilityRole="button" onPress={clearAll} style={styles.clearButton}>
                  <AppText style={styles.clearButtonText}>Clear search and filters</AppText>
                </Tappable>
              </View>
            )}

            {!query && !filters.layer && !filters.country && !filters.continent && !filters.region && !filters.interest ? (
              <View style={styles.continueSection}>
                <View style={styles.sectionHeading}>
                  <AppText accessibilityRole="header" style={styles.continueTitle}>Continue exploring</AppText>
                  <AppText style={styles.count}>Picked for you</AppText>
                </View>
                <ScrollView accessibilityLabel="Continue exploring destinations" contentContainerStyle={styles.continueRail} horizontal showsHorizontalScrollIndicator={false}>
                  {destinations.slice(3).map((destination) => (
                    <Tappable accessibilityLabel={`Continue exploring ${destination.name}`} accessibilityRole="link" key={destination.id} onPress={() => onOpenDestination(destination.id)} style={styles.continueCard}>
                      <ExpoImage contentFit="cover" source={destinationImages[destination.id]} style={StyleSheet.absoluteFill} />
                      <LinearGradient colors={cardFade} locations={[0, 0.35, 0.7, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
                      <AppText numberOfLines={1} style={styles.continueName}>{destination.name}</AppText>
                      <AppText numberOfLines={1} style={styles.continueCountry}>{destination.country}</AppText>
                      <Ionicons color={cloudWhite} name="chevron-forward" size={16} style={styles.continueArrow} />
                    </Tappable>
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View pointerEvents="box-none" style={[styles.dockPosition, { bottom: spacing.xs }]}>
          <BlurView accessibilityLabel="Primary navigation" accessibilityRole="tablist" intensity={68} style={styles.dock} tint="dark">
            <DockTab icon="compass-outline" label="Discover" onPress={() => onOpenTab('discover')} />
            <DockTab active icon="globe" label="Explore" onPress={() => undefined} />
            <DockTab icon="bookmark-outline" label="Saved" onPress={() => onOpenTab('saved')} />
            <DockTab icon="book-outline" label="Passport" onPress={() => onOpenTab('passport')} />
            <DockTab icon="person-outline" label="Profile" onPress={() => onOpenTab('profile')} />
          </BlurView>
        </View>
      </View>
    </ScreenContainer>
  );
}

function resultName(result: ExploreResult) {
  return result.kind === 'destination' ? result.destination.name : result.item.name;
}

function LayerFilter({ active, icon, label, onPress }: { active: boolean; icon: ExploreLayer; label: string; onPress: () => void }) {
  const color = exploreLayerColors[icon];
  return (
    <Tappable accessibilityLabel={`${label} layer filter`} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={styles.layerFilter}>
      <View style={[styles.layerIcon, { backgroundColor: color }, active && styles.layerIconActive]}>
        <Ionicons color={deepNavy} name={layerIcons[icon]} size={19} />
      </View>
      <AppText style={[styles.layerLabel, active && { color }]}>{label}</AppText>
    </Tappable>
  );
}

function FilterGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <View style={styles.filterGroup}>
      <AppText style={styles.filterLabel}>{label}</AppText>
      <ScrollView contentContainerStyle={styles.filterRail} horizontal showsHorizontalScrollIndicator={false}>{children}</ScrollView>
    </View>
  );
}

function FilterChip({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  return (
    <Tappable accessibilityLabel={label} accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.filterChip, selected && styles.filterChipSelected]}>
      <AppText style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{label}</AppText>
    </Tappable>
  );
}

function DestinationCard({ cardWidth, destination, onPress }: { cardWidth: number; destination: (typeof destinations)[number]; onPress: () => void }) {
  const layer = destinationLayers[destination.id];
  return (
    <Tappable accessibilityLabel={`Open ${destination.name}`} accessibilityRole="link" onPress={onPress} style={[styles.destinationCard, { width: cardWidth }]}>
      <ExpoImage contentFit="cover" source={destinationImages[destination.id]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={cardFade} locations={[0, 0.3, 0.62, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
      <View style={[styles.layerBadge, { backgroundColor: exploreLayerColors[layer] }]}>
        <Ionicons color={deepNavy} name={layerIcons[layer]} size={14} />
      </View>
      <View style={styles.destinationCopy}>
        <AppText numberOfLines={1} style={styles.destinationName}>{destination.name}</AppText>
        <AppText numberOfLines={1} style={styles.destinationCountry}>{destination.country}</AppText>
      </View>
      <Ionicons color={exploreLayerColors[layer]} name="chevron-forward" size={19} style={styles.destinationArrow} />
    </Tappable>
  );
}

function DiscoveryCard({ cardWidth, onPress, result }: { cardWidth: number; onPress: () => void; result: Extract<ExploreResult, { kind: 'item' }> }) {
  const layer = result.item.layer;
  return (
    <Tappable accessibilityLabel={`Open ${result.item.name}`} accessibilityRole="link" onPress={onPress} style={[styles.destinationCard, { width: cardWidth }]}>
      <ExpoImage contentFit="cover" source={destinationImages[result.destination.id]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={cardFade} locations={[0, 0.3, 0.62, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
      <View style={[styles.layerBadge, { backgroundColor: exploreLayerColors[layer] }]}>
        <Ionicons color={deepNavy} name={layerIcons[layer]} size={14} />
      </View>
      <View style={styles.destinationCopy}>
        <AppText numberOfLines={1} style={styles.destinationName}>{result.item.name}</AppText>
        <AppText numberOfLines={1} style={styles.destinationCountry}>{result.destination.country}</AppText>
      </View>
      <Ionicons color={exploreLayerColors[layer]} name="chevron-forward" size={19} style={styles.destinationArrow} />
    </Tappable>
  );
}

function DockTab({ active = false, icon, label, onPress }: { active?: boolean; icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Tappable accessibilityLabel={`${label} tab`} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={styles.dockTab}>
      <View style={styles.dockIcon}>
        <Ionicons color={active ? palette.sunsetVermilion : cloudWhite} name={icon} size={19} />
      </View>
      <AppText style={[styles.dockLabel, active && styles.dockLabelActive]}>{label}</AppText>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: deepNavy, flex: 1, marginHorizontal: -spacing.lg, marginTop: -spacing.xl, position: 'relative' },
  scrollContent: { paddingBottom: 96 },
  hero: { overflow: 'hidden', position: 'relative' },
  heroBottomFade: { bottom: -1, height: 104, left: 0, position: 'absolute', right: 0 },
  heroTop: { alignItems: 'center', flexDirection: 'row', left: spacing.lg, position: 'absolute', right: spacing.lg },
  heroControl: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.56)', borderRadius: radius.pill, height: 36, justifyContent: 'center', width: 36 },
  wordmark: { alignItems: 'center', flex: 1, gap: 1 },
  wordmarkText: { color: cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 18, lineHeight: 23 },
  heroCopy: { bottom: spacing.lg, left: spacing.lg, position: 'absolute', right: spacing.lg },
  heroTitle: { color: cloudWhite, fontFamily: fontFamilies.editorialBold, fontSize: 38, lineHeight: 46 },
  heroSubtitle: { color: cloudWhite, fontSize: 15, lineHeight: 21, maxWidth: 300 },
  content: { paddingHorizontal: spacing.lg },
  searchBox: { alignItems: 'center', backgroundColor: 'rgba(255,253,248,0.1)', borderColor: 'rgba(255,253,248,0.24)', borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, minHeight: 46, paddingHorizontal: spacing.md },
  searchInput: { color: cloudWhite, flex: 1, fontSize: 13, minHeight: 44 },
  layerRail: { alignItems: 'flex-start', gap: spacing.sm, paddingBottom: spacing.xs, paddingTop: spacing.xs },
  layerFilter: { alignItems: 'center', gap: 3, minHeight: 46, minWidth: 46 },
  layerIcon: { alignItems: 'center', borderRadius: radius.sm, height: 32, justifyContent: 'center', width: 32 },
  layerIconActive: { opacity: 1 },
  layerLabel: { color: cloudWhite, fontSize: 10, lineHeight: 14 },
  controls: { flexDirection: 'row', gap: spacing.xs, justifyContent: 'space-between', marginBottom: spacing.xs, marginTop: 0 },
  control: { alignItems: 'center', borderColor: 'rgba(255,253,248,0.32)', borderRadius: radius.pill, borderWidth: 1, flex: 1, flexDirection: 'row', gap: 4, height: 36, justifyContent: 'center', minHeight: 36, paddingHorizontal: 5 },
  controlText: { color: cloudWhite, flexShrink: 1, fontSize: 11 },
  filterPanel: { backgroundColor: 'rgba(255,253,248,0.06)', borderColor: 'rgba(255,253,248,0.12)', borderRadius: radius.md, borderWidth: 1, marginBottom: spacing.md, padding: spacing.sm },
  filterGroup: { gap: spacing.xs, marginVertical: spacing.xs },
  filterLabel: { color: cloudWhite, fontSize: 11, opacity: 0.78 },
  filterRail: { gap: spacing.xs },
  filterChip: { borderColor: 'rgba(255,253,248,0.28)', borderRadius: radius.pill, borderWidth: 1, minHeight: 32, justifyContent: 'center', paddingHorizontal: spacing.sm },
  filterChipSelected: { backgroundColor: palette.sunsetVermilion, borderColor: palette.sunsetVermilion },
  filterChipText: { color: cloudWhite, fontSize: 11 },
  filterChipTextSelected: { color: cloudWhite },
  sectionHeading: { alignItems: 'baseline', flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.xs, marginTop: 0 },
  sectionTitle: { color: cloudWhite, flex: 1, fontFamily: fontFamilies.editorialRegular, fontSize: 23, lineHeight: 29 },
  count: { color: cloudWhite, fontSize: 10, opacity: 0.78 },
  viewAll: { alignItems: 'center', flexDirection: 'row', gap: 2, minHeight: 28, minWidth: 0, paddingLeft: spacing.xs },
  viewAllText: { color: cloudWhite, fontSize: 11 },
  grid: { columnGap: spacing.sm, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  destinationCard: { backgroundColor: '#17435A', borderColor: 'rgba(255,253,248,0.12)', borderRadius: radius.sm, borderWidth: 1, height: 154, marginBottom: spacing.xs, overflow: 'hidden', position: 'relative' },
  layerBadge: { alignItems: 'center', borderRadius: radius.sm, height: 28, justifyContent: 'center', left: spacing.sm, position: 'absolute', top: spacing.sm, width: 28 },
  destinationCopy: { bottom: spacing.sm, left: spacing.sm, position: 'absolute', right: 29 },
  destinationName: { color: cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 20, lineHeight: 24 },
  destinationCountry: { color: cloudWhite, fontSize: 9, letterSpacing: 1.2, lineHeight: 13, opacity: 0.92, textTransform: 'uppercase' },
  destinationArrow: { bottom: spacing.xs, position: 'absolute', right: spacing.xs },
  itemGrid: { marginTop: spacing.md },
  continueSection: { marginTop: spacing.xl },
  continueTitle: { color: cloudWhite, flex: 1, fontFamily: fontFamilies.editorialRegular, fontSize: 21, lineHeight: 28 },
  continueRail: { gap: spacing.xs, paddingBottom: spacing.sm },
  continueCard: { backgroundColor: '#17435A', borderRadius: radius.sm, height: 104, overflow: 'hidden', position: 'relative', width: 116 },
  continueName: { bottom: 24, color: cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 14, left: spacing.xs, position: 'absolute', right: 22 },
  continueCountry: { bottom: spacing.xs, color: cloudWhite, fontSize: 8, left: spacing.xs, letterSpacing: 1, position: 'absolute', textTransform: 'uppercase' },
  continueArrow: { bottom: spacing.xs, position: 'absolute', right: spacing.xs },
  emptyState: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing['2xl'] },
  emptyTitle: { color: cloudWhite, fontFamily: fontFamilies.editorialRegular, fontSize: 22 },
  emptyCopy: { color: cloudWhite, fontSize: 13, opacity: 0.8, textAlign: 'center' },
  clearButton: { backgroundColor: palette.sunsetVermilion, borderRadius: radius.pill, marginTop: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  clearButtonText: { color: cloudWhite, fontSize: 12 },
  dockPosition: { alignItems: 'center', left: 0, position: 'absolute', right: 0 },
  dock: { alignItems: 'center', backgroundColor: 'rgba(3,26,47,0.9)', borderColor: 'rgba(253,251,247,0.18)', borderRadius: 32, borderWidth: 1, flexDirection: 'row', height: 58, maxWidth: 440, overflow: 'hidden', paddingHorizontal: spacing.xs, width: '94%' },
  dockTab: { alignItems: 'center', flex: 1, gap: 0, height: 52, justifyContent: 'center', minHeight: 48, minWidth: 48 },
  dockIcon: { alignItems: 'center', borderRadius: radius.pill, height: 28, justifyContent: 'center', width: 28 },
  dockLabel: { color: cloudWhite, fontSize: 9, opacity: 0.82 },
  dockLabelActive: { color: palette.sunsetVermilion, opacity: 1 },
});
