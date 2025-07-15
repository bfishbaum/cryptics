import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DatabaseService } from '../services/database';
import type { Cryptogram } from '../types/cryptogram';

export const ArchivePage: React.FC = () => {
  const [cryptograms, setCryptograms] = useState<Cryptogram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadCryptograms = async () => {
      try {
        setLoading(true);
        const results = await DatabaseService.getLatestCryptograms(page, 20);
        
        if (page === 1) {
          setCryptograms(results);
        } else {
          setCryptograms(prev => [...prev, ...results]);
        }
        
        setHasMore(results.length === 20);
        setError(null);
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
    if (!loading && hasMore) {
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
        <div className="loading">Loading cryptograms...</div>
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
        <h1 className="page-title">Cryptogram Archive</h1>
        
        {cryptograms.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d' }}>
            No cryptograms found.
          </p>
        ) : (
          <>
            <div className="archive-grid">
              {cryptograms.map((cryptogram) => (
                <Link
                  key={cryptogram.id}
                  to={`/puzzle/${cryptogram.id}`}
                  className="archive-item"
                >
                  <div className="archive-date">
                    {formatDate(cryptogram.date_added)}
                  </div>
                  <div className="archive-preview">
                    {cryptogram.puzzle.substring(0, 50)}
                    {cryptogram.puzzle.length > 50 ? '...' : ''}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6c757d', 
                    marginTop: '10px' 
                  }}>
                    Difficulty: {cryptogram.difficulty}/5
                  </div>
                </Link>
              ))}
            </div>
            
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};