<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
    <div class="card card-elevated p-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <h1 class="text-2xl md:text-3xl font-bold mb-2"> Meu Perfil Profissional</h1>
      <p class="opacity-90">Mostre seus trabalhos e conquiste mais clientes!</p>
    </div>

    <!-- INFORMAÇÕES BÁSICAS -->
    <div class="card card-elevated p-6 space-y-4">
      <h2 class="text-xl font-bold text-neutral-900 flex items-center gap-2">
        🏢 Informações do Negócio
      </h2>

      <div class="grid grid-responsive-cols-2 gap-4">
        <div>
          <label class="label">Nome do Negócio *</label>
          <input
            v-model="profile.business_name"
            type="text"
            placeholder="Ex: João Reformas e Pinturas"
            class="input input-lg"
          />
        </div>

        <div>
          <label class="label">Slogan</label>
          <input
            v-model="profile.tagline"
            type="text"
            placeholder="Ex: Qualidade e pontualidade garantidas!"
            class="input input-lg"
          />
        </div>
      </div>

      <div>
        <label class="label">Sobre Você e Seu Negócio</label>
        <textarea
          v-model="profile.about"
          rows="5"
          placeholder="Conte sua história, experiência, diferenciais..."
          class="textarea"
        ></textarea>
      </div>

      <div class="grid grid-responsive-cols-2 gap-4">
        <div>
          <label class="label">Anos de Experiência</label>
          <input
            v-model.number="profile.years_experience"
            type="number"
            min="0"
            placeholder="5"
            class="input input-lg"
          />
        </div>

        <div>
          <label class="label">Máx. Projetos Simultâneos</label>
          <input
            v-model.number="profile.max_concurrent_projects"
            type="number"
            min="1"
            placeholder="3"
            class="input input-lg"
          />
        </div>
      </div>
    </div>

    <!-- ESPECIALIDADES -->
    <div class="card card-elevated p-6 space-y-4">
      <h2 class="text-xl font-bold text-neutral-900 flex items-center gap-2">
         Especialidades e Serviços
      </h2>

      <div>
        <label class="label">Especialidades (pressione Enter para adicionar)</label>
        <input
          v-model="newSpecialty"
          @keyup.enter="addSpecialty"
          type="text"
          placeholder="Ex: Pintura Residencial"
          class="input input-lg"
        />
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="(spec, index) in profile.specialties"
            :key="index"
            class="badge badge-primary flex items-center gap-2"
          >
            {{ spec }}
            <button @click="removeSpecialty(index)" class="hover:text-white">✕</button>
          </span>
        </div>
      </div>

      <div>
        <label class="label">Serviços Oferecidos</label>
        <input
          v-model="newService"
          @keyup.enter="addService"
          type="text"
          placeholder="Ex: Pintura de fachadas"
          class="input input-lg"
        />
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="(service, index) in profile.services_offered"
            :key="index"
            class="badge badge-secondary flex items-center gap-2"
          >
            {{ service }}
            <button @click="removeService(index)" class="hover:text-white">✕</button>
          </span>
        </div>
      </div>
    </div>

    <!-- LOCALIZAÇÃO E CONTATO -->
    <div class="card card-elevated p-6 space-y-4">
      <h2 class="text-xl font-bold text-neutral-900 flex items-center gap-2">
        📍 Localização e Contato
      </h2>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="label">Cidade</label>
          <input
            v-model="profile.city"
            type="text"
            placeholder="Ex: São Paulo"
            class="input input-lg"
          />
        </div>

        <div>
          <label class="label">Estado</label>
          <input
            v-model="profile.state"
            type="text"
            placeholder="Ex: SP"
            maxlength="2"
            class="input input-lg"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="label">Telefone</label>
          <input
            v-model="profile.phone"
            type="tel"
            placeholder="(11) 98765-4321"
            class="input input-lg"
          />
        </div>

        <div>
          <label class="label">WhatsApp</label>
          <input
            v-model="profile.whatsapp"
            type="tel"
            placeholder="(11) 98765-4321"
            class="input input-lg"
          />
        </div>
      </div>

      <div>
        <label class="label">Website / Instagram</label>
        <input
          v-model="profile.website"
          type="url"
          placeholder="https://instagram.com/seu_perfil"
          class="input input-lg"
        />
      </div>
    </div>

    <!-- DISPONIBILIDADE -->
    <div class="card card-elevated p-6 space-y-4">
      <h2 class="text-xl font-bold text-neutral-900 flex items-center gap-2">
         Disponibilidade
      </h2>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="label">Status</label>
          <select
            v-model="profile.availability_status"
            class="select select-lg"
          >
            <option value="available"> Disponível</option>
            <option value="busy">⚠️ Ocupado (aceito novos projetos)</option>
            <option value="unavailable"> Indisponível</option>
          </select>
        </div>

        <div class="flex items-center gap-4 pt-8">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="profile.accept_new_projects"
              type="checkbox"
              class="checkbox"
            />
            <span class="text-sm font-medium text-neutral-900">Aceitar novos projetos</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="profile.profile_visible"
              type="checkbox"
              class="checkbox"
            />
            <span class="text-sm font-medium text-neutral-900">Perfil público visível</span>
          </label>
        </div>
      </div>
    </div>

    <!-- BOTÕES -->
    <div class="flex gap-4">
      <button
        @click="saveProfile"
        :disabled="loading"
        class="btn btn-primary flex-1"
      >
        {{ loading ? '⏳ Salvando...' : '💾 Salvar Perfil' }}
      </button>
    </div>

    <!-- MENSAGENS -->
    <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-error'">
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
    message.value = ' Perfil atualizado com sucesso!'
    messageType.value = 'success'
  } catch (error) {
    message.value = ' Erro ao salvar perfil: ' + (error.response?.data?.message || error.message)
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




