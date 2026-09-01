import { StyleSheet, View } from 'react-native';

import { AppText, Card, ContentImage, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { curatedCollections, destinations, discoveryItems } from '@/content/contentIndex';
import { getImageById } from '@/content/selectors';
import { rankDestinations } from '@/personalization/scoring';
import { useProfileStore } from '@/state/profileStore';
import { colors, radius, spacing } from '@/tokens';

interface DiscoverScreenProps { onOpenDestination: (id: string) => void; onOpenItem: (id: string) => void; onOpenProfile: () => void }

export function DiscoverScreen({ onOpenDestination, onOpenItem, onOpenProfile }: DiscoverScreenProps) {
  const featured = destinations[0];
  const hero = getImageById(featured.heroImageId);
  const interests = useProfileStore((state) => state.interests);
  const preferredRegions = useProfileStore((state) => state.preferredRegions);
  const layerInterests = useProfileStore((state) => state.layerInterests);
  const profile = { interests, preferredRegions, layerInterests };
  const ranked = rankDestinations(destinations, profile);
  const hasPreferences = profile.interests.length > 0 || profile.preferredRegions.length > 0 || profile.layerInterests.length > 0;

  return (
    <ScreenContainer>
      <View style={styles.intro}>
        <AppText accessibilityRole="header" typographyRole="display">The world, understood in layers.</AppText>
        <AppText style={styles.secondary}>Begin with one deeply considered city: mountain, ocean, memory, food, and living culture.</AppText>
        <Tappable accessibilityLabel="Open Profile and preferences" accessibilityRole="link" onPress={onOpenProfile} style={styles.profileLink}><AppText typographyRole="label">Profile & preferences →</AppText></Tappable>
      </View>

      <View style={styles.section}>
        <AppText accessibilityRole="header" typographyRole="subheading">Featured destination</AppText>
        <Tappable accessibilityLabel="Open Cape Town destination" accessibilityRole="link" onPress={() => onOpenDestination(featured.id)} style={styles.hero}>
          {hero ? <ContentImage height={360} image={hero} /> : null}
          <View style={styles.heroCopy}>
            <AppText typographyRole="caption" style={styles.eyebrow}>{featured.country}</AppText>
            <AppText typographyRole="heading">{featured.name}</AppText>
            <AppText>Where mountain and ocean frame a city of layered histories, working neighbourhoods, food traditions, and protected landscapes.</AppText>
            <AppText typographyRole="label" style={styles.linkText}>Explore Cape Town →</AppText>
          </View>
        </Tappable>
      </View>

      <View style={styles.section}>
        <AppText accessibilityRole="header" typographyRole="subheading">Editor&apos;s Picks</AppText>
        <AppText style={styles.secondary}>Three starting points selected from the approved pilot.</AppText>
        {discoveryItems.slice(0, 3).map((item) => {
          const image = getImageById(item.imageIds[0]);
          return (
            <Tappable key={item.id} accessibilityLabel={`Open ${item.name}`} accessibilityRole="link" onPress={() => onOpenItem(item.id)} style={styles.editorialRow}>
              {image ? <ContentImage height={150} image={image} style={styles.rowImage} /> : null}
              <View style={styles.rowCopy}><LayerLabel layer={item.layer} /><AppText typographyRole="subheading">{item.name}</AppText><AppText numberOfLines={3}>{item.description}</AppText></View>
            </Tappable>
          );
        })}
      </View>

      <View style={styles.section}>
        <AppText accessibilityRole="header" typographyRole="subheading">Curated Collections</AppText>
        {curatedCollections.map((collection) => (
          <Card key={collection.id}>
            <AppText typographyRole="subheading">{collection.title}</AppText>
            <AppText style={styles.secondary}>{collection.destinationIds.length} destination in the current pilot</AppText>
            <Tappable accessibilityLabel={`Open ${collection.title}`} accessibilityRole="link" onPress={() => onOpenDestination(collection.destinationIds[0])} style={styles.inlineLink}>
              <AppText typographyRole="label">View collection →</AppText>
            </Tappable>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <AppText accessibilityRole="header" typographyRole="subheading">For you</AppText>
        <AppText style={styles.secondary}>{hasPreferences ? 'Ranked from your saved interests, regions, and discovery layers.' : 'Default editorial ordering is shown until you choose Profile preferences.'}</AppText>
        {ranked.map((destination) => (
          <Tappable key={destination.id} accessibilityLabel={`Open personalized result ${destination.name}`} accessibilityRole="link" onPress={() => onOpenDestination(destination.id)} style={styles.personalized}>
            <View style={styles.rankMark}><AppText typographyRole="label">01</AppText></View>
            <View style={styles.rowCopy}><AppText typographyRole="subheading">{destination.name}</AppText><AppText>{destination.country}</AppText></View>
          </Tappable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing['2xl'], maxWidth: 760 },
  profileLink: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.sm },
  secondary: { color: colors.textSecondary },
  section: { gap: spacing.md, marginBottom: spacing['2xl'] },
  hero: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.lg, overflow: 'hidden', paddingBottom: spacing.lg },
  heroCopy: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  eyebrow: { color: colors.brand, textTransform: 'uppercase' },
  linkText: { color: colors.textPrimary, marginTop: spacing.sm },
  editorialRow: { alignItems: 'center', backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.md },
  rowImage: { borderRadius: radius.md, flexBasis: 220, maxWidth: 220 },
  rowCopy: { flex: 1, gap: spacing.sm },
  inlineLink: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.sm },
  personalized: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.md },
  rankMark: { alignItems: 'center', backgroundColor: colors.primaryAction, borderColor: colors.brand, borderRadius: radius.pill, borderWidth: 2, height: 48, justifyContent: 'center', width: 48 },
});
