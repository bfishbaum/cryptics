import { describe, it, expect } from 'vitest';
import { checkAnswer, normalizeString, isAnswerComplete } from './answerCheck';

describe('checkAnswer', () => {
  it('should return true for correct answers without spaces or hyphens', () => {
    const userInput = ['d', 'o', 'g'];
    const solution = 'dog';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should return true for correct answers with spaces', () => {
    const userInput = ['h', 'e', 'l', 'l', 'o', '', 'w', 'o', 'r', 'l', 'd'];
    const solution = 'hello world';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should return true for correct answers with hyphens', () => {
    const userInput = ['s', 'e', 'e', '', 't', 'h', 'r', 'o', 'u', 'g', 'h'];
    const solution = 'see-through';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should return true for correct answers with both spaces and hyphens', () => {
    const userInput = ['h', 'e', 'l', 'l', 'o', '', 'w', 'o', 'r', 'l', 'd', '', 't', 'h', 'i', 's', '', 'i', 's', '', 'a', '', 't', 'e', 's', 't'];
    const solution = 'hello world-this is a test';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should return false for incorrect answers', () => {
    const userInput = ['c', 'a', 't'];
    const solution = 'dog';
    expect(checkAnswer(userInput, solution)).toBe(false);
  });

  it('should return false for partially correct answers', () => {
    const userInput = ['h', 'e', 'l', 'l', 'x'];
    const solution = 'hello';
    expect(checkAnswer(userInput, solution)).toBe(false);
  });

  it('should return false for empty user input', () => {
    const userInput = ['', '', ''];
    const solution = 'dog';
    expect(checkAnswer(userInput, solution)).toBe(false);
  });

  it('should return false for user input with different length', () => {
    const userInput = ['d', 'o'];
    const solution = 'dog';
    expect(checkAnswer(userInput, solution)).toBe(false);
  });

  it('should be case insensitive', () => {
    const userInput = ['D', 'O', 'G'];
    const solution = 'dog';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should handle mixed case correctly', () => {
    const userInput = ['H', 'e', 'L', 'l', 'O'];
    const solution = 'hello';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should ignore spaces and hyphens in user input when comparing', () => {
    const userInput = ['a', 'l', 'o', 'n', 'e'];
    const solution = 'a-lone';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should handle complex cryptogram solutions', () => {
    const userInput = ['w', 'i', 'n', 'd', 'o', 'w'];
    const solution = 'window';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });

  it('should handle solutions with multiple spaces', () => {
    const userInput = ['t', 'h', 'i', 's', '', 'i', 's', '', 'a', '', 't', 'e', 's', 't'];
    const solution = 'this is a test';
    expect(checkAnswer(userInput, solution)).toBe(true);
  });
});

describe('normalizeString', () => {
  it('should remove spaces and hyphens', () => {
    expect(normalizeString('hello world')).toBe('helloworld');
    expect(normalizeString('see-through')).toBe('seethrough');
    expect(normalizeString('hello-world test')).toBe('helloworldtest');
  });

  it('should convert to lowercase', () => {
    expect(normalizeString('HELLO')).toBe('hello');
    expect(normalizeString('HeLLo')).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(normalizeString('')).toBe('');
  });

  it('should handle string with only spaces and hyphens', () => {
    expect(normalizeString('- - -')).toBe('');
    expect(normalizeString('   ')).toBe('');
  });
});

describe('isAnswerComplete', () => {
  it('should return true when all letter positions are filled', () => {
    const userInput = ['d', 'o', 'g'];
    const solution = 'dog';
    expect(isAnswerComplete(userInput, solution)).toBe(true);
  });

  it('should return false when some letter positions are empty', () => {
    const userInput = ['d', '', 'g'];
    const solution = 'dog';
    expect(isAnswerComplete(userInput, solution)).toBe(false);
  });

  it('should ignore spaces and hyphens in solution', () => {
    const userInput = ['h', 'e', 'l', 'l', 'o', '', 'w', 'o', 'r', 'l', 'd'];
    const solution = 'hello world';
    expect(isAnswerComplete(userInput, solution)).toBe(true);
  });

  it('should handle solution with hyphens', () => {
    const userInput = ['s', 'e', 'e', '', 't', 'h', 'r', 'o', 'u', 'g', 'h'];
    const solution = 'see-through';
    expect(isAnswerComplete(userInput, solution)).toBe(true);
  });

  it('should return false for empty user input', () => {
    const userInput = ['', '', ''];
    const solution = 'dog';
    expect(isAnswerComplete(userInput, solution)).toBe(false);
  });

  it('should return true for single character solution', () => {
    const userInput = ['a'];
    const solution = 'a';
    expect(isAnswerComplete(userInput, solution)).toBe(true);
  });

  it('should handle whitespace-only input correctly', () => {
    const userInput = [' ', '', '  '];
    const solution = 'dog';
    expect(isAnswerComplete(userInput, solution)).toBe(false);
  });
});