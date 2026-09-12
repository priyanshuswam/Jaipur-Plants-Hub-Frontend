/**
 * Axios Instance with Interceptors
 * Handles auth tokens, refresh logic, error normalisation
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: sends cookies with requests
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Token management ----
// Note: We no longer store accessToken in memory since we use httpOnly cookies
// The backend sends accessToken and refreshToken as httpOnly cookies
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// ---- Request Interceptor ----
// No need to manually add Authorization header - cookies are sent automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor ----
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the ongoing refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint - backend will use refreshToken from httpOnly cookie
        await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Refresh successful, backend set new cookies
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - user needs to login again
        processQueue(refreshError);

        if (typeof window !== 'undefined') {
          // Clear local auth state
          localStorage.removeItem('greenscape-auth');
          
          // Redirect to login only if not already there
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?session=expired';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Show error toast for certain status codes
    const message = (error.response?.data as any)?.message;
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please slow down.');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You don\'t have permission.');
    }

    return Promise.reject(error);
  }
);

// Legacy export for backward compatibility - but no longer used since we use cookies
export const setAccessToken = (_token: string | null) => {
  // No-op: tokens are now in httpOnly cookies, not in memory
  console.warn('setAccessToken is deprecated. Tokens are now managed via httpOnly cookies.');
};

export default api;
