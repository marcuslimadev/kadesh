import axios from '../services/axios'
import { ref } from 'vue'

const API_BASE = '/api'

export function useAuctions() {
  const auctions = ref([])
  const currentAuction = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchActiveAuctions = async () => {
    loading.value = true
    error.value = null
    try {
      // Usar /api/projects em vez de /api/auctions/active
      // porque os projetos são criados direto sem project_auction_config
      const response = await axios.get(`${API_BASE}/projects?status=open`, {
        withCredentials: true
      })
      
      // API retorna array direto, não objeto com propriedade auctions
      auctions.value = Array.isArray(response.data) ? response.data : (response.data.projects || [])
      
      // Transformar campos para compatibilidade com o template
      auctions.value = auctions.value.map(project => ({
        ...project,
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category || 'Geral',
        min_budget: project.max_budget ? (project.max_budget * 0.5) : 0, // Estimativa
        contractor_name: project.user_name || 'Contratante',
        bid_count: project.bids_count || 0,
        current_lowest_bid: project.lowest_bid || null,
        ends_at: project.bidding_ends_at || project.project_deadline
      }))
      
      return auctions.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar leilões'
      console.error('Erro ao buscar projetos:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAuctionDetail = async (id) => {
    loading.value = true
    error.value = null
    try {
      // Buscar detalhes do projeto
      const projectResponse = await axios.get(`${API_BASE}/projects/${id}`, {
        withCredentials: true
      })
      
      // Buscar bids do projeto
      let bids = []
      try {
        const bidsResponse = await axios.get(`${API_BASE}/projects/${id}/bids`, {
          withCredentials: true
        })
        bids = bidsResponse.data.bids || []
      } catch (err) {
        console.warn('Erro ao carregar bids:', err)
      }
      
      // Transformar projeto para formato compatível com auction
      const project = projectResponse.data
      currentAuction.value = {
        ...project,
        id: project.id,
        project_id: project.id,
        title: project.title,
        description: project.description,
        category: project.category || 'Geral',
        min_budget: project.max_budget ? (project.max_budget * 0.5) : 0,
        max_budget: project.max_budget,
        contractor_id: project.contractor_id,
        contractor_name: project.user_name || 'Contratante',
        contractor_email: project.user_email,
        bid_count: project.bids_count || 0,
        current_lowest_bid: project.lowest_bid || null,
        ends_at: project.bidding_ends_at || project.project_deadline,
        status: project.status,
        bids: bids
      }
      
      return currentAuction.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar leilão'
      console.error('Erro ao buscar detalhes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const placeBid = async (projectId, amount, proposalText = '') => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(`${API_BASE}/bids`, 
        {
          project_id: projectId,
          amount: amount,
          proposal: proposalText,
          delivery_time_days: 30
        },
        { withCredentials: true }
      )
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao enviar lance'
      console.error('❌ Erro ao enviar lance:', err.response?.data || err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    auctions,
    currentAuction,
    loading,
    error,
    fetchActiveAuctions,
    fetchAuctionDetail,
    placeBid
  }
}
