import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
// import { useToast } from 'vue-toastification'

// Toast instance (guarded for SSR/build time)
// const toast = typeof window !== 'undefined' ? useToast() : null

const DEFAULT_API_URL = 'https://kadesh-2.onrender.com'
const DEFAULT_API_TIMEOUT = 60000 // 60s to handle Render cold starts

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL

  // Em ambiente de desenvolvimento, falhar se nenhuma URL de API foi definida
  if (import.meta.env.DEV) {
    throw new Error('Defina VITE_API_URL para evitar chamadas involuntárias ao backend de produção')
  }

  // Fallback apenas para builds já configuradas em produção
  return DEFAULT_API_URL
}

const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || DEFAULT_API_TIMEOUT

// Create axios instance
const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: API_TIMEOUT,
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
    
    // Check if request is marked as silent (no toast on error)
    const isSilent = error.config?.silent === true

    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          const authStore = useAuthStore()
          authStore.logout()
          if (!isSilent) {
            // toast?.error('Sessão expirada. Faça login novamente.')
          }
          break

        case 403:
          if (!isSilent) {
            // toast?.error('Você não tem permissão para esta ação.')
          }
          break

        case 404:
          if (!isSilent) {
            // toast?.error('Recurso não encontrado.')
          }
          break

        case 422:
          // Validation errors
          if (!isSilent) {
            if (data.errors && Array.isArray(data.errors)) {
              // data.errors.forEach(err => toast?.error(err))
            } else if (data.error) {
              // toast?.error(data.error)
            }
          }
          break

        case 429:
          if (!isSilent) {
            // toast?.error('Muitas requisições. Tente novamente em alguns minutos.')
          }
          break

        case 500:
          if (!isSilent) {
            // toast?.error('Erro interno do servidor. Tente novamente mais tarde.')
          }
          break

        default:
          if (!isSilent) {
            // toast?.error(data?.error || 'Ocorreu um erro inesperado.')
          }
      }
    } else if (error.code === 'ECONNABORTED') {
      if (!isSilent) {
        // toast?.error(`Timeout: o servidor demorou mais de ${API_TIMEOUT / 1000}s para responder (pode estar acordando). Tente novamente.`)
      }
    } else if (error.message === 'Network Error') {
      // Network errors são sempre silenciosos para não assustar o usuário na home
      console.warn('Network error - servidor pode estar indisponível')
    } else {
      if (!isSilent) {
        // toast?.error('Ocorreu um erro inesperado.')
      }
    }

    return Promise.reject(error)
  }
)

// Wake up function - pings the server to wake it from cold start
// Use before critical operations or on app load
let isWakingUp = false
let wakeUpPromise = null

export const wakeUpServer = async () => {
  // Avoid multiple simultaneous wake up calls
  if (isWakingUp) {
    return wakeUpPromise
  }
  
  isWakingUp = true
  wakeUpPromise = (async () => {
    try {
      // Simple health check endpoint
      await api.get('/api/health', { 
        timeout: 70000, // Extra time for cold start
        _silent: true 
      })
      console.log('[API] Server is awake')
      return true
    } catch (error) {
      console.warn('[API] Wake up failed:', error.message)
      return false
    } finally {
      isWakingUp = false
      wakeUpPromise = null
    }
  })()
  
  return wakeUpPromise
}

export default api


