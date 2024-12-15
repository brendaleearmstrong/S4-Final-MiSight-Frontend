import axios from 'axios';

const baseURL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
    }
);

export const SCULLY_MINE = {
    id: 3,
    name: 'Scully Mine',
    company: 'Tacora Resources',
    location: 'Wabush, NL',
    province_id: 1
};

export const SCULLY_MINE_ID = SCULLY_MINE.id;

export const endpoints = {
    mines: {
        getAll: async () => api.get('/mines'),
        getById: async (id) => api.get(`/mines/${id}`),
        create: async (data) => api.post('/mines', data),
        update: async (id, data) => api.put(`/mines/${id}`, data),
        delete: async (id) => api.delete(`/mines/${id}`),
        getWithMinerals: async (id) => api.get(`/mines/${id}/minerals`),
        exportAll: async () => api.get('/mines/export', { responseType: 'blob' }),
        exportById: async (id) => api.get(`/mines/${id}/export`, { responseType: 'blob' })
    },

    minerals: {
        getAll: async () => api.get('/minerals'),
        getById: async (id) => api.get(`/minerals/${id}`),
        create: async (data) => api.post('/minerals', data),
        update: async (id, data) => api.put(`/minerals/${id}`, data),
        delete: async (id) => api.delete(`/minerals/${id}`),
        getByMine: async (mineId) => api.get(`/minerals/mine/${mineId}`),
        exportAll: async () => api.get('/minerals/export', { responseType: 'blob' }),
        exportByMine: async (mineId) => api.get(`/minerals/mine/${mineId}/export`, { responseType: 'blob' })
    },

    provinces: {
        getAll: async () => api.get('/provinces'),
        getById: async (id) => api.get(`/provinces/${id}`),
        create: async (data) => api.post('/provinces', data),
        update: async (id, data) => api.put(`/provinces/${id}`, data),
        delete: async (id) => api.delete(`/provinces/${id}`),
        getWithMines: async (id) => api.get(`/provinces/${id}/mines`),
        getWithStations: async (id) => api.get(`/provinces/${id}/stations`),
        exportAll: async () => api.get('/provinces/export', { responseType: 'blob' })
    },

    environmentalData: {
        getAll: async () => api.get('/environmental-data'),
        getById: async (id) => api.get(`/environmental-data/${id}`),
        getByMine: async (mineId) => api.get(`/environmental-data/mine/${mineId}`),
        getByStation: async (stationId) => api.get(`/environmental-data/station/${stationId}`),
        getByDateRange: async (startDate, endDate) => 
            api.get('/environmental-data/date-range', { params: { startDate, endDate }}),
        getByMineAndDateRange: async (mineId, startDate, endDate) =>
            api.get(`/environmental-data/mine/${mineId}/date-range`, { 
                params: { startDate, endDate }
            }),
        create: async (data) => api.post('/environmental-data', data),
        update: async (id, data) => api.put(`/environmental-data/${id}`, data),
        delete: async (id) => api.delete(`/environmental-data/${id}`),
        exportAll: async () => api.get('/environmental-data/export', { responseType: 'blob' }),
        exportByMine: async (mineId) => api.get(`/environmental-data/mine/${mineId}/export`, { responseType: 'blob' })
    },

    safetyData: {
        getAll: async () => api.get('/safety-data'),
        getById: async (id) => api.get(`/safety-data/${id}`),
        getByMine: async (mineId) => api.get(`/safety-data/mine/${mineId}`),
        getByDateRange: async (startDate, endDate) =>
            api.get('/safety-data/date-range', { params: { startDate, endDate }}),
        getByMineAndDateRange: async (mineId, startDate, endDate) =>
            api.get(`/safety-data/mine/${mineId}/date-range`, { 
                params: { startDate, endDate }
            }),
        create: async (data) => api.post('/safety-data', data),
        update: async (id, data) => api.put(`/safety-data/${id}`, data),
        delete: async (id) => api.delete(`/safety-data/${id}`),
        exportAll: async () => api.get('/safety-data/export', { responseType: 'blob' }),
        exportByMine: async (mineId) => api.get(`/safety-data/mine/${mineId}/export`, { responseType: 'blob' })
    },

    monitoringStations: {
        getAll: async () => api.get('/monitoringstations'),
        getById: async (id) => api.get(`/monitoringstations/${id}`),
        getByLocation: async (location) => api.get(`/monitoringstations/location/${location}`),
        getByProvince: async (provinceId) => api.get(`/monitoringstations/province/${provinceId}`),
        create: async (data) => api.post('/monitoringstations', data),
        update: async (id, data) => api.put(`/monitoringstations/${id}`, data),
        delete: async (id) => api.delete(`/monitoringstations/${id}`)
    },

    pollutants: {
        getAll: async () => api.get('/pollutants'),
        getById: async (id) => api.get(`/pollutants/${id}`),
        getByCategory: async (category) => api.get(`/pollutants/category/${category}`),
        create: async (data) => api.post('/pollutants', data),
        update: async (id, data) => api.put(`/pollutants/${id}`, data),
        delete: async (id) => api.delete(`/pollutants/${id}`)
    },

    users: {
        getAll: async () => api.get('/users'),
        getById: async (id) => api.get(`/users/${id}`),
        create: async (data) => api.post('/users', data),
        update: async (id, data) => api.put(`/users/${id}`, data),
        delete: async (id) => api.delete(`/users/${id}`)
    }
};

export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

export default endpoints;