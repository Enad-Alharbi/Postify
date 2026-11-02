import { validateImage } from './image-validation';

function file(name: string, type: string, size = 4): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe('validateImage', () => {
  it('accepts jpg, jpeg and png, in any letter case', () => {
    expect(validateImage(file('a.jpg', 'image/jpeg'), 100)).toBe('');
    expect(validateImage(file('a.JPEG', 'image/jpeg'), 100)).toBe('');
    expect(validateImage(file('a.Png', 'image/png'), 100)).toBe('');
  });

  it('rejects other types and files without an extension', () => {
    expect(validateImage(file('a.gif', 'image/gif'), 100)).toContain('.jpg');
    expect(validateImage(file('photo', 'image/jpeg'), 100)).toContain('.jpg');
  });

  it('rejects empty and oversized files', () => {
    expect(validateImage(file('a.png', 'image/png', 0), 100)).toContain('empty');
    expect(validateImage(file('a.png', 'image/png', 3 * 1024 * 1024), 2 * 1024 * 1024)).toBe('Images must be 2MB or less.');
  });
});
