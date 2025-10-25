// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Changed from /api/v1
  withCredentials: true,
});

export default api;