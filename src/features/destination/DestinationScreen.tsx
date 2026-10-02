import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, ContentImage, ErrorState, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS, type DiscoveryLayer } from '@/content/vocabularies';
import { usePassportStore } from '@/state/passportStore';
import { useSavedStore } from '@/state/savedStore';
import { colors, discoveryLayerColors, elevation, palette, radius, spacing } from '@/tokens';
import type { Destination, DiscoveryItem } from '@/types';

interface Props { destination?: Destination; items: readonly DiscoveryItem[]; onBack: () => void; onOpenCredits: (id: string) => void; onOpenItem: (id: string) => void; onOpenLayer: (layer: DiscoveryLayer) => void }
const layerNames: Record<DiscoveryLayer, string> = { iconic: 'Iconic', hidden: 'Hidden', culture: 'Culture', taste: 'Taste', nature: 'Nature' };

export function DestinationScreen({ destination, items, onBack, onOpenCredits, onOpenItem, onOpenLayer }: Props) {
  const destinationId = destination?.id;
  const savedRecord = useSavedStore((state) => state.records.find((record) => record.subjectId === destinationId));
  const setStatus = useSavedStore((state) => state.setStatus);
  const remove = useSavedStore((state) => state.remove);
  const visited = usePassportStore((state) => state.visitedRecords.some((record) => record.destinationId === destinationId));
  const markVisited = usePassportStore((state) => state.markVisited);
  if (!destination) return <ScreenContainer><ErrorState actionLabel="Go back" message="This destination is not part of the approved content set." onAction={onBack} title="Destination unavailable" /></ScreenContainer>;
  const hero = getImageById(destination.heroImageId);
  const destinationItems = items.filter((item) => item.destinationId === destination.id);
  const isSaved = savedRecord?.status === 'saved';
  const isWantToGo = savedRecord?.status === 'wantToGo';

  return <ScreenContainer>
    <View style={styles.hero}>{hero ? <ContentImage height={500} image={hero} style={styles.heroImage} /> : null}<View pointerEvents="none" style={styles.shade} /><View style={styles.heroActions}><Tappable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.floating}><Ionicons color={palette.softMist} name="arrow-back" size={24} /></Tappable><Tappable accessibilityLabel={isSaved ? `Remove ${destination.name} from Saved from hero` : `Save ${destination.name} from hero`} accessibilityRole="button" onPress={() => isSaved ? remove(destination.id) : setStatus(destination.id, 'destination', 'saved')} style={styles.floating}><Ionicons color={isSaved ? palette.sunsetCoral : palette.softMist} name={isSaved ? 'heart' : 'heart-outline'} size={24} /></Tappable></View></View>

    <View style={styles.sheet}>
      <View style={styles.handle} /><AppText typographyRole="caption" style={styles.eyebrow}>{destination.country} · {destination.continent}</AppText><AppText accessibilityRole="header" typographyRole="display">{destination.name}</AppText><AppText style={styles.description}>{destination.culturalOverview}</AppText>
      <ScrollView horizontal contentContainerStyle={styles.layerButtons} showsHorizontalScrollIndicator={false}>{DISCOVERY_LAYERS.map((layer) => <Tappable key={layer} accessibilityLabel={`Open ${layerNames[layer]} Layer`} accessibilityRole="link" onPress={() => onOpenLayer(layer)} style={styles.layerButton}><View style={[styles.layerDot, { backgroundColor: discoveryLayerColors[layer] }]}><Ionicons color={palette.carbonInk} name={layer === 'taste' ? 'restaurant-outline' : layer === 'nature' ? 'leaf-outline' : layer === 'culture' ? 'people-outline' : layer === 'hidden' ? 'key-outline' : 'sparkles-outline'} size={20} /></View><AppText typographyRole="caption">{layerNames[layer]}</AppText></Tappable>)}</ScrollView>

      <View style={styles.why}><AppText accessibilityRole="header" typographyRole="heading">Why it stays with you</AppText><View style={styles.insights}><Insight icon="eye-outline" label="View" value={destination.interestTags.includes('photography') ? 'A place made for looking twice' : 'Layers revealed slowly'} /><Insight icon="restaurant-outline" label="Flavor" value="Foodways shaped by place" /><Insight icon="heart-outline" label="Memory" value="Stories beyond the postcard" /></View></View>

      <View style={styles.actionRow}><Tappable accessibilityLabel={`Mark ${destination.name} Want to Go`} accessibilityRole="button" onPress={() => setStatus(destination.id, 'destination', 'wantToGo')} style={styles.want}><Ionicons color={colors.primaryActionText} name={isWantToGo ? 'checkmark' : 'heart-outline'} size={21} /><AppText typographyRole="label" style={styles.actionText}>{isWantToGo ? 'Want to Go' : 'Want to Go'}</AppText></Tappable><Tappable accessibilityLabel={isSaved ? `Remove ${destination.name} from Saved` : `Save ${destination.name}`} accessibilityRole="button" onPress={() => isSaved ? remove(destination.id) : setStatus(destination.id, 'destination', 'saved')} style={styles.save}><Ionicons color={colors.textPrimary} name={isSaved ? 'bookmark' : 'bookmark-outline'} size={21} /><AppText typographyRole="label">{isSaved ? 'Saved' : 'Save'}</AppText></Tappable></View>
      <Tappable accessibilityLabel={visited ? `${destination.name} marked visited` : `Mark ${destination.name} visited`} accessibilityRole="button" onPress={() => { if (!visited) markVisited(destination.id); }} style={styles.visited}><Ionicons color={colors.primaryAction} name={visited ? 'checkmark-circle' : 'checkmark-circle-outline'} size={22} /><AppText typographyRole="label">{visited ? 'Visited in Passport' : 'Mark visited in Passport'}</AppText></Tappable>
      {hero ? <Tappable accessibilityLabel={`View ${destination.name} hero image credits`} accessibilityRole="link" onPress={() => onOpenCredits(hero.id)} style={styles.credit}><AppText typographyRole="caption">Hero image credits →</AppText></Tappable> : null}

      <View style={styles.experiencesHeader}><AppText accessibilityRole="header" typographyRole="heading">Top experiences</AppText><AppText style={styles.secondary}>One carefully chosen story from every layer.</AppText></View>
      <View style={styles.experiences}>{DISCOVERY_LAYERS.map((layer) => destinationItems.filter((item) => item.layer === layer).map((item) => { const image = getImageById(item.imageIds[0]); return <Tappable key={item.id} accessibilityLabel={`Open ${item.name}`} accessibilityRole="link" onPress={() => onOpenItem(item.id)} style={styles.row}>{image ? <ContentImage height={118} image={image} style={styles.thumbnail} /> : null}<View style={styles.copy}><LayerLabel layer={item.layer} /><AppText typographyRole="subheading">{item.name}</AppText><AppText numberOfLines={2} style={styles.secondary}>{item.description}</AppText></View><Ionicons color={colors.textPrimary} name="chevron-forward" size={21} /></Tappable>; }))}</View>
    </View>
  </ScreenContainer>;
}

