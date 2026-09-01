import { render, screen } from '@testing-library/react-native';
import { Slot } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

import MapRoute from '../app/(tabs)/map';
import PassportRoute from '../app/(tabs)/passport';
import SavedRoute from '../app/(tabs)/saved';
import IndexRoute from '../app/index';
import ProfileRoute from '../app/profile';
import DiscoverRoute from '../app/(tabs)/discover';

const routeScreens = [
  [MapRoute, 'Map'],
  [SavedRoute, 'Saved'],
  [PassportRoute, 'Passport'],
  [ProfileRoute, 'Profile'],
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

    expect(await screen.findByRole('header', { name: 'The world, understood in layers.' })).toBeTruthy();
  });

  it.each(routeScreens)('keeps the deferred %s route as a placeholder', (Route, heading) => {
    render(<Route />);

    expect(screen.getByRole('header', { name: heading })).toBeTruthy();
  });
});
