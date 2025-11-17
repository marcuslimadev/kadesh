const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

/**
 * POST /api/milestones
 * Create milestone for a contract
 */
router.post('/', auth, async (req, res) => {
  try {
    const { contract_id, title, description, amount, due_date } = req.body;
    const userId = req.user.userId;

    // Validate
    if (!contract_id || !title || !amount) {
      return res.status(400).json({ error: 'contract_id, title e amount são obrigatórios' });
    }

    // Verify user is the client of the contract
    const contract = await db.query(
      'SELECT * FROM contracts WHERE id = $1 AND client_id = $2',
      [contract_id, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(403).json({ error: 'Apenas o cliente pode criar milestones' });
    }

    // Create milestone
    const milestone = await db.query(
      `INSERT INTO milestones (contract_id, title, description, amount, due_date, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())
       RETURNING *`,
      [contract_id, title, description || null, amount, due_date || null]
    );

    // Update contract escrow total
    await db.query(
      'UPDATE contracts SET escrow_enabled = TRUE, escrow_total = escrow_total + $1, updated_at = NOW() WHERE id = $2',
      [amount, contract_id]
    );

    res.status(201).json({
      success: true,
      milestone: milestone.rows[0]
    });
  } catch (error) {
    console.error('Error creating milestone:', error);
    res.status(500).json({ error: 'Erro ao criar milestone' });
  }
});

/**
 * GET /api/milestones/contract/:contractId
 * List all milestones for a contract
 */
router.get('/contract/:contractId', auth, async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.userId;

    // Verify user is involved in contract
    const contract = await db.query(
      'SELECT * FROM contracts WHERE id = $1 AND (client_id = $2 OR provider_id = $2)',
      [contractId, userId]
    );

    if (contract.rows.length === 0) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const milestones = await db.query(
      `SELECT * FROM milestones WHERE contract_id = $1 ORDER BY created_at ASC`,
      [contractId]
    );

    res.json({
      success: true,
      milestones: milestones.rows
    });
  } catch (error) {
    console.error('Error listing milestones:', error);
    res.status(500).json({ error: 'Erro ao listar milestones' });
  }
});

/**
 * PUT /api/milestones/:id/submit
 * Provider submits milestone for approval
 */
router.put('/:id/submit', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify milestone exists and user is provider
    const milestone = await db.query(
      `SELECT m.*, c.provider_id FROM milestones m
       JOIN contracts c ON m.contract_id = c.id
       WHERE m.id = $1 AND c.provider_id = $2`,
      [id, userId]
    );

    if (milestone.rows.length === 0) {
      return res.status(403).json({ error: 'Apenas o provider pode submeter' });
    }

    if (milestone.rows[0].status !== 'pending' && milestone.rows[0].status !== 'in_progress') {
      return res.status(400).json({ error: 'Milestone não pode ser submetido neste estado' });
    }

    const updated = await db.query(
      `UPDATE milestones SET status = 'submitted', submitted_at = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      milestone: updated.rows[0]
    });
  } catch (error) {
    console.error('Error submitting milestone:', error);
    res.status(500).json({ error: 'Erro ao submeter milestone' });
  }
});

/**
 * PUT /api/milestones/:id/approve
 * Client approves milestone
 */
router.put('/:id/approve', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify milestone exists and user is client
    const milestone = await db.query(
      `SELECT m.*, c.client_id, c.id as contract_id FROM milestones m
       JOIN contracts c ON m.contract_id = c.id
       WHERE m.id = $1 AND c.client_id = $2`,
      [id, userId]
    );

    if (milestone.rows.length === 0) {
      return res.status(403).json({ error: 'Apenas o cliente pode aprovar' });
    }

    if (milestone.rows[0].status !== 'submitted') {
      return res.status(400).json({ error: 'Milestone deve estar submetido para aprovação' });
    }

    const updated = await db.query(
      `UPDATE milestones SET status = 'approved', approved_at = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      milestone: updated.rows[0]
    });
  } catch (error) {
    console.error('Error approving milestone:', error);
    res.status(500).json({ error: 'Erro ao aprovar milestone' });
  }
});

