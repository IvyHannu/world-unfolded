import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Tappable } from '@/components/ui';
import { colors, fontFamilies, spacing } from '@/tokens';

type TabIconName = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<string, { active: TabIconName; inactive: TabIconName }> = {
  discover: { active: 'compass', inactive: 'compass-outline' },
  explore: { active: 'search', inactive: 'search-outline' },
  map: { active: 'map', inactive: 'map-outline' },
  saved: { active: 'bookmark', inactive: 'bookmark-outline' },
  passport: { active: 'book', inactive: 'book-outline' },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarAccessibilityLabel: `${route.name[0].toUpperCase()}${route.name.slice(1)} tab`,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarButton: ({ children, disabled, onPress, ref, style, ...tabButtonProps }) => {
          void ref;
          return (
            <Tappable
              {...tabButtonProps}
              accessibilityLabel={`${route.name[0].toUpperCase()}${route.name.slice(1)} tab`}
              accessibilityRole="tab"
              disabled={disabled ?? false}
              onPress={(event) => onPress?.(event)}
              style={style}
            >
              {children}
            </Tappable>
          );
        },
        tabBarIcon: ({ color, focused, size }) => {
          const icons = tabIcons[route.name];
          return <Ionicons color={color} name={focused ? icons.active : icons.inactive} size={size} />;
        },
        tabBarItemStyle: { minHeight: 48, paddingVertical: spacing.xs },
        tabBarLabelStyle: { fontFamily: fontFamilies.uiSemibold, fontSize: 12 },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, height: 72 },
      })}
    >
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      <Tabs.Screen name="passport" options={{ title: 'Passport' }} />
    </Tabs>
  );
}
