import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const {  loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()} className='nav-link'>Log In</button>;
}
const LogoutButton = () => {
  const {  logout } = useAuth0();
  return <button onClick={() => logout()} className='nav-link'>Log Out</button>;
}

export const Header: React.FC = () => {

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Cryptic Clues!
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/archive" className="nav-link">Archive</Link>
          <Link to="/privacy" className="nav-link">Privacy</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <LoginButton />
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
};