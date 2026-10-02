import { useRouter } from 'expo-router';

import { DiscoverScreen } from '@/features/discover/DiscoverScreen';

export default function DiscoverRoute() {
  const router = useRouter();
  return <DiscoverScreen onExplore={() => router.push('/explore')} onOpenDestination={(id) => router.push(`/destination/${id}`)} onOpenLayer={(layer) => router.push({ pathname: '/layer/[layer]', params: { layer } })} onOpenProfile={() => router.push('/(tabs)/profile')} />;
}
