import axios from 'axios'

const DEFAULT_API_URL = ''
const DEFAULT_API_TIMEOUT = 60000

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL
  return DEFAULT_API_URL
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || DEFAULT_API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kadesh_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se receber 401 e não for rota de login, pode significar token expirado no backend
      // Mas como queremos manter a sessão por 4h no front, só deslogamos se o front decidir
      console.warn('[API] 401 Unauthorized recebido')
    }
    return Promise.reject(error)
  }
)

export const wakeUpServer = async () => {
  try {
    await api.get('/api/health', { timeout: 70000 })
    return true
  } catch (error) {
    return false
  }
}

export default api
