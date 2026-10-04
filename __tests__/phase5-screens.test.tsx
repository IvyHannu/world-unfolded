import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppText, ContentImage } from '@/components/ui';
import { destinations, discoveryItems, images } from '@/content/contentIndex';
import { DestinationScreen } from '@/features/destination/DestinationScreen';
import { PassportScreen } from '@/features/passport/PassportScreen';
import { ProfileScreen } from '@/features/profile/ProfileScreen';
import { SavedScreen } from '@/features/saved/SavedScreen';
import { usePassportStore } from '@/state/passportStore';
import { useProfileStore } from '@/state/profileStore';
import { useSavedStore } from '@/state/savedStore';
import { typography } from '@/tokens';

describe('Phase 5 screens and preferences', () => {
  beforeEach(() => {
    useProfileStore.getState().reset();
    useSavedStore.getState().reset();
    usePassportStore.getState().reset();
  });

  it('updates Profile selections and applies the discrete Larger Text scale', () => {
    render(<ProfileScreen />);
    fireEvent.press(screen.getAllByRole('button', { name: 'Culture' })[0]);
    fireEvent.press(screen.getByRole('button', { name: 'North Africa' }));
    fireEvent.press(screen.getByRole('button', { name: 'Larger Text' }));
    expect(useProfileStore.getState()).toEqual(expect.objectContaining({ interests: ['culture'], preferredRegions: ['north_africa'], accessibilityPreferences: { reduceMotion: false, textScale: 'large' } }));

    const text = render(<AppText>Scaled text</AppText>).getByText('Scaled text');
    expect(StyleSheet.flatten(text.props.style)).toEqual(expect.objectContaining({ fontSize: typography.large.body.fontSize }));
  });

  it('suppresses image transitions when the in-app reduced-motion preference is enabled', () => {
    useProfileStore.getState().setReduceMotion(true);
    render(<ContentImage image={images[0]} />);
    expect(screen.getByLabelText(images[0].altText).props.transition).toEqual({ duration: 0 });
  });

  it('sets one Saved status per subject and marks Bali visited', () => {
    render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><DestinationScreen destination={destinations[0]} items={discoveryItems} onBack={jest.fn()} onOpenItem={jest.fn()} onOpenLayer={jest.fn()} onOpenTab={jest.fn()} /></SafeAreaProvider>);
    fireEvent.press(screen.getByRole('button', { name: 'Save Bali' }));
    fireEvent.press(screen.getByRole('button', { name: 'Mark Bali Want to Go' }));
    fireEvent.press(screen.getByRole('button', { name: 'Mark Bali visited in Passport' }));
    expect(useSavedStore.getState().records).toEqual([expect.objectContaining({ subjectId: 'bali', status: 'wantToGo' })]);
    expect(usePassportStore.getState().visitedRecords).toEqual([expect.objectContaining({ destinationId: 'bali' })]);
    expect(screen.getByRole('button', { name: 'Bali visited in Passport' })).toBeTruthy();
  });

  it('keeps only Overview, Layers, and Places sections and opens Bali place details', () => {
    const onOpenItem = jest.fn();
    render(<SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}><DestinationScreen destination={destinations[0]} items={discoveryItems} onBack={jest.fn()} onOpenItem={onOpenItem} onOpenLayer={jest.fn()} onOpenTab={jest.fn()} /></SafeAreaProvider>);
    expect(screen.getByRole('header', { name: 'About Bali' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Featured places' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Suggested stories' })).toBeTruthy();
    expect(screen.queryByText('Hero image credits →')).toBeNull();
    expect(screen.queryByRole('tab', { name: 'Plan destination tab' })).toBeNull();
    expect(screen.queryByRole('tab', { name: 'Saved destination tab' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Open Tenganan Village' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Open Barong Dance' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Open Babi Guling' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Open Subak Water Temples' })).toBeNull();

    fireEvent.press(screen.getByRole('tab', { name: 'Layers destination tab' }));
    expect(screen.getByRole('header', { name: 'Explore Bali by layer' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /^Open (Iconic|Hidden|Culture|Taste|Nature) layer$/ })).toHaveLength(5);
    expect(screen.getByRole('tab', { name: 'Overview destination tab' }).props.accessibilityState).toEqual(expect.objectContaining({ selected: false }));
    fireEvent.press(screen.getByRole('tab', { name: 'Places destination tab' }));
    for (const place of ['Tanah Lot', 'Tenganan Village', 'Mount Batur', 'Nusa Penida', 'Ulun Danu Beratan', 'Uluwatu Temple']) {
      expect(screen.getByRole('link', { name: `Open ${place}` })).toBeTruthy();
    }
    fireEvent.press(screen.getByRole('link', { name: 'Open Nusa Penida' }));
    expect(onOpenItem).toHaveBeenCalledWith('nusa-penida');
  });

  it('renders a Saved item in the default All filter', () => {
    useSavedStore.getState().setStatus('tanah-lot', 'discoveryItem', 'saved', 'date');
    render(<SavedScreen onExplore={jest.fn()} onOpenDestination={jest.fn()} onOpenItem={jest.fn()} onOpenPassport={jest.fn()} />);
    expect(screen.getByRole('link', { name: 'Open Tanah Lot, Indonesia' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'All saved filter' }).props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
  });

  it('renders derived Passport counters and a static stamp', () => {
    usePassportStore.getState().markVisited('bali', '2026-01-04T00:00:00.000Z');
    render(<PassportScreen onExplore={jest.fn()} onOpenDestination={jest.fn()} />);
    expect(screen.getByText('Countries visited')).toBeTruthy();
    expect(screen.getByText('Destinations visited')).toBeTruthy();
    expect(screen.getByLabelText('Bali, Indonesia Passport stamp')).toBeTruthy();
  });
});
