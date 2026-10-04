import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';

import { focusRing } from '@/components/accessibility';
import { colors } from '@/tokens';

type PressableProps = ComponentProps<typeof Pressable>;

interface TappableProps extends Omit<PressableProps, 'accessibilityLabel' | 'accessibilityRole' | 'children' | 'disabled' | 'onPress' | 'style'> {
  accessibilityLabel: string;
  accessibilityRole: NonNullable<PressableProps['accessibilityRole']>;
  children: ReactNode;
  disabled?: boolean;
  focusStyle?: StyleProp<ViewStyle>;
  focusVisibleOnly?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

interface WebKeyboardEvent {
  nativeEvent: { key: string };
  preventDefault?: () => void;
}

let webInputModality: 'keyboard' | 'pointer' = 'keyboard';
let focusVisibleSubscribers = 0;
const updateForKeyboard = () => { webInputModality = 'keyboard'; };
const updateForPointer = () => { webInputModality = 'pointer'; };

function subscribeToInputModality() {
  if (typeof document === 'undefined') return () => undefined;
  if (focusVisibleSubscribers === 0) {
    document.addEventListener('keydown', updateForKeyboard, true);
    document.addEventListener('pointerdown', updateForPointer, true);
    document.addEventListener('touchstart', updateForPointer, true);
  }
  focusVisibleSubscribers += 1;

  return () => {
    focusVisibleSubscribers -= 1;
    if (focusVisibleSubscribers === 0) {
      document.removeEventListener('keydown', updateForKeyboard, true);
      document.removeEventListener('pointerdown', updateForPointer, true);
      document.removeEventListener('touchstart', updateForPointer, true);
    }
  };
}

export function Tappable({ accessibilityLabel, accessibilityRole, children, disabled = false, focusStyle, focusVisibleOnly = false, onPress, style, ...props }: TappableProps) {
  const [focused, setFocused] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  useEffect(() => {
    if (!focusVisibleOnly || Platform.OS !== 'web') return undefined;
    return subscribeToInputModality();
  }, [focusVisibleOnly]);

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
      onBlur={() => {
        setFocused(false);
        setFocusVisible(false);
      }}
      onFocus={() => {
        setFocused(true);
        setFocusVisible(!focusVisibleOnly || Platform.OS !== 'web' || webInputModality === 'keyboard');
      }}
      onPress={(event) => {
        if (focusVisibleOnly && Platform.OS === 'web') setFocusVisible(webInputModality === 'keyboard');
        onPress(event);
      }}
      style={({ pressed }) => [styles.base, style, pressed && styles.pressed, disabled && styles.disabled, focused && (!focusVisibleOnly || focusVisible) && (focusStyle ?? focusRing)]}
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
