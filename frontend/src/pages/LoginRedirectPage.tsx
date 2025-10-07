import { useEffect } from 'react';

const AUTH0_DOMAIN = 'dev-l01xcafdoui0qywg.us.auth0.com';
const CLIENT_ID = 'zidEswQhfP0z4dcYa57zXqeC0Kha7I3R';
const AUDIENCE = 'cryptic_api_id';

const buildAuthorizeUrl = () => {
  const authorizeUrl = new URL(`https://${AUTH0_DOMAIN}/authorize`);
  authorizeUrl.searchParams.set('client_id', CLIENT_ID);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('redirect_uri', window.location.origin);
  authorizeUrl.searchParams.set('scope', 'openid profile email offline_access delete:cryptic write:new_cryptic');
  authorizeUrl.searchParams.set('audience', AUDIENCE);
  authorizeUrl.searchParams.set('prompt', 'login');

  return authorizeUrl.toString();
};

export const LoginRedirectPage = () => {
  useEffect(() => {
    const authorizeUrl = buildAuthorizeUrl();
    window.location.replace(authorizeUrl);
  }, []);

  return (
    <div className="container">
      <div className="white-box">
        <h1 className="page-title">Redirecting to Sign In</h1>
        <p style={{ textAlign: 'center', color: '#6c757d' }}>
          Please wait while we redirect you to the Auth0 login page.
        </p>
      </div>
    </div>
  );
};
