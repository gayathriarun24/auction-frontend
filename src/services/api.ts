import axios from 'axios';

// Connected directly to your backend server.js configuration port
const API_URL = 'http://localhost:3000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject your Auth Token from localStorage if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add your new service call here:
export const getMyBids = () => api.get('/bids/my-bids');

export default api;