import { useState, type ComponentProps, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';

import { focusRing } from '@/components/accessibility';
import { colors } from '@/tokens';

type PressableProps = ComponentProps<typeof Pressable>;

interface TappableProps extends Omit<PressableProps, 'accessibilityLabel' | 'accessibilityRole' | 'children' | 'disabled' | 'onPress' | 'style'> {
  accessibilityLabel: string;
  accessibilityRole: NonNullable<PressableProps['accessibilityRole']>;
  children: ReactNode;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

interface WebKeyboardEvent {
  nativeEvent: { key: string };
  preventDefault?: () => void;
}

export function Tappable({ accessibilityLabel, accessibilityRole, children, disabled = false, onPress, style, ...props }: TappableProps) {
  const [focused, setFocused] = useState(false);
  const webKeyboardProps = Platform.OS === 'web'
    ? {
        onKeyDown: (event: WebKeyboardEvent) => {
          if (!disabled && (event.nativeEvent.key === 'Enter' || event.nativeEvent.key === ' ')) {
            event.preventDefault?.();
            onPress(event as unknown as GestureResponderEvent);
          }
        },
        tabIndex: (disabled ? -1 : 0) as -1 | 0,
      }
    : {};

  return (
    <Pressable
      {...props}
      {...webKeyboardProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...props.accessibilityState, disabled }}
      disabled={disabled}
      focusable={!disabled}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [styles.base, style, pressed && styles.pressed, disabled && styles.disabled, focused && focusRing]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 48, minWidth: 48 },
  pressed: { opacity: 0.78 },
  disabled: { backgroundColor: colors.disabledSurface, opacity: 0.68 },
});
