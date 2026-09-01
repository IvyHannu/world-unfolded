import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText, Chip, ContentImage, EmptyState, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { destinations, discoveryItems } from '@/content/contentIndex';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS, INTEREST_TAGS, REGIONS, type DiscoveryLayer, type InterestTag, type Region } from '@/content/vocabularies';
import { searchAndFilterContent, type ExploreFilters } from '@/search/discoverySearch';
import { colors, elevation, radius, spacing, typography } from '@/tokens';

interface ExploreScreenProps { onOpenDestination: (id: string) => void; onOpenItem: (id: string) => void }
const display = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const continents = [...new Set(destinations.map(({ continent }) => continent))];
const countries = destinations.map(({ country }) => country);

export function ExploreScreen({ onOpenDestination, onOpenItem }: ExploreScreenProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ExploreFilters>({});
  const results = useMemo(() => searchAndFilterContent(destinations, discoveryItems, query, filters), [filters, query]);
  const update = <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) => setFilters((current) => ({ ...current, [key]: current[key] === value ? undefined : value }));
  const clearAll = () => { setQuery(''); setFilters({}); };

  return <ScreenContainer>
    <View style={styles.header}><AppText accessibilityRole="header" typographyRole="display">Where will curiosity take you?</AppText><AppText style={styles.secondary}>Search all seven destinations and 35 discoveries.</AppText></View>
    <View style={styles.floatingSearch}><TextInput accessibilityLabel="Search destinations and discovery items" onChangeText={setQuery} placeholder="Search Bali, samba, temples…" placeholderTextColor={colors.textSecondary} returnKeyType="search" style={styles.search} value={query} /></View>
    <FilterGroup label="Continent">{continents.map((value) => <Chip key={value} label={value} onPress={() => update('continent', value)} selected={filters.continent === value} />)}</FilterGroup>
    <FilterGroup label="Country">{countries.map((value) => <Chip key={value} label={value} onPress={() => update('country', value)} selected={filters.country === value} />)}</FilterGroup>
    <FilterGroup label="Region">{REGIONS.map((value) => <Chip key={value} label={display(value)} onPress={() => update('region', value as Region)} selected={filters.region === value} />)}</FilterGroup>
    <FilterGroup label="Discovery layer">{DISCOVERY_LAYERS.map((value) => <Chip key={value} label={display(value)} onPress={() => update('layer', value as DiscoveryLayer)} selected={filters.layer === value} />)}</FilterGroup>
    <FilterGroup label="Interest">{INTEREST_TAGS.map((value) => <Chip key={value} label={display(value)} onPress={() => update('interest', value as InterestTag)} selected={filters.interest === value} />)}</FilterGroup>
    <View style={styles.resultHeader}><AppText accessibilityRole="header" typographyRole="subheading">{results.length} {results.length === 1 ? 'result' : 'results'}</AppText><Tappable accessibilityLabel="Clear search and filters" accessibilityRole="button" onPress={clearAll} style={styles.clear}><AppText typographyRole="label">Clear all</AppText></Tappable></View>
    {results.length === 0 ? <EmptyState actionLabel="Clear search and filters" message="Try another name or remove an active filter." onAction={clearAll} title="No matching discoveries" /> : results.map((result) => {
      const item = result.kind === 'item' ? result.item : undefined;
      const image = getImageById(item ? item.imageIds[0] : result.destination.heroImageId);
      const label = item?.name ?? result.destination.name;
      return <Tappable key={`${result.kind}-${item?.id ?? result.destination.id}`} accessibilityLabel={`Open ${label}`} accessibilityRole="link" onPress={() => item ? onOpenItem(item.id) : onOpenDestination(result.destination.id)} style={styles.result}>
        {image ? <ContentImage height={180} image={image} style={styles.resultImage} /> : null}
        <View style={styles.resultCopy}>{item ? <LayerLabel layer={item.layer} /> : <AppText typographyRole="caption">Destination</AppText>}<AppText typographyRole="subheading">{label}</AppText><AppText style={styles.secondary}>{result.destination.country}</AppText></View>
      </Tappable>;
    })}
  </ScreenContainer>;
}

function FilterGroup({ children, label }: { children: React.ReactNode; label: string }) { return <View style={styles.filterGroup}><AppText typographyRole="label">{label}</AppText><ScrollView horizontal contentContainerStyle={styles.chips} showsHorizontalScrollIndicator={false}>{children}</ScrollView></View>; }

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginBottom: spacing.lg },
  secondary: { color: colors.textSecondary, opacity: 0.78 },
  floatingSearch: { backgroundColor: colors.surface, borderRadius: radius.pill, ...elevation.overlay },
  search: { ...typography.default.body, color: colors.textPrimary, minHeight: 56, paddingHorizontal: spacing.lg },
  filterGroup: { gap: spacing.sm, marginTop: spacing.lg },
  chips: { gap: spacing.sm },
  resultHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md, marginTop: spacing['2xl'] },
  clear: { alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.sm },
  result: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md, overflow: 'hidden', padding: spacing.sm, ...elevation.raised },
  resultImage: { borderRadius: radius.md, flexBasis: 210, maxWidth: 210 },
  resultCopy: { flex: 1, gap: spacing.xs, padding: spacing.sm },
});
