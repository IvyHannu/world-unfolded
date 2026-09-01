import { useRouter } from 'expo-router';

import { DiscoverScreen } from '@/features/discover/DiscoverScreen';

export default function DiscoverRoute() {
  const router = useRouter();
  return <DiscoverScreen onOpenDestination={(id) => router.push(`/destination/${id}`)} onOpenItem={(id) => router.push(`/item/${id}`)} />;
}
