<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Criar uma conta</h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- User fields -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" id="name" v-model="form.name" required class="w-full px-3 py-2 mt-1 border rounded-md">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="form.email" required class="w-full px-3 py-2 mt-1 border rounded-md">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" id="password" v-model="form.password" required class="w-full px-3 py-2 mt-1 border rounded-md">
          </div>
          <div>
            <label for="type" class="block text-sm font-medium text-gray-700">Tipo</label>
            <select id="type" v-model="form.type" required class="w-full px-3 py-2 mt-1 border rounded-md">
              <option value="contractor">Contratante</option>
              <option value="provider">Contratado</option>
            </select>
          </div>
          <!-- KYC Document Upload -->
          <div class="md:col-span-2">
            <label for="document" class="block text-sm font-medium text-gray-700">Documento KYC</label>
            <input type="file" id="document" @change="onFileChange" class="w-full px-3 py-2 mt-1 border rounded-md">
          </div>
        </div>
        <div v-if="error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg">{{ error }}</div>
        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md">Registrar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: '',
  type: 'contractor',
})
const kycDocument = ref(null)
const error = ref(null)

function onFileChange(event) {
  kycDocument.value = event.target.files[0]
}

async function handleRegister() {
  error.value = null
  try {
    // 1. Register the user
    await api.post('/api/register', form)

    // 2. If registration is successful, upload the KYC document
    if (kycDocument.value) {
      const formData = new FormData()
      formData.append('document', kycDocument.value)

      // Axios will set the correct Content-Type for FormData
      await api.post('/api/kyc-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }

    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Ocorreu um erro.'
  }
}
</script>
