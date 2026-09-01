import { useRouter } from 'expo-router';

import { ExploreScreen } from '@/features/explore/ExploreScreen';

export default function ExploreRoute() {
  const router = useRouter();
  return <ExploreScreen onOpenDestination={(id) => router.push(`/destination/${id}`)} onOpenItem={(id) => router.push(`/item/${id}`)} />;
}
