import { ref } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export function useReviews() {
  const reviews = ref([])
  const currentReview = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchReviews = async (userId, userType = 'provider') => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(
        `${API_BASE}/users/${userId}/reviews?type=${userType}`,
        { withCredentials: true }
      )
      
      reviews.value = response.data.reviews || response.data
      return reviews.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar avaliações'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createReview = async (projectId, data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(
        `${API_BASE}/projects/${projectId}/review`,
        {
          rating: data.rating,
          comment: data.comment,
          categories: data.categories || {}
        },
        { withCredentials: true }
      )
      
      currentReview.value = response.data.review || response.data
      return currentReview.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao criar avaliação'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateReview = async (reviewId, data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.put(
        `${API_BASE}/reviews/${reviewId}`,
        data,
        { withCredentials: true }
      )
      
      currentReview.value = response.data.review || response.data
      return currentReview.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao atualizar avaliação'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteReview = async (reviewId) => {
    loading.value = true
    error.value = null
    
    try {
      await axios.delete(`${API_BASE}/reviews/${reviewId}`, {
        withCredentials: true
      })
      
      // Remover da lista
      const index = reviews.value.findIndex(r => r.id === reviewId)
      if (index !== -1) {
        reviews.value.splice(index, 1)
      }
      
      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao deletar avaliação'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    reviews,
    currentReview,
    loading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview
  }
}
