import { Text, View } from 'react-native';

interface PlaceholderScreenProps {
  title: string;
}

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <View>
      <Text accessibilityRole="header">{title}</Text>
      <Text>Phase 1 placeholder</Text>
    </View>
  );
}
