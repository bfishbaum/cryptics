import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CryptogramGame } from '../components/CryptogramGame';
import { useUserPuzzle } from '../hooks/usePuzzles';
import '../styles/CryptogramGame.css';

export const UserPuzzlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const puzzleId = useMemo(() => {
    if (!id) {
      return undefined;
    }
    const parsed = Number.parseInt(id, 10);
    return Number.isNaN(parsed) ? NaN : parsed;
  }, [id]);

  const hasValidId = typeof puzzleId === 'number' && !Number.isNaN(puzzleId);

  useEffect(() => {
    if (!id || !hasValidId) {
      navigate('/', { replace: true });
    }
  }, [id, hasValidId, navigate]);

  const puzzleQuery = useUserPuzzle(hasValidId ? puzzleId : undefined, { enabled: Boolean(id) && hasValidId });

  useEffect(() => {
    if (id && hasValidId && puzzleQuery.isFetched && !puzzleQuery.data) {
      navigate('/', { replace: true });
    }
  }, [id, hasValidId, puzzleQuery.data, puzzleQuery.isFetched, navigate]);

  if (puzzleQuery.isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading cryptic clue...</div>
      </div>
    );
  }

  if (puzzleQuery.isError || !puzzleQuery.data) {
    return (
      <div className="container">
        <div className="white-box">
          <h1 className="page-title">Error</h1>
          <p style={{ textAlign: 'center', color: '#dc3545' }}>
            {'Puzzle not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">
          {id ? `Cryptic Crossword #${id}` : 'Latest Cryptic Crossword'}
        </h1>
        <CryptogramGame cryptogram={puzzleQuery.data} puzzleType="user" />
      </div>
    </div>
  );
};