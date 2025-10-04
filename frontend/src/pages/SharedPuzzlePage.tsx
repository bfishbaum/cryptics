import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CryptogramGame } from '../components/CryptogramGame';
import { decodeCryptogramFromParams } from '../utils/cryptogramShare';

export const SharedPuzzlePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const cryptogram = useMemo(
    () => decodeCryptogramFromParams(searchParams),
    [searchParams.toString()]
  );

  if (!cryptogram) {
    return (
      <div className="container">
        <div className="white-box">
          <h1 className="page-title">Shared Cryptic Puzzle</h1>
          <p style={{ textAlign: 'center', color: '#dc3545' }}>
            This shared puzzle link is invalid or has been corrupted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Shared Cryptic Puzzle</h1>
        <CryptogramGame cryptogram={cryptogram} puzzleType="user" />
      </div>
    </div>
  );
};
