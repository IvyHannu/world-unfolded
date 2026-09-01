import { Linking } from 'react-native';

export function openHttpsUrl(url: string): Promise<unknown> {
  if (!url.startsWith('https://')) return Promise.reject(new Error('Only HTTPS links are permitted.'));
  return Linking.openURL(url);
}
