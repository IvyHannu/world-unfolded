import { useLocalSearchParams, useRouter } from 'expo-router';

import { getImageById } from '@/content/selectors';
import { ImageCreditsScreen } from '@/features/destination/ImageCreditsScreen';

export default function ImageCreditsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageId?: string | string[] }>();
  const imageId = Array.isArray(params.imageId) ? params.imageId[0] : params.imageId;
  return <ImageCreditsScreen image={imageId ? getImageById(imageId) : undefined} onBack={() => router.back()} />;
}
