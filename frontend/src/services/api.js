import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api/', // 'https://api.ejemplo.com', // Cambia por la URL de tu API
    timeout: 10000,
});

export default api;
