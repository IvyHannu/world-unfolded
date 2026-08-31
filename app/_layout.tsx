import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="destination/[id]" options={{ title: 'Destination' }} />
      <Stack.Screen name="item/[id]" options={{ title: 'Discovery Item' }} />
      <Stack.Screen name="image-credits/[imageId]" options={{ title: 'Image Credits' }} />
    </Stack>
  );
}
