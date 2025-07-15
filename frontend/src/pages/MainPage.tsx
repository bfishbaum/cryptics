import React, { useState, useEffect } from 'react';
import { CryptogramGame } from '../components/CryptogramGame';
import { DatabaseService } from '../services/database';
import type { Cryptogram } from '../types/cryptogram';
import '../styles/CryptogramGame.css';

export const MainPage: React.FC = () => {
  const [cryptogram, setCryptogram] = useState<Cryptogram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestCryptogram = async () => {
      try {
        setLoading(true);
        const latest = await DatabaseService.getLatestCryptogram();
        setCryptogram(latest);
        setError(null);
      } catch (err) {
        setError('Failed to load cryptogram');
        console.error('Error loading cryptogram:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLatestCryptogram();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading today's cryptogram...</div>
      </div>
    );
  }

  if (error || !cryptogram) {
    return (
      <div className="container">
        <div className="white-box">
          <h1 className="page-title">Error</h1>
          <p style={{ textAlign: 'center', color: '#dc3545' }}>
            {error || 'No cryptogram available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Today's Cryptogram</h1>
        <CryptogramGame cryptogram={cryptogram} />
      </div>
    </div>
  );
};