import { apiClient } from './client';

/**
 * Generic POST request helper
 * @param {string} endpoint - The API path (e.g., '/auth/login' or '/applications')
 * @param {object|FormData} payload - The request body payload or FormData
 * @param {object} [headers] - Optional custom headers
 */
export async function postRequest(endpoint, payload = {}, headers = {}) {
  const isFormData = payload instanceof FormData;

  return apiClient(endpoint, {
    method: 'POST',
    body: isFormData ? payload : JSON.stringify(payload),
    headers,
  });
}