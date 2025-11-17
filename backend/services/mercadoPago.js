const BASE_URL = 'https://api.mercadopago.com'

const ensureAccessToken = () => {
  if (!process.env.MP_ACCESS_TOKEN) {
    const error = new Error('Mercado Pago não configurado. Defina MP_ACCESS_TOKEN.')
    error.status = 503
    throw error
  }
}

const buildHeaders = () => ({
  Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
})

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
  ensureAccessToken()
  const response = await fetch(`${BASE_URL}/checkout/preferences`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  })

  return handleResponse(response)
}

const getPayment = async (paymentId) => {
  ensureAccessToken()
  const response = await fetch(`${BASE_URL}/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: buildHeaders()
  })

  return handleResponse(response)
}

module.exports = {
  createPreference,
  getPayment
}
