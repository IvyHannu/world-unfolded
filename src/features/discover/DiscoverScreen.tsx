import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Chip, ContentImage, ScreenContainer, Tappable } from '@/components/ui';
import { destinations, discoveryItems } from '@/content/contentIndex';
import { getImageById } from '@/content/selectors';
import { rankDestinations } from '@/personalization/scoring';
import { useProfileStore } from '@/state/profileStore';
import { useSavedStore } from '@/state/savedStore';
import { colors, elevation, radius, spacing } from '@/tokens';

interface DiscoverScreenProps { onExplore: () => void; onOpenDestination: (id: string) => void; onOpenItem: (id: string) => void; onOpenProfile: () => void }
const categoryLabels = ['Beach', 'City', 'Culture', 'Nature', 'Food'];

export function DiscoverScreen({ onExplore, onOpenDestination, onOpenItem, onOpenProfile }: DiscoverScreenProps) {
  const interests = useProfileStore((state) => state.interests);
  const preferredRegions = useProfileStore((state) => state.preferredRegions);
  const layerInterests = useProfileStore((state) => state.layerInterests);
  const records = useSavedStore((state) => state.records);
  const setStatus = useSavedStore((state) => state.setStatus);
  const ranked = rankDestinations(destinations, { interests, preferredRegions, layerInterests });
  const featured = ranked[0];
  const hero = getImageById(featured.heroImageId);
  const saved = records.some(({ subjectId }) => subjectId === featured.id);
  const experiences = discoveryItems.filter(({ destinationId }) => destinationId === featured.id);

  return <ScreenContainer>
    <View style={styles.topBar}>
      <Tappable accessibilityLabel="Open Explore" accessibilityRole="button" onPress={onExplore} style={styles.iconButton}><Ionicons color={colors.textPrimary} name="menu" size={24} /></Tappable>
      <AppText typographyRole="subheading" style={styles.brand}>WORLD UNFOLDED</AppText>
      <Tappable accessibilityLabel="Open Profile and preferences" accessibilityRole="button" onPress={onOpenProfile} style={styles.iconButton}><Ionicons color={colors.textPrimary} name="person-outline" size={23} /></Tappable>
    </View>

    <View style={styles.intro}><AppText accessibilityRole="header" typographyRole="display">Discover the world, your way.</AppText><AppText style={styles.secondary}>Find places that stay with you long after the postcard moment.</AppText></View>

    <Tappable accessibilityLabel="Search destinations and experiences" accessibilityRole="search" onPress={onExplore} style={styles.search}>
      <Ionicons color={colors.primaryAction} name="search" size={22} /><AppText style={styles.searchText}>Where do you want to unfold?</AppText><View style={styles.searchAction}><Ionicons color={colors.primaryActionText} name="options-outline" size={20} /></View>
    </Tappable>

    <ScrollView horizontal contentContainerStyle={styles.categories} showsHorizontalScrollIndicator={false}>{categoryLabels.map((label, index) => <Chip key={label} label={label} onPress={onExplore} selected={index === 0} />)}</ScrollView>

    <View style={styles.sectionHeader}><AppText accessibilityRole="header" typographyRole="subheading">Featured destination</AppText><Tappable accessibilityLabel="Explore all destinations" accessibilityRole="link" onPress={onExplore} style={styles.textAction}><AppText typographyRole="label" style={styles.actionText}>See all</AppText></Tappable></View>
    <View style={styles.featuredCard}>
      <Tappable accessibilityLabel={`Open featured destination ${featured.name}`} accessibilityRole="link" onPress={() => onOpenDestination(featured.id)}>{hero ? <ContentImage height={370} image={hero} /> : null}</Tappable>
      <View style={styles.featuredCopy}>
        <View style={styles.featuredTitle}><View style={styles.titleCopy}><AppText typographyRole="heading">{featured.name}</AppText><View style={styles.location}><Ionicons color={colors.primaryAction} name="location" size={17} /><AppText typographyRole="caption">{featured.country} · {featured.continent}</AppText></View></View><Tappable accessibilityLabel={saved ? `Remove ${featured.name} from Saved` : `Save ${featured.name}`} accessibilityRole="button" onPress={() => saved ? useSavedStore.getState().remove(featured.id) : setStatus(featured.id, 'destination', 'saved')} style={styles.saveButton}><Ionicons color={saved ? colors.brand : colors.textPrimary} name={saved ? 'heart' : 'heart-outline'} size={24} /></Tappable></View>
        <AppText numberOfLines={3} style={styles.secondary}>{featured.culturalOverview}</AppText>
        <Tappable accessibilityLabel={`Explore ${featured.name}`} accessibilityRole="button" onPress={() => onOpenDestination(featured.id)} style={styles.primaryButton}><AppText typographyRole="label" style={styles.primaryButtonText}>Explore destination</AppText><Ionicons color={colors.primaryActionText} name="arrow-forward" size={20} /></Tappable>
      </View>
    </View>

    <View style={styles.sectionHeader}><AppText accessibilityRole="header" typographyRole="subheading">Curated experiences</AppText><AppText typographyRole="caption" style={styles.secondary}>Five ways into {featured.name}</AppText></View>
    <ScrollView horizontal contentContainerStyle={styles.experiences} showsHorizontalScrollIndicator={false}>{experiences.map((item) => {
      const image = getImageById(item.imageIds[0]);
      return <Tappable key={item.id} accessibilityLabel={`Open ${item.name}`} accessibilityRole="link" onPress={() => onOpenItem(item.id)} style={styles.experienceCard}>{image ? <ContentImage height={180} image={image} /> : null}<View style={styles.experienceCopy}><AppText typographyRole="caption" style={styles.actionText}>{item.layer.toUpperCase()}</AppText><AppText typographyRole="subheading">{item.name}</AppText></View></Tappable>;
    })}</ScrollView>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  iconButton: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48, ...elevation.raised },
  brand: { fontSize: 14, letterSpacing: 2 },
  intro: { gap: spacing.sm, marginBottom: spacing.lg, maxWidth: 720 },
  secondary: { color: colors.textSecondary, opacity: 0.74 },
  search: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, minHeight: 60, paddingLeft: spacing.lg, paddingRight: spacing.xs, ...elevation.overlay },
  searchText: { flex: 1, opacity: 0.64 },
  searchAction: { alignItems: 'center', backgroundColor: colors.primaryAction, borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48 },
  categories: { gap: spacing.sm, paddingVertical: spacing.lg },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md, marginTop: spacing.md },
  textAction: { alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingHorizontal: spacing.sm },
  actionText: { color: colors.brand },
  featuredCard: { backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.xl, overflow: 'hidden', ...elevation.overlay },
  featuredCopy: { gap: spacing.md, padding: spacing.lg },
  featuredTitle: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  titleCopy: { flex: 1, gap: spacing.xs },
  location: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  saveButton: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radius.pill, height: 48, justifyContent: 'center', width: 48 },
  primaryButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.brand, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.lg },
  primaryButtonText: { color: colors.primaryActionText },
  experiences: { gap: spacing.md, paddingBottom: 100 },
  experienceCard: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', width: 260, ...elevation.raised },
  experienceCopy: { gap: spacing.xs, padding: spacing.md },
});
