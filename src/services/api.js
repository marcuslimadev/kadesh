import axios from 'axios';

// Detectar ambiente e definir baseURL correto
const isDev = import.meta.env.DEV;
const baseURL = isDev ? '' : '/kadesh'; // Em dev usa proxy, em prod usa /kadesh

const api = axios.create({
  baseURL,
  withCredentials: true, // IMPORTANTE: Habilita envio de cookies/sessão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    // Suprimir erro 401 em /api/user (verificação inicial de autenticação)
    if (error.response?.status === 401 && error.config?.url?.includes('/api/user')) {
      // Silenciosamente rejeita sem logar no console
      return Promise.reject({ ...error, suppressLog: true });
    }
    
    return Promise.reject(error);
  }
);

export default api;
