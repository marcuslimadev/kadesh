const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const { validateBidData } = require('../utils/validators');

const router = express.Router();

// Get bids for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Check if project exists
    const projectCheck = await db.query(
      'SELECT id FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    const result = await db.query(`
      SELECT 
        b.*,
        u.name as provider_name,
        u.avatar_url,
        pp.rating,
        pp.total_reviews,
        pp.total_projects,
        pp.response_time_hours
      FROM bids b
      JOIN users u ON b.provider_id = u.id
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE b.project_id = $1 AND b.status != 'withdrawn'
      ORDER BY 
        CASE WHEN b.is_featured THEN 0 ELSE 1 END,
        b.created_at DESC
      LIMIT $2 OFFSET $3
    `, [projectId, limit, offset]);

    res.json({
      bids: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get project bids error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Handler para "minhas propostas" - DEVE vir ANTES de /:id
const getMyBidsHandler = async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT 
        b.*,
        p.title as project_title,
        p.status as project_status,
        p.budget as project_budget,
        u.name as client_name
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      JOIN users u ON p.client_id = u.id
      WHERE b.provider_id = $1
    `;
    
    const params = [req.user.userId];
    let paramCount = 1;

    if (status && status !== 'all') {
      query += ` AND b.status = $${++paramCount}`;
      params.push(status);
    }

    query += `
      ORDER BY b.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      bids: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('❌ [My Bids] Error:', error.message);
    res.status(500).json({
      error: 'Erro ao carregar propostas',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Rotas específicas ANTES da rota genérica /:id
router.get('/my-bids', auth, getMyBidsHandler);
router.get('/user/my-bids', auth, getMyBidsHandler);

// Create a bid
router.post('/', auth, async (req, res) => {
  try {
    const {
      project_id,
      amount,
      proposal,
      delivery_time
    } = req.body;

    // Validate bid data
    const validation = validateBidData({
      amount,
      proposal,
      delivery_time
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.errors.join(', ')
      });
    }

    // Check if project exists and is open
    const projectResult = await db.query(
      'SELECT id, client_id, status FROM projects WHERE id = $1',
      [project_id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    const project = projectResult.rows[0];

    if (project.status !== 'open') {
      return res.status(400).json({
        error: 'Este projeto não está mais aceitando propostas'
      });
    }

    // Check if user is not the project owner
    if (project.client_id === req.user.userId) {
      return res.status(400).json({
        error: 'Você não pode fazer uma proposta para seu próprio projeto'
      });
    }

    // Check if user is a provider
    const userResult = await db.query(
      'SELECT type FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows[0].type !== 'provider') {
      return res.status(403).json({
        error: 'Apenas prestadores de serviço podem fazer propostas'
      });
    }

    // Check if user already has a bid for this project
    const existingBid = await db.query(
      'SELECT id FROM bids WHERE project_id = $1 AND provider_id = $2',
      [project_id, req.user.userId]
    );

    if (existingBid.rows.length > 0) {
      return res.status(409).json({
        error: 'Você já fez uma proposta para este projeto'
      });
    }

    // Create the bid
    const result = await db.query(`
      INSERT INTO bids (
        project_id, provider_id, amount, proposal, delivery_time,
        status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())
      RETURNING *
    `, [
      project_id,
      req.user.userId,
      parseFloat(amount),
      proposal,
      delivery_time ? parseInt(delivery_time) : null
    ]);

    res.status(201).json({
      message: 'Proposta enviada com sucesso',
      bid: result.rows[0]
    });

  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Update a bid
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, proposal, delivery_time } = req.body;

    // Check if bid exists and user owns it
    const bidResult = await db.query(`
      SELECT b.*, p.status as project_status
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      WHERE b.id = $1
    `, [id]);

    if (bidResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Proposta não encontrada'
      });
    }

    const bid = bidResult.rows[0];

    if (bid.provider_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Você não tem permissão para editar esta proposta'
      });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({
        error: 'Só é possível editar propostas pendentes'
      });
    }

    if (bid.project_status !== 'open') {
      return res.status(400).json({
        error: 'Este projeto não está mais aceitando alterações'
      });
    }

    // Validate updated data if provided
    if (amount || proposal || delivery_time) {
      const validation = validateBidData({
        amount: amount || bid.amount,
        proposal: proposal || bid.proposal,
        delivery_time: delivery_time || bid.delivery_time
      });

      if (!validation.isValid) {
        return res.status(400).json({
          error: validation.errors.join(', ')
        });
      }
    }

    // Update the bid
    const result = await db.query(`
      UPDATE bids SET
        amount = COALESCE($2, amount),
        proposal = COALESCE($3, proposal),
        delivery_time = COALESCE($4, delivery_time),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [
      id,
      amount ? parseFloat(amount) : null,
      proposal,
      delivery_time ? parseInt(delivery_time) : null
    ]);

    res.json({
      message: 'Proposta atualizada com sucesso',
      bid: result.rows[0]
    });

  } catch (error) {
    console.error('Update bid error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Withdraw a bid
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if bid exists and user owns it
    const bidResult = await db.query(
      'SELECT provider_id, status FROM bids WHERE id = $1',
      [id]
    );

    if (bidResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Proposta não encontrada'
      });
    }

    const bid = bidResult.rows[0];

    if (bid.provider_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Você não tem permissão para retirar esta proposta'
      });
    }

    if (bid.status === 'accepted') {
      return res.status(400).json({
        error: 'Não é possível retirar uma proposta aceita'
      });
    }

    if (bid.status === 'withdrawn') {
      return res.status(400).json({
        error: 'Esta proposta já foi retirada'
      });
    }

    // Withdraw the bid
    await db.query(
      'UPDATE bids SET status = $2, updated_at = NOW() WHERE id = $1',
      [id, 'withdrawn']
    );

    res.json({
      message: 'Proposta retirada com sucesso'
    });

  } catch (error) {
    console.error('Withdraw bid error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Accept a bid (client only)
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get bid and project details
    const bidResult = await db.query(`
      SELECT 
        b.*,
        p.client_id,
        p.status as project_status,
        p.title as project_title
      FROM bids b
      JOIN projects p ON b.project_id = p.id
      WHERE b.id = $1
    `, [id]);

    if (bidResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Proposta não encontrada'
      });
    }

    const bid = bidResult.rows[0];

    // Check if user is the project owner
    if (bid.client_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Apenas o dono do projeto pode aceitar propostas'
      });
    }

    if (bid.project_status !== 'open') {
      return res.status(400).json({
        error: 'Este projeto não está mais aceitando propostas'
      });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({
        error: 'Esta proposta não pode mais ser aceita'
      });
    }

    // Start transaction
    await db.transaction(async (client) => {
      // Accept the bid
      await client.query(
        'UPDATE bids SET status = $2, updated_at = NOW() WHERE id = $1',
        [id, 'accepted']
      );

      // Reject all other bids for this project
      await client.query(
        'UPDATE bids SET status = $2, updated_at = NOW() WHERE project_id = $3 AND id != $1',
        [id, 'rejected', bid.project_id]
      );

      // Update project status
      await client.query(
        'UPDATE projects SET status = $2, updated_at = NOW() WHERE id = $1',
        [bid.project_id, 'in_progress']
      );

      // Create contract
      await client.query(`
        INSERT INTO contracts (
          project_id, client_id, provider_id, bid_id, amount,
          status, start_date, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, 'in_progress', NOW(), NOW(), NOW())
      `, [
        bid.project_id,
        bid.client_id,
        bid.provider_id,
        id,
        bid.amount
      ]);
    });

    res.json({
      message: 'Proposta aceita com sucesso! O projeto está em andamento.'
    });

  } catch (error) {
    console.error('Accept bid error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
