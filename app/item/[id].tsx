import { useLocalSearchParams, useRouter } from 'expo-router';

import { getDiscoveryItemById } from '@/content/selectors';
import { DiscoveryItemScreen } from '@/features/destination/DiscoveryItemScreen';

export default function DiscoveryItemRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  return <DiscoveryItemScreen item={id ? getDiscoveryItemById(id) : undefined} onBack={() => router.back()} onOpenCredits={(imageId) => router.push(`/image-credits/${imageId}`)} />;
}
