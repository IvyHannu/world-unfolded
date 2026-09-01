import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Chip, EmptyState, ScreenContainer, Tappable } from '@/components/ui';
import { getDestinationById, getDiscoveryItemById } from '@/content/selectors';
import { usePassportStore } from '@/state/passportStore';
import { useSavedStore } from '@/state/savedStore';
import { colors, radius, spacing } from '@/tokens';
import type { SavedItem } from '@/types';

type Filter = 'all' | SavedItem['status'];

export function SavedScreen({ onExplore, onOpenDestination, onOpenItem, onOpenPassport }: { onExplore: () => void; onOpenDestination: (id: string) => void; onOpenItem: (id: string) => void; onOpenPassport: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const records = useSavedStore((state) => state.records);
  const setStatus = useSavedStore((state) => state.setStatus);
  const remove = useSavedStore((state) => state.remove);
  const visited = usePassportStore((state) => state.visitedRecords);
  const markVisited = usePassportStore((state) => state.markVisited);
  const visible = records.filter((record) => filter === 'all' || record.status === filter);

  return (
    <ScreenContainer>
      <View style={styles.intro}><AppText accessibilityRole="header" typographyRole="display">Saved discoveries</AppText><AppText style={styles.secondary}>One list for references and places you want to go.</AppText></View>
      <View accessibilityLabel="Saved list filters" style={styles.filters}>
        <Chip label="All" onPress={() => setFilter('all')} selected={filter === 'all'} />
        <Chip label="Saved" onPress={() => setFilter('saved')} selected={filter === 'saved'} />
        <Chip label="Want to Go" onPress={() => setFilter('wantToGo')} selected={filter === 'wantToGo'} />
      </View>
      {visible.length === 0 ? <EmptyState actionLabel="Explore discoveries" message={records.length ? 'No records match this filter.' : 'Save a destination or discovery item to find it here.'} onAction={onExplore} title={records.length ? 'Nothing in this view' : 'Nothing saved yet'} /> : visible.map((record) => {
        const destination = record.subjectType === 'destination' ? getDestinationById(record.subjectId) : undefined;
        const item = record.subjectType === 'discoveryItem' ? getDiscoveryItemById(record.subjectId) : undefined;
        const name = destination?.name ?? item?.name;
        if (!name) return null;
        const isVisited = destination ? visited.some((entry) => entry.destinationId === destination.id) : false;
        return (
          <View key={record.subjectId} style={styles.record}>
            <Tappable accessibilityLabel={`Open ${name}`} accessibilityRole="link" onPress={() => destination ? onOpenDestination(destination.id) : onOpenItem(item!.id)} style={styles.open}>
              <AppText typographyRole="subheading">{name}</AppText><AppText typographyRole="caption">{destination ? 'Destination' : 'Discovery item'} · {record.status === 'saved' ? 'Saved' : 'Want to Go'}</AppText>
            </Tappable>
            <View style={styles.actions}>
              <Chip label="Saved" onPress={() => setStatus(record.subjectId, record.subjectType, 'saved')} selected={record.status === 'saved'} />
              <Chip label="Want to Go" onPress={() => setStatus(record.subjectId, record.subjectType, 'wantToGo')} selected={record.status === 'wantToGo'} />
              {destination ? <Chip label={isVisited ? 'Visited' : 'Mark visited'} onPress={() => { if (!isVisited) markVisited(destination.id); onOpenPassport(); }} selected={isVisited} /> : null}
              <Tappable accessibilityLabel={`Remove ${name} from Saved`} accessibilityRole="button" onPress={() => remove(record.subjectId)} style={styles.remove}><AppText typographyRole="label">Remove</AppText></Tappable>
            </View>
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing.xl }, secondary: { color: colors.textSecondary },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  record: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, gap: spacing.md, marginBottom: spacing.lg, padding: spacing.lg },
  open: { gap: spacing.xs, justifyContent: 'center' }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, remove: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
});
