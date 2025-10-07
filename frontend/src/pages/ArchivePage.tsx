import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { isPuzzleCompleted } from '../utils/puzzleProgress';
import { useOfficialArchive } from '../hooks/usePuzzles';
import type { Cryptogram } from '../types/cryptogram';

// TODO: Implement better pagination (infinite scroll?)

export const ArchivePage: React.FC = () => {
  const archiveQuery = useOfficialArchive(20);

  const cryptograms = useMemo<Cryptogram[]>(() => {
    const pages = (archiveQuery.data?.pages ?? []) as Cryptogram[][];
    return pages.flatMap((page) => page);
  }, [archiveQuery.data]);

  const initialLoading = archiveQuery.isLoading && !archiveQuery.isFetched;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (initialLoading) {
    return (
      <div className="container">
        <div className="loading">Loading cryptograms...</div>
      </div>
    );
  }

  if (archiveQuery.isError && cryptograms.length === 0) {
    return (
      <div className="container">
        <div className="white-box">
          <h1 className="page-title">Error</h1>
          <p style={{ textAlign: 'center', color: '#dc3545' }}>
            {'Failed to load cryptograms'}
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
            <div className="archive-list">
              {cryptograms.map((cryptogram) => (
                <Link
                  key={cryptogram.id}
                  to={`/puzzle/${cryptogram.id}`}
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
                      {isPuzzleCompleted(cryptogram.id) && (
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
                onClick={() => archiveQuery.fetchNextPage()}
                disabled={archiveQuery.isFetchingNextPage || !archiveQuery.hasNextPage}
                className="btn btn-primary"
              >
                {archiveQuery.isFetchingNextPage ? 'Loading...' : archiveQuery.hasNextPage ? 'Load More' : 'No More Puzzles'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};