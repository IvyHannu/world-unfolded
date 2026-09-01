import { fireEvent, render, screen } from '@testing-library/react-native';

import { ContentImage } from '@/components/ui';
import { destinations, discoveryItems, images } from '@/content/contentIndex';
import { DestinationScreen } from '@/features/destination/DestinationScreen';
import { DiscoveryItemScreen } from '@/features/destination/DiscoveryItemScreen';
import { ImageCreditsScreen } from '@/features/destination/ImageCreditsScreen';
import { DiscoverScreen } from '@/features/discover/DiscoverScreen';
import { ExploreScreen } from '@/features/explore/ExploreScreen';

const destination = destinations[0];
const tanahLot = discoveryItems.find((item) => item.id === 'tanah-lot')!;
const babiGuling = discoveryItems.find((item) => item.id === 'babi-guling')!;
const baliImage = images.find((image) => image.id === 'bali-hero')!;

describe('Phase 4 destination discovery core', () => {
  it('renders the Discover editorial hierarchy and uses navigation callbacks', () => {
    const onOpenDestination = jest.fn();
    const onOpenItem = jest.fn();
    render(<DiscoverScreen onExplore={jest.fn()} onOpenDestination={onOpenDestination} onOpenItem={onOpenItem} onOpenProfile={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'Discover the world, your way.' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Featured destination' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Curated experiences' })).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Open featured destination Bali'));
    fireEvent.press(screen.getByLabelText('Open Tanah Lot'));
    expect(onOpenDestination).toHaveBeenCalledWith('bali');
    expect(onOpenItem).toHaveBeenCalledWith('tanah-lot');
  });

  it('groups exactly one Bali item in each discovery layer', () => {
    const onOpenItem = jest.fn();
    render(<DestinationScreen destination={destination} items={discoveryItems.filter((item) => item.destinationId === destination.id)} onBack={jest.fn()} onOpenCredits={jest.fn()} onOpenItem={onOpenItem} />);

    for (const layer of ['Iconic', 'Hidden', 'Culture', 'Taste', 'Nature']) {
      expect(screen.getByLabelText(`${layer} discovery layer`)).toBeTruthy();
    }
    fireEvent.press(screen.getByLabelText('Open Tanah Lot'));
    expect(onOpenItem).toHaveBeenCalledWith('tanah-lot');
  });

  it('renders locations and omits absent optional fields', () => {
    const { rerender } = render(<DiscoveryItemScreen item={tanahLot} onBack={jest.fn()} onOpenCredits={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Location' })).toBeTruthy();
    rerender(<DiscoveryItemScreen item={babiGuling} onBack={jest.fn()} onOpenCredits={jest.fn()} />);
    expect(screen.queryByRole('header', { name: 'Practical information' })).toBeNull();
    expect(screen.queryByRole('header', { name: 'Location' })).toBeNull();
  });

  it('supports name search, combined filters, and a recoverable no-results state', () => {
    render(<ExploreScreen onOpenDestination={jest.fn()} onOpenItem={jest.fn()} />);
    fireEvent.changeText(screen.getByLabelText('Search destinations and discovery items'), 'Gion Matsuri');
    expect(screen.getByLabelText('Open Gion Matsuri')).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText('Search destinations and discovery items'), 'not-a-real-place');
    expect(screen.getByRole('header', { name: 'No matching discoveries' })).toBeTruthy();
    fireEvent.press(screen.getAllByLabelText('Clear search and filters')[0]);
    expect(screen.getByRole('header', { name: '42 results' })).toBeTruthy();
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
