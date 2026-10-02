import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

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
    render(<DestinationScreen destination={destinations[0]} items={discoveryItems} onBack={jest.fn()} onOpenCredits={jest.fn()} onOpenItem={jest.fn()} onOpenLayer={jest.fn()} />);
    fireEvent.press(screen.getByRole('button', { name: 'Save Bali' }));
    fireEvent.press(screen.getByRole('button', { name: 'Mark Bali Want to Go' }));
    fireEvent.press(screen.getByRole('button', { name: 'Mark Bali visited' }));
    expect(useSavedStore.getState().records).toEqual([expect.objectContaining({ subjectId: 'bali', status: 'wantToGo' })]);
    expect(usePassportStore.getState().visitedRecords).toEqual([expect.objectContaining({ destinationId: 'bali' })]);
  });

  it('renders the unified Saved list and its status filters', () => {
    useSavedStore.getState().setStatus('tanah-lot', 'discoveryItem', 'saved', 'date');
    render(<SavedScreen onExplore={jest.fn()} onOpenDestination={jest.fn()} onOpenItem={jest.fn()} onOpenPassport={jest.fn()} />);
    expect(screen.getByLabelText('Open Tanah Lot')).toBeTruthy();
    fireEvent.press(screen.getAllByRole('button', { name: 'Want to Go' })[0]);
    expect(screen.getByRole('header', { name: 'Nothing in this view' })).toBeTruthy();
  });

  it('renders derived Passport counters and a static stamp', () => {
    usePassportStore.getState().markVisited('bali', '2026-01-04T00:00:00.000Z');
    render(<PassportScreen onExplore={jest.fn()} onOpenDestination={jest.fn()} />);
    expect(screen.getByText('Countries visited')).toBeTruthy();
    expect(screen.getByText('Destinations visited')).toBeTruthy();
    expect(screen.getByLabelText('Bali, Indonesia Passport stamp')).toBeTruthy();
  });
});
