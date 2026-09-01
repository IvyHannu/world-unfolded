import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { Tappable } from '@/components/ui';
import { colors, elevation, fontFamilies, radius, spacing } from '@/tokens';

type TabIconName = keyof typeof Ionicons.glyphMap;
const tabIcons: Record<string, { active: TabIconName; inactive: TabIconName }> = {
  discover: { active: 'compass', inactive: 'compass-outline' },
  saved: { active: 'heart', inactive: 'heart-outline' },
  passport: { active: 'book', inactive: 'book-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export default function TabLayout() {
  return <Tabs screenOptions={({ route }) => ({
    headerShown: false,
    tabBarAccessibilityLabel: `${route.name[0].toUpperCase()}${route.name.slice(1)} tab`,
    tabBarActiveTintColor: colors.brand,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarButton: ({ children, disabled, onPress, ref, style, ...props }) => {
      void ref;
      return <Tappable {...props} accessibilityLabel={`${route.name[0].toUpperCase()}${route.name.slice(1)} tab`} accessibilityRole="tab" disabled={disabled ?? false} onPress={(event) => onPress?.(event)} style={style}>{children}</Tappable>;
    },
    tabBarIcon: ({ color, focused, size }) => {
      const icons = tabIcons[route.name];
      return icons ? <Ionicons color={color} name={focused ? icons.active : icons.inactive} size={size} /> : null;
    },
    tabBarItemStyle: { minHeight: 58, minWidth: 64, paddingVertical: spacing.xs },
    tabBarLabelStyle: { fontFamily: fontFamilies.uiSemibold, fontSize: 11 },
    tabBarStyle: { ...elevation.overlay, backgroundColor: colors.surface, borderRadius: radius.pill, borderTopWidth: 0, bottom: Platform.OS === 'web' ? 14 : 10, height: 70, left: 16, paddingHorizontal: spacing.xs, position: 'absolute', right: 16 },
  })}>
    <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
    <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
    <Tabs.Screen name="passport" options={{ title: 'Passport' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    <Tabs.Screen name="explore" options={{ href: null }} />
    <Tabs.Screen name="map" options={{ href: null }} />
  </Tabs>;
}
