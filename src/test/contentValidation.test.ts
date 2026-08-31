import { contentIndex } from '@/content/contentIndex';
import { assertValidContent } from './contentValidation';

describe('content validation', () => {
  it('accepts the complete Cape Town pilot content', () => {
    expect(() => assertValidContent(contentIndex)).not.toThrow();
  });
});
