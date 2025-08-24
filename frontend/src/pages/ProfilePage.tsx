import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const ProfilePage: React.FC = () => {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();

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
          </div>
        </div>
      </div>
    </div>
  );
};