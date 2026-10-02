import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppText, ContentImage, ErrorState, ScreenContainer, Tappable } from '@/components/ui';
import { getDestinationById, getImageById, getItemsForDestination } from '@/content/selectors';
import type { DiscoveryLayer } from '@/content/vocabularies';
import type { DiscoveryItem } from '@/types';
import { colors, discoveryLayerColors, radius, spacing } from '@/tokens';
import { openHttpsUrl } from '@/utils/externalLinks';
import { useSavedStore } from '@/state/savedStore';

interface DiscoveryItemScreenProps { item?: DiscoveryItem; onBack: () => void; onOpenCredits: (id: string) => void; onOpenItem?: (id: string) => void }

const typeNames: Record<DiscoveryItem['type'], string> = { attraction: 'Attraction', landmark: 'Landmark', cultural_practice: 'Cultural practice', food_experience: 'Food experience', natural_site: 'Natural site', hidden_place: 'Hidden place' };
const layerNames: Record<DiscoveryLayer, string> = { iconic: 'Iconic', hidden: 'Hidden', culture: 'Culture', taste: 'Taste', nature: 'Nature' };

const storyPalette = {
  sunsetVermilion: '#C94F3D',
  marigoldGold: '#E7A936',
  atlasBlue: '#3C6E8F',
  terracottaClay: '#B8643E',
  orchidViolet: '#8B5FBF',
  oliveGrove: '#6F8F55',
  shellPink: '#F3D8CF',
  sandstone: '#F6E8D6',
  cloudWhite: '#FFFDF8',
  carbonInk: '#20242C',
} as const;

const cinematic = {
  deepNavy: '#031A2F',
  oceanNight: '#063B5C',
  cloudWhite: '#FFFDF8',
} as const;

const navyFade = (alpha: number) => `rgba(3, 26, 47, ${alpha})`;
const heroFade = [navyFade(0.72), navyFade(0.12), navyFade(0.55), navyFade(1)] as const;
const panelFade = [navyFade(0), navyFade(0.08), navyFade(0.58), navyFade(0.92)] as const;
const placeFade = [navyFade(0), navyFade(0.3), navyFade(0.86)] as const;
const pageTurn = [cinematic.deepNavy, cinematic.deepNavy, storyPalette.sandstone, storyPalette.sandstone] as const;

