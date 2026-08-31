import { isValidCoordinate } from './coordinates';

describe('isValidCoordinate', () => {
  it.each([
    { latitude: 0, longitude: 0 }, { latitude: 90, longitude: 180 },
    { latitude: -90, longitude: -180 }, { latitude: -33.9628, longitude: 18.4098 },
  ])('accepts valid coordinates %#', (coordinate) => expect(isValidCoordinate(coordinate)).toBe(true));

  it.each([
    undefined, {}, { latitude: 0 }, { longitude: 0 }, { latitude: 90.1, longitude: 0 },
    { latitude: -90.1, longitude: 0 }, { latitude: 0, longitude: 180.1 },
    { latitude: 0, longitude: -180.1 }, { latitude: Number.NaN, longitude: 0 },
    { latitude: 0, longitude: Number.POSITIVE_INFINITY },
  ])('rejects invalid coordinates %#', (coordinate) => expect(isValidCoordinate(coordinate)).toBe(false));
});
