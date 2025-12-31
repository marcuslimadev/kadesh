import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useViewModeStore } from '@/stores/viewModeStore'

const SESSION_DURATION_MS = 4 * 60 * 60 * 1000 // 4 HORAS

const isSessionValid = () => {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('kadesh_token')
  const expiresAt = localStorage.getItem('kadesh_session_expires')
  
  if (!token || !expiresAt) return false
  
  const now = Date.now()
  const expires = parseInt(expiresAt, 10)
  return now < expires
}

const renewSession = () => {
  if (typeof window === 'undefined') return
  const expiresAt = Date.now() + SESSION_DURATION_MS
  localStorage.setItem('kadesh_session_expires', expiresAt.toString())
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('kadesh_token'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => {
    return !!token.value && isSessionValid()
  })

  const isClient = computed(() => user.value?.type === 'client')
  const isProvider = computed(() => user.value?.type === 'provider' || user.value?.type === 'unified')
  const isAdmin = computed(() => user.value?.isAdmin === true || user.value?.type === 'admin')
  
  const userInitials = computed(() => {
    if (!user.value?.name) return ''
    return user.value.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  })

  const syncViewModeForUser = (userData) => {
    try {
      const viewModeStore = useViewModeStore()
      const userType = userData?.type
      const mode = viewModeStore.currentMode?.value || viewModeStore.currentMode

      if (userType === 'provider' && mode === 'contractor') {
        viewModeStore.setProviderMode()
      }
      if (userType === 'client' && mode === 'provider') {
        viewModeStore.setContractorMode()
      }
    } catch (e) {
      console.warn('[Auth] Erro ao sincronizar modo de visualização', e)
    }
  }

  const login = async (email, password) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { user: userData, token: userToken } = response.data

      user.value = userData
      token.value = userToken
      
      localStorage.setItem('kadesh_token', userToken)
      localStorage.setItem('kadesh_user', JSON.stringify(userData))
      renewSession()

      if (api.defaults.headers.common) {
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
      }

      syncViewModeForUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      console.error('[Auth] Erro ao fazer login:', error.response?.data?.error || error.message)
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

      user.value = newUser
      token.value = userToken
      localStorage.setItem('kadesh_token', userToken)
      localStorage.setItem('kadesh_user', JSON.stringify(newUser))
      renewSession()

      if (api.defaults.headers.common) {
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
      }

      syncViewModeForUser(newUser)
      return { success: true, user: newUser }
    } catch (error) {
      console.error('[Auth] Erro ao registrar:', error)
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
    localStorage.removeItem('kadesh_session_expires')

    if (api.defaults.headers.common) {
      delete api.defaults.headers.common['Authorization']
    }
  }

  const verifyToken = async () => {
    if (!isSessionValid()) {
      logout()
      return false
    }

    // Se temos token mas não temos usuário, restaurar do localStorage
    if (token.value && !user.value) {
      const storedUser = localStorage.getItem('kadesh_user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
          syncViewModeForUser(user.value)
        } catch (e) {
          logout()
          return false
        }
      }
    }

    // Renovar sessão a cada verificação bem-sucedida
    renewSession()
    return true
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const response = await api.put('/api/users/profile', profileData)
      user.value = response.data.user
      localStorage.setItem('kadesh_user', JSON.stringify(response.data.user))
      return { success: true, user: response.data.user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao atualizar perfil'
      }
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = () => {
    if (!isSessionValid()) {
      logout()
      return
    }

    const storedUser = localStorage.getItem('kadesh_user')
    const storedToken = localStorage.getItem('kadesh_token')
    
    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
        if (api.defaults.headers.common) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        }
        syncViewModeForUser(user.value)
      } catch (error) {
        logout()
      }
    }
  }

  initializeAuth()

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isClient,
    isProvider,
    isAdmin,
    userInitials,
    login,
    register,
    logout,
    verifyToken,
    updateProfile,
    initializeAuth
  }
})
