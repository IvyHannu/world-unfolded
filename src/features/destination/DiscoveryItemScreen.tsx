import { StyleSheet, View } from 'react-native';

import { AppText, ContentImage, ErrorState, LayerLabel, ScreenContainer, Tappable } from '@/components/ui';
import { getImageById } from '@/content/selectors';
import type { DiscoveryItem } from '@/types';
import { colors, radius, spacing } from '@/tokens';
import { openHttpsUrl } from '@/utils/externalLinks';

interface DiscoveryItemScreenProps { item?: DiscoveryItem; onBack: () => void; onOpenCredits: (id: string) => void }

const typeNames: Record<DiscoveryItem['type'], string> = { attraction: 'Attraction', landmark: 'Landmark', cultural_practice: 'Cultural practice', food_experience: 'Food experience', natural_site: 'Natural site', hidden_place: 'Hidden place' };

export function DiscoveryItemScreen({ item, onBack, onOpenCredits }: DiscoveryItemScreenProps) {
  if (!item) return <ScreenContainer><ErrorState actionLabel="Go back" message="This discovery is not part of the approved Cape Town pilot." onAction={onBack} title="Discovery unavailable" /></ScreenContainer>;
  const image = getImageById(item.imageIds[0]);
  const practical = item.practicalInformation;
  const verificationSourceUrl = practical?.verification.kind !== 'not-applicable' ? practical?.verification.sourceUrl : undefined;
  return (
    <ScreenContainer>
      {image ? <ContentImage height={420} image={image} /> : null}
      <View style={styles.heading}>
        <LayerLabel layer={item.layer} />
        <AppText accessibilityRole="header" typographyRole="display">{item.name}</AppText>
        <AppText typographyRole="caption" style={styles.type}>{typeNames[item.type]}</AppText>
        {image ? <Tappable accessibilityLabel={`View image credits for ${item.name}`} accessibilityRole="link" onPress={() => onOpenCredits(image.id)} style={styles.link}><AppText typographyRole="caption">Image credits →</AppText></Tappable> : null}
      </View>

      <View style={styles.section}><AppText accessibilityRole="header" typographyRole="subheading">The discovery</AppText><AppText>{item.description}</AppText></View>
      {item.culturalSignificance ? <View style={styles.significance}><AppText accessibilityRole="header" typographyRole="subheading">Why it matters</AppText><AppText>{item.culturalSignificance}</AppText></View> : null}
      {item.location ? <View style={styles.section}><AppText accessibilityRole="header" typographyRole="subheading">Location</AppText><AppText>Latitude {item.location.latitude}; longitude {item.location.longitude}</AppText></View> : null}
      {practical ? (
        <View style={styles.practical}>
          <AppText accessibilityRole="header" typographyRole="subheading">Practical information</AppText>
          {practical.openingHours ? <Info label="Opening information" value={practical.openingHours} /> : null}
          {practical.accessibilityNotes ? <Info label="Accessibility" value={practical.accessibilityNotes} /> : null}
          {practical.practicalGuidance ? <Info label="Guidance" value={practical.practicalGuidance} /> : null}
          {practical.verification.kind !== 'not-applicable' ? (
            <>
              <Tappable accessibilityLabel={`Open official source from ${practical.verification.sourceName}`} accessibilityRole="link" onPress={() => void openHttpsUrl(verificationSourceUrl!)} style={styles.link}><AppText typographyRole="label">Official source: {practical.verification.sourceName} →</AppText></Tappable>
              {practical.verification.kind === 'verified' ? <AppText typographyRole="caption">Last verified: {practical.verification.lastVerifiedDate}</AppText> : <AppText typographyRole="caption">Linked to the official source for current information.</AppText>}
            </>
          ) : null}
          {practical.officialVisitorUrl && practical.officialVisitorUrl !== verificationSourceUrl ? <Tappable accessibilityLabel="Open official visitor page" accessibilityRole="link" onPress={() => void openHttpsUrl(practical.officialVisitorUrl!)} style={styles.link}><AppText typographyRole="label">Official visitor page →</AppText></Tappable> : null}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><AppText typographyRole="label">{label}</AppText><AppText>{value}</AppText></View>; }

const styles = StyleSheet.create({
  heading: { gap: spacing.sm, marginBottom: spacing['2xl'], marginTop: spacing.lg },
  type: { color: colors.textSecondary, textTransform: 'uppercase' },
  section: { gap: spacing.md, marginBottom: spacing.xl, maxWidth: 760 },
  significance: { backgroundColor: colors.surface, borderLeftColor: colors.brand, borderLeftWidth: 5, borderRadius: radius.md, gap: spacing.md, marginBottom: spacing.xl, maxWidth: 760, padding: spacing.lg },
  practical: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, marginBottom: spacing.xl, maxWidth: 760, padding: spacing.lg },
  info: { gap: spacing.xs },
  link: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: spacing.sm },
});
