import { useLocalSearchParams, useRouter } from 'expo-router';

import { LayerStoryScreen } from '@/features/discover/LayerStoryScreen';

export default function LayerStoryRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ destinationId?: string | string[]; layer?: string | string[] }>();
  const layer = Array.isArray(params.layer) ? params.layer[0] : params.layer;
  const destinationId = Array.isArray(params.destinationId) ? params.destinationId[0] : params.destinationId;
  return <LayerStoryScreen destinationId={destinationId} layer={layer} onBack={() => router.back()} onOpenItem={(id) => router.push(`/item/${id}`)} />;
}
