import * as Reanimated from 'react-native-reanimated';

import { useProfileStore } from '@/state/profileStore';

const useSystemReducedMotion = typeof Reanimated.useReducedMotion === 'function' ? Reanimated.useReducedMotion : () => false;

export function useReducedMotion() {
  const preference = useProfileStore((state) => state.accessibilityPreferences.reduceMotion);
  const systemPreference = useSystemReducedMotion();
  return preference || Boolean(systemPreference);
}
