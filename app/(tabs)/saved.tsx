import { useRouter } from 'expo-router';

import { SavedScreen } from '@/features/saved/SavedScreen';

export default function SavedRoute() {
  const router = useRouter();
  return <SavedScreen onExplore={() => router.push('/explore')} onOpenDestination={(id) => router.push(`/destination/${id}`)} onOpenItem={(id) => router.push(`/item/${id}`)} onOpenPassport={() => router.push('/passport')} />;
}
