export interface AccessibilityPreferencesState {
  reduceMotion: boolean;
  textScale: 'default' | 'large';
}

export interface ProfileStoreState {
  interestIds: readonly string[];
  preferredRegionIds: readonly string[];
  layerInterestIds: readonly string[];
  accessibilityPreferences: AccessibilityPreferencesState;
}

export interface ProfileStoreActions {
  setInterestIds: (interestIds: readonly string[]) => void;
  setPreferredRegionIds: (regionIds: readonly string[]) => void;
  setLayerInterestIds: (layerIds: readonly string[]) => void;
  setAccessibilityPreferences: (preferences: AccessibilityPreferencesState) => void;
}

export type ProfileStoreShape = ProfileStoreState & ProfileStoreActions;
