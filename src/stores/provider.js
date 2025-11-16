import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import providerService from '@/services/providerService'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()

export const useProviderStore = defineStore('provider', () => {
  const profile = ref(null)
  const stats = ref(null)
  const isLoadingProfile = ref(false)
  const isLoadingStats = ref(false)
  const isSaving = ref(false)

  const fetchProfile = async () => {
    isLoadingProfile.value = true
    try {
      const result = await providerService.getProfile()
      if (result.success) {
        profile.value = result.data
      }
      return result
    } catch (error) {
      console.error('Provider store profile error:', error)
      return {
        success: false,
        error: 'Erro ao carregar perfil'
      }
    } finally {
      isLoadingProfile.value = false
    }
  }

  const fetchStats = async () => {
    isLoadingStats.value = true
    try {
      const result = await providerService.getStats()
      if (result.success) {
        stats.value = result.data
      }
      return result
    } catch (error) {
      console.error('Provider store stats error:', error)
      return {
        success: false,
        error: 'Erro ao carregar mǸtricas'
      }
    } finally {
      isLoadingStats.value = false
    }
  }

  const saveProfile = async (payload) => {
    isSaving.value = true
    try {
      const result = await providerService.updateProfile(payload)
      if (result.success) {
        profile.value = result.data

        // Sync auth store so the navbar and other areas stay updated
        const authStore = useAuthStore()
        authStore.user = result.data
        localStorage.setItem('kadesh_user', JSON.stringify(result.data))

        toast.success('Perfil atualizado com sucesso!')
      } else if (result.error) {
        toast.error(result.error)
      }
      return result
    } catch (error) {
      console.error('Provider store save error:', error)
      toast.error('Erro ao salvar perfil')
      return {
        success: false,
        error: 'Erro ao salvar perfil'
      }
    } finally {
      isSaving.value = false
    }
  }

  return {
    profile,
    stats,
    isLoadingProfile,
    isLoadingStats,
    isSaving,
    fetchProfile,
    fetchStats,
    saveProfile
  }
})
