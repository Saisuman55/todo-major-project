import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

export function setAuthToken(token) {
  if (token) client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete client.defaults.headers.common['Authorization'];
}

export const auth = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
};

export const tasksApi = {
  getAll: (filter) => client.get('/tasks' + (filter ? `?filter=${filter}` : '')),
  create: (task) => client.post('/tasks', task),
  update: (id, data) => client.put(`/tasks/${id}`, data),
  remove: (id) => client.delete(`/tasks/${id}`),
};

export default client;
