import apiClient from '../../../shared/api/apiClient.js';

export async function loginUser(credentials) {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);
    // Expecting response.data to have { token, user: { id, name, role } }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function logoutUser() {
  // Can be used if backend requires calling an endpoint for logout
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error on server:', error);
  }
}
