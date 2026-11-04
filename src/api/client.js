import { useAuthStore } from '../store/useAuthStore'; // Adjust path to your store if needed

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiClient(endpoint, options = {}, isRetry = false) {
  const url = `${BASE_URL}/api/v1${endpoint}`;

  // Grab access token from memory/store if available
  const accessToken = useAuthStore.getState?.().accessToken;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config = {
    ...options,
    credentials: 'include', // Required for httpOnly refresh token cookies
    headers: defaultHeaders,
  };

  try {
    const response = await fetch(url, config);

    // Handle token expiration & automatic refresh
    if (response.status === 401 && !isRetry && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
      // console.log(`[Auth] Access token expired (401) on ${endpoint}. Attempting token refresh...`);
      
      try {
        // Request a new access token using the httpOnly cookie
        const refreshResponse = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!refreshResponse.ok) {
          // console.log('[Auth] Refresh token failed or expired. Forcing logout.');
          useAuthStore.getState().clearSession?.();
          throw new Error('Session expired. Please log in again.');
        }

        const refreshData = await refreshResponse.json();
        
        // Extract and save the new access token
        const newAccessToken = refreshData.accessToken || refreshData.data?.accessToken;
        if (newAccessToken) {
          useAuthStore.getState().setAccessToken?.(newAccessToken);
          // console.log('[Auth] Token successfully refreshed and reset in store!');
        }

        // Retry the original request with the new access token
        // console.log(`[Auth] Retrying original request to: ${endpoint}`);
        return apiClient(endpoint, options, true);

      } catch (refreshError) {
        console.error('[Auth] Refresh flow encountered an error:', refreshError.message);
        useAuthStore.getState().clearSession?.();
        throw refreshError;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.error?.message || `HTTP Error: ${response.status}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}