/**
 * API endpoints and configuration types
 */

// API Base Configuration
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  authHeader: string;
}

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    SIGN_OUT: '/auth/signout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    CHANGE_PASSWORD: '/auth/change-password',
    DELETE_ACCOUNT: '/auth/delete-account',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    GET_STATS: '/user/stats',
    GET_ACHIEVEMENTS: '/user/achievements',
    GET_PUBLIC_PROFILE: (userId: number) => `/user/${userId}/public`,
    UPLOAD_AVATAR: '/user/avatar',
  },
  
  // Cryptogram endpoints
  CRYPTOGRAM: {
    LIST: '/cryptograms',
    GET_BY_ID: (id: number) => `/cryptograms/${id}`,
    GET_LATEST: '/cryptograms/latest',
    CREATE: '/cryptograms',
    UPDATE: (id: number) => `/cryptograms/${id}`,
    DELETE: (id: number) => `/cryptograms/${id}`,
    SEARCH: '/cryptograms/search',
  },
  
  // Progress endpoints
  PROGRESS: {
    GET_USER_PROGRESS: '/progress',
    SAVE_PROGRESS: '/progress/save',
    GET_PUZZLE_PROGRESS: (puzzleId: number) => `/progress/puzzle/${puzzleId}`,
    MARK_COMPLETED: '/progress/complete',
    GET_LEADERBOARD: '/progress/leaderboard',
  },
  
  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    USER_DETAILS: (userId: number) => `/admin/users/${userId}`,
    CRYPTOGRAMS: '/admin/cryptograms',
    ANALYTICS: '/admin/analytics',
    MODERATE_CONTENT: '/admin/moderate',
  }
} as const;

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Request Options
export interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  requiresAuth?: boolean;
}

// API Response Structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  pagination?: PaginationInfo;
}

// Error Response Structure
export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
  statusCode?: number;
}

// Pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Request/Response interceptor types
export type RequestInterceptor = (config: ApiRequestOptions) => ApiRequestOptions | Promise<ApiRequestOptions>;
export type ResponseInterceptor = (response: any) => any | Promise<any>;
export type ErrorInterceptor = (error: any) => any | Promise<any>;

// API Client Interface
export interface ApiClient {
  get<T = any>(url: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>>;
  post<T = any>(url: string, data?: any, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>>;
  put<T = any>(url: string, data?: any, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, data?: any, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>>;
  setAuthToken(token: string | null): void;
  addRequestInterceptor(interceptor: RequestInterceptor): void;
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
  addErrorInterceptor(interceptor: ErrorInterceptor): void;
}

// Environment-specific API configurations
export const API_CONFIGS: Record<string, ApiConfig> = {
  development: {
    baseUrl: 'http://localhost:3001/api',
    timeout: 10000,
    retries: 3,
    authHeader: 'Authorization'
  },
  production: {
    baseUrl: 'https://api.crypticclues.com/api',
    timeout: 15000,
    retries: 2,
    authHeader: 'Authorization'
  },
  test: {
    baseUrl: 'http://localhost:3001/api',
    timeout: 5000,
    retries: 1,
    authHeader: 'Authorization'
  }
};

// API Status Codes
export type ApiStatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 503;

// Status code constants for easier use
export const API_STATUS = {
  OK: 200 as const,
  CREATED: 201 as const,
  NO_CONTENT: 204 as const,
  BAD_REQUEST: 400 as const,
  UNAUTHORIZED: 401 as const,
  FORBIDDEN: 403 as const,
  NOT_FOUND: 404 as const,
  CONFLICT: 409 as const,
  UNPROCESSABLE_ENTITY: 422 as const,
  TOO_MANY_REQUESTS: 429 as const,
  INTERNAL_SERVER_ERROR: 500 as const,
  SERVICE_UNAVAILABLE: 503 as const
} as const;

// Upload/File types
export interface FileUploadRequest {
  file: File;
  onProgress?: (progress: number) => void;
}

export interface FileUploadResponse {
  success: boolean;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  message?: string;
}