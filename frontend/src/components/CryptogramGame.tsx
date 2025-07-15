import React, { useState, useRef, useEffect } from 'react';
import type { Cryptogram } from '../types/cryptogram';
import { checkAnswer } from '../utils/answerCheck';

interface CryptogramGameProps {
  cryptogram: Cryptogram;
}

export const CryptogramGame: React.FC<CryptogramGameProps> = ({ cryptogram }) => {
  const [userInput, setUserInput] = useState<string[]>(new Array(cryptogram.solution.length).fill(''));
  const [, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect' | 'given_up'>('playing');
  const [showExplanation, setShowExplanation] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, cryptogram.solution.length);
  }, [cryptogram.solution.length]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^[a-z]$/.test(value.toLowerCase())) return;

    const newInput = [...userInput];
    newInput[index] = value.toLowerCase();
    setUserInput(newInput);

    if (value && index < cryptogram.solution.length - 1) {
      const nextIndex = findNextEditableIndex(index);
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !userInput[index] && index > 0) {
      const prevIndex = findPreviousEditableIndex(index);
      if (prevIndex !== -1) {
        setCurrentIndex(prevIndex);
        inputRefs.current[prevIndex]?.focus();
      }
    } else if (event.key === 'ArrowLeft') {
      const prevIndex = findPreviousEditableIndex(index);
      if (prevIndex !== -1) {
        setCurrentIndex(prevIndex);
        inputRefs.current[prevIndex]?.focus();
      }
    } else if (event.key === 'ArrowRight') {
      const nextIndex = findNextEditableIndex(index);
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const findNextEditableIndex = (currentIndex: number): number => {
    for (let i = currentIndex + 1; i < cryptogram.solution.length; i++) {
      if (cryptogram.solution[i] !== ' ' && cryptogram.solution[i] !== '-') {
        return i;
      }
    }
    return -1;
  };

  const findPreviousEditableIndex = (currentIndex: number): number => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (cryptogram.solution[i] !== ' ' && cryptogram.solution[i] !== '-') {
        return i;
      }
    }
    return -1;
  };

  const handleCheckAnswer = () => {
    if (checkAnswer(userInput, cryptogram.solution)) {
      setGameState('correct');
      setShowExplanation(true);
    } else {
      setGameState('incorrect');
      setTimeout(() => setGameState('playing'), 2000);
    }
  };

  const handleGiveUp = () => {
    setUserInput(cryptogram.solution.split(''));
    setGameState('given_up');
    setShowExplanation(true);
  };

  const renderInputBoxes = () => {
    return cryptogram.solution.split('').map((char, index) => {
      if (char === ' ') {
        return <div key={index} className="input-space" />;
      } else if (char === '-') {
        return <div key={index} className="input-hyphen">-</div>;
      } else {
        return (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el; }}
            type="text"
            className={`input-box ${gameState === 'correct' ? 'correct' : ''}`}
            value={userInput[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => setCurrentIndex(index)}
            disabled={gameState === 'correct' || gameState === 'given_up'}
            maxLength={1}
          />
        );
      }
    });
  };

  return (
    <div className="cryptogram-game">
      <div className="input-container">
        {renderInputBoxes()}
      </div>
      
      <div className="puzzle-text">
        {cryptogram.puzzle}
      </div>
      
      <div className="game-controls">
        <button 
          className="check-button"
          onClick={handleCheckAnswer}
          disabled={gameState === 'correct' || gameState === 'given_up'}
        >
          Check Answer
        </button>
        <button 
          className="give-up-button"
          onClick={handleGiveUp}
          disabled={gameState === 'correct' || gameState === 'given_up'}
        >
          Give Up
        </button>
      </div>
      
      {gameState === 'correct' && (
        <div className="feedback-box correct-feedback">
          Correct!
        </div>
      )}
      
      {gameState === 'incorrect' && (
        <div className="feedback-box incorrect-feedback">
          Incorrect! Try Again!
        </div>
      )}
      
      {gameState === 'given_up' && (
        <div className="feedback-box given-up-feedback">
          Better luck next time!
        </div>
      )}
      
      {showExplanation && cryptogram.explanation && (
        <div className="explanation">
          {cryptogram.explanation}
        </div>
      )}
    </div>
  );
};