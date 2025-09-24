// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'

console.log("Env:", import.meta.env.PROD);
createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain='dev-l01xcafdoui0qywg.us.auth0.com'
    clientId='zidEswQhfP0z4dcYa57zXqeC0Kha7I3R'
    authorizationParams={{
      redirect_uri: "https://bfishbaum.github.io/cryptics",
      audience: 'cryptic_api_id',
    }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
)
