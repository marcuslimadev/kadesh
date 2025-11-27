const db = require('../config/database')

const DEFAULT_DESCRIPTIONS = {
  deposit: 'Depósito na carteira',
  withdrawal: 'Saque solicitado',
  escrow_hold: 'Valor bloqueado em escrow',
  escrow_release: 'Liberação de escrow',
  payment: 'Pagamento de projeto',
  payment_received: 'Pagamento recebido',
  payment_sent: 'Pagamento enviado',
  refund: 'Reembolso',
  fee: 'Taxa da plataforma'
}

const parseMetadata = (metadata) => {
  if (!metadata) return {}
  if (typeof metadata === 'object') return metadata

  try {
    return JSON.parse(metadata)
  } catch (error) {
    console.error('Failed to parse wallet metadata:', error.message)
    return {}
  }
}

const buildTransactionPayload = (row) => ({
  id: row.id,
  user_id: row.user_id,
  type: row.type,
  amount: Number(row.amount),
  balance_after: Number(row.balance_after),
  description: row.description || DEFAULT_DESCRIPTIONS[row.type] || 'Transação',
  reference_type: row.reference_type,
  reference_id: row.reference_id,
  status: row.status,
  metadata: parseMetadata(row.metadata),
  created_at: row.created_at
})

const getCurrentBalance = async (userId, client = null) => {
  const executor = client || db
  const result = await executor.query(
    'SELECT balance_after FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [userId]
  )

  if (result.rows.length === 0) {
    return 0
  }

  return Number(result.rows[0].balance_after)
}

const createWalletTransaction = async (
  userId,
  {
    amount,
    type,
    description,
    referenceType,
    referenceId,
    status = 'completed',
    metadata = {},
    allowZeroAmount = false
  },
  client = null
) => {
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount) || (!allowZeroAmount && numericAmount === 0)) {
    const error = new Error('Valor inválido')
    error.status = 400
    throw error
  }

  if (!type) {
    const error = new Error('Tipo de transação é obrigatório')
    error.status = 400
    throw error
  }

  const run = async (dbClient) => {
    const previousResult = await dbClient.query(
      'SELECT balance_after FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1 FOR UPDATE',
      [userId]
    )

    const previousBalance = previousResult.rows.length ? Number(previousResult.rows[0].balance_after) : 0
    const balanceAfter = Number((previousBalance + numericAmount).toFixed(2))

    if (balanceAfter < -0.01) {
      const error = new Error('Saldo insuficiente')
      error.status = 400
      throw error
    }

    const insertResult = await dbClient.query(
      `INSERT INTO wallet_transactions (
        user_id, type, amount, balance_after, description, reference_type, reference_id, status, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        type,
        numericAmount,
        balanceAfter,
        description || DEFAULT_DESCRIPTIONS[type] || null,
        referenceType || null,
        referenceId || null,
        status,
        JSON.stringify(metadata || {})
      ]
    )

    return {
      transaction: buildTransactionPayload(insertResult.rows[0]),
      balanceAfter
    }
  }

  if (client) {
    return run(client)
  }

  return db.transaction(run)
}

module.exports = {
  DEFAULT_DESCRIPTIONS,
  parseMetadata,
  buildTransactionPayload,
  getCurrentBalance,
  createWalletTransaction
}
