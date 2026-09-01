import { StyleSheet, View } from 'react-native';

import { AppText, Chip, ContentImage, ErrorState, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { getImageById } from '@/content/selectors';
import { DISCOVERY_LAYERS } from '@/content/vocabularies';
import type { Destination, DiscoveryItem } from '@/types';
import { colors, discoveryLayerColors, radius, spacing } from '@/tokens';
import { usePassportStore } from '@/state/passportStore';
import { useSavedStore } from '@/state/savedStore';

interface DestinationScreenProps { destination?: Destination; items: readonly DiscoveryItem[]; onBack: () => void; onOpenCredits: (id: string) => void; onOpenItem: (id: string) => void }

export function DestinationScreen({ destination, items, onBack, onOpenCredits, onOpenItem }: DestinationScreenProps) {
  const destinationId = destination?.id;
  const savedRecord = useSavedStore((state) => state.records.find((record) => record.subjectId === destinationId));
  const setSavedStatus = useSavedStore((state) => state.setStatus);
  const visited = usePassportStore((state) => state.visitedRecords.some((record) => record.destinationId === destinationId));
  const markVisited = usePassportStore((state) => state.markVisited);
  if (!destination) return <ScreenContainer><ErrorState actionLabel="Go back" message="This destination is not part of the approved content set." onAction={onBack} title="Destination unavailable" /></ScreenContainer>;
  const hero = getImageById(destination.heroImageId);
  return (
    <ScreenContainer>
      {hero ? <ContentImage height={420} image={hero} /> : null}
      <View style={styles.heroCopy}>
        <AppText typographyRole="caption" style={styles.eyebrow}>{destination.country} · {destination.continent}</AppText>
        <AppText accessibilityRole="header" typographyRole="display">{destination.name}</AppText>
        {hero ? <Tappable accessibilityLabel="View Cape Town hero image credits" accessibilityRole="link" onPress={() => onOpenCredits(hero.id)} style={styles.creditLink}><AppText typographyRole="caption">Photo credits →</AppText></Tappable> : null}
        <View accessibilityLabel={`${destination.name} actions`} style={styles.actions}>
          <Chip label="Saved" onPress={() => setSavedStatus(destination.id, 'destination', 'saved')} selected={savedRecord?.status === 'saved'} />
          <Chip label="Want to Go" onPress={() => setSavedStatus(destination.id, 'destination', 'wantToGo')} selected={savedRecord?.status === 'wantToGo'} />
          <Chip label={visited ? 'Visited' : 'Mark visited'} onPress={() => markVisited(destination.id)} selected={visited} />
        </View>
      </View>
      <View style={styles.story}>
        <AppText accessibilityRole="header" typographyRole="subheading">A city understood together</AppText>
        <AppText>{destination.culturalOverview}</AppText>
      </View>

      {DISCOVERY_LAYERS.map((layer) => {
        const layerItems = items.filter((item) => item.layer === layer);
        return (
          <View key={layer} accessibilityLabel={`${layer} layer, ${layerItems.length} items`} style={[styles.layer, { borderTopColor: discoveryLayerColors[layer] }]}>
            <LayerLabel layer={layer} />
            {layerItems.map((item, index) => {
              const image = getImageById(item.imageIds[0]);
              return (
                <Tappable key={item.id} accessibilityLabel={`Open ${item.name}`} accessibilityRole="link" onPress={() => onOpenItem(item.id)} style={[styles.item, index % 2 === 1 && styles.offsetItem]}>
                  {image ? <ContentImage height={230} image={image} /> : null}
                  <View style={styles.itemCopy}><AppText typographyRole="subheading">{item.name}</AppText><AppText numberOfLines={4}>{item.description}</AppText><AppText typographyRole="label">Read the story →</AppText></View>
                </Tappable>
              );
            })}
          </View>
        );
      })}

      <View style={styles.nearby}>
        <AppText accessibilityRole="header" typographyRole="subheading">Nearby destinations</AppText>
        <AppText style={styles.secondary}>No nearby destinations are included in the approved Cape Town pilot yet.</AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCopy: { gap: spacing.sm, marginBottom: spacing['2xl'], marginTop: spacing.lg },
  eyebrow: { color: colors.brand, textTransform: 'uppercase' },
  creditLink: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: spacing.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  story: { borderLeftColor: colors.brand, borderLeftWidth: 5, gap: spacing.md, marginBottom: spacing['2xl'], maxWidth: 760, paddingLeft: spacing.lg },
  layer: { borderTopWidth: 4, gap: spacing.lg, marginBottom: spacing['2xl'], paddingTop: spacing.lg },
  item: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, maxWidth: 760, overflow: 'hidden', paddingBottom: spacing.lg },
  offsetItem: { alignSelf: 'flex-end' },
  itemCopy: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  nearby: { gap: spacing.sm, marginBottom: spacing.xl },
  secondary: { color: colors.textSecondary },
});
