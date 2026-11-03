import { apiClient } from './client';

/**
 * Generic DELETE request helper
 * @param {string} endpoint - The API path (e.g., '/opportunities/123')
 * @param {object} [headers] - Optional custom headers
 */
export async function deleteRequest(endpoint, headers = {}) {
  return apiClient(endpoint, {
    method: 'DELETE',
    headers,
  });
}