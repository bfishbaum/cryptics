import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CryptogramGame } from '../components/CryptogramGame';
import { UserPuzzleDatabaseService } from '../services/userPuzzles';
import type { Cryptogram } from '../types/cryptogram';
import '../styles/CryptogramGame.css';

export const UserPuzzlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cryptogram, setCryptogram] = useState<Cryptogram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCryptogram = async () => {
      try {
        setLoading(true);
        let result: Cryptogram | null = null;
        
        if (id) {
          const puzzleId = parseInt(id, 10);
          if (isNaN(puzzleId)) {
            navigate('/puzzle');
            return;
          }
          result = await UserPuzzleDatabaseService.getUserPuzzleById(puzzleId);
          if (!result) {
            navigate('/puzzle');
            return;
          }
        } else {
          navigate('/puzzle');
        }
        
        setCryptogram(result);
        setError(null);
      } catch (err) {
        setError('Failed to load cryptogram');
        console.error('Error loading cryptogram:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCryptogram();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cryptic clue...</div>
      </div>
    );
  }

  if (error || !cryptogram) {
    return (
      <div className="container">
        <div className="white-box">
          <h1 className="page-title">Error</h1>
          <p style={{ textAlign: 'center', color: '#dc3545' }}>
            {error || 'Puzzle not found'}
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
        <CryptogramGame cryptogram={cryptogram} />
      </div>
    </div>
  );
};