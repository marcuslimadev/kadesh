import axios from 'axios';

// Detecta ambiente: produção ou desenvolvimento
const baseURL = import.meta.env.PROD 
  ? 'https://kadesh.mmbsites.com.br'  // Produção - backend PHP puro
  : 'http://localhost:8000';           // Desenvolvimento - Laravel

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Token não é mais necessário com sessões, mas mantemos compatibilidade
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Opcional: redirecionar para login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
