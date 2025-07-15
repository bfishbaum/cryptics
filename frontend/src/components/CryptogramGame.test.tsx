import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CryptogramGame } from './CryptogramGame';
import { Source } from '../types/cryptogram';
import type { Cryptogram } from '../types/cryptogram';

const mockCryptogram: Cryptogram = {
  id: 1,
  puzzle: "Test puzzle",
  solution: "dog",
  explanation: "Test explanation",
  source: Source.OFFICIAL,
  difficulty: 1,
  date_added: new Date('2024-01-01')
};

const mockCryptogramWithSpaces: Cryptogram = {
  id: 2,
  puzzle: "Test puzzle with spaces",
  solution: "hello world",
  explanation: "Test explanation with spaces",
  source: Source.OFFICIAL,
  difficulty: 2,
  date_added: new Date('2024-01-01')
};

const mockCryptogramWithHyphens: Cryptogram = {
  id: 3,
  puzzle: "Test puzzle with hyphens",
  solution: "see-through",
  explanation: "Test explanation with hyphens",
  source: Source.OFFICIAL,
  difficulty: 3,
  date_added: new Date('2024-01-01')
};

describe('CryptogramGame - Basic Functionality', () => {
  it('renders the puzzle text', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    expect(screen.getByText('Test puzzle')).toBeInTheDocument();
  });

  it('renders input boxes for each letter in the solution', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(3); // 'dog' has 3 letters
  });

  it('renders spaces correctly', () => {
    const { container } = render(<CryptogramGame cryptogram={mockCryptogramWithSpaces} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(10); // 'hello world' has 10 letters (space is not an input)
    
    // Check for space divs
    const spaceElements = container.querySelectorAll('.input-space');
    expect(spaceElements).toHaveLength(1);
  });

  it('renders hyphens correctly', () => {
    const { container } = render(<CryptogramGame cryptogram={mockCryptogramWithHyphens} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(10); // 'see-through' has 10 letters (hyphen is not an input)
    
    // Check for hyphen divs
    const hyphenElements = container.querySelectorAll('.input-hyphen');
    expect(hyphenElements).toHaveLength(1);
    expect(hyphenElements[0]).toHaveTextContent('-');
  });

  it('allows typing in input boxes', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'd' } });
    
    expect(inputs[0]).toHaveValue('d');
  });

  it('shows correct feedback for correct answer', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'd' } });
    fireEvent.change(inputs[1], { target: { value: 'o' } });
    fireEvent.change(inputs[2], { target: { value: 'g' } });
    
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows incorrect feedback for wrong answer', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'c' } });
    fireEvent.change(inputs[1], { target: { value: 'a' } });
    fireEvent.change(inputs[2], { target: { value: 't' } });
    
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    expect(screen.getByText('Incorrect! Try Again!')).toBeInTheDocument();
  });

  it('shows explanation when answer is correct', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'd' } });
    fireEvent.change(inputs[1], { target: { value: 'o' } });
    fireEvent.change(inputs[2], { target: { value: 'g' } });
    
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    expect(screen.getByText('Test explanation')).toBeInTheDocument();
  });

  it('handles give up functionality', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const giveUpButton = screen.getByText('Give Up');
    fireEvent.click(giveUpButton);
    
    expect(screen.getByText('Better luck next time!')).toBeInTheDocument();
    expect(screen.getByText('Test explanation')).toBeInTheDocument();
    
    // Check that inputs are filled with solution
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('d');
    expect(inputs[1]).toHaveValue('o');
    expect(inputs[2]).toHaveValue('g');
  });

  it('disables buttons after correct answer', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'd' } });
    fireEvent.change(inputs[1], { target: { value: 'o' } });
    fireEvent.change(inputs[2], { target: { value: 'g' } });
    
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    expect(checkButton).toBeDisabled();
    expect(screen.getByText('Give Up')).toBeDisabled();
  });

  it('disables buttons after giving up', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const giveUpButton = screen.getByText('Give Up');
    fireEvent.click(giveUpButton);
    
    expect(screen.getByText('Check Answer')).toBeDisabled();
    expect(giveUpButton).toBeDisabled();
  });

  it('handles solutions with spaces correctly', () => {
    render(<CryptogramGame cryptogram={mockCryptogramWithSpaces} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // Type 'hello world' (ignoring the space)
    fireEvent.change(inputs[0], { target: { value: 'h' } });
    fireEvent.change(inputs[1], { target: { value: 'e' } });
    fireEvent.change(inputs[2], { target: { value: 'l' } });
    fireEvent.change(inputs[3], { target: { value: 'l' } });
    fireEvent.change(inputs[4], { target: { value: 'o' } });
    // Skip space (index 5)
    fireEvent.change(inputs[5], { target: { value: 'w' } });
    fireEvent.change(inputs[6], { target: { value: 'o' } });
    fireEvent.change(inputs[7], { target: { value: 'r' } });
    fireEvent.change(inputs[8], { target: { value: 'l' } });
    fireEvent.change(inputs[9], { target: { value: 'd' } });
    
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('handles solutions with hyphens correctly', () => {
    render(<CryptogramGame cryptogram={mockCryptogramWithHyphens} />);
    
    const inputs = screen.getAllByRole('textbox');
    
    // Type 'see-through' (ignoring the hyphen)
    fireEvent.change(inputs[0], { target: { value: 's' } });
    fireEvent.change(inputs[1], { target: { value: 'e' } });
    fireEvent.change(inputs[2], { target: { value: 'e' } });
    // Skip hyphen (index 3)
    fireEvent.change(inputs[3], { target: { value: 't' } });
    fireEvent.change(inputs[4], { target: { value: 'h' } });
    fireEvent.change(inputs[5], { target: { value: 'r' } });
    fireEvent.change(inputs[6], { target: { value: 'o' } });
    fireEvent.change(inputs[7], { target: { value: 'u' } });
    fireEvent.change(inputs[8], { target: { value: 'g' } });
    fireEvent.change(inputs[9], { target: { value: 'h' } });
    
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('accepts case insensitive input', () => {
    render(<CryptogramGame cryptogram={mockCryptogram} />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'D' } });
    fireEvent.change(inputs[1], { target: { value: 'O' } });
    fireEvent.change(inputs[2], { target: { value: 'G' } });
    
    const checkButton = screen.getByText('Check Answer');
    fireEvent.click(checkButton);
    
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });
});