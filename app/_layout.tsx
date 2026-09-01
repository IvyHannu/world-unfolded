import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  useFonts as usePlayfairFonts,
} from '@expo-google-fonts/playfair-display';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { colors, fontFamilies } from '@/tokens';
import { LoadingIndicator, ScreenContainer } from '@/components/ui';
import { useStoreHydration } from '@/persistence/hydration';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded] = useInterFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const [playfairLoaded] = usePlayfairFonts({ PlayfairDisplay_400Regular, PlayfairDisplay_700Bold });
  const fontsLoaded = interLoaded && playfairLoaded;
  const storesHydrated = useStoreHydration();
  const ready = fontsLoaded && storesHydrated;

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      {!storesHydrated ? <ScreenContainer scroll={false}><LoadingIndicator label="Loading your saved World Unfolded data" /></ScreenContainer> : (
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.textPrimary, headerTitleStyle: { fontFamily: fontFamilies.uiSemibold } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="explore" options={{ title: 'Explore' }} />
        <Stack.Screen name="destination/[id]" options={{ title: 'Destination' }} />
        <Stack.Screen name="item/[id]" options={{ title: 'Discovery Item' }} />
        <Stack.Screen name="image-credits/[imageId]" options={{ title: 'Image Credits' }} />
      </Stack>
      )}
    </SafeAreaProvider>
  );
}
