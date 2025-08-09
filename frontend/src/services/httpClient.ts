/**
 * HTTP Client for API calls with authentication support
 * Using Axios for robust HTTP handling
 */

import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { 
  ApiClient, 
  ApiResponse, 
  ApiRequestOptions, 
  ApiError,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor
} from '../types/api';
import { getAccessToken, formatAuthHeader, isTokenExpired } from '../utils/jwt';

class HttpClientImpl implements ApiClient {
  private axiosInstance: AxiosInstance;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseUrl: string, timeout: number = 10000) {
    // Create Axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup default interceptors
    this.setupDefaultInterceptors();
  }

  /**
   * Setup default Axios interceptors
   */
  private setupDefaultInterceptors(): void {
    // Request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available and not explicitly disabled
        if (config.headers && !config.headers['skipAuth']) {
          const token = getAccessToken();
          if (token && !isTokenExpired(token)) {
            config.headers.Authorization = formatAuthHeader(token);
          }
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor for consistent error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token might be expired, trigger auth refresh
          window.dispatchEvent(new CustomEvent('auth:token-expired'));
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Convert Axios response to our API response format
   */
  private convertResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data,
      message: response.data?.message,
    };
  }

  /**
   * Convert Axios error to our API error format
   */
  private convertError(error: AxiosError): ApiResponse {
    const response = error.response;
    const responseData = response?.data as any;
    
    const apiError: ApiError = {
      code: responseData?.code || `HTTP_${response?.status || 0}`,
      message: responseData?.message || error.message || 'An error occurred',
      statusCode: response?.status,
      details: responseData?.details,
    };

    return {
      success: false,
      error: apiError,
    };
  }

  /**
   * Make HTTP request using Axios
   */
  private async request<T>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
    try {
      // Apply custom request interceptors
      let processedOptions = { ...options };
      for (const interceptor of this.requestInterceptors) {
        processedOptions = await interceptor(processedOptions);
      }

      // Convert our options to Axios config
      const axiosConfig = {
        method: processedOptions.method.toLowerCase() as any,
        url: processedOptions.url,
        data: processedOptions.data,
        params: processedOptions.params,
        headers: {
          ...processedOptions.headers,
          ...(processedOptions.requiresAuth === false ? { skipAuth: true } : {}),
        },
        timeout: processedOptions.timeout,
      };

      // Make request with Axios
      const response = await this.axiosInstance.request<T>(axiosConfig);
      
      // Convert to our response format
      let apiResponse = this.convertResponse<T>(response);

      // Apply custom response interceptors
      for (const interceptor of this.responseInterceptors) {
        apiResponse = await interceptor(apiResponse);
      }

      return apiResponse;

    } catch (error) {
      // Apply custom error interceptors
      let processedError = error;
      for (const interceptor of this.errorInterceptors) {
        processedError = await interceptor(processedError);
      }

      // Convert Axios error to our format
      if (axios.isAxiosError(processedError)) {
        return this.convertError(processedError);
      }

      // Handle non-Axios errors
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: (processedError as Error).message || 'An unknown error occurred',
        },
      };
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      ...options,
    });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options: Partial<ApiRequestOptions> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...options,
    });
  }

  /**
   * Set authentication token (deprecated - use interceptors)
   */
  setAuthToken(_token: string | null): void {
    // This method is kept for interface compatibility
    // Authentication should be handled by interceptors
    console.warn('setAuthToken is deprecated. Use request interceptors for authentication.');
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

}

// Create default HTTP client instance
const getApiConfig = () => {
  // Use environment variables with fallbacks
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://api.crypticclues.com/api' 
      : 'http://localhost:3001/api');
  
  const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);
  
  return {
    baseUrl,
    timeout,
  };
};

const config = getApiConfig();
const httpClient = new HttpClientImpl(config.baseUrl, config.timeout);

export { httpClient };
export default httpClient;