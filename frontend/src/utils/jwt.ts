/**
 * JWT token management utilities
 */

// Token storage keys
const ACCESS_TOKEN_KEY = 'cryptics_access_token';
const REFRESH_TOKEN_KEY = 'cryptics_refresh_token';
const TOKEN_EXPIRY_KEY = 'cryptics_token_expiry';

export interface TokenPayload {
  sub: string; // user ID
  email: string;
  username: string;
  role: string;
  iat: number; // issued at
  exp: number; // expires at
}

/**
 * Decode JWT token payload (without verification)
 * Note: This is for client-side parsing only, server should verify
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as TokenPayload;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Check if token expires within the next N seconds
 */
export function isTokenExpiringSoon(token: string, thresholdSeconds: number = 300): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  return (payload.exp - now) < thresholdSeconds;
}

/**
 * Get token expiry date
 */
export function getTokenExpiry(token: string): Date | null {
  const payload = decodeToken(token);
  if (!payload) return null;
  
  return new Date(payload.exp * 1000);
}

/**
 * Store tokens securely
 */
export function storeTokens(accessToken: string, refreshToken: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    const expiry = getTokenExpiry(accessToken);
    if (expiry) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());
    }
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
}

/**
 * Get stored access token
 * Note: This is kept for backward compatibility
 * For Auth0 integration, use getAuth0AccessToken from auth0-token.ts
 */
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

/**
 * Get access token from Auth0 or localStorage fallback
 * This is a transitional function - prefer using Auth0 directly
 */
export async function getAccessTokenAsync(): Promise<string | null> {
  // First try localStorage (existing tokens)
  const storedToken = getAccessToken();
  if (storedToken && !isTokenExpired(storedToken)) {
    return storedToken;
  }

  // If no valid stored token, caller should use Auth0 directly
  return null;
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}

/**
 * Get stored token expiry
 */
export function getStoredTokenExpiry(): Date | null {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? new Date(expiry) : null;
  } catch (error) {
    console.error('Failed to get token expiry:', error);
    return null;
  }
}

/**
 * Clear all stored tokens
 */
export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  
  return !isTokenExpired(token);
}

/**
 * Get user info from token
 */
export function getUserFromToken(): TokenPayload | null {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) return null;
  
  return decodeToken(token);
}

/**
 * Format token for Authorization header
 */
export function formatAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string): string | null {
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

/**
 * Validate token format (basic structure check)
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
}

/**
 * Get time until token expires (in seconds)
 */
export function getTimeUntilExpiry(token: string): number {
  const payload = decodeToken(token);
  if (!payload) return 0;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

/**
 * Create a token refresh scheduler
 */
export function createTokenRefreshScheduler(
  refreshCallback: () => Promise<void>,
  thresholdSeconds: number = 300
): () => void {
  let timeoutId: NodeJS.Timeout | null = null;

  const scheduleRefresh = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const token = getAccessToken();
    if (!token) return;

    const timeUntilRefresh = getTimeUntilExpiry(token) - thresholdSeconds;
    
    if (timeUntilRefresh > 0) {
      timeoutId = setTimeout(async () => {
        try {
          await refreshCallback();
          scheduleRefresh(); // Schedule next refresh
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }, timeUntilRefresh * 1000);
    }
  };

  scheduleRefresh();

  // Return cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}