export function DiscoveryItemScreen({ item, onBack, onOpenCredits, onOpenItem }: DiscoveryItemScreenProps) {
  const { height: windowHeight } = useWindowDimensions();
  const itemId = item?.id;
  const savedRecord = useSavedStore((state) => state.records.find((record) => record.subjectId === itemId));
  const setSavedStatus = useSavedStore((state) => state.setStatus);
  if (!item) return <ScreenContainer><ErrorState actionLabel="Go back" message="This discovery is not part of the approved content set." onAction={onBack} title="Discovery unavailable" /></ScreenContainer>;

  const image = getImageById(item.imageIds[0]);
  const destination = getDestinationById(item.destinationId);
  const placeImage = destination ? getImageById(destination.heroImageId) : undefined;
  const practical = item.practicalInformation;
  const verificationSourceUrl = practical?.verification.kind !== 'not-applicable' ? practical?.verification.sourceUrl : undefined;
  const accent = discoveryLayerColors[item.layer];
  const isSaved = savedRecord?.status === 'saved';
  const isWantToGo = savedRecord?.status === 'wantToGo';

  const statement = item.culturalSignificance ?? item.description;
  const storyCopy = item.culturalSignificance ? item.description : undefined;
  const siblings = getItemsForDestination(item.destinationId).filter((candidate) => candidate.id !== item.id);

  const heroHeight = Math.min(440, Math.max(360, Math.round(windowHeight * 0.52)));

  return (
    <ScreenContainer backgroundColor={storyPalette.sandstone}>
      <View style={[styles.hero, { height: heroHeight }]}>
        {image ? <ContentImage height={heroHeight} image={image} style={styles.heroImage} /> : null}
        <LinearGradient colors={heroFade} locations={[0, 0.3, 0.6, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
        <View style={styles.heroTop}>
          <Tappable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.heroControl}>
            <Ionicons color={storyPalette.cloudWhite} name="arrow-back" size={22} />
          </Tappable>
        </View>
        <View style={styles.heroCopy}>
          <View accessibilityLabel={`${layerNames[item.layer]} discovery layer`} style={styles.badge}>
            <View style={[styles.badgeDot, { backgroundColor: accent }]} />
            <AppText typographyRole="caption" style={styles.badgeText}>{layerNames[item.layer]}</AppText>
          </View>
          <AppText style={styles.heroKicker}>{typeNames[item.type]}</AppText>
          <AppText accessibilityRole="header" numberOfLines={2} typographyRole="display" style={styles.heroTitle}>{item.name}</AppText>
          {destination ? <AppText numberOfLines={2} style={styles.heroPlace}>{destination.name}, {destination.country}</AppText> : null}
          <AppText numberOfLines={3} style={styles.heroIntro}>{item.description}</AppText>
        </View>
      </View>

      <LinearGradient colors={pageTurn} locations={[0, 0.45, 0.7, 1]} pointerEvents="none" style={styles.transition} />

      <View style={styles.content}>
        <View style={styles.statementBlock}>
          <View style={[styles.statementRule, { backgroundColor: accent }]} />
          <AppText style={styles.eyebrow}>WHY IT&apos;S SPECIAL</AppText>
          <AppText accessibilityRole="header" style={styles.statement}>{statement}</AppText>
          {storyCopy ? <AppText style={styles.storyCopy}>{storyCopy}</AppText> : null}
        </View>

        {item.location ? (
          <View style={styles.metaInline}>
            <AppText accessibilityRole="header" typographyRole="caption" style={styles.metaLabel}>Location</AppText>
            <AppText typographyRole="caption" style={styles.metaValue}>{item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}</AppText>
          </View>
        ) : null}

        {practical ? (
          <View style={styles.practical}>
            <AppText accessibilityRole="header" style={styles.practicalTitle}>Practical information</AppText>
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

        {image ? <Tappable accessibilityLabel={`View image credits for ${item.name}`} accessibilityRole="link" onPress={() => onOpenCredits(image.id)} style={styles.credit}><AppText typographyRole="caption">Image credits →</AppText></Tappable> : null}

        {placeImage && destination ? (
          <View style={styles.placeBand}>
            <ContentImage height={240} image={placeImage} style={styles.placeImage} />
            <LinearGradient colors={placeFade} locations={[0.1, 0.5, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
            <View style={styles.placeCopy}>
              <AppText numberOfLines={2} style={styles.placeName}>{destination.name}</AppText>
              <AppText numberOfLines={3} style={styles.placeOverview}>{destination.culturalOverview}</AppText>
              <AppText numberOfLines={1} style={styles.placeMeta}>{destination.country} · {destination.continent}</AppText>
            </View>
          </View>
        ) : null}

        {placeImage && destination ? <Tappable accessibilityLabel={`View ${destination.name} image credits`} accessibilityRole="link" onPress={() => onOpenCredits(placeImage.id)} style={styles.credit}><AppText typographyRole="caption">{destination.name} image credits →</AppText></Tappable> : null}

        {destination && siblings.length > 0 ? (
          <View style={styles.more}>
            <AppText accessibilityRole="header" typographyRole="heading" style={styles.moreTitle}>More in {destination.name}</AppText>
            <AppText style={styles.moreNote}>{siblings.length === 1 ? 'One more story' : `${siblings.length} more stories`} from {destination.name}.</AppText>
            <ScrollView accessibilityLabel={`More stories in ${destination.name}`} contentContainerStyle={styles.moreRail} horizontal showsHorizontalScrollIndicator={false} style={styles.railBleed}>
              {siblings.map((sibling) => {
                const siblingImage = getImageById(sibling.imageIds[0]);
                const type = typeNames[sibling.type];
                const layer = layerNames[sibling.layer];
                return (
                  <RelatedCard
                    accent={discoveryLayerColors[sibling.layer]}
                    image={siblingImage}
                    key={sibling.id}
                    label={type.toLowerCase().startsWith(layer.toLowerCase()) ? type : `${layer} · ${type}`}
                    name={sibling.name}
                    onPress={onOpenItem ? () => onOpenItem(sibling.id) : undefined}
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <Tappable
            accessibilityLabel="Want to Go"
            accessibilityRole="button"
            accessibilityState={{ selected: isWantToGo }}
            onPress={() => setSavedStatus(item.id, 'discoveryItem', 'wantToGo')}
            style={[styles.action, isWantToGo && styles.wantActive]}
          >
            <Ionicons color={storyPalette.cloudWhite} name={isWantToGo ? 'checkmark' : 'heart-outline'} size={18} />
            <AppText style={styles.actionText}>Want to Go</AppText>
          </Tappable>
          <Tappable
            accessibilityLabel="Saved"
            accessibilityRole="button"
            accessibilityState={{ selected: isSaved }}
            onPress={() => setSavedStatus(item.id, 'discoveryItem', 'saved')}
            style={[styles.action, isSaved && styles.savedActive]}
          >
            <Ionicons color={storyPalette.cloudWhite} name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} />
            <AppText style={styles.actionText}>Saved</AppText>
          </Tappable>
        </View>
      </View>
    </ScreenContainer>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><AppText typographyRole="label">{label}</AppText><AppText style={styles.infoValue}>{value}</AppText></View>; }

function RelatedCard({ accent, image, label, name, onPress }: { accent: string; image?: ReturnType<typeof getImageById>; label: string; name: string; onPress?: () => void }) {
  const body = (
    <>
      {image ? <ContentImage height={112} image={image} style={styles.relatedImage} /> : null}
      <LinearGradient colors={panelFade} locations={[0, 0.4, 0.7, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
      <View style={styles.relatedCopy}>
        <View style={[styles.relatedRule, { backgroundColor: accent }]} />
        <AppText numberOfLines={2} style={styles.relatedName}>{name}</AppText>
        <AppText numberOfLines={1} style={styles.relatedLabel}>{label}</AppText>
      </View>
    </>
  );
  return onPress
    ? <Tappable accessibilityLabel={`Open ${name}`} accessibilityRole="link" onPress={onPress} style={styles.relatedCard}>{body}</Tappable>
    : <View style={styles.relatedCard}>{body}</View>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: cinematic.oceanNight, marginHorizontal: -spacing.lg, marginTop: -(spacing.xl + spacing.sm), overflow: 'hidden', position: 'relative' },
  heroImage: { borderRadius: radius.none },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', left: spacing.md, position: 'absolute', right: spacing.md, top: spacing.sm },
  heroControl: { alignItems: 'center', backgroundColor: 'rgba(3, 26, 47, 0.42)', borderColor: 'rgba(255, 253, 248, 0.28)', borderRadius: radius.pill, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  heroCopy: { bottom: spacing.sm, gap: 3, left: spacing.lg, position: 'absolute', right: spacing.lg },
  badge: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(3, 26, 47, 0.52)', borderColor: 'rgba(255, 253, 248, 0.26)', borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: 5, paddingHorizontal: 9, paddingVertical: 4 },
  badgeDot: { borderRadius: radius.pill, height: 6, width: 6 },
  badgeText: { color: cinematic.cloudWhite, fontSize: 9, letterSpacing: 1, opacity: 0.94, textTransform: 'uppercase' },
  heroKicker: { color: storyPalette.marigoldGold, fontSize: 9, letterSpacing: 1.1, textTransform: 'uppercase' },
  heroTitle: { color: cinematic.cloudWhite, fontSize: 30, lineHeight: 36 },
  heroPlace: { color: cinematic.cloudWhite, fontSize: 12, lineHeight: 16, opacity: 0.84 },
  heroIntro: { color: cinematic.cloudWhite, fontSize: 13, lineHeight: 19, opacity: 0.78, marginTop: 2 },

  transition: { backgroundColor: cinematic.deepNavy, height: 56, width: '100%' },

  content: { marginHorizontal: -spacing.lg, paddingBottom: spacing.xl, paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  statementBlock: { gap: 2, paddingTop: 2 },
  statementRule: { borderRadius: radius.pill, height: 2, marginBottom: 3, width: 26 },
  eyebrow: { color: storyPalette.atlasBlue, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase' },
  statement: { color: storyPalette.carbonInk, fontFamily: 'PlayfairDisplay_400Regular', fontSize: 22, lineHeight: 29 },
  storyCopy: { color: storyPalette.carbonInk, fontSize: 14, lineHeight: 21, marginTop: 1, opacity: 0.84 },

  metaInline: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, paddingHorizontal: spacing.xs },
  metaLabel: { color: storyPalette.carbonInk, fontSize: 9, letterSpacing: 1, opacity: 0.5, textTransform: 'uppercase' },
  metaValue: { color: storyPalette.carbonInk, fontSize: 11, opacity: 0.7 },

  practical: { backgroundColor: storyPalette.sandstone, borderRadius: radius.md, gap: 1, marginTop: spacing.md, padding: spacing.md },
  practicalTitle: { color: storyPalette.carbonInk, fontSize: 15, fontFamily: 'PlayfairDisplay_400Regular' },
  info: { gap: 1 },
  infoValue: { color: storyPalette.carbonInk, opacity: 0.86 },
  link: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', paddingHorizontal: spacing.xs, paddingVertical: spacing.xs },
  credit: { alignItems: 'center', alignSelf: 'flex-start', justifyContent: 'center', marginTop: spacing.sm, minHeight: 40, paddingHorizontal: spacing.xs },

  placeBand: { borderRadius: radius.none, marginHorizontal: -spacing.lg, marginTop: spacing.md, height: 220, overflow: 'hidden', position: 'relative' },
  placeImage: { borderRadius: radius.none },
  placeCopy: { bottom: spacing.xs, gap: 3, left: spacing.lg, position: 'absolute', right: spacing.lg },
  placeName: { color: cinematic.cloudWhite, fontFamily: 'PlayfairDisplay_400Regular', fontSize: 20, lineHeight: 26 },
  placeOverview: { color: cinematic.cloudWhite, fontSize: 13, lineHeight: 18, opacity: 0.88 },
  placeMeta: { color: storyPalette.marigoldGold, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },

  more: { marginTop: spacing.md },
  moreTitle: { color: storyPalette.carbonInk, fontSize: 20, fontFamily: 'PlayfairDisplay_400Regular' },
  moreNote: { color: storyPalette.carbonInk, fontSize: 12, lineHeight: 16, marginTop: 1, opacity: 0.68 },
  railBleed: { marginHorizontal: -spacing.lg, marginTop: spacing.xs },
  moreRail: { gap: spacing.md, paddingHorizontal: spacing.lg },
  relatedCard: { backgroundColor: cinematic.oceanNight, borderRadius: radius.md, height: 156, overflow: 'hidden', position: 'relative', width: 140 },
  relatedImage: { borderRadius: radius.none },
  relatedCopy: { bottom: 4, gap: 1, left: spacing.sm, position: 'absolute', right: spacing.sm },
  relatedRule: { borderRadius: radius.pill, height: 2, marginBottom: 2, width: 12 },
  relatedName: { color: cinematic.cloudWhite, fontSize: 15, lineHeight: 19 },
  relatedLabel: { color: cinematic.cloudWhite, fontSize: 9, opacity: 0.74 },

  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, paddingBottom: spacing.xl },
  action: { alignItems: 'center', backgroundColor: storyPalette.carbonInk, borderColor: 'rgba(255, 253, 248, 0.34)', borderRadius: radius.pill, borderWidth: 1, flex: 1, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', minHeight: 44, paddingHorizontal: spacing.md },
  wantActive: { backgroundColor: colors.primaryAction, borderColor: colors.primaryAction },
  savedActive: { backgroundColor: storyPalette.atlasBlue, borderColor: storyPalette.atlasBlue },
  actionText: { color: cinematic.cloudWhite, fontSize: 13, lineHeight: 18 },
});