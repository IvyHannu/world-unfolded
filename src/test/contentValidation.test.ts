import { contentIndex } from '@/content/contentIndex';
import { assertValidContent } from './contentValidation';

describe('content validation', () => {
  it('accepts the complete seven-destination V1 content', () => {
    expect(() => assertValidContent(contentIndex)).not.toThrow();
  });
});
