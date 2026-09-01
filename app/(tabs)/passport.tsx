import { useRouter } from 'expo-router';

import { PassportScreen } from '@/features/passport/PassportScreen';

export default function PassportRoute() {
  const router = useRouter();
  return <PassportScreen onExplore={() => router.push('/explore')} onOpenDestination={(id) => router.push(`/destination/${id}`)} />;
}
