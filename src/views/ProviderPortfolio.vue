<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
    <div class="bg-neutral-900 p-6 rounded text-white shadow">
      <h1 class="text-2xl md:text-3xl font-bold mb-2"> Meu Portfólio</h1>
      <p class="opacity-90">Mostre seus melhores trabalhos e conquiste clientes!</p>
    </div>

    <!-- UPLOAD DE IMAGEM -->
    <div class="bg-white rounded shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">➕ Adicionar Foto</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Selecionar Imagem</label>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-neutral-300 transition-all"
          />
          <p class="text-sm text-gray-500 mt-1">JPG, PNG ou WebP - Máximo 5MB</p>
        </div>

        <div v-if="previewUrl" class="relative w-full h-64 rounded overflow-hidden border-2 border-gray-200">
          <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover" />
          <button
            @click="clearPreview"
            class="absolute top-2 right-2 bg-neutral-600 text-white w-8 h-8 rounded-full hover:bg-neutral-600 transition-all"
          >
            ✕
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              v-model="uploadForm.title"
              type="text"
              placeholder="Ex: Reforma Completa - Sala de Estar"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-neutral-300 transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Projeto</label>
            <input
              v-model="uploadForm.project_type"
              type="text"
              placeholder="Ex: Residencial, Comercial"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-neutral-300 transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <textarea
            v-model="uploadForm.description"
            rows="3"
            placeholder="Descreva o trabalho realizado..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-neutral-300 transition-all"
          ></textarea>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="uploadForm.is_featured"
            type="checkbox"
            id="featured"
            class="w-5 h-5 text-neutral-900 border-gray-300 rounded focus:ring-purple-500"
          />
          <label for="featured" class="text-sm font-medium text-gray-700 cursor-pointer">
             Destacar esta imagem (aparece primeiro)
          </label>
        </div>

        <button
          @click="uploadImage"
          :disabled="!selectedFile || uploading"
          class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded font-bold text-lg shadow-lg hover:shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ uploading ? '⏳ Enviando...' : '📤 Enviar Imagem' }}
        </button>
      </div>
    </div>

    <!-- GALERIA -->
    <div class="bg-white rounded shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-800">🖼️ Minhas Fotos ({{ portfolio.length }})</h2>
        <button
          @click="loadPortfolio"
          class="text-neutral-900 hover:text-neutral-900 font-medium"
        >
          🔄 Atualizar
        </button>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-12 h-12 border-4 border-neutral-300 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Carregando portfólio...</p>
      </div>

      <div v-else-if="portfolio.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4"></div>
        <p class="text-gray-600 text-lg">Nenhuma foto ainda</p>
        <p class="text-gray-500 text-sm">Adicione fotos dos seus melhores trabalhos!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in portfolio"
          :key="item.id"
          class="group relative bg-white rounded overflow-hidden shadow-md hover:shadow transition-all border-2 border-gray-100"
        >
          <!-- Badge Destaque -->
          <div v-if="item.is_featured" class="absolute top-3 left-3 z-10 bg-neutral-600 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
             Destaque
          </div>

          <!-- Imagem -->
          <div class="relative w-full h-64 overflow-hidden bg-gray-100">
            <img
              :src="getImageUrl(item.file_path)"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:opacity-90 transition-duration-300"
              @error="handleImageError"
            />
          </div>

          <!-- Informações -->
          <div class="p-4 space-y-2">
            <h3 class="font-bold text-gray-800 truncate">{{ item.title || 'Sem título' }}</h3>
            <p v-if="item.description" class="text-sm text-gray-600 line-clamp-2">{{ item.description }}</p>
            <div v-if="item.project_type" class="inline-block bg-purple-100 text-neutral-900 px-2 py-1 rounded-md text-xs font-medium">
              {{ item.project_type }}
            </div>
          </div>

          <!-- Botão Deletar -->
          <button
            @click="deleteImage(item.id)"
            class="absolute top-3 right-3 bg-neutral-600 text-white w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-neutral-600 flex items-center justify-center"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- MENSAGENS -->
    <div v-if="message" class="p-4 rounded" :class="messageType === 'success' ? 'bg-neutral-800 text-neutral-900' : 'bg-neutral-600 text-red-800'">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const portfolio = ref([])
const loading = ref(false)
const uploading = ref(false)
const message = ref('')
const messageType = ref('')
const selectedFile = ref(null)
const previewUrl = ref('')
const fileInput = ref(null)

const uploadForm = ref({
  title: '',
  description: '',
  project_type: '',
  is_featured: false
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tipo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    message.value = ' Tipo de arquivo não permitido. Use JPG, PNG ou WebP'
    messageType.value = 'error'
    return
  }

  // Validar tamanho (5MB)
  if (file.size > 5 * 1024 * 1024) {
    message.value = ' Arquivo muito grande. Máximo 5MB'
    messageType.value = 'error'
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  message.value = ''
}

const clearPreview = () => {
  selectedFile.value = null
  previewUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadImage = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  message.value = ''

  try {
    const formData = new FormData()
    formData.append('image', selectedFile.value)
    formData.append('title', uploadForm.value.title)
    formData.append('description', uploadForm.value.description)
    formData.append('project_type', uploadForm.value.project_type)
    formData.append('is_featured', uploadForm.value.is_featured ? '1' : '0')

    await axios.post('/kadesh/api/portfolio/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    message.value = ' Imagem enviada com sucesso!'
    messageType.value = 'success'

    // Resetar form
    uploadForm.value = {
      title: '',
      description: '',
      project_type: '',
      is_featured: false
    }
    clearPreview()

    // Recarregar portfólio
    await loadPortfolio()
  } catch (error) {
    message.value = ' Erro ao enviar imagem: ' + (error.response?.data?.message || error.message)
    messageType.value = 'error'
  } finally {
    uploading.value = false
  }
}

const loadPortfolio = async () => {
  loading.value = true
  message.value = ''

  try {
    const userResponse = await axios.get('/kadesh/api/user')
    const userId = userResponse.data.id

    const response = await axios.get(`/kadesh/api/providers/${userId}/profile`)
    portfolio.value = response.data.portfolio || []
  } catch (error) {
    message.value = ' Erro ao carregar portfólio: ' + (error.response?.data?.message || error.message)
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const deleteImage = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta imagem?')) return

  try {
    await axios.delete(`/kadesh/api/portfolio/${id}`)
    message.value = ' Imagem removida com sucesso!'
    messageType.value = 'success'
    await loadPortfolio()
  } catch (error) {
    message.value = ' Erro ao remover imagem: ' + (error.response?.data?.message || error.message)
    messageType.value = 'error'
  }
}

const getImageUrl = (path) => {
  return path.startsWith('http') ? path : `/kadesh${path}`
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="150" dx="120"%3EImagem não encontrada%3C/text%3E%3C/svg%3E'
}

onMounted(() => {
  loadPortfolio()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>




