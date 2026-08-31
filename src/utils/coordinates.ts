import type { Coordinates } from '@/types';

export function isValidCoordinate(location?: Partial<Coordinates>): location is Coordinates {
  if (!location) return false;
  const { latitude, longitude } = location;
  return typeof latitude === 'number' && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && typeof longitude === 'number' && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}
