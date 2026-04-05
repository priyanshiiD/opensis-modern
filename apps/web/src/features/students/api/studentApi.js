import apiClient from '../../../shared/api/apiClient.js';

export async function createStudent(data) {
  const response = await apiClient.post('/api/students', data);
  return response.data;
}

export async function getStudentById(id) {
  const response = await apiClient.get(`/api/students/${id}`);
  return response.data;
}

export async function updateStudent(id, data) {
  const response = await apiClient.put(`/api/students/${id}`, data);
  return response.data;
}
