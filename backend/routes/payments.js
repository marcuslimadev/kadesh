const express = require('express')
const crypto = require('crypto')
const db = require('../config/database')
const auth = require('../middleware/auth')
const { sanitizeInput } = require('../utils/validators')
const { createPreference, getPayment } = require('../services/mercadoPago')
const { createWalletTransaction } = require('../services/walletService')

const router = express.Router()

const DEFAULT_MIN_DEPOSIT = 10
const SUPPORTED_METHODS = ['mercadopago']

const resolveFrontendBaseUrl = (req) => {
  if (process.env.MP_RETURN_URL) {
    return process.env.MP_RETURN_URL
  }

  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL
  }

  if (process.env.FRONTEND_URLS) {
    const [first] = process.env.FRONTEND_URLS.split(',').map(url => url.trim()).filter(Boolean)
    if (first) return first
  }

  return `${req.protocol || 'https'}://${req.get('host') || 'localhost:5173'}`.replace('://:', '://')
}

const resolveNotificationUrl = (req) => {
  if (process.env.MP_NOTIFICATION_URL) {
    return process.env.MP_NOTIFICATION_URL
  }

  const base = process.env.BACKEND_PUBLIC_URL || `${req.protocol || 'https'}://${req.get('host')}`
  return `${base}/api/payments/mercadopago/webhook`
}

const normalizeIntent = (intent) => {
  if (!intent) return null
  const { error_message: _ignoreError, ...rest } = intent
  return rest
}

const mapPaymentStatus = (status) => {
  switch (status) {
    case 'approved':
      return 'completed'
    case 'in_process':
    case 'in_mediation':
    case 'authorized':
    case 'pending':
      return 'processing'
    case 'cancelled':
    case 'rejected':
    case 'charged_back':
      return 'failed'
    default:
      return 'pending'
  }
}

const verifySignature = (signatureHeader, payload) => {
  if (!process.env.MP_WEBHOOK_SECRET) {
    // If no secret is configured we can't validate, so allow to avoid blocking sandbox
    return true
  }

  if (!signatureHeader) {
    return false
  }

  const parts = signatureHeader.split(',')
  const data = {}

  parts.forEach(part => {
    const [key, value] = part.split('=')
    if (key && value) {
      data[key] = value
    }
  })

  if (!data.ts || !data.v1) {
    return false
  }

  const manifest = `ts:${data.ts};payload:${payload};`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest('hex')

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  const receivedBuffer = Buffer.from(data.v1, 'utf8')

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
}

router.post('/deposit', auth, async (req, res) => {
  try {
    const method = req.body.method || 'mercadopago'
    const amount = Number(req.body.amount)
    const description = sanitizeInput(req.body.description) || 'Depósito na carteira Kadesh'

    if (!SUPPORTED_METHODS.includes(method)) {
      return res.status(400).json({ error: 'Método de pagamento não suportado' })
    }

    const minDeposit = Number(process.env.MP_MIN_DEPOSIT || DEFAULT_MIN_DEPOSIT)

    if (!Number.isFinite(amount) || amount < minDeposit) {
      return res.status(400).json({ error: `Informe um valor mínimo de R$ ${minDeposit.toFixed(2)}` })
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(503).json({ error: 'Integração com o Mercado Pago não está configurada' })
    }

    const userResult = await db.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.user.userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const user = userResult.rows[0]

    const intentResult = await db.query(
      `INSERT INTO payment_intents (
        user_id, type, payment_method, amount, currency, status, description, reference_type, metadata
      ) VALUES ($1, $2, $3, $4, 'BRL', 'pending', $5, 'wallet', $6::jsonb)
      RETURNING *`,
      [
        user.id,
        'wallet_deposit',
        method,
        amount,
        description,
        JSON.stringify({ user_id: user.id, type: 'wallet_deposit' })
      ]
    )

    const intent = intentResult.rows[0]
    const frontendBase = resolveFrontendBaseUrl(req)
    const notificationUrl = resolveNotificationUrl(req)

    const preferencePayload = {
      items: [
        {
          id: intent.id,
          title: 'Depósito de saldo - Kadesh',
          description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: amount
        }
      ],
      payer: {
        email: user.email,
        name: user.name
      },
      metadata: {
        intent_id: intent.id,
        user_id: user.id,
        type: 'wallet_deposit'
      },
      external_reference: intent.id,
      back_urls: {
        success: process.env.MP_SUCCESS_URL || `${frontendBase}/wallet?payment=success`,
        failure: process.env.MP_FAILURE_URL || `${frontendBase}/wallet?payment=failure`,
        pending: process.env.MP_PENDING_URL || `${frontendBase}/wallet?payment=pending`
      },
      auto_return: 'approved',
      notification_url: notificationUrl,
      statement_descriptor: 'KADESH'
    }

    const preference = await createPreference(preferencePayload)
    const checkoutUrl = preference.init_point || preference.sandbox_init_point

    await db.query(
      `UPDATE payment_intents SET preference_id = $2, checkout_url = $3, notification_url = $4, metadata = metadata || $5::jsonb WHERE id = $1`,
      [
        intent.id,
        preference.id,
        checkoutUrl,
        notificationUrl,
        JSON.stringify({ preference_id: preference.id })
      ]
    )

    return res.json({
      success: true,
      message: 'Checkout criado com sucesso. Finalize o pagamento no Mercado Pago.',
      data: {
        intent: normalizeIntent({ ...intent, preference_id: preference.id, checkout_url: checkoutUrl }),
        preference_id: preference.id,
        checkout_url: checkoutUrl,
        sandbox_checkout_url: preference.sandbox_init_point
      }
    })
  } catch (error) {
    console.error('Deposit checkout error:', error)
    res.status(error.status || 500).json({ error: error.message || 'Erro ao criar checkout' })
  }
})

