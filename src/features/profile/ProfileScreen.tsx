import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Chip, ScreenContainer } from '@/components/ui';
import { DISCOVERY_LAYERS, INTEREST_TAGS, REGIONS, type DiscoveryLayer, type InterestTag, type Region } from '@/content/vocabularies';
import { destinations } from '@/content/contentIndex';
import { getPassportCounters, usePassportStore } from '@/state/passportStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, elevation, palette, radius, spacing } from '@/tokens';

const labels: Record<InterestTag | Region | DiscoveryLayer, string> = {
  nature: 'Nature', wildlife: 'Wildlife', culture: 'Culture', food: 'Food', architecture: 'Architecture', adventure: 'Adventure', history: 'History', beaches: 'Beaches', mountains: 'Mountains', photography: 'Photography',
  southeast_asia: 'Southeast Asia', north_africa: 'North Africa', southern_europe: 'Southern Europe', western_asia: 'Western Asia', east_asia: 'East Asia', south_america: 'South America',
  iconic: 'Iconic', hidden: 'Hidden', taste: 'Taste',
};

const toggle = <T extends string>(values: readonly T[], value: T) => values.includes(value) ? values.filter((candidate) => candidate !== value) : [...values, value];

export function ProfileScreen() {
  const interests = useProfileStore((state) => state.interests);
  const regions = useProfileStore((state) => state.preferredRegions);
  const layers = useProfileStore((state) => state.layerInterests);
  const preferences = useProfileStore((state) => state.accessibilityPreferences);
  const setInterests = useProfileStore((state) => state.setInterests);
  const setRegions = useProfileStore((state) => state.setPreferredRegions);
  const setLayers = useProfileStore((state) => state.setLayerInterests);
  const setTextScale = useProfileStore((state) => state.setTextScale);
  const setReduceMotion = useProfileStore((state) => state.setReduceMotion);
  const visitedRecords = usePassportStore((state) => state.visitedRecords);
  const passport = getPassportCounters(visitedRecords, destinations);

  return (
    <ScreenContainer>
      <View style={styles.intro}><AppText accessibilityRole="header" typographyRole="display">Your world, your way.</AppText><AppText style={styles.secondary}>Preferences stay on this device and shape the rules-based Discover ordering.</AppText></View>
      <View accessibilityLabel="Your travel identity" style={styles.identity}>
        <View style={styles.identityIcon}><Ionicons color={colors.brand} name="compass-outline" size={28} /></View>
        <View style={styles.identityCopy}><AppText typographyRole="caption" style={styles.identityEyebrow}>YOUR TRAVEL IDENTITY</AppText><AppText typographyRole="heading" style={styles.identityText}>{visitedRecords.length ? 'Your story is unfolding.' : 'Your first stamp is waiting.'}</AppText><AppText style={styles.identityText}>{interests.length || regions.length ? `${interests.length} interests · ${regions.length} preferred regions` : 'Choose what draws you in and World Unfolded will shape discovery around you.'}</AppText></View>
        <View accessibilityLabel="Profile Passport summary" style={styles.passportSummary}><Summary value={passport.countriesVisited} label="Countries" /><View style={styles.divider} /><Summary value={passport.destinationsVisited} label="Destinations" /></View>
      </View>
      <PreferenceSection description="Choose the subjects you want World Unfolded to prioritize." title="Interests">
        {INTEREST_TAGS.map((interest) => <Chip key={interest} label={labels[interest]} onPress={() => setInterests(toggle(interests, interest))} selected={interests.includes(interest)} />)}
      </PreferenceSection>
      <PreferenceSection description="Choose the regions you are most curious about." title="Preferred regions">
        {REGIONS.map((region) => <Chip key={region} label={labels[region]} onPress={() => setRegions(toggle(regions, region))} selected={regions.includes(region)} />)}
      </PreferenceSection>
      <PreferenceSection description="Optional emphasis for the five ways World Unfolded organizes a place." title="Discovery layers">
        {DISCOVERY_LAYERS.map((layer) => <Chip key={layer} label={labels[layer]} onPress={() => setLayers(toggle(layers, layer))} selected={layers.includes(layer)} />)}
      </PreferenceSection>
      <PreferenceSection description="These settings apply immediately and persist locally." title="Accessibility preferences">
        <Chip label="Larger Text" onPress={() => setTextScale(preferences.textScale === 'large' ? 'default' : 'large')} selected={preferences.textScale === 'large'} />
        <Chip label="Reduce Motion" onPress={() => setReduceMotion(!preferences.reduceMotion)} selected={preferences.reduceMotion} />
      </PreferenceSection>
    </ScreenContainer>
  );
}

function Summary({ label, value }: { label: string; value: number }) { return <View style={styles.summary}><AppText typographyRole="heading" style={styles.identityText}>{value}</AppText><AppText typographyRole="caption" style={styles.identityText}>{label}</AppText></View>; }

function PreferenceSection({ children, description, title }: { children: React.ReactNode; description: string; title: string }) {
  return <View style={styles.section}><AppText accessibilityRole="header" typographyRole="subheading">{title}</AppText><AppText style={styles.secondary}>{description}</AppText><View style={styles.options}>{children}</View></View>;
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing['2xl'], maxWidth: 760 },
  identity: { backgroundColor: palette.sunsetCoral, borderRadius: radius.lg, gap: spacing.md, marginBottom: spacing['2xl'], padding: spacing.lg, ...elevation.overlay },
  identityIcon: { alignItems: 'center', backgroundColor: palette.cloudWhite, borderRadius: radius.pill, height: 52, justifyContent: 'center', width: 52 },
  identityCopy: { gap: spacing.sm }, identityEyebrow: { color: colors.brand, letterSpacing: 1.5 }, identityText: { color: palette.carbonInk },
  passportSummary: { backgroundColor: 'rgba(255, 253, 248, 0.62)', borderRadius: radius.md, flexDirection: 'row', padding: spacing.md }, summary: { alignItems: 'center', flex: 1, gap: spacing.xs }, divider: { backgroundColor: 'rgba(32, 36, 44, 0.16)', width: 1 },
  section: { borderTopColor: 'rgba(36, 123, 160, 0.22)', borderTopWidth: 1, gap: spacing.md, marginBottom: spacing.xl, paddingHorizontal: spacing.sm, paddingTop: spacing.lg },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  secondary: { color: colors.textSecondary },
});
