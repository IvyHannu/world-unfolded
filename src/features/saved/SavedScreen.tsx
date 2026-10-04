import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { useReducedMotion } from '@/accessibility/preferences';
import { AppText, ScreenContainer, Tappable } from '@/components/ui';
import { getDestinationById, getDiscoveryItemById } from '@/content/selectors';
import { useSavedStore } from '@/state/savedStore';
import { colors, fontFamilies, palette, radius, spacing } from '@/tokens';
import type { DiscoveryItem, SavedItem } from '@/types';

type SavedCategory = 'place' | 'story' | 'experience' | 'food';
type CategoryFilter = 'All' | 'Places' | 'Stories' | 'Experiences' | 'Food';
type SortOrder = 'Newest' | 'Oldest' | 'A–Z';

const filters: CategoryFilter[] = ['All', 'Places', 'Stories', 'Experiences', 'Food'];
const categoryLabels: Record<SavedCategory, string> = { place: 'Place', story: 'Story', experience: 'Experience', food: 'Food' };
const savedHero = require('../../../assets/images/bali-sidemen-valley-alt.jpg');
const baliImages: Record<string, number> = {
  bali: require('../../../assets/images/bali-destination-hero.jpg'),
  'tanah-lot': require('../../../assets/images/bali-tanah-lot.jpg'),
  tenganan: require('../../../assets/images/bali-tenganan-village.jpg'),
  subak: require('../../../assets/images/bali-layer-barong dance.jpg'),
  'babi-guling': require('../../../assets/images/bali-babi-guling.jpg'),
  'mount-batur': require('../../../assets/images/bali-mount-batur.jpg'),
  'nusa-penida': require('../../../assets/images/nusa penida’s turquoise broken beach.png'),
  'ulun-danu-beratan': require('../../../assets/images/bali-ulun-danu.jpg'),
  'uluwatu-temple': require('../../../assets/images/bali-kecak-fire-dance.jpg'),
};

interface SavedEntry {
  record: SavedItem;
  title: string;
  country: string;
  category: SavedCategory;
  image?: number;
  onOpen: () => void;
}

function categoryFor(item: DiscoveryItem): SavedCategory {
  if (item.type === 'food_experience') return 'food';
  if (item.type === 'cultural_practice') return 'story';
  return 'place';
}

function filterFor(category: SavedCategory): CategoryFilter {
  switch (category) {
    case 'place': return 'Places';
    case 'story': return 'Stories';
    case 'experience': return 'Experiences';
    case 'food': return 'Food';
  }
}

