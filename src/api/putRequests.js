import { apiClient } from './client';

/**
 * Generic PUT/PATCH request helper
 * @param {string} endpoint - The API path (e.g., '/users/profile')
 * @param {object|FormData} payload - The request body payload or FormData
 * @param {boolean} [isPatch=false] - Set to true if using PATCH instead of PUT
 * @param {object} [headers] - Optional custom headers
 */
export async function putRequest(
  endpoint,
  payload = {},
  isPatch = false,
  headers = {}
) {
  const isFormData = payload instanceof FormData;

  return apiClient(endpoint, {
    method: isPatch ? 'PATCH' : 'PUT',
    body: isFormData ? payload : JSON.stringify(payload),
    headers,
  });
}