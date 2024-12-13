// src/services/api.js
import axiosConfig from '../config/axios-config';

const handleResponse = (response) => response.data;

const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  throw new Error(message);
};

export const endpoints = {
  auth: {
    login: (credentials) =>
      axiosConfig.post('/auth/login', credentials)
        .then(handleResponse)
        .catch(handleError),
    register: (userData) =>
      axiosConfig.post('/auth/register', userData)
        .then(handleResponse)
        .catch(handleError),
  },
  mines: {
    getAll: () =>
      axiosConfig.get('/mines')
        .then(handleResponse)
        .catch(handleError),
    getById: (id) =>
      axiosConfig.get(`/mines/${id}`)
        .then(handleResponse)
        .catch(handleError),
    create: (data) =>
      axiosConfig.post('/mines', data)
        .then(handleResponse)
        .catch(handleError),
    update: (id, data) =>
      axiosConfig.put(`/mines/${id}`, data)
        .then(handleResponse)
        .catch(handleError),
    delete: (id) =>
      axiosConfig.delete(`/mines/${id}`)
        .then(handleResponse)
        .catch(handleError),
  },
  minerals: {
    getAll: () =>
      axiosConfig.get('/minerals')
        .then(handleResponse)
        .catch(handleError),
    getById: (id) =>
      axiosConfig.get(`/minerals/${id}`)
        .then(handleResponse)
        .catch(handleError),
    create: (data) =>
      axiosConfig.post('/minerals', data)
        .then(handleResponse)
        .catch(handleError),
    update: (id, data) =>
      axiosConfig.put(`/minerals/${id}`, data)
        .then(handleResponse)
        .catch(handleError),
    delete: (id) =>
      axiosConfig.delete(`/minerals/${id}`)
        .then(handleResponse)
        .catch(handleError),
  },
  users: {
    getAll: () =>
      axiosConfig.get('/users')
        .then(handleResponse)
        .catch(handleError),
    getById: (id) =>
      axiosConfig.get(`/users/${id}`)
        .then(handleResponse)
        .catch(handleError),
    create: (data) =>
      axiosConfig.post('/users', data)
        .then(handleResponse)
        .catch(handleError),
    update: (id, data) =>
      axiosConfig.put(`/users/${id}`, data)
        .then(handleResponse)
        .catch(handleError),
    delete: (id) =>
      axiosConfig.delete(`/users/${id}`)
        .then(handleResponse)
        .catch(handleError),
  },
  provinces: {
    getAll: () =>
      axiosConfig.get('/provinces')
        .then(handleResponse)
        .catch(handleError),
    getById: (id) =>
      axiosConfig.get(`/provinces/${id}`)
        .then(handleResponse)
        .catch(handleError),
    create: (data) =>
      axiosConfig.post('/provinces', data)
        .then(handleResponse)
        .catch(handleError),
    update: (id, data) =>
      axiosConfig.put(`/provinces/${id}`, data)
        .then(handleResponse)
        .catch(handleError),
    delete: (id) =>
      axiosConfig.delete(`/provinces/${id}`)
        .then(handleResponse)
        .catch(handleError),
  },
  environmental: {
    getAll: () =>
      axiosConfig.get('/environmental-data')
        .then(handleResponse)
        .catch(handleError),
    getByMine: (mineId) =>
      axiosConfig.get(`/environmental-data/mine/${mineId}`)
        .then(handleResponse)
        .catch(handleError),
  },
  safety: {
    getAll: () =>
      axiosConfig.get('/safety-data')
        .then(handleResponse)
        .catch(handleError),
    getByMine: (mineId) =>
      axiosConfig.get(`/safety-data/mine/${mineId}`)
        .then(handleResponse)
        .catch(handleError),
  },
};

export default endpoints;