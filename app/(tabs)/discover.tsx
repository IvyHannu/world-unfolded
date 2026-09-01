import { useRouter } from 'expo-router';

import { DiscoverScreen } from '@/features/discover/DiscoverScreen';

export default function DiscoverRoute() {
  const router = useRouter();
  return <DiscoverScreen onExplore={() => router.push('/explore')} onOpenDestination={(id) => router.push(`/destination/${id}`)} onOpenItem={(id) => router.push(`/item/${id}`)} onOpenProfile={() => router.push('/(tabs)/profile')} />;
}
