import axios from 'axios';

// Detectar ambiente e definir baseURL correto
const isDev = import.meta.env.DEV;
const baseURL = isDev ? '' : '/kadesh'; // Em dev usa proxy, em prod usa /kadesh

const api = axios.create({
  baseURL,
  withCredentials: false,
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
