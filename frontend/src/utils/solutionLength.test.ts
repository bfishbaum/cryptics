import { describe, it, expect } from 'vitest';
import { getSolutionLengthPattern } from './solutionLength';

describe('getSolutionLengthPattern', () => {
  it('should handle single hyphenated words', () => {
    expect(getSolutionLengthPattern('dog-gone')).toBe('(3-4)');
  });

  it('should handle two words with spaces', () => {
    expect(getSolutionLengthPattern('hello world')).toBe('(5,5)');
  });

  it('should handle multiple words with hyphens', () => {
    expect(getSolutionLengthPattern('my gee-golly')).toBe('(2,3-5)');
  });

  it('should handle single words', () => {
    expect(getSolutionLengthPattern('cat')).toBe('(3)');
  });

  it('should handle complex patterns', () => {
    expect(getSolutionLengthPattern('well-done my friend')).toBe('(4-4,2,6)');
  });

  it('should handle single letters', () => {
    expect(getSolutionLengthPattern('a')).toBe('(1)');
  });

  it('should handle multiple hyphens', () => {
    expect(getSolutionLengthPattern('up-to-date')).toBe('(2-2-4)');
  });

  it('should handle three words', () => {
    expect(getSolutionLengthPattern('the quick fox')).toBe('(3,5,3)');
  });

  it('should handle empty string', () => {
    expect(getSolutionLengthPattern('')).toBe('');
  });

  it('should handle mixed complex pattern', () => {
    expect(getSolutionLengthPattern('pre-school age children')).toBe('(3-6,3,8)');
  });
});