export function SavedScreen({ onExplore, onOpenDestination, onOpenItem }: { onExplore: () => void; onOpenDestination: (id: string) => void; onOpenItem: (id: string) => void; onOpenPassport: () => void }) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('Newest');
  const records = useSavedStore((state) => state.records);
  const remove = useSavedStore((state) => state.remove);
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - spacing.lg * 2, 680);

  const entries = useMemo(() => records.flatMap((record): SavedEntry[] => {
    const destination = record.subjectType === 'destination' ? getDestinationById(record.subjectId) : undefined;
    const item = record.subjectType === 'discoveryItem' ? getDiscoveryItemById(record.subjectId) : undefined;
    if (destination) {
      return [{
        record,
        title: destination.name,
        country: destination.country,
        category: 'place',
        image: baliImages[destination.id],
        onOpen: () => onOpenDestination(destination.id),
      }];
    }
    if (item) {
      const itemDestination = getDestinationById(item.destinationId);
      return [{
        record,
        title: item.name,
        country: itemDestination?.country ?? '',
        category: categoryFor(item),
        image: baliImages[item.id],
        onOpen: () => onOpenItem(item.id),
      }];
    }
    return [];
  }), [onOpenDestination, onOpenItem, records]);

  const visibleEntries = useMemo(() => {
    const filtered = entries.filter((entry) => activeFilter === 'All' || filterFor(entry.category) === activeFilter);
    return filtered.sort((left, right) => {
      if (sortOrder === 'A–Z') return left.title.localeCompare(right.title);
      const newestFirst = Date.parse(right.record.dateAdded) - Date.parse(left.record.dateAdded);
      if (Number.isNaN(newestFirst)) return 0;
      return sortOrder === 'Newest' ? newestFirst : -newestFirst;
    });
  }, [activeFilter, entries, sortOrder]);

  const nextSort: Record<SortOrder, SortOrder> = { Newest: 'Oldest', Oldest: 'A–Z', 'A–Z': 'Newest' };
  const isAll = activeFilter === 'All';
  const emptySaved = records.length === 0;
  const selectedCount = visibleEntries.length;
  const countLabel = isAll
    ? `${selectedCount} saved ${selectedCount === 1 ? 'item' : 'items'}`
    : `${selectedCount} saved ${activeFilter.toLowerCase()}`;

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <View style={styles.hero}>
          <ExpoImage accessible={false} contentFit="cover" source={savedHero} style={StyleSheet.absoluteFill} transition={reduceMotion ? 0 : 180} />
          <LinearGradient colors={['rgba(255,248,239,0.14)', 'rgba(255,248,239,0.4)', colors.background]} locations={[0.05, 0.68, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
          <AppText style={styles.brand}>✦  World Unfolded</AppText>
          <View style={styles.heroCopy}>
            <AppText accessibilityRole="header" style={styles.title}>Saved</AppText>
            <AppText style={styles.subtitle}>The places, stories and experiences{'\n'}you want to come back to.</AppText>
          </View>
        </View>

        <ScrollView accessibilityLabel="Saved category filters" contentContainerStyle={styles.filterRail} horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <Tappable accessibilityLabel={`${filter} saved filter`} accessibilityRole="button" accessibilityState={{ selected }} key={filter} onPress={() => setActiveFilter(filter)} style={[styles.filterChip, selected && styles.filterChipSelected]}>
                <AppText style={[styles.filterText, selected && styles.filterTextSelected]}>{filter}</AppText>
              </Tappable>
            );
          })}
        </ScrollView>

        <View style={styles.listHeader}>
          <AppText accessibilityLiveRegion="polite" style={styles.count}>{countLabel}</AppText>
          {!emptySaved ? (
            <Tappable accessibilityLabel={`Sort saved items, ${sortOrder}`} accessibilityRole="button" onPress={() => setSortOrder(nextSort[sortOrder])} style={styles.sortControl}>
              <AppText style={styles.sortLabel}>Sort by</AppText>
              <AppText style={styles.sortValue}>{sortOrder}</AppText>
              <Ionicons color={palette.carbonInk} name="chevron-down" size={16} />
            </Tappable>
          ) : null}
        </View>

        {emptySaved ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons color={palette.carbonInk} name="bookmark-outline" size={36} />
              <View style={styles.emptySpark}><Ionicons color={palette.goldenSun} name="sunny" size={19} /></View>
            </View>
            <AppText accessibilityRole="header" style={styles.emptyTitle}>Nothing saved yet</AppText>
            <AppText style={styles.emptyCopy}>Save places, stories, experiences{'\n'}and food as you explore the world.{'\n'}They’ll appear here.</AppText>
            <Tappable accessibilityLabel="Start exploring" accessibilityRole="button" onPress={onExplore} style={styles.exploreButton}>
              <AppText style={styles.exploreButtonText}>Start exploring</AppText>
            </Tappable>
          </View>
        ) : visibleEntries.length === 0 ? (
          <View style={styles.noResults}>
            <AppText style={styles.noResultsTitle}>No {activeFilter.toLowerCase()} saved yet</AppText>
            <AppText style={styles.noResultsCopy}>Saved {activeFilter.toLowerCase()} will appear here.</AppText>
          </View>
        ) : (
          <View accessibilityLabel="Saved items" style={[styles.cards, !isAll && styles.cardsGrid]}>
            {visibleEntries.map((entry) => (
              <View key={`${entry.record.subjectType}-${entry.record.subjectId}`} style={[styles.card, !isAll && styles.gridCard, !isAll ? { width: Math.floor((cardWidth - spacing.sm) / 2) } : { width: cardWidth }]}>
                <Tappable accessibilityLabel={`Open ${entry.title}, ${entry.country}`} accessibilityRole="link" onPress={entry.onOpen} style={[styles.cardOpen, !isAll && styles.gridCardOpen]}>
                  {entry.image ? <ExpoImage accessible={false} contentFit="cover" source={entry.image} style={StyleSheet.absoluteFill} transition={reduceMotion ? 0 : 180} /> : null}
                  <LinearGradient colors={['rgba(3,26,47,0.02)', 'rgba(3,26,47,0.18)', 'rgba(3,26,47,0.84)']} locations={[0.08, 0.52, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
                  <View style={styles.cardCopy}>
                    <AppText style={styles.categoryBadge}>{categoryLabels[entry.category]}</AppText>
                    <AppText numberOfLines={2} style={styles.cardTitle}>{entry.title}</AppText>
                    <AppText numberOfLines={1} style={styles.cardLocation}>{entry.country}</AppText>
                  </View>
                  <Ionicons color={palette.cloudWhite} name="arrow-forward" size={19} style={styles.cardArrow} />
                </Tappable>
                <Tappable accessibilityLabel={`Remove ${entry.title} from Saved`} accessibilityRole="button" accessibilityState={{ checked: entry.record.status === 'saved' }} onPress={() => remove(entry.record.subjectId)} style={styles.bookmarkButton}>
                  <Ionicons color={palette.sunsetVermilion} name={entry.record.status === 'saved' ? 'bookmark' : 'bookmark-outline'} size={18} />
                </Tappable>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { marginHorizontal: -spacing.lg, marginTop: -spacing.xl, paddingBottom: spacing.xl },
  hero: { height: 222, justifyContent: 'space-between', overflow: 'hidden', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, position: 'relative' },
  brand: { alignSelf: 'center', color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 16, marginTop: spacing.sm },
  heroCopy: { paddingBottom: spacing.md },
  title: { color: palette.carbonInk, fontFamily: fontFamilies.editorialBold, fontSize: 38, lineHeight: 45 },
  subtitle: { color: palette.carbonInk, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
  filterRail: { alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  filterChip: { alignItems: 'center', backgroundColor: 'rgba(255,253,248,0.7)', borderColor: 'rgba(32,36,44,0.12)', borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center', minHeight: 36, paddingHorizontal: spacing.md },
  filterChipSelected: { backgroundColor: palette.carbonInk, borderColor: palette.carbonInk },
  filterText: { color: palette.carbonInk, fontSize: 12 },
  filterTextSelected: { color: palette.cloudWhite, fontFamily: fontFamilies.uiSemibold },
  listHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 44, paddingHorizontal: spacing.lg },
  count: { color: palette.carbonInk, fontSize: 12, fontWeight: '500' },
  sortControl: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 44, paddingLeft: spacing.sm },
  sortLabel: { color: palette.carbonInk, fontSize: 12 },
  sortValue: { color: palette.carbonInk, fontSize: 12, fontWeight: '600' },
  cards: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.xs },
  cardsGrid: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: { borderRadius: radius.md, height: 132, overflow: 'hidden', position: 'relative' },
  gridCard: { height: 190 },
  cardOpen: { backgroundColor: palette.oceanBlue, flex: 1, justifyContent: 'flex-end', minHeight: 48, overflow: 'hidden', position: 'relative' },
  gridCardOpen: { minHeight: 48 },
  cardCopy: { gap: 3, paddingBottom: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.xl },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(32,36,44,0.55)', borderColor: 'rgba(255,253,248,0.82)', borderRadius: radius.pill, borderWidth: 1, color: palette.cloudWhite, fontSize: 10, lineHeight: 14, overflow: 'hidden', paddingHorizontal: spacing.sm },
  cardTitle: { color: palette.cloudWhite, fontSize: 15, fontWeight: '700', lineHeight: 18, paddingRight: 40 },
  cardLocation: { color: palette.cloudWhite, fontSize: 12, lineHeight: 16, paddingRight: 40 },
  cardArrow: { bottom: spacing.md, position: 'absolute', right: spacing.md },
  bookmarkButton: { alignItems: 'center', backgroundColor: palette.cloudWhite, borderRadius: radius.pill, height: 36, justifyContent: 'center', position: 'absolute', right: spacing.sm, top: spacing.sm, width: 36 },
  emptyState: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 360, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  emptyIcon: { alignItems: 'center', height: 82, justifyContent: 'center', marginBottom: spacing.md, position: 'relative', width: 82 },
  emptySpark: { position: 'absolute', right: 8, top: 1 },
  emptyTitle: { color: palette.carbonInk, fontSize: 20, fontWeight: '700', marginBottom: spacing.sm, textAlign: 'center' },
  emptyCopy: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  exploreButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.primaryAction, borderRadius: radius.pill, justifyContent: 'center', marginTop: spacing.xl, minHeight: 50, paddingHorizontal: spacing.xl, width: '72%' },
  exploreButtonText: { color: palette.cloudWhite, fontSize: 14, fontWeight: '700' },
  noResults: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  noResultsTitle: { color: palette.carbonInk, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  noResultsCopy: { color: colors.textSecondary, fontSize: 13, marginTop: spacing.xs, textAlign: 'center' },
});
