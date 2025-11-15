const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Calculate available balance (payments received - payments sent)
    const balanceResult = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN receiver_id = $1 AND status = 'completed' THEN net_amount ELSE 0 END), 0) as received,
        COALESCE(SUM(CASE WHEN payer_id = $1 AND status = 'completed' THEN amount ELSE 0 END), 0) as paid,
        COALESCE(SUM(CASE WHEN receiver_id = $1 AND status IN ('pending', 'processing') THEN net_amount ELSE 0 END), 0) as pending_received,
        COALESCE(SUM(CASE WHEN payer_id = $1 AND status IN ('pending', 'processing') THEN amount ELSE 0 END), 0) as pending_paid
      FROM payments
      WHERE receiver_id = $1 OR payer_id = $1
    `, [userId]);

    const balance = balanceResult.rows[0];
    
    // Calculate escrow balance (contracts in progress)
    const escrowResult = await db.query(`
      SELECT COALESCE(SUM(total_amount), 0) as escrow
      FROM contracts
      WHERE (client_id = $1 OR provider_id = $1) AND status = 'active'
    `, [userId]);

    const escrow = parseFloat(escrowResult.rows[0].escrow || 0);
    const received = parseFloat(balance.received || 0);
    const paid = parseFloat(balance.paid || 0);
    const pending = parseFloat(balance.pending_received || 0) - parseFloat(balance.pending_paid || 0);

    res.json({
      success: true,
      data: {
        available: received - paid,
        escrow: escrow,
        pending: pending,
        total: received - paid + escrow + pending
      }
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: 'Erro ao buscar saldo'
    });
  }
});

// Get user transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      type, 
      status, 
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = `
      SELECT 
        p.id,
        p.amount,
        p.net_amount,
        p.platform_fee,
        p.status,
        p.payment_method,
        p.created_at,
        p.processed_at,
        CASE 
          WHEN p.payer_id = $1 THEN 'payment'
          WHEN p.receiver_id = $1 THEN 'receipt'
        END as type,
        CASE 
          WHEN p.payer_id = $1 THEN receiver.name
          WHEN p.receiver_id = $1 THEN payer.name
        END as counterparty_name,
        c.project_id,
        pr.title as project_title
      FROM payments p
      LEFT JOIN users payer ON p.payer_id = payer.id
      LEFT JOIN users receiver ON p.receiver_id = receiver.id
      LEFT JOIN contracts c ON p.contract_id = c.id
      LEFT JOIN projects pr ON c.project_id = pr.id
      WHERE p.payer_id = $1 OR p.receiver_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND p.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) 
      FROM payments 
      WHERE payer_id = $1 OR receiver_id = $1
    `;
    const countParams = [userId];
    
    if (status) {
      countQuery += ' AND status = $2';
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        transactions: result.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + result.rows.length < total
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Erro ao buscar transações'
    });
  }
});

// Create withdrawal request
router.post('/withdraw', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, method = 'bank_transfer' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Valor inválido'
      });
    }

    // Check available balance
    const balanceResult = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN receiver_id = $1 AND status = 'completed' THEN net_amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN payer_id = $1 AND status = 'completed' THEN amount ELSE 0 END), 0) as available
      FROM payments
      WHERE receiver_id = $1 OR payer_id = $1
    `, [userId]);

    const available = parseFloat(balanceResult.rows[0].available);

    if (amount > available) {
      return res.status(400).json({
        error: 'Saldo insuficiente'
      });
    }

    // Create withdrawal record (placeholder - would integrate with payment gateway)
    res.json({
      success: true,
      message: 'Solicitação de saque criada com sucesso',
      data: {
        amount,
        status: 'pending',
        estimated_processing_time: '2-3 dias úteis'
      }
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({
      error: 'Erro ao processar saque'
    });
  }
});

// Create deposit (placeholder for Mercado Pago integration)
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Valor inválido'
      });
    }

    // Placeholder - would create Mercado Pago preference
    res.json({
      success: true,
      message: 'Preferência de pagamento criada',
      data: {
        payment_url: 'https://mercadopago.com/checkout/...',
        amount
      }
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({
      error: 'Erro ao criar depósito'
    });
  }
});

module.exports = router;
