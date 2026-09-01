import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform, StyleSheet } from 'react-native';

import { Button, Card, Chip, EmptyState, ErrorState, LoadingIndicator, OfflineBanner, ScreenContainer, SuccessState, Tappable } from '@/components/ui';
import { colors, discoveryLayerColors, palette, radius, spacing } from '@/tokens';

describe('Phase 3 shared components', () => {
  it('gives Tappable explicit semantics, a 48dp target, activation, and a focus indicator', () => {
    const onPress = jest.fn();
    render(<Tappable accessibilityLabel="Open details" accessibilityRole="button" onPress={onPress}>Open</Tappable>);

    const tappable = screen.getByRole('button', { name: 'Open details' });
    expect(StyleSheet.flatten(tappable.props.style)).toEqual(expect.objectContaining({ minHeight: 48, minWidth: 48 }));
    fireEvent(tappable, 'focus');
    expect(StyleSheet.flatten(tappable.props.style)).toEqual(expect.objectContaining({ borderColor: colors.focus, borderWidth: 3 }));
    fireEvent.press(tappable);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('supports explicit Enter and Space keyboard activation on web', () => {
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'web' });
    const onPress = jest.fn();
    render(<Tappable accessibilityLabel="Keyboard action" accessibilityRole="button" onPress={onPress}>Action</Tappable>);
    const tappable = screen.getByLabelText('Keyboard action');

    fireEvent(tappable, 'keyDown', { nativeEvent: { key: 'Enter' }, preventDefault: jest.fn() });
    fireEvent(tappable, 'keyDown', { nativeEvent: { key: ' ' }, preventDefault: jest.fn() });
    expect(onPress).toHaveBeenCalledTimes(2);
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalOS });
  });

  it('exposes disabled and selected states without relying on color alone', () => {
    render(<><Button disabled label="Continue" onPress={jest.fn()} /><Chip label="Culture" onPress={jest.fn()} selected /></>);
    expect(screen.getByRole('button', { name: 'Continue' }).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    expect(screen.getByRole('button', { name: 'Culture' }).props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
    expect(screen.getByText('✓ Culture')).toBeTruthy();
  });

  it('renders shared containers and feedback states with accessible content', () => {
    render(
      <ScreenContainer>
        <Card><LoadingIndicator label="Loading destinations" /></Card>
        <EmptyState message="Nothing saved." title="No saved places" />
        <ErrorState actionLabel="Try again" message="Unable to load." onAction={jest.fn()} title="Something went wrong" />
        <SuccessState message="Saved for later." title="Saved" />
        <OfflineBanner />
      </ScreenContainer>,
    );

    expect(screen.getByLabelText('Loading destinations')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'No saved places' })).toBeTruthy();
    expect(screen.getByLabelText('error: Something went wrong')).toBeTruthy();
    expect(screen.getByLabelText('Offline status')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
    expect(screen.getByText('Saved for later.')).toBeTruthy();
    expect(screen.getByText('Offline')).toBeTruthy();
  });
});

describe('approved design tokens', () => {
  it('uses the approved palette, discovery layers, and restrained geometry', () => {
    expect(palette).toEqual({ tropicalSky: '#D7F3F4', sunsetCoral: '#FFD7C2', sunsetVermilion: '#C94F3D', carbonInk: '#20242C', softMist: '#F7FEFC', oceanBlue: '#1677A8', goldenSun: '#F2B84B', orchidViolet: '#8B5FBF', terracottaClay: '#B8643E', palmGreen: '#6F8F55' });
    expect(discoveryLayerColors).toEqual({ iconic: '#F2B84B', hidden: '#8B5FBF', culture: '#B8643E', taste: '#C94F3D', nature: '#6F8F55' });
    expect(colors).toEqual(expect.objectContaining({ background: '#D7F3F4', surface: '#F7FEFC', textPrimary: '#20242C', brand: '#C94F3D', primaryAction: '#1677A8' }));
    expect(contrastRatio(colors.textPrimary, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(colors.primaryActionText, colors.primaryAction)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(colors.textSecondary, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(spacing.lg).toBe(24);
    expect(radius.lg).toBe(20);
  });
});

function contrastRatio(foreground: string, background: string) {
  const luminance = (hex: string) => {
    const channels = hex.match(/[\dA-F]{2}/gi)!.map((channel) => parseInt(channel, 16) / 255).map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}
