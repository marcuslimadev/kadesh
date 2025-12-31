import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useViewModeStore } from '@/stores/viewModeStore'

const SESSION_DURATION_MS = 4 * 60 * 60 * 1000 // 4 HORAS

const TOKEN_KEY = 'kadesh_token'
const USER_KEY = 'kadesh_user'
const EXPIRES_KEY = 'kadesh_session_expires'
const REMEMBER_KEY = 'kadesh_remember'

const getStorageWithToken = () => {
  if (typeof window === 'undefined') return null
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage
  if (localStorage.getItem(TOKEN_KEY)) return localStorage
  return localStorage
}

const isSessionValid = () => {
  if (typeof window === 'undefined') {
    console.log('[Auth] isSessionValid: window undefined')
    return false
  }

  const storage = getStorageWithToken()
  const token = storage?.getItem(TOKEN_KEY)
  const expiresAt = storage?.getItem(EXPIRES_KEY)

  console.log('[Auth] isSessionValid check:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    expiresAt,
    expiresDate: expiresAt ? new Date(parseInt(expiresAt, 10)).toLocaleString('pt-BR') : 'N/A'
  })

  if (!token || !expiresAt) {
    console.warn('[Auth] isSessionValid: FALSE - token ou expiresAt ausente')
    return false
  }

  const now = Date.now()
  const expires = parseInt(expiresAt, 10)
  const isValid = now < expires

  if (!isValid) {
    console.warn('[Auth] isSessionValid: FALSE - sessao expirada', {
      now: new Date(now).toLocaleString('pt-BR'),
      expires: new Date(expires).toLocaleString('pt-BR')
    })
  } else {
    const hoursLeft = ((expires - now) / (1000 * 60 * 60)).toFixed(2)
    console.log(`[Auth] isSessionValid: TRUE - valida por ${hoursLeft}h`)
  }

  return isValid
}

const renewSession = () => {
  if (typeof window === 'undefined') return
  const storage = getStorageWithToken()
  if (!storage) return
  const expiresAt = Date.now() + SESSION_DURATION_MS
  storage.setItem(EXPIRES_KEY, expiresAt.toString())
  console.log('[Auth] Sessao renovada por 4 horas')
}

const persistAuth = ({ userData, userToken, remember }) => {
  if (typeof window === 'undefined') return
  const targetStorage = remember ? localStorage : sessionStorage

  targetStorage.setItem(TOKEN_KEY, userToken)
  targetStorage.setItem(USER_KEY, JSON.stringify(userData))
  targetStorage.setItem(EXPIRES_KEY, (Date.now() + SESSION_DURATION_MS).toString())

  if (remember) {
    localStorage.setItem(REMEMBER_KEY, 'true')
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(EXPIRES_KEY)
  } else {
    localStorage.removeItem(REMEMBER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(EXPIRES_KEY)
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(getStorageWithToken()?.getItem(TOKEN_KEY) || null)
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
      console.warn('[Auth] Erro ao sincronizar modo de visualizacao', e)
    }
  }

  const login = async (email, password, rememberMe = false) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { user: userData, token: userToken } = response.data

      user.value = userData
      token.value = userToken

      persistAuth({ userData, userToken, remember: rememberMe })

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
      persistAuth({ userData: newUser, userToken, remember: true })

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
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(EXPIRES_KEY)
    localStorage.removeItem(REMEMBER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(EXPIRES_KEY)

    if (api.defaults.headers.common) {
      delete api.defaults.headers.common['Authorization']
    }
  }

  const verifyToken = async () => {
    if (!isSessionValid()) {
      logout()
      return false
    }

    // Se temos token mas nao temos usuario, restaurar do storage
    if (token.value && !user.value) {
      const storage = getStorageWithToken()
      const storedUser = storage?.getItem(USER_KEY)
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

    // Renovar sessao a cada verificacao bem-sucedida
    renewSession()
    return true
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const response = await api.put('/api/users/profile', profileData)
      user.value = response.data.user
      const storage = getStorageWithToken()
      storage?.setItem(USER_KEY, JSON.stringify(response.data.user))
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

    const storage = getStorageWithToken()
    const storedUser = storage?.getItem(USER_KEY)
    const storedToken = storage?.getItem(TOKEN_KEY)

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
