const db = require('../config/database')
const BASE_URL = 'https://api.mercadopago.com'

// Cache simples para evitar query no banco a cada request
let cachedToken = null
let tokenLastFetched = 0
const TOKEN_CACHE_TTL = 5 * 60 * 1000 // 5 minutos

const getAccessToken = async () => {
  // 1. Tentar cache
  if (cachedToken && (Date.now() - tokenLastFetched < TOKEN_CACHE_TTL)) {
    return cachedToken
  }

  // 2. Tentar banco de dados
  try {
    const result = await db.query(
      "SELECT value FROM system_settings WHERE key = 'mp_access_token'"
    )
    if (result.rows.length > 0 && result.rows[0].value) {
      cachedToken = result.rows[0].value
      tokenLastFetched = Date.now()
      return cachedToken
    }
  } catch (error) {
    console.warn('Erro ao buscar token MP do banco:', error.message)
  }

  // 3. Fallback para variável de ambiente
  if (process.env.MP_ACCESS_TOKEN) {
    return process.env.MP_ACCESS_TOKEN
  }

  return null
}

const buildHeaders = async () => {
  const token = await getAccessToken()
  if (!token) {
    const error = new Error('Mercado Pago não configurado. Defina MP_ACCESS_TOKEN no .env ou no Painel Admin.')
    error.status = 503
    throw error
  }
  
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const handleResponse = async (response) => {
  const body = await response.json()
  if (!response.ok) {
    const error = new Error(body?.message || 'Erro na API do Mercado Pago')
    error.status = response.status
    error.details = body
    throw error
  }
  return body
}

const createPreference = async (payload) => {
  const headers = await buildHeaders()
  const response = await fetch(`${BASE_URL}/checkout/preferences`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })

  return handleResponse(response)
}

const getPayment = async (paymentId) => {
  const headers = await buildHeaders()
  const response = await fetch(`${BASE_URL}/v1/payments/${paymentId}`, {
    method: 'GET',
    headers
  })

  return handleResponse(response)
}

module.exports = {
  createPreference,
  getPayment
}
