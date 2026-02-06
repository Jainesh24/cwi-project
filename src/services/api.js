import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = process.env.REACT_APP_API_URL || 'https://cwi-backend.vercel.app/api';

// Create axios instancenpm 
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Waste Entry APIs
export const wasteAPI = {
  // Log new waste entry
  logWaste: async (wasteData) => {
    const response = await api.post('/waste', wasteData);
    return response.data;
  },

  // Get all waste entries
  getWasteEntries: async (filters = {}) => {
    const response = await api.get('/waste', { params: filters });
    return response.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/waste/stats');
    return response.data;
  },

  // Get alerts
  getAlerts: async (status = 'active') => {
    const response = await api.get('/waste/alerts', { params: { status } });
    return response.data;
  },

  // Reset all data
  resetData: async () => {
    const response = await api.delete('/waste/reset');
    return response.data;
  },
};

// Baseline APIs
export const baselineAPI = {
  // Save baseline
  saveBaseline: async (baselineData) => {
    const response = await api.post('/baselines', baselineData);
    return response.data;
  },

  // Get all baselines
  getBaselines: async () => {
    const response = await api.get('/baselines');
    return response.data;
  },

  // Delete baseline
  deleteBaseline: async (department) => {
    const response = await api.delete(`/baselines/${department}`);
    return response.data;
  },
};

export default api;
