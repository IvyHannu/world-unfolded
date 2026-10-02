import { useLocalSearchParams, useRouter } from 'expo-router';

import { getDestinationById, getItemsForDestination } from '@/content/selectors';
import { DestinationScreen } from '@/features/destination/DestinationScreen';

export default function DestinationRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const destination = id ? getDestinationById(id) : undefined;
  return <DestinationScreen destination={destination} items={destination ? getItemsForDestination(destination.id) : []} onBack={() => router.back()} onOpenCredits={(imageId) => router.push(`/image-credits/${imageId}`)} onOpenItem={(itemId) => router.push(`/item/${itemId}`)} onOpenLayer={(layer) => router.push({ pathname: '/layer/[layer]', params: { destinationId: destination?.id, layer } })} />;
}
