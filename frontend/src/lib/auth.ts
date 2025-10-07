/**
 * Clean Auth.js-inspired authentication for React SPA
 * Uses Auth.js backend endpoints
 */

import { z } from 'zod';
import type { User } from '../types/user';

// Auth.js-inspired configuration
export interface AuthConfig {
  baseUrl: string;
  pages?: {
    signIn?: string;
    signUp?: string;
    error?: string;
    verifyRequest?: string;
  };
  session: {
    strategy: 'jwt';
    maxAge: number;
  };
}

// Auth.js-inspired provider interface
export interface AuthProvider {
  id: string;
  name: string;
  type: 'credentials' | 'oauth';
}

// Session interface matching Auth.js
export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
  expires: string;
}

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms'),
  subscribeToNewsletter: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Auth configuration
export const authConfig: AuthConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

// Main Auth class
class Auth {
  private currentSession: Session | null = null;
  private config: AuthConfig;
  private csrfToken: string | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  private buildUrl(path: string) {
    try {
      return new URL(path, this.config.baseUrl).toString();
    } catch {
      return `${this.config.baseUrl}${path}`;
    }
  }

  // Get CSRF token from Auth.js
  private async getCsrfToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/auth/csrf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data?.csrfToken) {
          this.csrfToken = data.csrfToken;
          return this.csrfToken;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      return null;
    }
  }

  // Auth.js-inspired signIn method with proper redirect handling
  async signIn(
    providerId: string = 'credentials', 
    credentials?: any,
    options?: { redirect?: boolean; callbackUrl?: string }
  ): Promise<{ ok: boolean; error?: string; url?: string }> {
    try {
      // Get CSRF token first
      const csrfToken = await this.getCsrfToken();
      if (!csrfToken) {
        return { ok: false, error: 'Failed to get security token' };
      }

      // Use Auth.js signin endpoint with form data and handle redirects
      const formData = new URLSearchParams();
      
      // Add credentials (must match the credentials config in Auth.js)
      if (credentials.email) formData.append('email', credentials.email);
      if (credentials.password) formData.append('password', credentials.password);
      
      // Add Auth.js specific fields
      formData.append('csrfToken', csrfToken);
      formData.append('callbackUrl', options?.callbackUrl || '/');
      formData.append('json', 'true'); // Request JSON response

      const fetchResponse = await fetch(`${this.config.baseUrl}/auth/signin/${providerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
        redirect: 'manual', // Handle redirects manually
      });

      // Auth.js will return 302 for successful signin
      if (fetchResponse.status === 302) {
        // Check if we got a session by calling getSession
        const session = await this.getSession();
        if (session) {
          return { ok: true, url: options?.callbackUrl || '/' };
        } else {
          return { ok: false, error: 'Authentication failed' };
        }
      }

      // Handle error responses
      if (fetchResponse.status >= 400) {
        const errorText = await fetchResponse.text().catch(() => 'Sign in failed');
        return { ok: false, error: errorText };
      }

      return { ok: false, error: 'Unexpected response from server' };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }

  // Auth.js-inspired signUp method
  async signUp(credentials: any): Promise<{ ok: boolean; error?: string; user?: User }> {
    try {
      const validatedCredentials = signUpSchema.parse(credentials);

      const fetchResponse = await fetch(this.buildUrl('/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(validatedCredentials),
        credentials: 'include',
      });

      const data = await fetchResponse.json().catch(() => null);

      if (fetchResponse.ok && data && typeof data === 'object' && 'user' in data) {
        return { ok: true, user: (data as { user: User }).user };
      }

      const message = data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : 'Sign up failed';

      return { ok: false, error: message };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { ok: false, error: error.issues[0].message };
      }
      return { ok: false, error: (error as Error).message };
    }
  }

  // Auth.js-inspired signOut method
  async signOut(options?: { redirect?: boolean; callbackUrl?: string }): Promise<{ url?: string }> {
    try {
      // Get CSRF token first
      const csrfToken = await this.getCsrfToken();
      
      if (csrfToken) {
        // Use JSON format for Auth.js signout
        await fetch(`${this.config.baseUrl}/auth/signout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            csrfToken,
            callbackUrl: options?.callbackUrl || '/',
            json: true,
          }),
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Sign out request failed:', error);
    } finally {
      this.currentSession = null;
      this.csrfToken = null; // Clear cached CSRF token
    }

    const redirectUrl = options?.callbackUrl || '/';
    return { url: redirectUrl };
  }

  // Auth.js-inspired getSession method
  async getSession(): Promise<Session | null> {
    try {
      const fetchResponse = await fetch(this.buildUrl('/auth/session'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!fetchResponse.ok) {
        this.currentSession = null;
        return null;
      }

      const data = await fetchResponse.json().catch(() => null);

      if (data && typeof data === 'object' && 'user' in data) {
        this.currentSession = data as Session;
        return this.currentSession;
      }

      this.currentSession = null;
      return null;
    } catch (error) {
      console.error('Failed to get session:', error);
      this.currentSession = null;
      return null;
    }
  }

  // Get current user
  getUser(): Session['user'] | null {
    return this.currentSession?.user || null;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }
}

// Create global auth instance
export const auth = new Auth(authConfig);

// Export validation schemas for use in components
export { signInSchema, signUpSchema };