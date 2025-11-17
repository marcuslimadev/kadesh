import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const VERIFY_TOKEN_TIMEOUT_MS = Number(import.meta.env.VITE_VERIFY_TOKEN_TIMEOUT) || 8000

const getToast = () => {
  if (typeof window === 'undefined') return null
  return useToast()
}

const showToast = (type, message) => {
  const toastInstance = getToast()
  if (!toastInstance || !toastInstance[type]) return
  toastInstance[type](message)
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('kadesh_token'))
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isClient = computed(() => user.value?.type === 'client')
  const isProvider = computed(() => user.value?.type === 'provider')
  const userInitials = computed(() => {
    if (!user.value?.name) return ''
    return user.value.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  })

  // Actions
  const login = async (email, password) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      })

      const { user: userData, token: userToken } = response.data

      // Store auth data
      user.value = userData
      token.value = userToken
      localStorage.setItem('kadesh_token', userToken)
      localStorage.setItem('kadesh_user', JSON.stringify(userData))

      showToast('success', `Bem-vindo, ${userData.name}!`)
      return { success: true, user: userData }

    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao fazer login'
      }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/auth/register', userData)

      const { user: newUser, token: userToken } = response.data

      // Store auth data
      user.value = newUser
      token.value = userToken
      localStorage.setItem('kadesh_token', userToken)
      localStorage.setItem('kadesh_user', JSON.stringify(newUser))

      showToast('success', `Conta criada com sucesso! Bem-vindo, ${newUser.name}!`)
      return { success: true, user: newUser }

    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar conta'
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('kadesh_token')
    localStorage.removeItem('kadesh_user')
    showToast('info', 'Logout realizado com sucesso!')
  }

  const verifyToken = async () => {
    if (!token.value) return false

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), VERIFY_TOKEN_TIMEOUT_MS)

    isLoading.value = true
    try {
      const response = await api.get('/api/auth/verify', { signal: controller.signal })
      user.value = response.data.user
      localStorage.setItem('kadesh_user', JSON.stringify(response.data.user))
      return true
    } catch (error) {
      const isTimeoutOrOffline =
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        error.code === 'ERR_CANCELED' ||
        error.name === 'CanceledError' ||
        error.message === 'Network Error'

      if (isTimeoutOrOffline) {
        console.warn('Token verification skipped: backend indisponível ou sem resposta rápida.', error)
        return false
      }

      console.error('Token verification failed:', error)
      logout()
      return false
    } finally {
      clearTimeout(timeoutId)
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const response = await api.put('/api/users/profile', profileData)
      
      user.value = response.data.user
      localStorage.setItem('kadesh_user', JSON.stringify(response.data.user))

      showToast('success', 'Perfil atualizado com sucesso!')
      return { success: true, user: response.data.user }

    } catch (error) {
      console.error('Update profile error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao atualizar perfil'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize from localStorage
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('kadesh_user')
    const storedToken = localStorage.getItem('kadesh_token')
    
    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      } catch (error) {
        console.error('Error parsing stored auth data:', error)
        logout()
      }
    }
  }

  // Initialize on store creation
  initializeAuth()

  return {
    // State
    user,
    token,
    isLoading,
    
    // Getters
    isAuthenticated,
    isClient,
    isProvider,
    userInitials,
    
    // Actions
    login,
    register,
    logout,
    verifyToken,
    updateProfile,
    initializeAuth
  }
})