router.get('/intents', auth, async (req, res) => {
  try {
    const { status, type, limit = 10, offset = 0 } = req.query

    let query = `
      SELECT id, type, payment_method, amount, currency, status, description, preference_id, checkout_url, created_at
      FROM payment_intents
      WHERE user_id = $1
    `

    const params = [req.user.userId]
    let counter = 1

    if (type) {
      query += ` AND type = $${++counter}`
      params.push(type)
    }

    if (status) {
      query += ` AND status = $${++counter}`
      params.push(status)
    }

    query += ` ORDER BY created_at DESC LIMIT $${++counter} OFFSET $${++counter}`
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const intentsResult = await db.query(query, params)

    res.json({
      success: true,
      data: {
        intents: intentsResult.rows,
        pagination: {
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10)
        }
      }
    })
  } catch (error) {
    console.error('Get payment intents error:', error)
    res.status(500).json({ error: 'Erro ao buscar intentos de pagamento' })
  }
})

router.post('/mercadopago/webhook', async (req, res) => {
  try {
    const rawBody = req.rawBody || JSON.stringify(req.body || {})
    const signature = req.headers['x-signature']

    if (!verifySignature(signature, rawBody)) {
      return res.status(403).json({ error: 'Assinatura inválida' })
    }

    const notification = req.body

    if (!notification || (notification.type && notification.type !== 'payment')) {
      return res.json({ received: true })
    }

    const paymentId = notification.data?.id || notification.data?.payment?.id

    if (!paymentId) {
      return res.status(400).json({ error: 'Pagamento inválido' })
    }

    const payment = await getPayment(paymentId)
    const intentId = payment.metadata?.intent_id || payment.metadata?.intentId || payment.external_reference

    if (!intentId) {
      console.warn('Mercado Pago webhook sem intent_id', payment.id)
      return res.json({ received: true })
    }

    await db.transaction(async (client) => {
      const intentResult = await client.query(
        'SELECT * FROM payment_intents WHERE id = $1 FOR UPDATE',
        [intentId]
      )

      if (intentResult.rows.length === 0) {
        throw new Error(`Intento ${intentId} não encontrado`)
      }

      const intent = intentResult.rows[0]
      const newStatus = mapPaymentStatus(payment.status)

      if (intent.status === 'completed') {
        return
      }

      await client.query(
        `UPDATE payment_intents
         SET status = $2, gateway_payment_id = $3, gateway_reference = $4, metadata = metadata || $5::jsonb,
             processed_at = CASE WHEN $2 = 'completed' THEN NOW() ELSE processed_at END,
             updated_at = NOW()
         WHERE id = $1`,
        [
          intent.id,
          newStatus,
          payment.id,
          payment.external_reference || payment.order?.id || null,
          JSON.stringify({ payment_status: payment.status, payment_method: payment.payment_method_id, status_detail: payment.status_detail })
        ]
      )

      if (newStatus === 'completed' && intent.type === 'wallet_deposit') {
        await createWalletTransaction(
          intent.user_id,
          {
            amount: Number(payment.transaction_amount || intent.amount),
            type: 'deposit',
            description: 'Depósito via Mercado Pago',
            referenceType: 'payment_intent',
            referenceId: intent.id,
            metadata: {
              payment_id: payment.id,
              payment_method: payment.payment_method_id,
              preference_id: intent.preference_id,
              status_detail: payment.status_detail
            }
          },
          client
        )
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Mercado Pago webhook error:', error)
    res.status(500).json({ error: 'Erro ao processar webhook' })
  }
})

module.exports = router
