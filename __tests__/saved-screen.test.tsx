import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SavedScreen } from '@/features/saved/SavedScreen';
import { useSavedStore } from '@/state/savedStore';

const makeScreen = (onExplore = jest.fn(), onOpenItem = jest.fn()) => (
  <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
    <SavedScreen onExplore={onExplore} onOpenDestination={jest.fn()} onOpenItem={onOpenItem} onOpenPassport={jest.fn()} />
  </SafeAreaProvider>
);

describe('Saved screen', () => {
  beforeEach(() => useSavedStore.getState().reset());

  it('shows image-led saved cards and filters them locally by category', () => {
    const onOpenItem = jest.fn();
    useSavedStore.getState().setStatus('tanah-lot', 'discoveryItem', 'saved', '2026-02-03T00:00:00.000Z');
    useSavedStore.getState().setStatus('subak', 'discoveryItem', 'saved', '2026-02-02T00:00:00.000Z');
    useSavedStore.getState().setStatus('babi-guling', 'discoveryItem', 'wantToGo', '2026-02-01T00:00:00.000Z');
    render(makeScreen(jest.fn(), onOpenItem));

    expect(screen.getByRole('header', { name: 'Saved' })).toBeTruthy();
    expect(screen.getByText('3 saved items')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Open Tanah Lot, Indonesia' })).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Places saved filter' }));
    expect(screen.getByRole('link', { name: 'Open Tanah Lot, Indonesia' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Open Barong Dance, Indonesia' })).toBeNull();
    fireEvent.press(screen.getByRole('link', { name: 'Open Tanah Lot, Indonesia' }));
    expect(onOpenItem).toHaveBeenCalledWith('tanah-lot');

    fireEvent.press(screen.getByRole('button', { name: 'Stories saved filter' }));
    expect(screen.getByRole('link', { name: 'Open Barong Dance, Indonesia' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Food saved filter' }));
    expect(screen.getByRole('link', { name: 'Open Babi Guling, Indonesia' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Sort saved items, Newest' }));
    expect(screen.getByRole('button', { name: 'Sort saved items, Oldest' })).toBeTruthy();
  });

  it('shows the empty state and opens Explore', () => {
    const onExplore = jest.fn();
    render(makeScreen(onExplore));

    expect(screen.getByRole('header', { name: 'Nothing saved yet' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Start exploring' }));
    expect(onExplore).toHaveBeenCalledTimes(1);
  });
});
