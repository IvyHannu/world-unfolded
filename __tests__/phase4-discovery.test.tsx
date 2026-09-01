import { fireEvent, render, screen } from '@testing-library/react-native';

import { ContentImage } from '@/components/ui';
import { destinations, discoveryItems, images } from '@/content/contentIndex';
import { DestinationScreen } from '@/features/destination/DestinationScreen';
import { DiscoveryItemScreen } from '@/features/destination/DiscoveryItemScreen';
import { ImageCreditsScreen } from '@/features/destination/ImageCreditsScreen';
import { DiscoverScreen } from '@/features/discover/DiscoverScreen';
import { ExploreScreen } from '@/features/explore/ExploreScreen';

const destination = destinations[0];
const districtSix = discoveryItems.find((item) => item.id === 'district-six-museum')!;
const capeMalayCooking = discoveryItems.find((item) => item.id === 'cape-malay-cooking')!;
const tableMountainImage = images.find((image) => image.id === 'table-mountain-image')!;

describe('Phase 4 destination discovery core', () => {
  it('renders the Discover editorial hierarchy and uses navigation callbacks', () => {
    const onOpenDestination = jest.fn();
    const onOpenItem = jest.fn();
    render(<DiscoverScreen onOpenDestination={onOpenDestination} onOpenItem={onOpenItem} onOpenProfile={jest.fn()} />);

    expect(screen.getByRole('header', { name: 'The world, understood in layers.' })).toBeTruthy();
    expect(screen.getByRole('header', { name: "Editor's Picks" })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Curated Collections' })).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Open Cape Town destination'));
    fireEvent.press(screen.getByLabelText('Open Table Mountain'));
    expect(onOpenDestination).toHaveBeenCalledWith('cape-town');
    expect(onOpenItem).toHaveBeenCalledWith('table-mountain');
  });

  it('groups exactly two Cape Town items in each discovery layer', () => {
    const onOpenItem = jest.fn();
    render(<DestinationScreen destination={destination} items={discoveryItems} onBack={jest.fn()} onOpenCredits={jest.fn()} onOpenItem={onOpenItem} />);

    for (const layer of ['iconic', 'hidden', 'culture', 'taste', 'nature']) {
      expect(screen.getByLabelText(`${layer} layer, 2 items`)).toBeTruthy();
    }
    fireEvent.press(screen.getByLabelText('Open Table Mountain'));
    expect(onOpenItem).toHaveBeenCalledWith('table-mountain');
  });

  it('renders verified practical information and omits absent optional fields', () => {
    const { rerender } = render(<DiscoveryItemScreen item={districtSix} onBack={jest.fn()} onOpenCredits={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Practical information' })).toBeTruthy();
    expect(screen.getByText(/Last verified:/)).toBeTruthy();

    rerender(<DiscoveryItemScreen item={capeMalayCooking} onBack={jest.fn()} onOpenCredits={jest.fn()} />);
    expect(screen.queryByRole('header', { name: 'Practical information' })).toBeNull();
    expect(screen.queryByRole('header', { name: 'Location' })).toBeNull();
  });

  it('supports name search, combined filters, and a recoverable no-results state', () => {
    render(<ExploreScreen onOpenDestination={jest.fn()} onOpenItem={jest.fn()} />);
    fireEvent.changeText(screen.getByLabelText('Search destinations and discovery items'), 'District Six');
    expect(screen.getByLabelText('Open District Six Museum')).toBeTruthy();
    fireEvent.changeText(screen.getByLabelText('Search destinations and discovery items'), 'not-a-real-place');
    expect(screen.getByRole('header', { name: 'No matching discoveries' })).toBeTruthy();
    fireEvent.press(screen.getAllByLabelText('Clear search and filters')[0]);
    expect(screen.getByRole('header', { name: '11 results' })).toBeTruthy();
  });

  it('shows complete image credits and a recoverable image error', () => {
    render(<ImageCreditsScreen image={tableMountainImage} onBack={jest.fn()} />);
    expect(screen.getAllByText(tableMountainImage.creatorAttribution)).toHaveLength(2);
    expect(screen.getByText(tableMountainImage.licenseOrTerms)).toBeTruthy();

    const imageView = render(<ContentImage image={tableMountainImage} />);
    fireEvent(imageView.getByLabelText(tableMountainImage.altText), 'error', { nativeEvent: {} });
    expect(imageView.getByLabelText(`Image unavailable: ${tableMountainImage.altText}`)).toBeTruthy();
  });
});
