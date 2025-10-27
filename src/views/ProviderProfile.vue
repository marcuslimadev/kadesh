<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
    <div class="bg-neutral-900 p-6 rounded-2xl text-white shadow-xl">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">✨ Meu Perfil Profissional</h1>
      <p class="opacity-90">Mostre seus trabalhos e conquiste mais clientes!</p>
    </div>

    <!-- INFORMAÇÕES BÁSICAS -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        🏢 Informações do Negócio
      </h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Negócio *</label>
          <input
            v-model="profile.business_name"
            type="text"
            placeholder="Ex: João Reformas e Pinturas"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
          <input
            v-model="profile.tagline"
            type="text"
            placeholder="Ex: Qualidade e pontualidade garantidas!"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Sobre Você e Seu Negócio</label>
        <textarea
          v-model="profile.about"
          rows="5"
          placeholder="Conte sua história, experiência, diferenciais..."
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
        ></textarea>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Anos de Experiência</label>
          <input
            v-model.number="profile.years_experience"
            type="number"
            min="0"
            placeholder="5"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Máx. Projetos Simultâneos</label>
          <input
            v-model.number="profile.max_concurrent_projects"
            type="number"
            min="1"
            placeholder="3"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>
      </div>
    </div>

    <!-- ESPECIALIDADES -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        🎯 Especialidades e Serviços
      </h2>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Especialidades (pressione Enter para adicionar)</label>
        <input
          v-model="newSpecialty"
          @keyup.enter="addSpecialty"
          type="text"
          placeholder="Ex: Pintura Residencial"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
        />
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="(spec, index) in profile.specialties"
            :key="index"
            class="bg-purple-100 text-neutral-900 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {{ spec }}
            <button @click="removeSpecialty(index)" class="hover:text-neutral-900">✕</button>
          </span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Serviços Oferecidos</label>
        <input
          v-model="newService"
          @keyup.enter="addService"
          type="text"
          placeholder="Ex: Pintura de fachadas"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
        />
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="(service, index) in profile.services_offered"
            :key="index"
            class="bg-neutral-700 text-neutral-900 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {{ service }}
            <button @click="removeService(index)" class="hover:text-neutral-900">✕</button>
          </span>
        </div>
      </div>
    </div>

    <!-- LOCALIZAÇÃO E CONTATO -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        📍 Localização e Contato
      </h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <input
            v-model="profile.city"
            type="text"
            placeholder="Ex: São Paulo"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <input
            v-model="profile.state"
            type="text"
            placeholder="Ex: SP"
            maxlength="2"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
          <input
            v-model="profile.phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
          <input
            v-model="profile.whatsapp"
            type="tel"
            placeholder="(11) 98765-4321"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Website / Instagram</label>
        <input
          v-model="profile.website"
          type="url"
          placeholder="https://instagram.com/seu_perfil"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
        />
      </div>
    </div>

    <!-- DISPONIBILIDADE -->
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        ⏰ Disponibilidade
      </h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="profile.availability_status"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          >
            <option value="available">✅ Disponível</option>
            <option value="busy">⚠️ Ocupado (aceito novos projetos)</option>
            <option value="unavailable">❌ Indisponível</option>
          </select>
        </div>

        <div class="flex items-center gap-4 pt-8">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="profile.accept_new_projects"
              type="checkbox"
              class="w-5 h-5 text-neutral-900 border-gray-300 rounded focus:ring-purple-500"
            />
            <span class="text-sm font-medium text-gray-700">Aceitar novos projetos</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="profile.profile_visible"
              type="checkbox"
              class="w-5 h-5 text-neutral-900 border-gray-300 rounded focus:ring-purple-500"
            />
            <span class="text-sm font-medium text-gray-700">Perfil público visível</span>
          </label>
        </div>
      </div>
    </div>

    <!-- BOTÕES -->
    <div class="flex gap-4">
      <button
        @click="saveProfile"
        :disabled="loading"
        class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? '⏳ Salvando...' : '💾 Salvar Perfil' }}
      </button>
    </div>

    <!-- MENSAGENS -->
    <div v-if="message" class="p-4 rounded-xl" :class="messageType === 'success' ? 'bg-neutral-800 text-neutral-900' : 'bg-neutral-600 text-red-800'">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const profile = ref({
  business_name: '',
  tagline: '',
  about: '',
  specialties: [],
  services_offered: [],
  years_experience: 0,
  certifications: [],
  city: '',
  state: '',
  phone: '',
  whatsapp: '',
  website: '',
  availability_status: 'available',
  max_concurrent_projects: 3,
  profile_visible: true,
  accept_new_projects: true
})

const newSpecialty = ref('')
const newService = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const addSpecialty = () => {
  if (newSpecialty.value.trim()) {
    profile.value.specialties.push(newSpecialty.value.trim())
    newSpecialty.value = ''
  }
}

const removeSpecialty = (index) => {
  profile.value.specialties.splice(index, 1)
}

const addService = () => {
  if (newService.value.trim()) {
    profile.value.services_offered.push(newService.value.trim())
    newService.value = ''
  }
}

const removeService = (index) => {
  profile.value.services_offered.splice(index, 1)
}

const loadProfile = async () => {
  try {
    const response = await axios.get('/kadesh/api/user')
    // Se tiver perfil, carregar dados
    // Aqui você pode fazer uma chamada adicional para buscar o perfil completo
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
  }
}

const saveProfile = async () => {
  loading.value = true
  message.value = ''
  
  try {
    await axios.put('/kadesh/api/profile', profile.value)
    message.value = '✅ Perfil atualizado com sucesso!'
    messageType.value = 'success'
  } catch (error) {
    message.value = '❌ Erro ao salvar perfil: ' + (error.response?.data?.message || error.message)
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
/* Animações adicionais se necessário */
</style>


