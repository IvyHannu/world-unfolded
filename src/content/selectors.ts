import { destinations, discoveryItems, images } from './contentIndex';

export const getDestinationById = (id: string) => destinations.find((destination) => destination.id === id);
export const getDiscoveryItemById = (id: string) => discoveryItems.find((item) => item.id === id);
export const getImageById = (id: string) => images.find((image) => image.id === id);
export const getItemsForDestination = (destinationId: string) => discoveryItems.filter((item) => item.destinationId === destinationId);
