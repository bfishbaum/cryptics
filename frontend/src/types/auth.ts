/**
 * Authentication-related TypeScript types
 */

import type { User } from './user';

// Sign In Types
export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignInResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string; // ISO date string
  message?: string;
}

// Sign Up Types
export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  acceptTerms: boolean;
  subscribeToNewsletter?: boolean;
}

export interface SignUpResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string; // ISO date string
  message: string;
  requiresEmailVerification: boolean;
}

// Password Reset Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Email Verification Types
export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

// Token Refresh Types
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  expiresAt: string; // ISO date string
}

// Sign Out Types
export interface SignOutRequest {
  refreshToken?: string;
}

export interface SignOutResponse {
  success: boolean;
  message: string;
}

// Profile Update Types
export interface UpdateProfileRequest {
  displayName?: string;
  username?: string;
  avatar?: string;
  preferences?: Partial<import('./user').UserPreferences>;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: User;
  message: string;
}

// Change Password Types
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Delete Account Types
export interface DeleteAccountRequest {
  password: string;
  confirmation: string; // Must be "DELETE"
}

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

// Authentication Error Types
export interface AuthError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface AuthValidationError {
  success: false;
  errors: {
    [field: string]: string[];
  };
  message: string;
}

// Common API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: AuthError;
  errors?: AuthValidationError['errors'];
}

// Authentication State Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  authState: AuthState;
  signIn: (credentials: SignInRequest) => Promise<SignInResponse>;
  signUp: (userData: SignUpRequest) => Promise<SignUpResponse>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateProfile: (updates: UpdateProfileRequest) => Promise<UpdateProfileResponse>;
  changePassword: (passwords: ChangePasswordRequest) => Promise<ChangePasswordResponse>;
  deleteAccount: (confirmation: DeleteAccountRequest) => Promise<DeleteAccountResponse>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
  verifyEmail: (token: string) => Promise<VerifyEmailResponse>;
  resendVerification: (email: string) => Promise<ResendVerificationResponse>;
}

// Form Validation Types
export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  acceptTerms: boolean;
  subscribeToNewsletter: boolean;
}

export interface FormErrors {
  [field: string]: string;
}

// OAuth Types (for future social login)
export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface OAuthSignInRequest {
  provider: string;
  code: string;
  state?: string;
}

export interface OAuthSignInResponse extends SignInResponse {
  isNewUser: boolean;
}