import { render, screen } from '@testing-library/react-native';
import { Slot } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

import MapRoute from '../app/(tabs)/map';
import IndexRoute from '../app/index';
import DiscoverRoute from '../app/(tabs)/discover';
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

  it('renders the Layer Story route scoped when a destination id is passed', async () => {
    renderRouter({ _layout: TestLayout, 'layer/[layer]': LayerStoryRoute }, { initialUrl: '/layer/culture?destinationId=bali' });

    expect(await screen.findByText('Bali through the Culture Layer.')).toBeTruthy();
    expect(screen.getByLabelText('Open Subak Water Temples')).toBeTruthy();
    expect(screen.queryByLabelText('Open Medina Craft Souks')).toBeNull();
  });
});
