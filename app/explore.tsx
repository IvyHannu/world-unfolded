import { useRouter } from 'expo-router';

import { ExploreScreen } from '@/features/explore/ExploreScreen';

export default function ExploreRoute() {
  const router = useRouter();
  const tabRoutes = {
    discover: '/(tabs)/discover',
    saved: '/(tabs)/saved',
    passport: '/(tabs)/passport',
    profile: '/(tabs)/profile',
  } as const;
  return (
    <ExploreScreen
      onBack={() => router.back()}
      onOpenDestination={(id) => router.push(`/destination/${id}`)}
      onOpenItem={(id) => router.push(`/item/${id}`)}
      onOpenTab={(tab) => router.replace(tabRoutes[tab])}
    />
  );
}
