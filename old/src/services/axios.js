import axios from 'axios'

// Configurar axios globalmente para enviar cookies em todas as requisições
axios.defaults.withCredentials = true

// Base URL da API
export const API_BASE = '/api'

export default axios
