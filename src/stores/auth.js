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
  console.log('[Auth] Sessão renovada por 4 horas')
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('kadesh_token'))
  const isLoading = ref(false)

  // Getters - BASEADO APENAS NO LOCALSTORAGE E EXPIRAÇÃO
  const isAuthenticated = computed(() => {
    return isSessionValid()
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

  // Actions
  const syncViewModeForUser = (userData) => {
    // O backend é a fonte de verdade: usuário provider não consegue agir como contractor.
    // Se o modo salvo estiver incompatível, ajusta para evitar telas vazias/401.
    try {
      const viewModeStore = useViewModeStore()
      const userType = userData?.type

      const mode =
        viewModeStore.currentMode && typeof viewModeStore.currentMode === 'object' && 'value' in viewModeStore.currentMode
          ? viewModeStore.currentMode.value
          : viewModeStore.currentMode

      if (userType === 'provider' && mode === 'contractor') {
        viewModeStore.setProviderMode()
      }

      if (userType === 'client' && mode === 'provider') {
        viewModeStore.setContractorMode()
      }
    } catch {
      // Ignorar: evita problemas de inicialização/circularidade em ambientes especiais
    }
  }

  const login = async (email, password) => {
    isLoading.value = true
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      })

      const { user: userData, token: userToken } = response.data

      // Store auth data COM EXPIRAÇÃO DE 4 HORAS
      user.value = userData
      token.value = userToken
      localStorage.setItem('kadesh_token', userToken)
      localStorage.setItem('kadesh_user', JSON.stringify(userData))
      renewSession() // Criar timestamp de expiração

      // Garantir que as próximas requisições já saiam autenticadas
      if (api?.defaults?.headers?.common) {
        api.defaults.headers.common.Authorization = `Bearer ${userToken}`
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
      }
      if (api?.defaults?.headers) {
        api.defaults.headers.Authorization = `Bearer ${userToken}`
      }

      syncViewModeForUser(userData)

      console.log('[Auth] Login realizado com sucesso. Sessão válida por 4 horas.')
      return { success: true, user: userData }

    } catch (error) {
      console.error('[Auth] Erro ao fazer login:', error.response?.status, error.response?.data?.error || error.message)
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

      // Store auth data COM EXPIRAÇÃO DE 4 HORAS
      user.value = newUser
      token.value = userToken
      localStorage.setItem('kadesh_token', userToken)
      localStorage.setItem('kadesh_user', JSON.stringify(newUser))
      renewSession() // Criar timestamp de expiração

      // Garantir header padrão após registro
      if (api?.defaults?.headers?.common) {
        api.defaults.headers.common.Authorization = `Bearer ${userToken}`
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
      }
      if (api?.defaults?.headers) {
        api.defaults.headers.Authorization = `Bearer ${userToken}`
      }

      syncViewModeForUser(newUser)

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
    localStorage.removeItem('kadesh_session_expires')

    // Remover header padrão
    if (api?.defaults?.headers?.common) {
      delete api.defaults.headers.common.Authorization
    }
    console.log('[Auth] Logout realizado')
  }

  const verifyToken = async () => {
    // Se a sessão expirou, fazer logout
    if (!isSessionValid()) {
      console.log('[Auth] Sessão expirada após 4 horas')
      logout()
      return false
    }

    // Renovar sessão a cada verify (reset timer de 4 horas)
    renewSession()

    if (!token.value) return false

    // Garantir header Authorization
    if (api?.defaults?.headers?.common && !api.defaults.headers.common.Authorization) {
      api.defaults.headers.common.Authorization = `Bearer ${token.value}`
    }

    // Tentar buscar dados do usuário se não estiver carregado
    if (!user.value) {
      const storedUser = localStorage.getItem('kadesh_user')
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          user.value = JSON.parse(storedUser)
          syncViewModeForUser(user.value)
        } catch {
          // Ignorar erro de parse
        }
      }
    }

    // NÃO FAZER CHAMADA AO BACKEND - CONFIAR 100% NO LOCALSTORAGE
    // Sessão válida por 4 horas, renovada a cada verify
    return true
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const response = await api.put('/api/users/profile', profileData)
      
      user.value = response.data.user
      localStorage.setItem('kadesh_user', JSON.stringify(response.data.user))

      // showToast('success', 'Perfil atualizado com sucesso!')
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
    // Verificar se a sessão ainda é válida
    if (!isSessionValid()) {
      console.log('[Auth] Sessão expirada no init - limpando storage')
      localStorage.removeItem('kadesh_token')
      localStorage.removeItem('kadesh_user')
      localStorage.removeItem('kadesh_session_expires')
      return
    }

    const storedUser = localStorage.getItem('kadesh_user')
    const storedToken = localStorage.getItem('kadesh_token')
    
    const isValidStoredUser =
      storedUser &&
      storedUser !== 'undefined' &&
      storedUser !== 'null'

    if (isValidStoredUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken

        // Garantir header padrão ao restaurar sessão
        if (api?.defaults?.headers?.common) {
          api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        }
        if (api?.defaults?.headers) {
          api.defaults.headers.Authorization = `Bearer ${storedToken}`
        }

        syncViewModeForUser(user.value)

        console.log('[Auth] Sessão restaurada:', user.value.email, '| Válida por 4 horas')
      } catch (error) {
        console.error('[Auth] Erro ao decodificar dados do storage:', error)
        // Limpar se não conseguir fazer parse
        localStorage.removeItem('kadesh_token')
        localStorage.removeItem('kadesh_user')
        localStorage.removeItem('kadesh_session_expires')
      }
    } else {
      console.log('[Auth] Nenhum dado de autenticação armazenado')
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
    isAdmin,
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
