import axios from 'axios'
import { ref } from 'vue'

const API_BASE = '/api'

// Configuração de persistência
const AUTH_STORAGE_KEY = 'kadesh_user'
const AUTH_EXPIRY_KEY = 'kadesh_auth_expiry'
const AUTH_DURATION_DAYS = 7 // Login persiste por 7 dias

// Funções auxiliares de armazenamento
const saveAuthData = (userData, rememberMe = true) => {
  if (rememberMe) {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + AUTH_DURATION_DAYS)
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    localStorage.setItem(AUTH_EXPIRY_KEY, expiryDate.toISOString())
  } else {
    // Modo sessão temporária
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
  }
}

const getAuthData = () => {
  try {
    // Tentar localStorage primeiro
    let userData = localStorage.getItem(AUTH_STORAGE_KEY)
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY)
    
    if (userData && expiry) {
      // Verificar se expirou
      const expiryDate = new Date(expiry)
      const now = new Date()
      
      if (now > expiryDate) {
        // Expirado - limpar dados
        clearAuthData()
        return null
      }
      
      return JSON.parse(userData)
    }
    
    // Fallback para sessionStorage
    userData = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (userData) {
      return JSON.parse(userData)
    }
    
    return null
  } catch (err) {
    console.error('Erro ao recuperar dados de autenticação:', err)
    clearAuthData()
    return null
  }
}

const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(AUTH_EXPIRY_KEY)
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

const getRemainingDays = () => {
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY)
  if (!expiry) return 0
  
  const expiryDate = new Date(expiry)
  const now = new Date()
  const diff = expiryDate - now
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
  return days > 0 ? days : 0
}

const extendSession = () => {
  const currentUser = getAuthData()
  if (currentUser) {
    saveAuthData(currentUser, true)
    return true
  }
  return false
}

export function useAuth() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loadUser = () => {
    const stored = getAuthData()
    if (stored) {
      user.value = stored
    }
  }

  const checkAuth = async () => {
    loading.value = true
    try {
      const response = await axios.get(`${API_BASE}/user`, {
        withCredentials: true
      })
      user.value = response.data.user || response.data
      
      // Manter o tipo de storage atual
      const hasLocalStorage = localStorage.getItem(AUTH_STORAGE_KEY)
      saveAuthData(user.value, !!hasLocalStorage)
      
      return user.value
    } catch (err) {
      clearAuthData()
      user.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password, rememberMe = true) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(`${API_BASE}/login`, 
        { email, password },
        { withCredentials: true }
      )
      
      // Backend retorna { message, user }
      user.value = response.data.user || response.data
      saveAuthData(user.value, rememberMe)
      return user.value
    } catch (err) {
      error.value = err.response?.data?.error || err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(`${API_BASE}/register`, 
        userData,
        { withCredentials: true }
      )
      
      // Backend retorna { message, user }
      user.value = response.data.user || response.data
      saveAuthData(user.value, true) // Registrar sempre salva por 7 dias
      return user.value
    } catch (err) {
      error.value = err.response?.data?.error || err.response?.data?.message || 'Erro ao registrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true })
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      user.value = null
      clearAuthData()
    }
  }

  // Load user on init
  loadUser()

  return {
    user,
    loading,
    error,
    checkAuth,
    login,
    register,
    logout,
    extendSession,
    getRemainingDays
  }
}
