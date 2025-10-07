import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()}
      className='menu-item-button'
    >
      Log In
    </button>
  );
}

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() => logout()}
      className='menu-item-button'
    >
      Log Out
    </button>
  );
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
      </div>
    </header>
  );
};

const ADMIN_REQUIRED_SCOPES = ['delete:cryptic', 'write:new_cryptic'];

export const NavigationMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAdminAccess = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setHasAdminAccess(false);
        }
        return;
      }

      try {
        const tokenResponse = await getAccessTokenSilently({
          detailedResponse: true,
          cacheMode: 'on',
          authorizationParams: {
            audience: 'cryptic_api_id',
            scope: ADMIN_REQUIRED_SCOPES.join(' '),
          },
        }) as { access_token: string; scope?: string };

        const scopeSet = new Set((tokenResponse.scope ?? '').split(' ').filter(Boolean));
        const hasAllScopes = ADMIN_REQUIRED_SCOPES.every(scope => scopeSet.has(scope));
        if (isMounted) {
          setHasAdminAccess(hasAllScopes);
        }
      } catch (error) {
        if (isMounted) {
          setHasAdminAccess(false);
        }
        console.warn('Failed to determine admin access', error);
      }
    };

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <button
        className="hamburger-menu-fixed"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-section">
          <h3 className="nav-section-title">Puzzles</h3>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/archive" className="nav-link" onClick={closeMenu}>Official Archive</Link>
          <Link to="/userarchive" className="nav-link" onClick={closeMenu}>User Archive</Link>
          <Link to="/submit" className="nav-link" onClick={closeMenu}>Submit</Link>
          {hasAdminAccess && (
            <Link to="/admin" className="nav-link" onClick={closeMenu}>Admin</Link>
          )}
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Information</h3>
          <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
          <Link to="/support" className="nav-link" onClick={closeMenu}>Support</Link>
          <Link to="/privacy" className="nav-link" onClick={closeMenu}>Privacy</Link>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Account</h3>
          <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link>
          <div onClick={closeMenu} className="nav-link-container">
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </nav>

      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </>
  );
};