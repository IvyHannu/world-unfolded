import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PassportScreen } from '@/features/passport/PassportScreen';
import { usePassportStore } from '@/state/passportStore';

const makeScreen = (onExplore = jest.fn()) => (
  <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
    <PassportScreen onExplore={onExplore} />
  </SafeAreaProvider>
);

describe('Passport screen', () => {
  beforeEach(() => usePassportStore.getState().reset());

  it('shows visit counters, Bali passport card, and dated journey memory from visited state', () => {
    usePassportStore.getState().markVisited('bali', '2026-01-04T00:00:00.000Z');
    const { getAllByText, getByRole, getByText, getByLabelText } = render(makeScreen());

    expect(getByRole('header', { name: 'Your Passport' })).toBeTruthy();
    expect(getByText('Countries visited')).toBeTruthy();
    expect(getByText('Destinations visited')).toBeTruthy();
    expect(getByLabelText('Bali, Indonesia Passport stamp')).toBeTruthy();
    expect(getByRole('header', { name: 'My Journey' })).toBeTruthy();
    expect(getAllByText('JAN 4, 2026')).toHaveLength(1);
    expect(getByText('OCT 3 2026')).toBeTruthy();

    fireEvent.press(getByRole('button', { name: 'Open Bali Passport' }));
    expect(getByRole('header', { name: 'Bali' })).toBeTruthy();
    expect(getByRole('tab', { name: 'Stamps Passport tab' })).toBeTruthy();
    expect(getByRole('tab', { name: 'Highlights Passport tab' })).toBeTruthy();
    expect(getByRole('tab', { name: 'Notes Passport tab' })).toBeTruthy();
    expect(getByLabelText('Journey stamp grid')).toBeTruthy();
  });

  it('features the latest visit while keeping Bali then Kyoto in the journey and opening rows by destination', () => {
    usePassportStore.getState().markVisited('bali', '2026-05-12T00:00:00.000Z');
    usePassportStore.getState().markVisited('kyoto', '2026-04-05T00:00:00.000Z');
    render(makeScreen());

    expect(screen.getByRole('button', { name: 'Open Bali Passport' })).toBeTruthy();
    expect(screen.getByLabelText('Bali, Indonesia Passport stamp')).toBeTruthy();
    const journeyRows = screen.getAllByRole('button', { name: /Open .* memory/ });
    expect(journeyRows[0].props.accessibilityLabel).toBe('Open Bali memory');
    expect(journeyRows[1].props.accessibilityLabel).toBe('Open Kyoto memory');

    fireEvent.press(journeyRows[1]);
    expect(screen.getByRole('header', { name: 'Kyoto' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Back to Your Passport' }));
    expect(screen.getByRole('button', { name: 'Open Bali Passport' })).toBeTruthy();
  });

  it('shows highlights and notes in the destination Passport detail', () => {
    usePassportStore.getState().markVisited('bali', '2026-01-04T00:00:00.000Z');
    render(makeScreen());

    fireEvent.press(screen.getByRole('button', { name: 'Open Bali Passport' }));
    fireEvent.press(screen.getByRole('tab', { name: 'Highlights Passport tab' }));
    expect(screen.getAllByText('Highlights').length).toBeGreaterThan(0);
    expect(screen.getByText('Tanah Lot')).toBeTruthy();

    fireEvent.press(screen.getByRole('tab', { name: 'Notes Passport tab' }));
    expect(screen.getByText('Your personal notes for Bali will live here.')).toBeTruthy();
  });

  it('shows the empty state and opens Explore when no destinations are visited', () => {
    const onExplore = jest.fn();
    render(makeScreen(onExplore));

    expect(screen.getByRole('header', { name: 'Nothing here yet' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Start exploring' }));
    expect(onExplore).toHaveBeenCalledTimes(1);
  });
});
