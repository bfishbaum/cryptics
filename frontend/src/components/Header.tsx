import React from 'react';
import { Link } from 'react-router-dom';

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
          <Link to="/submit" className="nav-link">Submit</Link>
        </nav>
      </div>
    </header>
  );
};