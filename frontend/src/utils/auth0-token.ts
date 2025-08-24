/**
 * Auth0 token management utilities
 * Integrates with Auth0 SDK for token handling
 */

import type { User } from '@auth0/auth0-react';

// Audience for your API (you'll need to configure this in Auth0)
const API_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || `${window.location.origin}/api`;

// Auth0 hook return type interface
interface Auth0Hook {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  getAccessTokenSilently: (options?: any) => Promise<string>;
  loginWithRedirect: (options?: any) => Promise<void>;
}

/**
 * Get Auth0 access token for API calls
 * This is a wrapper around Auth0's getAccessTokenSilently
 */
export async function getAuth0AccessToken(auth0: Auth0Hook): Promise<string | null> {
  try {
    if (!auth0.isAuthenticated) {
      console.warn('User not authenticated, cannot get access token');
      return null;
    }

    // Get access token from Auth0
    const token = await auth0.getAccessTokenSilently({
      authorizationParams: {
        audience: API_AUDIENCE,
        scope: 'read:cryptograms write:cryptograms delete:cryptograms'
      }
    });

    return token;
  } catch (error) {
    console.error('Failed to get Auth0 access token:', error);
    
    // If getting token silently fails, might need to login again
    if (error instanceof Error && error.message.includes('login_required')) {
      console.warn('Login required - redirecting to Auth0');
      auth0.loginWithRedirect();
    }
    
    return null;
  }
}

/**
 * Check if Auth0 user is authenticated and has valid token
 */
export function isAuth0Authenticated(auth0: Auth0Hook): boolean {
  return auth0.isAuthenticated && !auth0.isLoading;
}

/**
 * Get user info from Auth0
 */
export function getAuth0User(auth0: Auth0Hook): User | null {
  if (!isAuth0Authenticated(auth0)) return null;
  return auth0.user || null;
}

/**
 * Format Auth0 token for Authorization header
 */
export function formatAuth0Header(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Create an Auth0-aware HTTP request function
 */
export function createAuthenticatedRequest(auth0: Auth0Hook) {
  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    try {
      // Get access token
      const token = await getAuth0AccessToken(auth0);
      
      if (!token) {
        throw new Error('Failed to get access token');
      }

      // Add authorization header
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': formatAuth0Header(token)
      };

      // Make request with token
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle 401 (unauthorized) responses
      if (response.status === 401) {
        console.warn('Request unauthorized - token may be expired');
        // Could trigger re-authentication here if needed
      }

      return response;
    } catch (error) {
      console.error('Authenticated request failed:', error);
      throw error;
    }
  };
}

/**
 * Hook to use Auth0 token with existing HTTP client
 */
export function createAuth0TokenProvider(auth0: Auth0Hook) {
  return {
    getToken: () => getAuth0AccessToken(auth0),
    isAuthenticated: () => isAuth0Authenticated(auth0),
    getUser: () => getAuth0User(auth0)
  };
}