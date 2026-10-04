import { render, screen } from '@testing-library/react-native';
import { Slot } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

import MapRoute from '../app/(tabs)/map';
import IndexRoute from '../app/index';
import DiscoverRoute from '../app/(tabs)/discover';
import DestinationRoute from '../app/destination/[destinationId]';
import LayerStoryRoute from '../app/layer/[layer]';

const routeScreens = [
  [MapRoute, 'Map'],
] as const;

function TestLayout() {
  return <Slot />;
}

describe('approved Phase 1 routes', () => {
  it('redirects the root route to Discover', async () => {
    renderRouter(
      {
        _layout: TestLayout,
        index: IndexRoute,
        '(tabs)/_layout': TestLayout,
        '(tabs)/discover': DiscoverRoute,
      },
      { initialUrl: '/' },
    );

    expect(await screen.findByRole('header', { name: 'Unfold somewhere unforgettable.' })).toBeTruthy();
  });

  it.each(routeScreens)('keeps the deferred %s route as a placeholder', (Route, heading) => {
    render(<Route />);

    expect(screen.getByRole('header', { name: heading })).toBeTruthy();
  });

  it('renders the Layer Story route cross-destination without a destination id', async () => {
    renderRouter({ _layout: TestLayout, 'layer/[layer]': LayerStoryRoute }, { initialUrl: '/layer/culture' });

    expect(await screen.findByRole('header', { name: 'Culture Layer' })).toBeTruthy();
    expect(screen.getByText('A cross-destination edit from the current World Unfolded collection.')).toBeTruthy();
  });

  it('renders the Bali cinematic layer route when a destination id is passed', async () => {
    renderRouter({ _layout: TestLayout, 'layer/[layer]': LayerStoryRoute }, { initialUrl: '/layer/culture?destinationId=bali' });

    expect(await screen.findByRole('header', { name: 'Culture Layer' })).toBeTruthy();
    expect(screen.getByLabelText('Open Barong Dance')).toBeTruthy();
    expect(screen.queryByLabelText('Open Medina Craft Souks')).toBeNull();
  });

  it.each([
    ['/destination/bali', 'Overview', 'About Bali'],
    ['/destination/bali?tab=overview', 'Overview', 'About Bali'],
    ['/destination/bali?tab=layers', 'Layers', 'Explore Bali by layer'],
    ['/destination/bali?tab=places', 'Places', 'Places in Bali'],
  ])('opens destination URL %s in the %s section', async (initialUrl, tab, heading) => {
    renderRouter(
      { _layout: TestLayout, 'destination/[destinationId]': DestinationRoute },
      { initialUrl },
    );

    expect(await screen.findByRole('header', { name: heading })).toBeTruthy();
    expect(screen.getByRole('tab', { name: `${tab} destination tab` }).props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
  });

  it.each(['/destination/bali?tab=invalid', '/destination/bali?tab='])('defaults invalid destination tab state to Overview for %s', async (initialUrl) => {
    renderRouter(
      { _layout: TestLayout, 'destination/[destinationId]': DestinationRoute },
      { initialUrl },
    );

    expect(await screen.findByRole('header', { name: 'About Bali' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Overview destination tab' }).props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
  });
});
