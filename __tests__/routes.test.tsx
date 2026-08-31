import { render, screen } from '@testing-library/react-native';
import { Slot } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';

import DiscoverRoute from '../app/(tabs)/discover';
import ExploreRoute from '../app/(tabs)/explore';
import MapRoute from '../app/(tabs)/map';
import PassportRoute from '../app/(tabs)/passport';
import SavedRoute from '../app/(tabs)/saved';
import DestinationDetailsRoute from '../app/destination/[id]';
import ImageCreditsRoute from '../app/image-credits/[imageId]';
import IndexRoute from '../app/index';
import DiscoveryItemDetailsRoute from '../app/item/[id]';
import ProfileRoute from '../app/profile';

const routeScreens = [
  [DiscoverRoute, 'Discover'],
  [ExploreRoute, 'Explore'],
  [MapRoute, 'Map'],
  [SavedRoute, 'Saved'],
  [PassportRoute, 'Passport'],
  [ProfileRoute, 'Profile'],
  [DestinationDetailsRoute, 'Destination Details'],
  [DiscoveryItemDetailsRoute, 'Discovery Item Details'],
  [ImageCreditsRoute, 'Image Credits'],
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

    expect(await screen.findByRole('header', { name: 'Discover' })).toBeTruthy();
  });

  it.each(routeScreens)('renders the %s placeholder', (Route, heading) => {
    render(<Route />);

    expect(screen.getByRole('header', { name: heading })).toBeTruthy();
  });
});
