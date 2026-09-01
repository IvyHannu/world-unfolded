import { StyleSheet, View } from 'react-native';

import { AppText, EmptyState, ScreenContainer, Tappable } from '@/components/ui';
import { destinations } from '@/content/contentIndex';
import { getDestinationById } from '@/content/selectors';
import { getPassportCounters, usePassportStore } from '@/state/passportStore';
import { colors, radius, spacing } from '@/tokens';

export function PassportScreen({ onExplore, onOpenDestination }: { onExplore: () => void; onOpenDestination: (id: string) => void }) {
  const records = usePassportStore((state) => state.visitedRecords);
  const counters = getPassportCounters(records, destinations);
  return (
    <ScreenContainer>
      <View style={styles.intro}><AppText accessibilityRole="header" typographyRole="display">Passport</AppText><AppText style={styles.secondary}>A local record of destinations you have chosen to mark as visited.</AppText></View>
      <View accessibilityLabel="Passport visit counters" style={styles.counters}>
        <Counter label="Countries visited" value={counters.countriesVisited} />
        <Counter label="Destinations visited" value={counters.destinationsVisited} />
      </View>
      {records.length === 0 ? <EmptyState actionLabel="Explore destinations" message="Mark a destination as visited to add its stamp." onAction={onExplore} title="Your Passport is ready" /> : records.map((record) => {
        const destination = getDestinationById(record.destinationId);
        if (!destination) return null;
        return <Tappable key={record.destinationId} accessibilityLabel={`Open visited destination ${destination.name}`} accessibilityRole="link" onPress={() => onOpenDestination(destination.id)} style={styles.entry}><PassportStamp country={destination.country} name={destination.name} /><View style={styles.copy}><AppText typographyRole="subheading">{destination.name}</AppText><AppText>{destination.country}</AppText><AppText typographyRole="caption">Marked visited {new Date(record.dateMarkedVisited).toLocaleDateString()}</AppText></View></Tappable>;
      })}
    </ScreenContainer>
  );
}

function Counter({ label, value }: { label: string; value: number }) { return <View style={styles.counter}><AppText typographyRole="heading">{value}</AppText><AppText typographyRole="label">{label}</AppText></View>; }
function PassportStamp({ country, name }: { country: string; name: string }) { return <View accessibilityLabel={`${name}, ${country} Passport stamp`} accessibilityRole="image" style={styles.stamp}><AppText typographyRole="heading">WU</AppText><AppText typographyRole="caption">{name.toUpperCase()}</AppText><AppText typographyRole="caption">VISITED</AppText></View>; }

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing.xl }, secondary: { color: colors.textSecondary }, counters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing['2xl'] },
  counter: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, flex: 1, gap: spacing.xs, minWidth: 150, padding: spacing.lg },
  entry: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
  stamp: { alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderColor: colors.brand, borderRadius: radius.pill, borderStyle: 'dashed', borderWidth: 3, height: 132, justifyContent: 'center', transform: [{ rotate: '-4deg' }], width: 132 }, copy: { flex: 1, gap: spacing.xs },
});
