import { ref } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export function useDeliveries() {
  const deliveries = ref([])
  const currentDelivery = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchDeliveries = async (projectId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`${API_BASE}/projects/${projectId}/deliveries`, {
        withCredentials: true
      })
      
      deliveries.value = response.data.deliveries || response.data
      return deliveries.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar entregas'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDelivery = async (projectId, data) => {
    loading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('description', data.description)
      formData.append('notes', data.notes || '')
      
      // Anexar arquivos
      if (data.files && data.files.length > 0) {
        data.files.forEach((file, index) => {
          formData.append(`files[${index}]`, file)
        })
      }
      
      const response = await axios.post(
        `${API_BASE}/projects/${projectId}/deliveries`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      
      currentDelivery.value = response.data.delivery || response.data
      return currentDelivery.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao criar entrega'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDeliveryStatus = async (deliveryId, status, feedback = null) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(
        `${API_BASE}/deliveries/${deliveryId}/status`,
        { status, feedback },
        { withCredentials: true }
      )
      
      currentDelivery.value = response.data.delivery || response.data
      
      // Atualizar na lista
      const index = deliveries.value.findIndex(d => d.id === deliveryId)
      if (index !== -1) {
        deliveries.value[index] = currentDelivery.value
      }
      
      return currentDelivery.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao atualizar status'
      throw err
    } finally {
      loading.value = false
    }
  }

  const requestRevision = async (deliveryId, revisionNotes) => {
    return updateDeliveryStatus(deliveryId, 'revision_requested', revisionNotes)
  }

  const approveDelivery = async (deliveryId, feedback = null) => {
    return updateDeliveryStatus(deliveryId, 'approved', feedback)
  }

  const rejectDelivery = async (deliveryId, reason) => {
    return updateDeliveryStatus(deliveryId, 'rejected', reason)
  }

  return {
    deliveries,
    currentDelivery,
    loading,
    error,
    fetchDeliveries,
    createDelivery,
    updateDeliveryStatus,
    requestRevision,
    approveDelivery,
    rejectDelivery
  }
}
