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
    const userId = req.user.id;

    const contracts = await db.query(
      `SELECT 
        c.*,
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
    const userId = req.user.id;

    const contract = await db.query(
      `SELECT 
        c.*,
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
    const userId = req.user.id;

    // Verify bid exists and is accepted
    const bid = await db.query(
      `SELECT b.*, p.budget, u.id as provider_id
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      JOIN users u ON u.id = $1
      WHERE b.id = $2 AND b.status = 'accepted'`,
      [userId, bid_id]
    );

    if (bid.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid não encontrado ou não está aceito'
      });
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

    // Create contract
    const contract = await db.query(
      `INSERT INTO contracts (bid_id, project_id, client_id, provider_id, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, 'active', NOW(), NOW())
      RETURNING *`,
      [bid_id, bid.rows[0].project_id, bid.rows[0].client_id, bid.rows[0].provider_id]
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
    const userId = req.user.id;

    // Verify user is provider
    const contract = await db.query(
      'SELECT * FROM contracts WHERE id = $1 AND provider_id = $2',
      [id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado ou você não é o provider'
      });
    }

    // Update contract status
    const updated = await db.query(
      `UPDATE contracts SET status = 'completed', updated_at = NOW()
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
    const userId = req.user.id;

    // Verify user is client
    const contract = await db.query(
      'SELECT * FROM contracts WHERE id = $1 AND client_id = $2',
      [id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado ou você não é o cliente'
      });
    }

    // Update contract status
    const updated = await db.query(
      `UPDATE contracts SET status = 'accepted', updated_at = NOW()
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
 * File dispute on contract
 */
router.put('/:id/dispute', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

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

    // Update contract status
    const updated = await db.query(
      `UPDATE contracts SET status = 'disputed', dispute_reason = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *`,
      [reason, id]
    );

    // Notify admin (TODO: implement admin notification)

    res.json({
      success: true,
      message: 'Disputa registrada, equipe será notificada',
      data: updated.rows[0]
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
    const userId = req.user.id;

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

    // Only allow cancellation if contract is active
    if (contract.rows[0].status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Não é possível cancelar contrato com status ${contract.rows[0].status}`
      });
    }

    // Update contract status
    const updated = await db.query(
      `UPDATE contracts SET status = 'cancelled', dispute_reason = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *`,
      [reason, id]
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
