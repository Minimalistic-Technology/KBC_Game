import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_DEV, 
  withCredentials: true,
});

export default api;