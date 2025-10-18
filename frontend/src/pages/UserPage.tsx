import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { UserService } from '../services/user';
import type { Cryptogram } from '../types/cryptogram';
import { isUserPuzzleCompleted } from '../utils/puzzleProgress';

export const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [displayName, setDisplayName] = useState<string>('');
  const [puzzles, setPuzzles] = useState<Cryptogram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      navigate('/', { replace: true });
      return;
    }

    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'cryptic_api_id',
          },
        });

        const profile = await UserService.getUserProfile(userId, accessToken);
        setDisplayName(profile.displayName);
        setPuzzles(profile.puzzles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate, isAuthenticated, authLoading, getAccessTokenSilently]);

  if (authLoading || isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading user profile...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="white-box" style={{ textAlign: 'center', padding: '40px' }}>
          <h1 className="page-title">Members Only</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            You need to be signed in to view user profiles.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '12px 24px' }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (error) {
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
        <h1 className="page-title">{displayName}</h1>

        {puzzles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '20px' }}>
            This user hasn't created any puzzles yet.
          </p>
        ) : (
          <>
            <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '30px' }}>
              {puzzles.length} {puzzles.length === 1 ? 'puzzle' : 'puzzles'} created
            </p>
            <div className="archive-list">
              {puzzles.map((cryptogram) => (
                <Link
                  key={cryptogram.id}
                  to={`/userpuzzle/${cryptogram.id}`}
                  className="archive-row"
                >
                  <div className="archive-row-content">
                    <div className="archive-row-date">
                      Puzzle #{cryptogram.id}
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
          </>
        )}
      </div>
    </div>
  );
};
