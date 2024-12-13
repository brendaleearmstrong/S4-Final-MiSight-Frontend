// src/services/api.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export const endpoints = {
  mines: {
    getAll: async () => {
      const response = await axiosInstance.get('/mines');
      return response.data;
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/mines/${id}`);
      return response.data;
    },
    create: async (data) => {
      const response = await axiosInstance.post('/mines', data);
      return response.data;
    },
    update: async (id, data) => {
      const response = await axiosInstance.put(`/mines/${id}`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await axiosInstance.delete(`/mines/${id}`);
      return response.data;
    }
  },

  minerals: {
    getAll: async () => {
      const response = await axiosInstance.get('/minerals');
      return response.data;
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/minerals/${id}`);
      return response.data;
    },
    create: async (data) => {
      const response = await axiosInstance.post('/minerals', data);
      return response.data;
    },
    update: async (id, data) => {
      const response = await axiosInstance.put(`/minerals/${id}`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await axiosInstance.delete(`/minerals/${id}`);
      return response.data;
    }
  },

  users: {
    getAll: async () => {
      const response = await axiosInstance.get('/users');
      return response.data;
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    },
    create: async (data) => {
      const response = await axiosInstance.post('/users', {
        username: data.username,
        password: data.password,
        role: data.role,
        privileges: data.privileges || []
      });
      return response.data;
    },
    update: async (id, data) => {
      const response = await axiosInstance.put(`/users/${id}`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    }
  },

  provinces: {
    getAll: async () => {
      const response = await axiosInstance.get('/provinces');
      return response.data;
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/provinces/${id}`);
      return response.data;
    }
  },

  pollutants: {
    getAll: async () => {
      const response = await axiosInstance.get('/pollutants');
      return response.data;
    },
    getById: async (id) => {
      const response = await axiosInstance.get(`/pollutants/${id}`);
      return response.data;
    }
  },

  environmentalData: {
    getAll: async () => {
      const response = await axiosInstance.get('/environmental-data');
      return response.data;
    },
    getByMine: async (mineId) => {
      const response = await axiosInstance.get(`/environmental-data/mine/${mineId}`);
      return response.data;
    }
  },

  safetyData: {
    getAll: async () => {
      const response = await axiosInstance.get('/safety-data');
      return response.data;
    },
    getByMine: async (mineId) => {
      const response = await axiosInstance.get(`/safety-data/mine/${mineId}`);
      return response.data;
    }
  }
};

export default endpoints;