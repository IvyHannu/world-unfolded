import { StyleSheet, View } from 'react-native';

import { AppText, EmptyState, ScreenContainer, Tappable } from '@/components/ui';
import { destinations } from '@/content/contentIndex';
import { getDestinationById } from '@/content/selectors';
import { getPassportCounters, usePassportStore } from '@/state/passportStore';
import { colors, elevation, palette, radius, spacing } from '@/tokens';

export function PassportScreen({ onExplore, onOpenDestination }: { onExplore: () => void; onOpenDestination: (id: string) => void }) {
  const records = usePassportStore((state) => state.visitedRecords);
  const counters = getPassportCounters(records, destinations);
  return (
    <ScreenContainer>
      <View style={styles.intro}><AppText accessibilityRole="header" typographyRole="display">Passport</AppText><AppText style={styles.secondary}>A local record of destinations you have chosen to mark as visited.</AppText></View>
      <View accessibilityLabel="Passport visit counters" style={styles.summaryPanel}>
        <View style={styles.summaryMark}><AppText typographyRole="heading" style={styles.summaryText}>WU</AppText><AppText typographyRole="caption" style={styles.summaryText}>TRAVEL MEMORY</AppText></View>
        <View style={styles.counters}><Counter label="Countries visited" value={counters.countriesVisited} /><View style={styles.divider} /><Counter label="Destinations visited" value={counters.destinationsVisited} /></View>
      </View>
      <View style={styles.sectionHeader}><AppText accessibilityRole="header" typographyRole="heading">{records.length ? 'Your stamps' : 'A place for your stamps'}</AppText><AppText style={styles.secondary}>{records.length === 1 ? 'One memory, intentionally kept.' : records.length ? 'Each stamp marks a destination you chose to remember.' : 'Mark a destination visited to begin your travel record.'}</AppText></View>
      {records.length === 0 ? <EmptyState actionLabel="Explore destinations" message="Mark a destination as visited to add its stamp." onAction={onExplore} title="Your Passport is ready" /> : <View style={styles.stampGrid}>{records.map((record) => {
        const destination = getDestinationById(record.destinationId);
        if (!destination) return null;
        return <Tappable key={record.destinationId} accessibilityLabel={`Open visited destination ${destination.name}`} accessibilityRole="link" onPress={() => onOpenDestination(destination.id)} style={styles.entry}><PassportStamp country={destination.country} name={destination.name} /><View style={styles.copy}><AppText typographyRole="subheading">{destination.name}</AppText><AppText>{destination.country}</AppText><AppText typographyRole="caption">Marked visited {new Date(record.dateMarkedVisited).toLocaleDateString()}</AppText></View></Tappable>;
      })}</View>}
    </ScreenContainer>
  );
}

function Counter({ label, value }: { label: string; value: number }) { return <View style={styles.counter}><AppText typographyRole="heading" style={styles.summaryText}>{value}</AppText><AppText typographyRole="label" style={styles.summaryText}>{label}</AppText></View>; }
function PassportStamp({ country, name }: { country: string; name: string }) { return <View accessibilityLabel={`${name}, ${country} Passport stamp`} accessibilityRole="image" style={styles.stamp}><AppText typographyRole="heading">WU</AppText><AppText typographyRole="caption">{name.toUpperCase()}</AppText><AppText typographyRole="caption">VISITED</AppText></View>; }

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing.xl }, secondary: { color: colors.textSecondary },
  summaryPanel: { backgroundColor: palette.sunsetCoral, borderRadius: radius.lg, gap: spacing.lg, marginBottom: spacing['2xl'], padding: spacing.lg, ...elevation.overlay }, summaryMark: { alignItems: 'center', alignSelf: 'center', backgroundColor: palette.cloudWhite, borderColor: colors.brand, borderRadius: radius.pill, borderStyle: 'dashed', borderWidth: 2, height: 118, justifyContent: 'center', transform: [{ rotate: '-3deg' }], width: 118 }, summaryText: { color: palette.carbonInk }, counters: { backgroundColor: 'rgba(255, 253, 248, 0.58)', borderRadius: radius.md, flexDirection: 'row' }, counter: { alignItems: 'center', flex: 1, gap: spacing.xs, padding: spacing.sm }, divider: { backgroundColor: 'rgba(32, 36, 44, 0.16)', width: 1 },
  sectionHeader: { gap: spacing.xs, marginBottom: spacing.lg }, stampGrid: { gap: spacing.md },
  entry: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, padding: spacing.lg, ...elevation.raised },
  stamp: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderColor: colors.brand, borderRadius: radius.pill, borderStyle: 'dashed', borderWidth: 3, height: 132, justifyContent: 'center', transform: [{ rotate: '-4deg' }], width: 132 }, copy: { flex: 1, gap: spacing.xs },
});
