import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ContentImage } from '@/components/ui';
import { destinations, discoveryItems, images } from '@/content/contentIndex';
import { DestinationScreen } from '@/features/destination/DestinationScreen';
import { DiscoveryItemScreen } from '@/features/destination/DiscoveryItemScreen';
import { ImageCreditsScreen } from '@/features/destination/ImageCreditsScreen';
import { DiscoverScreen } from '@/features/discover/DiscoverScreen';
import { LayerStoryScreen } from '@/features/discover/LayerStoryScreen';
import { ExploreScreen } from '@/features/explore/ExploreScreen';

const destination = destinations[0];
const tanahLot = discoveryItems.find((item) => item.id === 'tanah-lot')!;
const babiGuling = discoveryItems.find((item) => item.id === 'babi-guling')!;
const baliImage = images.find((image) => image.id === 'bali-hero')!;

describe('Phase 4 destination discovery core', () => {
  it('renders the Discover editorial hierarchy and uses navigation callbacks', () => {
    const onExplore = jest.fn();
    const onOpenDestination = jest.fn();
    const onOpenLayer = jest.fn();
    render(<DiscoverScreen onExplore={onExplore} onOpenDestination={onOpenDestination} onOpenLayer={onOpenLayer} onOpenProfile={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'Unfold somewhere unforgettable.' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Choose your way in' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Featured Destination' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Passport picks' })).toBeTruthy();
    expect(screen.getByLabelText('Five discovery layers')).toBeTruthy();
    expect(screen.getByLabelText('Five passport picks')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Search destinations and experiences'));
    expect(onExplore).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByLabelText('Open featured destination Bali'));
    fireEvent.press(screen.getByLabelText('Open Culture Layer'));
    fireEvent.press(screen.getByLabelText('Save Bali'));
    expect(screen.getByLabelText('Remove Bali from Saved')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Remove Bali from Saved'));
    expect(screen.getByLabelText('Save Bali')).toBeTruthy();
    expect(onOpenDestination).toHaveBeenCalledWith('bali');
    expect(onOpenLayer).toHaveBeenCalledWith('culture');
  });

  it('switches destination states and opens Bali layer and place details', () => {
    const onOpenItem = jest.fn();
    const onOpenLayer = jest.fn();
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
        <DestinationScreen destination={destination} items={discoveryItems.filter((item) => item.destinationId === destination.id)} onBack={jest.fn()} onOpenItem={onOpenItem} onOpenLayer={onOpenLayer} onOpenTab={jest.fn()} />
      </SafeAreaProvider>,
    );

    fireEvent.press(screen.getByRole('tab', { name: 'Layers destination tab' }));
    for (const layer of ['Iconic', 'Hidden', 'Culture', 'Taste', 'Nature']) expect(screen.getByRole('link', { name: `Open ${layer} layer` })).toBeTruthy();
    fireEvent.press(screen.getByRole('link', { name: 'Open Culture layer' }));
    expect(onOpenLayer).toHaveBeenCalledWith('culture');
    fireEvent.press(screen.getByRole('tab', { name: 'Overview destination tab' }));
    fireEvent.press(screen.getByLabelText('Explore taste layer'));
    expect(onOpenLayer).toHaveBeenCalledWith('taste');
    fireEvent.press(screen.getByLabelText('Open Tanah Lot'));
    expect(onOpenItem).toHaveBeenCalledWith('tanah-lot');
  });

  it('renders a discovery layer story and its navigation', () => {
    const onOpenItem = jest.fn();
    render(<LayerStoryScreen layer="culture" onBack={jest.fn()} onOpenItem={onOpenItem} onOpenLayer={jest.fn()} onOpenTab={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Culture Layer' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Stories through this layer' })).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Open Barong Dance'));
    expect(onOpenItem).toHaveBeenCalledWith('subak');
  });

  it('renders the Bali Culture layer with its dedicated image and Barong story', () => {
    const onOpenItem = jest.fn();
    const onOpenLayer = jest.fn();
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
        <LayerStoryScreen destinationId="bali" layer="culture" onBack={jest.fn()} onOpenItem={onOpenItem} onOpenLayer={onOpenLayer} onOpenTab={jest.fn()} />
      </SafeAreaProvider>,
    );
    expect(screen.getByLabelText('Bali Culture layer hero: Balinese cultural performance')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Culture Layer' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Stories in this layer' })).toBeTruthy();
    expect(screen.getByLabelText('Open Barong Dance')).toBeTruthy();
    expect(screen.getByLabelText('Open Temple Ceremonies')).toBeTruthy();
    expect(screen.getByLabelText('Open Uluwatu Temple')).toBeTruthy();
    expect(screen.getByLabelText('Open Ulun Danu Beratan')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Iconic layer'));
    expect(onOpenLayer).toHaveBeenCalledWith('iconic');
    expect(screen.queryByText('A note from the journal')).toBeNull();
    expect(screen.queryByLabelText('Open Medina Craft Souks')).toBeNull();
    fireEvent.press(screen.getByLabelText('Open Barong Dance'));
    expect(onOpenItem).toHaveBeenCalledWith('subak');
  });

  it('uses the matching hero and story content for all five Bali layers', () => {
    const layerItems = {
      iconic: { hero: 'Bali Iconic layer hero', story: 'Tanah Lot' },
      hidden: { hero: 'Bali Hidden layer hero', story: 'Tenganan' },
      culture: { hero: 'Bali Culture layer hero: Balinese cultural performance', story: 'Barong Dance' },
      taste: { hero: 'Bali Taste layer hero', story: 'Babi Guling' },
      nature: { hero: 'Bali Nature layer hero', story: 'Mount Batur' },
    } as const;
    const layers = Object.keys(layerItems) as (keyof typeof layerItems)[];
    const onBack = jest.fn();
    const view = render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
        <LayerStoryScreen destinationId="bali" layer={layers[0]} onBack={onBack} onOpenItem={jest.fn()} onOpenLayer={jest.fn()} onOpenTab={jest.fn()} />
      </SafeAreaProvider>,
    );

    for (const layer of layers) {
      view.rerender(
        <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
          <LayerStoryScreen destinationId="bali" layer={layer} onBack={onBack} onOpenItem={jest.fn()} onOpenLayer={jest.fn()} onOpenTab={jest.fn()} />
        </SafeAreaProvider>,
      );
      expect(screen.getByLabelText(layerItems[layer].hero)).toBeTruthy();
      expect(screen.getByLabelText(`Open ${layerItems[layer].story}`)).toBeTruthy();
    }

    fireEvent.press(screen.getByLabelText('Go back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders locations and omits absent optional fields', () => {
    const { rerender } = render(<DiscoveryItemScreen item={tanahLot} onBack={jest.fn()} onOpenCredits={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Location' })).toBeTruthy();
    rerender(<DiscoveryItemScreen item={babiGuling} onBack={jest.fn()} onOpenCredits={jest.fn()} />);
    expect(screen.queryByRole('header', { name: 'Practical information' })).toBeNull();
    expect(screen.queryByRole('header', { name: 'Location' })).toBeNull();
  });

  it('supports name search, combined filters, and a recoverable no-results state', () => {
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
        <ExploreScreen onBack={jest.fn()} onOpenDestination={jest.fn()} onOpenItem={jest.fn()} onOpenTab={jest.fn()} />
      </SafeAreaProvider>,
    );
    fireEvent.press(screen.getByLabelText('Search destinations, places or experiences'));
    fireEvent.changeText(screen.getByLabelText('Search destinations and discovery items'), 'Gion Matsuri');
    expect(screen.getByLabelText('Open Gion Matsuri')).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText('Search destinations and discovery items'), 'not-a-real-place');
    expect(screen.getByRole('header', { name: 'No matching discoveries' })).toBeTruthy();
    fireEvent.press(screen.getAllByLabelText('Clear search and filters')[0]);
    expect(screen.getByRole('header', { name: '45 results' })).toBeTruthy();
  });

  it('renders the curated destination cards and keeps Explore navigation available', () => {
    const onOpenDestination = jest.fn();
    const onOpenTab = jest.fn();
    render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } }}>
        <ExploreScreen onBack={jest.fn()} onOpenDestination={onOpenDestination} onOpenItem={jest.fn()} onOpenTab={onOpenTab} />
      </SafeAreaProvider>,
    );

    expect(screen.getByText('Bali')).toBeTruthy();
    expect(screen.getByText('Indonesia')).toBeTruthy();
    expect(screen.queryByText('Temples, coastlines and volcanic landscapes.')).toBeNull();
    fireEvent.press(screen.getByLabelText('Toggle filters'));
    fireEvent.press(screen.getByLabelText('Africa'));
    expect(screen.getByLabelText('Open Marrakech')).toBeTruthy();
    expect(screen.queryByLabelText('Open Bali')).toBeNull();
    fireEvent.press(screen.getByLabelText('Saved tab'));
    expect(onOpenTab).toHaveBeenCalledWith('saved');
    fireEvent.press(screen.getByLabelText('Open Marrakech'));
    expect(onOpenDestination).toHaveBeenCalledWith('marrakech');
  });

  it('shows complete image credits and a recoverable image error', () => {
    render(<ImageCreditsScreen image={baliImage} onBack={jest.fn()} />);
    expect(screen.getByText(baliImage.creatorAttribution)).toBeTruthy();
    expect(screen.getByText(baliImage.licenseOrTerms)).toBeTruthy();

    const imageView = render(<ContentImage image={baliImage} />);
    fireEvent(imageView.getByLabelText(baliImage.altText), 'error', { nativeEvent: {} });
    expect(imageView.getByLabelText(`Image unavailable: ${baliImage.altText}`)).toBeTruthy();
  });
});
