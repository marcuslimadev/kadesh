import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

// Toast instance (guarded for SSR/build time)
const toast = typeof window !== 'undefined' ? useToast() : null

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    // Add request timestamp for debugging
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }

    return config
  },
  (error) => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses in debug mode
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(`[API] Response:`, response.data)
    }

    return response
  },
  (error) => {
    console.error('[API] Response error:', error)

    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          const authStore = useAuthStore()
          authStore.logout()
          toast?.error('Sessão expirada. Faça login novamente.')
          break

        case 403:
          toast?.error('Você não tem permissão para esta ação.')
          break

        case 404:
          toast?.error('Recurso não encontrado.')
          break

        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => toast?.error(err))
          } else if (data.error) {
            toast?.error(data.error)
          }
          break

        case 429:
          toast?.error('Muitas requisições. Tente novamente em alguns minutos.')
          break

        case 500:
          toast?.error('Erro interno do servidor. Tente novamente mais tarde.')
          break

        default:
          toast?.error(data?.error || 'Ocorreu um erro inesperado.')
      }
    } else if (error.code === 'ECONNABORTED') {
      toast?.error('Timeout: A requisição demorou muito para responder.')
    } else if (error.message === 'Network Error') {
      toast?.error('Erro de conexão. Verifique sua internet.')
    } else {
      toast?.error('Ocorreu um erro inesperado.')
    }

    return Promise.reject(error)
  }
)

export default api