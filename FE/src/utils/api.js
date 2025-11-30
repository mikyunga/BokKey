// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '', // 백엔드 포트에 맞게 설정할 것
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // JWT 쿠키 안 쓸 거면 false, 쓸 거면 true
});

export default api;
