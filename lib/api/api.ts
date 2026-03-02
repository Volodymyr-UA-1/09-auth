import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
  withCredentials: true, // КРИТИЧНО для роботи з cookies
});