import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Tappable } from '@/components/ui';
import { elevation, radius, spacing } from '@/tokens';

type TabIconName = keyof typeof Ionicons.glyphMap;
const tabIcons: Record<string, { active: TabIconName; inactive: TabIconName }> = {
  discover: { active: 'compass', inactive: 'compass-outline' },
  saved: { active: 'heart', inactive: 'heart-outline' },
  passport: { active: 'book', inactive: 'book-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

function FloatingDock({ descriptors, navigation, state }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter((route) => Boolean(tabIcons[route.name]));
  return <View pointerEvents="box-none" style={[styles.dockPosition, { bottom: insets.bottom + 24 }]}>
    <BlurView accessibilityLabel="Primary navigation" accessibilityRole="tablist" intensity={65} style={styles.dock} tint="dark">
      {routes.map((route) => {
        const focused = state.routes[state.index]?.key === route.key;
        const options = descriptors[route.key].options;
        const label = typeof options.title === 'string' ? options.title : route.name[0].toUpperCase() + route.name.slice(1);
        const icons = tabIcons[route.name];
        const onPress = () => {
          const event = navigation.emit({ canPreventDefault: true, target: route.key, type: 'tabPress' });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return <Tappable key={route.key} accessibilityLabel={`${label} tab`} accessibilityRole="tab" accessibilityState={{ selected: focused }} onPress={onPress} style={styles.tab}>
          <View style={[styles.iconBadge, focused && styles.activeBadge]}><Ionicons color={focused ? '#F25A3D' : '#FDFBF7'} name={focused ? icons.active : icons.inactive} size={19} /></View>
          <AppText typographyRole="caption" style={[styles.label, focused && styles.activeLabel]}>{label}</AppText>
        </Tappable>;
      })}
    </BlurView>
  </View>;
}

export default function TabLayout() {
  return <Tabs tabBar={(props) => <FloatingDock {...props} />} screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
    <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
    <Tabs.Screen name="passport" options={{ title: 'Passport' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    <Tabs.Screen name="map" options={{ href: null }} />
  </Tabs>;
}

const styles = StyleSheet.create({
  dockPosition: { alignItems: 'center', left: 0, position: 'absolute', right: 0 },
  dock: { alignItems: 'center', backgroundColor: 'rgba(3, 26, 47, 0.82)', borderColor: 'rgba(253, 251, 247, 0.22)', borderRadius: 34, borderWidth: 1, flexDirection: 'row', height: 68, maxWidth: 360, overflow: 'hidden', paddingHorizontal: spacing.xs, width: '88%', ...elevation.overlay },
  tab: { alignItems: 'center', flex: 1, gap: 1, height: 58, justifyContent: 'center', minWidth: 48 },
  iconBadge: { alignItems: 'center', borderRadius: radius.pill, height: 32, justifyContent: 'center', width: 32 },
  activeBadge: { backgroundColor: 'rgba(242, 90, 61, 0.2)', transform: [{ translateY: -3 }], ...elevation.raised },
  label: { color: '#FDFBF7', fontSize: 10, opacity: 0.82 },
  activeLabel: { color: '#F25A3D', opacity: 1 },
});
