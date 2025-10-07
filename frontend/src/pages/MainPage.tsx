import React from 'react';
import { CryptogramGame } from '../components/CryptogramGame';
import { useLatestOfficialPuzzle } from '../hooks/usePuzzles';
import '../styles/CryptogramGame.css';

export const MainPage: React.FC = () => {
  const { data: cryptogram, isLoading, isError } = useLatestOfficialPuzzle();

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading today's cryptic crossword...</div>
      </div>
    );
  }

  if (isError || !cryptogram) {
    return (
      <div className="container">
        <div className="white-box">
          <h1 className="page-title">Error</h1>
          <p style={{ textAlign: 'center', color: '#dc3545' }}>
            {'Failed to load cryptogram'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Today's Cryptic Crossword</h1>
        <CryptogramGame cryptogram={cryptogram} />
      </div>
    </div>
  );
};