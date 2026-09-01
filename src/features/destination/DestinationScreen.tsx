import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, ContentImage, ErrorState, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS } from '@/content/vocabularies';
import { usePassportStore } from '@/state/passportStore';
import { useSavedStore } from '@/state/savedStore';
import { colors, elevation, radius, spacing } from '@/tokens';
import type { Destination, DiscoveryItem } from '@/types';

interface DestinationScreenProps { destination?: Destination; items: readonly DiscoveryItem[]; onBack: () => void; onOpenCredits: (id: string) => void; onOpenItem: (id: string) => void }

export function DestinationScreen({ destination, items, onBack, onOpenCredits, onOpenItem }: DestinationScreenProps) {
  const destinationId = destination?.id;
  const savedRecord = useSavedStore((state) => state.records.find((record) => record.subjectId === destinationId));
  const setSavedStatus = useSavedStore((state) => state.setStatus);
  const removeSaved = useSavedStore((state) => state.remove);
  const visited = usePassportStore((state) => state.visitedRecords.some((record) => record.destinationId === destinationId));
  const markVisited = usePassportStore((state) => state.markVisited);
  if (!destination) return <ScreenContainer><ErrorState actionLabel="Go back" message="This destination is not part of the approved content set." onAction={onBack} title="Destination unavailable" /></ScreenContainer>;
  const hero = getImageById(destination.heroImageId);
  const destinationItems = items.filter((item) => item.destinationId === destination.id);
  const saved = Boolean(savedRecord);

  return <ScreenContainer>
    <View style={styles.heroWrap}>
      {hero ? <ContentImage height={480} image={hero} /> : null}
      <View style={styles.heroActions}>
        <Tappable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.floatingButton}><Ionicons color={colors.textPrimary} name="arrow-back" size={24} /></Tappable>
        <Tappable accessibilityLabel={saved ? `Remove ${destination.name} from Saved` : `Save ${destination.name}`} accessibilityRole="button" onPress={() => saved ? removeSaved(destination.id) : setSavedStatus(destination.id, 'destination', 'saved')} style={styles.floatingButton}><Ionicons color={saved ? colors.brand : colors.textPrimary} name={saved ? 'heart' : 'heart-outline'} size={24} /></Tappable>
      </View>
    </View>

    <View style={styles.panel}>
      <View style={styles.handle} />
      <AppText typographyRole="caption" style={styles.eyebrow}>{destination.country} · {destination.continent}</AppText>
      <AppText accessibilityRole="header" typographyRole="display">{destination.name}</AppText>
      <AppText style={styles.description}>{destination.culturalOverview}</AppText>
      <View accessibilityLabel={`${destination.name} information`} style={styles.infoRow}>
        <Info icon="layers-outline" label="Discovery layers" value="5" />
        <Info icon="sparkles-outline" label="Top experiences" value={`${destinationItems.length}`} />
        <Info icon="location-outline" label="Region" value={destination.region.replaceAll('_', ' ')} />
      </View>
      <View style={styles.primaryActions}>
        <Tappable accessibilityLabel={`Mark ${destination.name} Want to Go`} accessibilityRole="button" onPress={() => setSavedStatus(destination.id, 'destination', 'wantToGo')} style={styles.wantButton}><Ionicons color={colors.primaryActionText} name={savedRecord?.status === 'wantToGo' ? 'heart' : 'heart-outline'} size={21} /><AppText typographyRole="label" style={styles.wantText}>{savedRecord?.status === 'wantToGo' ? 'Want to Go' : 'Add to Want to Go'}</AppText></Tappable>
        <Tappable accessibilityLabel={visited ? `${destination.name} marked visited` : `Mark ${destination.name} visited`} accessibilityRole="button" onPress={() => markVisited(destination.id)} style={styles.visitedButton}><Ionicons color={colors.primaryAction} name={visited ? 'checkmark-circle' : 'checkmark-circle-outline'} size={22} /><AppText typographyRole="label">{visited ? 'Visited' : 'Mark visited'}</AppText></Tappable>
      </View>
      {hero ? <Tappable accessibilityLabel={`View ${destination.name} hero image credits`} accessibilityRole="link" onPress={() => onOpenCredits(hero.id)} style={styles.credit}><AppText typographyRole="caption">Hero image credits →</AppText></Tappable> : null}

      <View style={styles.experiencesHeader}><AppText accessibilityRole="header" typographyRole="heading">Top experiences</AppText><AppText style={styles.secondary}>One carefully chosen story from every layer.</AppText></View>
      {DISCOVERY_LAYERS.map((layer) => destinationItems.filter((item) => item.layer === layer).map((item) => {
        const image = getImageById(item.imageIds[0]);
        return <Tappable key={item.id} accessibilityLabel={`Open ${item.name}`} accessibilityRole="link" onPress={() => onOpenItem(item.id)} style={styles.experienceRow}>
          {image ? <ContentImage height={118} image={image} style={styles.thumbnail} /> : null}
          <View style={styles.experienceCopy}><LayerLabel layer={item.layer} /><AppText typographyRole="subheading">{item.name}</AppText><AppText numberOfLines={2} style={styles.secondary}>{item.description}</AppText></View>
          <Ionicons color={colors.textPrimary} name="chevron-forward" size={21} />
        </Tappable>;
      }))}
    </View>
  </ScreenContainer>;
}

function Info({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { return <View style={styles.info}><Ionicons color={colors.primaryAction} name={icon} size={22} /><AppText typographyRole="label">{value}</AppText><AppText typographyRole="caption" style={styles.secondary}>{label}</AppText></View>; }

const styles = StyleSheet.create({
  heroWrap: { position: 'relative' },
  heroActions: { flexDirection: 'row', justifyContent: 'space-between', left: spacing.md, position: 'absolute', right: spacing.md, top: spacing.md },
  floatingButton: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48, ...elevation.overlay },
  panel: { backgroundColor: colors.surface, borderRadius: radius.lg, gap: spacing.md, marginTop: -42, padding: spacing.lg, position: 'relative', ...elevation.overlay },
  handle: { alignSelf: 'center', backgroundColor: colors.disabledSurface, borderRadius: radius.pill, height: 5, width: 48 },
  eyebrow: { color: colors.brand, textTransform: 'uppercase' },
  description: { maxWidth: 760 },
  secondary: { color: colors.textSecondary, opacity: 0.72 },
  infoRow: { backgroundColor: colors.background, borderRadius: radius.lg, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  info: { alignItems: 'center', flex: 1, gap: spacing.xs, minWidth: 80 },
  primaryActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  wantButton: { alignItems: 'center', backgroundColor: colors.brand, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg },
  wantText: { color: colors.primaryActionText },
  visitedButton: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg },
  credit: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.sm },
  experiencesHeader: { gap: spacing.xs, marginTop: spacing.lg },
  experienceRow: { alignItems: 'center', backgroundColor: colors.surfaceElevated, borderRadius: radius.lg, flexDirection: 'row', gap: spacing.md, minHeight: 142, padding: spacing.sm, ...elevation.raised },
  thumbnail: { borderRadius: radius.md, flexBasis: 120, maxWidth: 120 },
  experienceCopy: { flex: 1, gap: spacing.xs },
});
