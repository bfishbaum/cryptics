import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { UserService } from '../services/user';
import { UserPuzzleDatabaseService } from '../services/userPuzzles';
import type { UserProfileResponse } from '../types/profile';
import { isUserPuzzleCompleted } from '../utils/puzzleProgress';

export const ProfilePage: React.FC = () => {
  const { isAuthenticated, isLoading, user, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [displayNameSubmitting, setDisplayNameSubmitting] = useState(false);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [displayNameSuccess, setDisplayNameSuccess] = useState<string | null>(null);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [deletingPuzzleId, setDeletingPuzzleId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        setProfileLoading(true);
        setProfileError(null);
        const accessToken = await getAccessTokenSilently();
        const data = await UserService.getProfile(accessToken);
        if (isMounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        if (isMounted) {
          setProfileError('Failed to load profile information.');
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayNameInput(profile.displayName);
    } else {
      setDisplayNameInput('');
    }
  }, [profile?.displayName]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDisplayNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisplayNameSuccess(null);

    const trimmedName = displayNameInput.trim();
    if (!trimmedName) {
      setDisplayNameError('Display name is required');
      return;
    }

    try {
      setDisplayNameSubmitting(true);
      setDisplayNameError(null);
      const accessToken = await getAccessTokenSilently();
      const updatedName = await UserService.updateDisplayName(trimmedName, accessToken);
      setProfile(prev => (prev ? { ...prev, displayName: updatedName } : prev));
      setDisplayNameInput(updatedName);
      setDisplayNameSuccess('Display name updated successfully.');
      setIsEditingDisplayName(false);
    } catch (error) {
      setDisplayNameError(error instanceof Error ? error.message : 'Failed to update display name.');
    } finally {
      setDisplayNameSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditingDisplayName) {
      setIsEditingDisplayName(false);
      setDisplayNameError(null);
      setDisplayNameSuccess(null);
      if (profile?.displayName) {
        setDisplayNameInput(profile.displayName);
      }
      return;
    }

    setIsEditingDisplayName(true);
    setDisplayNameError(null);
    setDisplayNameSuccess(null);
  };

  const handleDeletePuzzle = async (puzzleId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this puzzle? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingPuzzleId(puzzleId);
      const accessToken = await getAccessTokenSilently();
      await UserPuzzleDatabaseService.deleteUserPuzzle(puzzleId, accessToken);

      // Refresh profile to update puzzle list
      const updatedProfile = await UserService.getProfile(accessToken);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete puzzle');
    } finally {
      setDeletingPuzzleId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="white-box" style={{ textAlign: 'center', padding: '40px' }}>
          <h1 className="page-title">Profile</h1>
          <p style={{ fontSize: '18px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="white-box" style={{ textAlign: 'center', padding: '40px' }}>
          <h1 className="page-title">Profile</h1>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            You must be logged in to view your profile.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '12px 24px' }}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Profile</h1>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          {user?.picture && (
            <img 
              src={user.picture} 
              alt="Profile" 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                marginBottom: '30px',
                border: '2px solid #000'
              }}
            />
          )}
          <div style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <div style={{ 
                padding: '12px', 
                border: '1px solid #000', 
                borderRadius: '6px',
                backgroundColor: '#f8f9fa'
              }}>
                {user?.name || 'Not provided'}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ 
                padding: '12px', 
                border: '1px solid #000', 
                borderRadius: '6px',
                backgroundColor: '#f8f9fa'
              }}>
                {user?.email || 'Not provided'}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ 
                padding: '12px', 
                border: '1px solid #000', 
                borderRadius: '6px',
                backgroundColor: '#f8f9fa'
              }}>
                {user?.nickname || user?.preferred_username || 'Not provided'}
              </div>
            </div>
            
            {user?.email_verified !== undefined && (
              <div className="form-group">
                <label className="form-label">Email Verified</label>
                <div style={{ 
                  padding: '12px', 
                  border: '1px solid #000', 
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa'
                }}>
                  {user.email_verified ? 'Yes' : 'No'}
                </div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  padding: '12px',
                  border: '1px solid #000',
                  borderRadius: '6px',
                  backgroundColor: '#f8f9fa',
                  width: '100%',
                  paddingRight: '56px'
                }}>
                  {profileLoading ? 'Loading...' : profile?.displayName || 'Not set'}
                </div>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '8px',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    border: '2px solid #000',
                    backgroundColor: '#f8f9fa',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: profileLoading ? 'not-allowed' : 'pointer'
                  }}
                  disabled={profileLoading}
                  aria-label={isEditingDisplayName ? 'Cancel editing display name' : 'Edit display name'}
                >
                  {isEditingDisplayName ? '✕' : '✎'}
                </button>
              </div>
            </div>

            {displayNameSuccess && !isEditingDisplayName && (
              <div style={{
                background: '#d4edda',
                color: '#155724',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #c3e6cb',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                {displayNameSuccess}
              </div>
            )}

            {isEditingDisplayName && (
              <form onSubmit={handleDisplayNameSubmit} style={{ width: '100%', maxWidth: '600px', marginTop: '16px' }}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label htmlFor="display-name-input" className="form-label">Update Display Name</label>
                  <input
                    id="display-name-input"
                    type="text"
                    className="form-input"
                    value={displayNameInput}
                    onChange={(e) => {
                      setDisplayNameInput(e.target.value);
                      if (displayNameError) {
                        setDisplayNameError(null);
                      }
                    }}
                    placeholder="Enter a new display name"
                    disabled={displayNameSubmitting || profileLoading}
                  />
                </div>

                {displayNameError && (
                  <div className="error-message" style={{ marginBottom: '12px', textAlign: 'center' }}>
                    {displayNameError}
                  </div>
                )}

                {displayNameSuccess && (
                  <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #c3e6cb',
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}>
                    {displayNameSuccess}
                  </div>
                )}

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={displayNameSubmitting || profileLoading}
                  >
                    {displayNameSubmitting ? 'Saving...' : 'Save Display Name'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="white-box" style={{ marginTop: '30px' }}>
        <h2 className="page-title" style={{ fontSize: '24px' }}>Your Submitted Puzzles</h2>
        {profileLoading && !profile ? (
          <p style={{ textAlign: 'center' }}>Loading your puzzles...</p>
        ) : profileError ? (
          <p style={{ textAlign: 'center', color: '#dc3545' }}>{profileError}</p>
        ) : !profile || profile.puzzles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d' }}>You have not submitted any puzzles yet.</p>
        ) : (
          <div className="archive-list">
            {profile.puzzles.map((puzzle) => (
              <div key={puzzle.id} style={{ position: 'relative' }}>
                <Link
                  to={`/userpuzzle/${puzzle.id}`}
                  className="archive-row"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className="archive-row-content">
                    <div className="archive-row-date">
                      {formatDate(puzzle.date_added)}
                    </div>
                    <div className="archive-row-difficulty">
                      Difficulty: {puzzle.difficulty}/5
                    </div>
                    <div className="archive-row-status">
                      {isUserPuzzleCompleted(puzzle.id) && (
                        <span className="completion-check">✓</span>
                      )}
                    </div>
                  </div>
                  <div className="archive-row-preview">
                    {puzzle.puzzle.substring(0, 80)}
                    {puzzle.puzzle.length > 80 ? '...' : ''}
                  </div>
                </Link>
                <button
                  onClick={(e) => handleDeletePuzzle(puzzle.id, e)}
                  disabled={deletingPuzzleId === puzzle.id}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '15px',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: '2px solid #dc3545',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: deletingPuzzleId === puzzle.id ? 'not-allowed' : 'pointer',
                    opacity: deletingPuzzleId === puzzle.id ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (deletingPuzzleId !== puzzle.id) {
                      e.currentTarget.style.backgroundColor = '#c82333';
                      e.currentTarget.style.borderColor = '#bd2130';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc3545';
                    e.currentTarget.style.borderColor = '#dc3545';
                  }}
                >
                  {deletingPuzzleId === puzzle.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};