function Insight({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.insight}><Ionicons color={colors.primaryAction} name={icon} size={24} /><AppText typographyRole="label">{label}</AppText><AppText typographyRole="caption" style={styles.secondary}>{value}</AppText></View>; }

const styles = StyleSheet.create({
  hero: { backgroundColor: palette.oceanBlue, borderRadius: radius.lg, height: 500, overflow: 'hidden', position: 'relative' }, heroImage: { borderRadius: radius.none }, shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9, 42, 58, 0.22)' }, heroActions: { flexDirection: 'row', justifyContent: 'space-between', left: spacing.md, position: 'absolute', right: spacing.md, top: spacing.md }, floating: { alignItems: 'center', backgroundColor: 'rgba(11, 40, 53, 0.7)', borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48 },
  sheet: { backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.md, marginTop: -44, padding: spacing.lg, position: 'relative', ...elevation.overlay }, handle: { alignSelf: 'center', backgroundColor: colors.disabledSurface, borderRadius: radius.pill, height: 5, width: 48 }, eyebrow: { color: colors.brand, textTransform: 'uppercase' }, description: { maxWidth: 760 }, secondary: { color: colors.textSecondary, opacity: 0.72 },
  layerButtons: { gap: spacing.md, paddingVertical: spacing.sm }, layerButton: { alignItems: 'center', gap: spacing.xs, minHeight: 72, minWidth: 62 }, layerDot: { alignItems: 'center', borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48 }, why: { gap: spacing.md, marginTop: spacing.md }, insights: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, insight: { backgroundColor: colors.background, borderRadius: radius.md, flex: 1, gap: spacing.xs, minWidth: 145, padding: spacing.md },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }, want: { alignItems: 'center', backgroundColor: colors.primaryAction, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg }, actionText: { color: colors.primaryActionText }, save: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg }, visited: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: spacing.sm, minHeight: 48, paddingHorizontal: spacing.sm }, credit: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.sm },
  experiencesHeader: { gap: spacing.xs, marginTop: spacing.lg }, experiences: { gap: spacing.md, paddingBottom: spacing.xl }, row: { alignItems: 'center', backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, flexDirection: 'row', gap: spacing.md, minHeight: 142, padding: spacing.sm, ...elevation.raised }, thumbnail: { borderRadius: radius.md, flexBasis: 120, maxWidth: 120 }, copy: { flex: 1, gap: spacing.xs },
});