/**
 * PUT /api/milestones/:id/reject
 * Client rejects milestone
 */
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    // Verify milestone exists and user is client
    const milestone = await db.query(
      `SELECT m.*, c.client_id FROM milestones m
       JOIN contracts c ON m.contract_id = c.id
       WHERE m.id = $1 AND c.client_id = $2`,
      [id, userId]
    );

    if (milestone.rows.length === 0) {
      return res.status(403).json({ error: 'Apenas o cliente pode rejeitar' });
    }

    if (milestone.rows[0].status !== 'submitted') {
      return res.status(400).json({ error: 'Milestone deve estar submetido para rejeição' });
    }

    const updated = await db.query(
      `UPDATE milestones SET status = 'rejected', rejection_reason = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [reason || null, id]
    );

    res.json({
      success: true,
      milestone: updated.rows[0]
    });
  } catch (error) {
    console.error('Error rejecting milestone:', error);
    res.status(500).json({ error: 'Erro ao rejeitar milestone' });
  }
});

/**
 * PUT /api/milestones/:id/release
 * Release payment for approved milestone
 */
router.put('/:id/release', auth, async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify milestone exists and user is client
    const milestone = await client.query(
      `SELECT m.*, c.client_id, c.provider_id, c.id as contract_id FROM milestones m
       JOIN contracts c ON m.contract_id = c.id
       WHERE m.id = $1 AND c.client_id = $2`,
      [id, userId]
    );

    if (milestone.rows.length === 0) {
      throw new Error('Apenas o cliente pode liberar pagamento');
    }

    const m = milestone.rows[0];

    if (m.status !== 'approved') {
      throw new Error('Milestone deve estar aprovado para liberação');
    }

    // Update milestone
    await client.query(
      `UPDATE milestones SET status = 'released', released_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [id]
    );

    // Create wallet transaction for provider
    await client.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, description, reference_type, reference_id, created_at)
       VALUES ($1, 'credit', $2, $3, 'milestone', $4, NOW())`,
      [m.provider_id, m.amount, `Milestone liberado: ${m.title}`, id]
    );

    // Update provider wallet balance
    await client.query(
      `INSERT INTO wallets (user_id, balance, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + $2, updated_at = NOW()`,
      [m.provider_id, m.amount]
    );

    await client.query('COMMIT');

    const updated = await db.query('SELECT * FROM milestones WHERE id = $1', [id]);

    res.json({
      success: true,
      milestone: updated.rows[0],
      message: 'Pagamento liberado com sucesso'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error releasing milestone:', error);
    res.status(500).json({ error: error.message || 'Erro ao liberar pagamento' });
  } finally {
    client.release();
  }
});

/**
 * DELETE /api/milestones/:id
 * Delete milestone (only if pending)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify milestone exists and user is client
    const milestone = await db.query(
      `SELECT m.*, c.client_id FROM milestones m
       JOIN contracts c ON m.contract_id = c.id
       WHERE m.id = $1 AND c.client_id = $2`,
      [id, userId]
    );

    if (milestone.rows.length === 0) {
      return res.status(403).json({ error: 'Apenas o cliente pode deletar' });
    }

    if (milestone.rows[0].status !== 'pending') {
      return res.status(400).json({ error: 'Apenas milestones pendentes podem ser deletados' });
    }

    // Update contract escrow total
    await db.query(
      'UPDATE contracts SET escrow_total = escrow_total - $1, updated_at = NOW() WHERE id = $2',
      [milestone.rows[0].amount, milestone.rows[0].contract_id]
    );

    await db.query('DELETE FROM milestones WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Milestone deletado com sucesso'
    });
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).json({ error: 'Erro ao deletar milestone' });
  }
});

module.exports = router;
