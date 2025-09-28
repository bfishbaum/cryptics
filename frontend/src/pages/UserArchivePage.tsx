import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPuzzleDatabaseService } from '../services/userPuzzles';
import type { Cryptogram } from '../types/cryptogram';
import { isUserPuzzleCompleted } from '../utils/puzzleProgress';

// TODO: Implement better pagination (infinite scroll?)

export const UserArchivePage: React.FC = () => {
  const [cryptograms, setCryptograms] = useState<Cryptogram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadCryptograms = async () => {
      try {
        setLoading(true);
        const results = await UserPuzzleDatabaseService.getLatestUserPuzzles(page, 20);

        if (page === 1) {
          setCryptograms(results);
        } else {
          setCryptograms(prev => [...prev, ...results]);
        }
      } catch (err) {
        setError('Failed to load cryptograms');
        console.error('Error loading cryptograms:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCryptograms();
  }, [page]);

  const loadMore = () => {
    if (!loading) {
      setPage(prev => prev + 1);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && page === 1) {
    return (
      <div className="container">
        <div className="loading">Loading puzzles...</div>
      </div>
    );
  }

  if (error && cryptograms.length === 0) {
    return (
      <div className="container">
        <div className="white-box">
          <h1 className="page-title">Error</h1>
          <p style={{ textAlign: 'center', color: '#dc3545' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">User Submitted Archive</h1>
        {cryptograms.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d' }}>
            No cryptograms found.
          </p>
        ) : (
          <>
            <div className="archive-list">
              {cryptograms.map((cryptogram) => (
                <Link
                  key={cryptogram.id}
                  to={`/userpuzzle/${cryptogram.id}`}
                  className="archive-row"
                >
                  <div className="archive-row-content">
                    <div className="archive-row-date">
                      {formatDate(cryptogram.date_added)}
                    </div>
                    <div className="archive-row-difficulty">
                      Difficulty: {cryptogram.difficulty}/5
                    </div>
                    <div className="archive-row-status">
                      {isUserPuzzleCompleted(cryptogram.id) && (
                        <span className="completion-check">✓</span>
                      )}
                    </div>
                  </div>
                  <div className="archive-row-preview">
                    {cryptogram.puzzle.substring(0, 80)}
                    {cryptogram.puzzle.length > 80 ? '...' : ''}
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};