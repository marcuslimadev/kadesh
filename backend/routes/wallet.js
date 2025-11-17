const express = require('express')
const db = require('../config/database')
const auth = require('../middleware/auth')
const {
  DEFAULT_DESCRIPTIONS,
  parseMetadata,
  buildTransactionPayload,
  getCurrentBalance,
  createWalletTransaction
} = require('../services/walletService')

const router = express.Router()

router.get('/balance', auth, async (req, res) => {
  try {
    const userId = req.user.userId
    const available = await getCurrentBalance(userId)

    const escrowResult = await db.query(
      `SELECT
        COALESCE(SUM(amount) FILTER (WHERE type = 'escrow_hold' AND status IN ('pending', 'completed')), 0) as hold,
        COALESCE(SUM(amount) FILTER (WHERE type = 'escrow_release' AND status IN ('pending', 'completed')), 0) as release
      FROM wallet_transactions
      WHERE user_id = $1`,
      [userId]
    )

    const hold = Number(escrowResult.rows[0]?.hold || 0)
    const release = Number(escrowResult.rows[0]?.release || 0)
    const escrow = Math.max(0, Math.abs(hold) - Math.abs(release))

    const pendingResult = await db.query(
      `SELECT
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as pending_in,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) as pending_out
      FROM wallet_transactions
      WHERE user_id = $1 AND status IN ('pending', 'processing')`,
      [userId]
    )

    const pendingIn = Number(pendingResult.rows[0]?.pending_in || 0)
    const pendingOut = Math.abs(Number(pendingResult.rows[0]?.pending_out || 0))
    const pending = pendingIn + pendingOut

    res.json({
      success: true,
      data: {
        available: Number(available.toFixed(2)),
        escrow: Number(escrow.toFixed(2)),
        pending: Number(pending.toFixed(2)),
        total: Number((available + escrow + pending).toFixed(2))
      }
    })
  } catch (error) {
    console.error('Get balance error:', error)
    res.status(500).json({
      error: 'Erro ao buscar saldo'
    })
  }
})

router.get('/transactions', auth, async (req, res) => {
  try {
    const userId = req.user.userId
    const { type, status, limit = 20, offset = 0, sort = 'desc' } = req.query

    let query = `
      SELECT
        id,
        user_id,
        type,
        amount,
        balance_after,
        description,
        reference_type,
        reference_id,
        metadata,
        status,
        created_at
      FROM wallet_transactions
      WHERE user_id = $1
    `

    const params = [userId]
    let paramCount = 1

    if (type) {
      query += ` AND type = $${++paramCount}`
      params.push(type)
    }

    if (status) {
      query += ` AND status = $${++paramCount}`
      params.push(status)
    }

    const sortDirection = sort === 'asc' ? 'ASC' : 'DESC'
    query += ` ORDER BY created_at ${sortDirection} LIMIT $${++paramCount} OFFSET $${++paramCount}`
    params.push(parseInt(limit, 10), parseInt(offset, 10))

    const result = await db.query(query, params)

    let countQuery = 'SELECT COUNT(*) as total FROM wallet_transactions WHERE user_id = $1'
    const countParams = [userId]

    if (type) {
      countQuery += ' AND type = $2'
      countParams.push(type)
      if (status) {
        countQuery += ' AND status = $3'
        countParams.push(status)
      }
    } else if (status) {
      countQuery += ' AND status = $2'
      countParams.push(status)
    }

    const countResult = await db.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].total, 10)

    res.json({
      success: true,
      data: {
        transactions: result.rows.map(buildTransactionPayload),
        pagination: {
          total,
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          hasMore: offset + result.rows.length < total
        }
      }
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    res.status(500).json({
      error: 'Erro ao buscar transações'
    })
  }
})

router.post('/withdraw', auth, async (req, res) => {
  try {
    const userId = req.user.userId
    const amount = Number(req.body.amount)
    const method = req.body.method || 'bank_transfer'
    const notes = req.body.notes || req.body.details || null

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Valor inválido'
      })
    }

    const currentBalance = await getCurrentBalance(userId)
    if (amount > currentBalance) {
      return res.status(400).json({
        error: 'Saldo insuficiente'
      })
    }

    const { transaction, balanceAfter } = await createWalletTransaction(userId, {
      amount: -Math.abs(amount),
      type: 'withdrawal',
      description: `Saque via ${method.toUpperCase()}`,
      referenceType: 'withdrawal',
      status: 'completed',
      metadata: {
        method,
        ...(notes ? { notes } : {})
      }
    })

    res.json({
      success: true,
      message: 'Solicitação de saque registrada com sucesso',
      data: {
        balance: balanceAfter,
        transaction
      }
    })
  } catch (error) {
    console.error('Withdraw error:', error)
    res.status(error.status || 500).json({
      error: error.status === 400 ? error.message : 'Erro ao processar saque'
    })
  }
})

router.post('/deposit', auth, async (req, res) => {
  try {
    const userId = req.user.userId
    const amount = Number(req.body.amount)
    const method = req.body.method || 'pix'
    const reference = req.body.reference || null

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Valor inválido'
      })
    }

    const { transaction, balanceAfter } = await createWalletTransaction(userId, {
      amount: Math.abs(amount),
      type: 'deposit',
      description: `Depósito via ${method.toUpperCase()}`,
      referenceType: 'deposit',
      status: 'completed',
      metadata: {
        method,
        ...(reference ? { reference } : {})
      }
    })

    res.json({
      success: true,
      message: 'Depósito registrado com sucesso',
      data: {
        balance: balanceAfter,
        transaction
      }
    })
  } catch (error) {
    console.error('Deposit error:', error)
    res.status(error.status || 500).json({
      error: error.status === 400 ? error.message : 'Erro ao registrar depósito'
    })
  }
})

module.exports = router
