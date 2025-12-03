import axios from 'axios';

const isMock = import.meta.env.VITE_USE_MSW === 'true';

const api = axios.create({
  baseURL: isMock ? '' : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
