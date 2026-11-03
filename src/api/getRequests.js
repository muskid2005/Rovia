import { apiClient } from './client';

/**
 * Generic GET request helper
 * @param {string} endpoint - The API path (e.g., '/opportunities')
 * @param {object} [params] - Optional query parameters object
 * @param {object} [headers] - Optional custom headers
 */
export async function getRequest(endpoint, params = {}, headers = {}) {
  let url = endpoint;

  // Append query parameters if provided
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  return apiClient(url, {
    method: 'GET',
    headers,
  });
}