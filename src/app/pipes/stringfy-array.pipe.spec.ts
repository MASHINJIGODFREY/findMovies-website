import { StringfyArrayPipe } from './stringfy-array.pipe';

describe('StringfyArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new StringfyArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
