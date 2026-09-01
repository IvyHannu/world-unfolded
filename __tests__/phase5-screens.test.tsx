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
    fireEvent.press(screen.getByRole('button', { name: 'Southern Africa' }));
    fireEvent.press(screen.getByRole('button', { name: 'Larger Text' }));
    expect(useProfileStore.getState()).toEqual(expect.objectContaining({ interests: ['culture'], preferredRegions: ['southern_africa'], accessibilityPreferences: { reduceMotion: false, textScale: 'large' } }));

    const text = render(<AppText>Scaled text</AppText>).getByText('Scaled text');
    expect(StyleSheet.flatten(text.props.style)).toEqual(expect.objectContaining({ fontSize: typography.large.body.fontSize }));
  });

  it('suppresses image transitions when the in-app reduced-motion preference is enabled', () => {
    useProfileStore.getState().setReduceMotion(true);
    render(<ContentImage image={images[0]} />);
    expect(screen.getByLabelText(images[0].altText).props.transition).toEqual({ duration: 0 });
  });

  it('sets one Saved status per subject and marks Cape Town visited', () => {
    render(<DestinationScreen destination={destinations[0]} items={discoveryItems} onBack={jest.fn()} onOpenCredits={jest.fn()} onOpenItem={jest.fn()} />);
    fireEvent.press(screen.getByRole('button', { name: 'Saved' }));
    fireEvent.press(screen.getAllByRole('button', { name: 'Want to Go' })[0]);
    fireEvent.press(screen.getByRole('button', { name: 'Mark visited' }));
    expect(useSavedStore.getState().records).toEqual([expect.objectContaining({ subjectId: 'cape-town', status: 'wantToGo' })]);
    expect(usePassportStore.getState().visitedRecords).toEqual([expect.objectContaining({ destinationId: 'cape-town' })]);
  });

  it('renders the unified Saved list and its status filters', () => {
    useSavedStore.getState().setStatus('table-mountain', 'discoveryItem', 'saved', 'date');
    render(<SavedScreen onExplore={jest.fn()} onOpenDestination={jest.fn()} onOpenItem={jest.fn()} onOpenPassport={jest.fn()} />);
    expect(screen.getByLabelText('Open Table Mountain')).toBeTruthy();
    fireEvent.press(screen.getAllByRole('button', { name: 'Want to Go' })[0]);
    expect(screen.getByRole('header', { name: 'Nothing in this view' })).toBeTruthy();
  });

  it('renders derived Passport counters and a static stamp', () => {
    usePassportStore.getState().markVisited('cape-town', '2026-01-04T00:00:00.000Z');
    render(<PassportScreen onExplore={jest.fn()} onOpenDestination={jest.fn()} />);
    expect(screen.getByText('Countries visited')).toBeTruthy();
    expect(screen.getByText('Destinations visited')).toBeTruthy();
    expect(screen.getByLabelText('Cape Town, South Africa Passport stamp')).toBeTruthy();
  });
});
