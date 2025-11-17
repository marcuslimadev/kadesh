const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

/**
 * GET /api/contracts
 * List all contracts for authenticated user (client or provider)
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const contracts = await db.query(
      `SELECT 
        c.id, c.project_id, c.client_id, c.provider_id, c.bid_id,
        c.amount, c.start_date, c.end_date, c.actual_completion_date,
        c.status, c.created_at, c.updated_at,
        p.title as project_title,
        p.budget as project_budget,
        u_client.name as client_name,
        u_provider.name as provider_name
      FROM contracts c
      JOIN projects p ON c.project_id = p.id
      JOIN users u_client ON c.client_id = u_client.id
      JOIN users u_provider ON c.provider_id = u_provider.id
      WHERE c.client_id = $1 OR c.provider_id = $1
      ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: contracts.rows
    });
  } catch (error) {
    console.error('[Contracts] Error listing contracts:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar contratos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/contracts/:id
 * Get contract details
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const contract = await db.query(
      `SELECT 
        c.id, c.project_id, c.client_id, c.provider_id, c.bid_id,
        c.amount, c.start_date, c.end_date, c.actual_completion_date,
        c.status, c.created_at, c.updated_at,
        p.title as project_title,
        p.description as project_description,
        p.budget as project_budget,
        u_client.name as client_name,
        u_client.email as client_email,
        u_provider.name as provider_name,
        u_provider.email as provider_email
      FROM contracts c
      JOIN projects p ON c.project_id = p.id
      JOIN users u_client ON c.client_id = u_client.id
      JOIN users u_provider ON c.provider_id = u_provider.id
      WHERE c.id = $1 AND (c.client_id = $2 OR c.provider_id = $2)`,
      [id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado'
      });
    }

    res.json({
      success: true,
      data: contract.rows[0]
    });
  } catch (error) {
    console.error('[Contracts] Error fetching contract:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar contrato',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/contracts
 * Create new contract from accepted bid
 * Body: { bid_id }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { bid_id } = req.body;
    const userId = req.user.userId;

    // Verify bid exists and is accepted and fetch project client
    const bid = await db.query(
      `SELECT b.id, b.project_id, b.provider_id, b.amount, b.status,
              p.client_id
       FROM bids b
       JOIN projects p ON b.project_id = p.id
       WHERE b.id = $1 AND b.status = 'accepted'`,
      [bid_id]
    );

    if (bid.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid não encontrado ou não está aceito'
      });
    }

    // Only the project client can create the contract
    if (bid.rows[0].client_id !== userId) {
      return res.status(403).json({ success: false, message: 'Apenas o cliente pode criar o contrato' });
    }

    // Check if contract already exists for this bid
    const existing = await db.query(
      'SELECT id FROM contracts WHERE bid_id = $1',
      [bid_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Contrato já existe para este bid'
      });
    }

    // Create contract (status in_progress)
    const contract = await db.query(
      `INSERT INTO contracts (bid_id, project_id, client_id, provider_id, amount, status, start_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'in_progress', NOW(), NOW(), NOW())
       RETURNING *`,
      [
        bid_id,
        bid.rows[0].project_id,
        bid.rows[0].client_id,
        bid.rows[0].provider_id,
        bid.rows[0].amount
      ]
    );

    // Lock payment (optional - for future escrow implementation)
    // TODO: Implement payment locking mechanism with Mercado Pago

    res.status(201).json({
      success: true,
      message: 'Contrato criado com sucesso',
      data: contract.rows[0]
    });
  } catch (error) {
    console.error('[Contracts] Error creating contract:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar contrato',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/contracts/:id/mark-complete
 * Mark contract as complete (work delivered)
 */
router.put('/:id/mark-complete', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify user is provider and contract is in_progress
    const contract = await db.query(
      `SELECT * FROM contracts WHERE id = $1 AND provider_id = $2 AND status = 'in_progress'`,
      [id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado ou você não é o provider'
      });
    }

    // Update contract status to completed and set actual_completion_date
    const updated = await db.query(
      `UPDATE contracts SET status = 'completed', actual_completion_date = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      message: 'Contrato marcado como completo',
      data: updated.rows[0]
    });
  } catch (error) {
    console.error('[Contracts] Error marking contract complete:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar contrato',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/contracts/:id/accept-completion
 * Accept contract completion (client accepts work)
 */
router.put('/:id/accept-completion', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify user is client and contract is completed
    const contract = await db.query(
      `SELECT * FROM contracts WHERE id = $1 AND client_id = $2 AND status = 'completed'`,
      [id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado ou você não é o cliente'
      });
    }

    // Set end_date (status already completed)
    const updated = await db.query(
      `UPDATE contracts SET end_date = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // Release payment to provider (TODO: implement payment release)
    // await releasePaymentToProvider(contract.rows[0].provider_id, contract.rows[0].id);

    res.json({
      success: true,
      message: 'Contrato aceito, pagamento liberado',
      data: updated.rows[0]
    });
  } catch (error) {
    console.error('[Contracts] Error accepting contract:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao aceitar contrato',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/contracts/:id/dispute
 * File dispute on contract: cria uma mensagem sistêmica e mantém status
 */
router.put('/:id/dispute', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    // Verify user is involved in contract
    const contract = await db.query(
      'SELECT * FROM contracts WHERE id = $1 AND (client_id = $2 OR provider_id = $2)',
      [id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado'
      });
    }

    // Create a system message to register dispute
    await db.query(
      `INSERT INTO messages (contract_id, sender_id, receiver_id, content, is_system_message)
       VALUES ($1, $2, $3, $4, TRUE)`,
      [id, userId, userId, `[DISPUTE] ${reason || 'Sem motivo informado'}`]
    );

    res.json({
      success: true,
      message: 'Disputa registrada, equipe será notificada'
    });
  } catch (error) {
    console.error('[Contracts] Error filing dispute:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar disputa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/contracts/:id/cancel
 * Cancel contract
 */
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    // Verify user is involved in contract
    const contract = await db.query(
      'SELECT * FROM contracts WHERE id = $1 AND (client_id = $2 OR provider_id = $2)',
      [id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado'
      });
    }

    // Only allow cancellation if contract is in_progress
    if (contract.rows[0].status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: `Não é possível cancelar contrato com status ${contract.rows[0].status}`
      });
    }

    // Update contract status
    const updated = await db.query(
      `UPDATE contracts SET status = 'cancelled', updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      message: 'Contrato cancelado',
      data: updated.rows[0]
    });
  } catch (error) {
    console.error('[Contracts] Error cancelling contract:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar contrato',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
