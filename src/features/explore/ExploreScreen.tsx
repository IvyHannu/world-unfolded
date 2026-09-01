import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText, Chip, ContentImage, EmptyState, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { destinations, discoveryItems } from '@/content/contentIndex';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS, INTEREST_TAGS, type DiscoveryLayer, type InterestTag } from '@/content/vocabularies';
import { searchAndFilterContent, type ExploreFilters } from '@/search/discoverySearch';
import { colors, radius, spacing, typography } from '@/tokens';

interface ExploreScreenProps { onOpenDestination: (id: string) => void; onOpenItem: (id: string) => void }

const regionNames: Record<string, string> = { southern_africa: 'Southern Africa' };
const display = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function ExploreScreen({ onOpenDestination, onOpenItem }: ExploreScreenProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ExploreFilters>({});
  const results = useMemo(() => searchAndFilterContent(destinations, discoveryItems, query, filters), [filters, query]);
  const update = <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) => setFilters((current) => ({ ...current, [key]: current[key] === value ? undefined : value }));
  const clearAll = () => { setQuery(''); setFilters({}); };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <AppText accessibilityRole="header" typographyRole="display">Explore</AppText>
        <AppText style={styles.secondary}>Search destinations and discoveries, then narrow them through one combined filter system.</AppText>
      </View>
      <TextInput
        accessibilityLabel="Search destinations and discovery items"
        onChangeText={setQuery}
        placeholder="Search Cape Town, Boulders Beach…"
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        style={styles.search}
        value={query}
      />

      <FilterGroup label="Continent"><Chip label="Africa" onPress={() => update('continent', 'Africa')} selected={filters.continent === 'Africa'} /></FilterGroup>
      <FilterGroup label="Country"><Chip label="South Africa" onPress={() => update('country', 'South Africa')} selected={filters.country === 'South Africa'} /></FilterGroup>
      <FilterGroup label="Region"><Chip label={regionNames.southern_africa} onPress={() => update('region', 'southern_africa')} selected={filters.region === 'southern_africa'} /></FilterGroup>
      <FilterGroup label="Discovery layer">
        {DISCOVERY_LAYERS.map((layer) => <Chip key={layer} label={display(layer)} onPress={() => update('layer', layer as DiscoveryLayer)} selected={filters.layer === layer} />)}
      </FilterGroup>
      <FilterGroup label="Interest">
        {INTEREST_TAGS.map((interest) => <Chip key={interest} label={display(interest)} onPress={() => update('interest', interest as InterestTag)} selected={filters.interest === interest} />)}
      </FilterGroup>

      <View style={styles.resultHeader}>
        <AppText accessibilityRole="header" typographyRole="subheading">{results.length} {results.length === 1 ? 'result' : 'results'}</AppText>
        <Tappable accessibilityLabel="Clear search and filters" accessibilityRole="button" onPress={clearAll} style={styles.clear}><AppText typographyRole="label">Clear all</AppText></Tappable>
      </View>

      {results.length === 0 ? <EmptyState actionLabel="Clear search and filters" message="Try a different name or remove one of the active filters." onAction={clearAll} title="No matching discoveries" /> : results.map((result) => {
        const item = result.kind === 'item' ? result.item : undefined;
        const image = getImageById(item ? item.imageIds[0] : result.destination.heroImageId);
        const label = item?.name ?? result.destination.name;
        return (
          <Tappable key={`${result.kind}-${label}`} accessibilityLabel={`Open ${label}`} accessibilityRole="link" onPress={() => item ? onOpenItem(item.id) : onOpenDestination(result.destination.id)} style={styles.result}>
            {image ? <ContentImage height={150} image={image} style={styles.resultImage} /> : null}
            <View style={styles.resultCopy}>
              {item ? <LayerLabel layer={item.layer} /> : <AppText typographyRole="caption">Destination</AppText>}
              <AppText typographyRole="subheading">{label}</AppText>
              <AppText style={styles.secondary}>{result.destination.country}</AppText>
            </View>
          </Tappable>
        );
      })}
    </ScreenContainer>
  );
}

function FilterGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return <View style={styles.filterGroup}><AppText typographyRole="label">{label}</AppText><ScrollView horizontal contentContainerStyle={styles.chips} showsHorizontalScrollIndicator={false}>{children}</ScrollView></View>;
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginBottom: spacing.lg },
  secondary: { color: colors.textSecondary },
  search: { ...typography.default.body, backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 2, color: colors.textPrimary, minHeight: 52, paddingHorizontal: spacing.md },
  filterGroup: { gap: spacing.sm, marginTop: spacing.lg },
  chips: { gap: spacing.sm },
  resultHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md, marginTop: spacing['2xl'] },
  clear: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
  result: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.md },
  resultImage: { borderRadius: radius.md, flexBasis: 190, maxWidth: 190 },
  resultCopy: { flex: 1, gap: spacing.xs },
});
