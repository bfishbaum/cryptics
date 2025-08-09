import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const ProfilePage: React.FC = () => {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="content-box">
          <h1>Profile</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="content-box">
          <h1>Profile</h1>
          <p>You must be logged in to view your profile.</p>
          <button 
            onClick={() => loginWithRedirect()}
            className="submit-btn"
            style={{ marginTop: '1rem' }}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-box">
        <h1>Profile</h1>
        <div className="profile-info">
          {user?.picture && (
            <img 
              src={user.picture} 
              alt="Profile" 
              className="profile-picture"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                marginBottom: '1rem',
                border: '2px solid #ccc'
              }}
            />
          )}
          <div className="profile-details">
            <p><strong>Name:</strong> {user?.name || 'Not provided'}</p>
            <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
            <p><strong>Username:</strong> {user?.nickname || user?.preferred_username || 'Not provided'}</p>
            {user?.email_verified !== undefined && (
              <p><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};