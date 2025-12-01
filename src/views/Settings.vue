<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Configurações</h1>
        <p class="text-gray-600 mt-2">Gerencie suas informações e preferências</p>
      </div>

      <!-- Settings Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <div class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-3 font-medium text-sm border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Profile Settings -->
        <div v-if="activeTab === 'profile'" class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Informações Pessoais</h2>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                v-model="profileForm.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            <!-- Email (read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                :value="user?.email"
                disabled
                class="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg text-gray-600"
              />
              <p class="text-sm text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            <!-- Bio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Bio / Descrição
              </label>
              <textarea
                v-model="profileForm.bio"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Localização
              </label>
              <input
                v-model="profileForm.location"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="Cidade, Estado"
              />
            </div>

            <!-- Website -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Website / Portfolio
              </label>
              <input
                v-model="profileForm.website"
                type="url"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                placeholder="https://seu-portfolio.com"
              />
            </div>

            <!-- Submit button -->
            <div class="pt-4">
              <button
                type="submit"
                :disabled="isSaving"
                class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
              >
                {{ isSaving ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Privacy & Security -->
        <div v-if="activeTab === 'privacy'" class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Privacidade e Segurança</h2>
          
          <div class="space-y-6">
            <!-- Email Preferences -->
            <div class="border-b border-gray-200 pb-6">
              <h3 class="font-medium text-gray-900 mb-4">Preferências de Email</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.emailNotifications"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 rounded"
                  />
                  <span class="ml-3 text-sm text-gray-700">Receber notificações por email</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.emailMarketing"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 rounded"
                  />
                  <span class="ml-3 text-sm text-gray-700">Receber promoções e novidades</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.emailWeekly"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 rounded"
                  />
                  <span class="ml-3 text-sm text-gray-700">Resumo semanal de atividades</span>
                </label>
              </div>
            </div>

            <!-- Profile Visibility -->
            <div class="border-b border-gray-200 pb-6">
              <h3 class="font-medium text-gray-900 mb-4">Visibilidade do Perfil</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.profilePublic"
                    type="radio"
                    value="public"
                    class="w-4 h-4 text-primary-600"
                  />
                  <span class="ml-3 text-sm text-gray-700">Perfil público (visível para todos)</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="privacySettings.profilePublic"
                    type="radio"
                    value="private"
                    class="w-4 h-4 text-primary-600"
                  />
                  <span class="ml-3 text-sm text-gray-700">Perfil privado (apenas para conexões)</span>
                </label>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 class="font-medium text-red-900 mb-3">Zona de Risco</h3>
              <button
                @click="showDeleteModal = true"
                class="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Deletar minha conta permanentemente
              </button>
            </div>

            <!-- Save button -->
            <div class="pt-4">
              <button
                @click="savePrivacySettings"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div v-if="activeTab === 'preferences'" class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Preferências</h2>
          
          <div class="space-y-6">
            <!-- Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
              <select
                v-model="preferences.language"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <!-- Timezone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fuso Horário</label>
              <select
                v-model="preferences.timezone"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="America/Sao_Paulo">(UTC-3) São Paulo</option>
                <option value="America/New_York">(UTC-5) Nova York</option>
                <option value="Europe/London">(UTC+0) Londres</option>
                <option value="Europe/Paris">(UTC+1) Paris</option>
              </select>
            </div>

            <!-- Save button -->
            <div class="pt-4">
              <button
                @click="savePreferences"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Deletar Conta</h3>
        <p class="text-gray-600 mb-4">
          Tem certeza? Esta ação é irreversível e todos os seus dados serão permanentemente deletados.
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Deletar Permanentemente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
// import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
// const toast = useToast()

const user = computed(() => authStore.user)
const activeTab = ref('profile')
const isSaving = ref(false)
const showDeleteModal = ref(false)

const tabs = [
  { id: 'profile', label: 'Perfil' },
  { id: 'privacy', label: 'Privacidade' },
  { id: 'preferences', label: 'Preferências' }
]

const profileForm = ref({
  name: user.value?.name || '',
  phone: user.value?.phone || '',
  bio: user.value?.bio || '',
  location: user.value?.location || '',
  website: user.value?.website || ''
})

const privacySettings = ref({
  emailNotifications: true,
  emailMarketing: false,
  emailWeekly: true,
  profilePublic: 'public'
})

const preferences = ref({
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo'
})

const updateProfile = async () => {
  isSaving.value = true
  try {
    await authStore.updateProfile(profileForm.value)
    // toast.success('Perfil atualizado com sucesso!')
  } catch (error) {
    // toast.error('Erro ao atualizar perfil')
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const savePrivacySettings = async () => {
  try {
    await api.put('/api/users/preferences', {
      emailNotifications: privacySettings.value.emailNotifications,
      emailMarketing: privacySettings.value.emailMarketing,
      emailWeekly: privacySettings.value.emailWeekly,
      profilePublic: privacySettings.value.profilePublic
    })
    // toast.success('Preferências de privacidade salvas!')
  } catch (error) {
    // toast.error('Erro ao salvar preferências de privacidade')
  }
}

const savePreferences = async () => {
  try {
    await api.put('/api/users/profile', {
      language: preferences.value.language,
      timezone: preferences.value.timezone
    })
    // toast.success('Preferências salvas!')
  } catch (error) {
    // toast.error('Erro ao salvar preferências')
  }
}

const deleteAccount = async () => {
  try {
    await api.delete('/api/users/profile')
    authStore.logout()
    // toast.success('Conta deletada com sucesso')
    router.push('/')
  } catch (error) {
    // toast.error('Erro ao deletar conta')
  } finally {
    showDeleteModal.value = false
  }
}
</script>
