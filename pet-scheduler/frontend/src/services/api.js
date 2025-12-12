import axios from 'axios';

const api = axios.create({
  // A URL base do seu backend (onde o server.js está rodando)
  baseURL: 'http://localhost:3333', 
});

export default api;