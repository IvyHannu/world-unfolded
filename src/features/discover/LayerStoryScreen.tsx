import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, ContentImage, ErrorState, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { discoveryItems } from '@/content/contentIndex';
import { getDestinationById, getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS, type DiscoveryLayer } from '@/content/vocabularies';
import { colors, discoveryLayerColors, elevation, palette, radius, spacing } from '@/tokens';

const copy: Record<DiscoveryLayer, { title: string; subtitle: string; note: string }> = {
  iconic: { title: 'Iconic Layer', subtitle: 'Look again at the places everyone recognises.', note: 'A landmark becomes memorable when its human story matters as much as its silhouette.' },
  hidden: { title: 'Hidden Layer', subtitle: 'Follow quieter paths into the character of a place.', note: 'Hidden does not mean secret. It means slowing down enough to notice what a quick visit might miss.' },
  culture: { title: 'Culture Layer', subtitle: 'Meet living traditions, shared rituals, and local memory.', note: 'Culture is not scenery. These stories point toward practices and communities that continue to shape everyday life.' },
  taste: { title: 'Taste Layer', subtitle: 'Understand a destination through its kitchens and tables.', note: 'Food carries migration, season, work, celebration, and family memory in every destination.' },
  nature: { title: 'Nature Layer', subtitle: 'See how landscape and local life shape one another.', note: 'Nature is more than a view: it influences movement, livelihoods, traditions, and the rhythm of a place.' },
};

export function LayerStoryScreen({ destinationId, layer, onBack, onOpenItem }: { destinationId?: string; layer?: string; onBack: () => void; onOpenItem: (id: string) => void }) {
  if (!DISCOVERY_LAYERS.includes(layer as DiscoveryLayer)) return <ScreenContainer><ErrorState actionLabel="Go back" message="This discovery layer is not available." onAction={onBack} title="Layer unavailable" /></ScreenContainer>;
  const activeLayer = layer as DiscoveryLayer;
  const detail = copy[activeLayer];
  const destination = destinationId ? getDestinationById(destinationId) : undefined;
  const items = discoveryItems.filter((item) => item.layer === activeLayer && (!destinationId || item.destinationId === destinationId)).slice(0, 5);
  if (items.length === 0) return <ScreenContainer><ErrorState actionLabel="Go back" message={`${destination ? destination.name : 'This destination'} has no story in the ${detail.title} yet.`} onAction={onBack} title="No stories in this layer" /></ScreenContainer>;
  const hero = getImageById(items[0].imageIds[0]);
  return <ScreenContainer>
    <View style={styles.hero}>{hero ? <ContentImage height={390} image={hero} style={styles.heroImage} /> : null}<View pointerEvents="none" style={styles.shade} /><Tappable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.back}><Ionicons color={palette.softMist} name="arrow-back" size={24} /></Tappable><View style={styles.heroCopy}><View style={[styles.accent, { backgroundColor: discoveryLayerColors[activeLayer] }]} /><AppText accessibilityRole="header" typographyRole="display" style={styles.heroTitle}>{detail.title}</AppText><AppText style={styles.heroSubtitle}>{detail.subtitle}</AppText></View></View>
    <View style={styles.story}><AppText accessibilityRole="header" typographyRole="heading">Stories through this layer</AppText><AppText style={styles.secondary}>{destination ? `${destination.name} through the ${detail.title}.` : 'A cross-destination edit from the current World Unfolded collection.'}</AppText></View>
    <View style={styles.list}>{items.map((item) => { const image = getImageById(item.imageIds[0]); return <Tappable key={item.id} accessibilityLabel={`Open ${item.name}`} accessibilityRole="link" onPress={() => onOpenItem(item.id)} style={styles.row}>{image ? <ContentImage height={112} image={image} style={styles.thumbnail} /> : null}<View style={styles.copy}><LayerLabel layer={item.layer} /><AppText typographyRole="subheading">{item.name}</AppText><AppText numberOfLines={2} style={styles.secondary}>{item.description}</AppText></View><Ionicons color={colors.textPrimary} name="chevron-forward" size={21} /></Tappable>; })}</View>
    <View style={[styles.note, { borderTopColor: discoveryLayerColors[activeLayer] }]}><Ionicons color={discoveryLayerColors[activeLayer]} name="journal-outline" size={28} /><View style={styles.copy}><AppText typographyRole="subheading">A note from the journal</AppText><AppText style={styles.secondary}>{detail.note}</AppText></View></View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: palette.oceanBlue, borderRadius: radius.lg, height: 390, marginBottom: spacing['2xl'], overflow: 'hidden', position: 'relative' }, heroImage: { borderRadius: radius.none }, shade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9, 42, 58, 0.5)' }, back: { alignItems: 'center', backgroundColor: 'rgba(11, 40, 53, 0.68)', borderRadius: radius.pill, height: 48, justifyContent: 'center', left: spacing.md, position: 'absolute', top: spacing.md, width: 48 },
  heroCopy: { bottom: spacing.lg, gap: spacing.sm, left: spacing.lg, position: 'absolute', right: spacing.lg }, accent: { borderRadius: radius.pill, height: 7, width: 64 }, heroTitle: { color: palette.softMist }, heroSubtitle: { color: palette.softMist, opacity: 0.9 }, story: { gap: spacing.xs, marginBottom: spacing.lg }, secondary: { color: colors.textSecondary, opacity: 0.72 }, list: { gap: spacing.md }, row: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, flexDirection: 'row', gap: spacing.md, minHeight: 136, padding: spacing.sm, ...elevation.raised }, thumbnail: { borderRadius: radius.md, flexBasis: 112, maxWidth: 112 }, copy: { flex: 1, gap: spacing.xs }, note: { alignItems: 'flex-start', backgroundColor: colors.surface, borderRadius: radius.lg, borderTopWidth: 6, flexDirection: 'row', gap: spacing.md, marginBottom: spacing['2xl'], marginTop: spacing.xl, padding: spacing.lg, ...elevation.raised },
});
