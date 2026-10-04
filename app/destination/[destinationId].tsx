import { useLocalSearchParams, useRouter } from 'expo-router';

import { getDestinationById, getItemsForDestination } from '@/content/selectors';
import { DestinationScreen, type DestinationDockTab, type DestinationSection } from '@/features/destination/DestinationScreen';

const sections: readonly DestinationSection[] = ['overview', 'layers', 'places'];

export default function DestinationRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ destinationId?: string | string[]; tab?: string | string[] }>();
  const destinationId = Array.isArray(params.destinationId) ? params.destinationId[0] : params.destinationId;
  const requestedTab = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const section = sections.find((candidate) => candidate === requestedTab) ?? 'overview';
  const destination = destinationId ? getDestinationById(destinationId) : undefined;
  const onOpenTab = (tab: DestinationDockTab) => {
    if (tab === 'explore') router.push('/explore');
    else router.push(`/(tabs)/${tab}`);
  };
  return <DestinationScreen section={section} destination={destination} items={destination ? getItemsForDestination(destination.id) : []} onBack={() => router.back()} onOpenItem={(itemId) => router.push(`/item/${itemId}`)} onOpenLayer={(layer) => router.push({ pathname: '/layer/[layer]', params: { destinationId: destination?.id, layer } })} onSectionChange={(nextSection) => router.setParams({ tab: nextSection })} onOpenTab={onOpenTab} />;
}
