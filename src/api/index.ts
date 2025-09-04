import axios from 'axios';

const api = axios.create({
    // Alterar futuramente para o uso do VITE
  baseURL: 'http://localhost:8080',
});

export default api;