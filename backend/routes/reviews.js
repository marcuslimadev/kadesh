const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

/**
 * GET /api/reviews
 * List all reviews for a specific user (with query param user_id)
 */
router.get('/', async (req, res) => {
  try {
    const { user_id, limit = 10, offset = 0 } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id é obrigatório'
      });
    }

    const reviews = await db.query(
      `SELECT 
        r.id, r.contract_id, r.reviewer_id, r.reviewed_id, r.rating, r.comment, r.is_public, r.created_at,
        u_reviewer.name as reviewer_name,
        u_reviewer.avatar as reviewer_avatar,
        c.project_id
      FROM reviews r
      JOIN users u_reviewer ON r.reviewer_id = u_reviewer.id
      JOIN contracts c ON r.contract_id = c.id
      WHERE r.reviewed_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3`,
      [user_id, parseInt(limit), parseInt(offset)]
    );

    const countResult = await db.query(
      'SELECT COUNT(*) as total FROM reviews WHERE reviewed_id = $1',
      [user_id]
    );

    const avgRatingResult = await db.query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE reviewed_user_id = $1',
      [user_id]
    );

    res.json({
      success: true,
      data: reviews.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        avg_rating: parseFloat(avgRatingResult.rows[0].avg_rating || 0)
      }
    });
  } catch (error) {
    console.error('[Reviews] Error listing reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar avaliações',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/reviews/:id
 * Get review details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const review = await db.query(
      `SELECT 
        r.id, r.contract_id, r.reviewer_id, r.reviewed_id, r.rating, r.comment, r.is_public, r.created_at,
        u_reviewer.name as reviewer_name,
        u_reviewer.email as reviewer_email,
        u_reviewer.avatar as reviewer_avatar,
        u_reviewed.name as reviewed_name,
        p.title as project_title
      FROM reviews r
      JOIN users u_reviewer ON r.reviewer_id = u_reviewer.id
      JOIN users u_reviewed ON r.reviewed_id = u_reviewed.id
      JOIN contracts c ON r.contract_id = c.id
      JOIN projects p ON c.project_id = p.id
      WHERE r.id = $1`,
      [id]
    );

    if (review.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada'
      });
    }

    res.json({
      success: true,
      data: review.rows[0]
    });
  } catch (error) {
    console.error('[Reviews] Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar avaliação',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/reviews
 * Create review after contract completion
 * Body: { contract_id, reviewed_user_id, rating, comment }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { contract_id, reviewed_user_id, rating, comment } = req.body;
    const reviewerId = req.user.userId;

    // Validation
    if (!contract_id || !reviewed_user_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'contract_id, reviewed_user_id e rating são obrigatórios'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating deve estar entre 1 e 5'
      });
    }

    if (reviewerId === parseInt(reviewed_user_id)) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode avaliar a si mesmo'
      });
    }

    // Verify contract is completed and involves both users
    const contract = await db.query(
      `SELECT * FROM contracts 
       WHERE id = $1 AND status = 'completed'
       AND ((client_id = $2 AND provider_id = $3) OR (client_id = $3 AND provider_id = $2))`,
      [contract_id, reviewerId, reviewed_user_id]
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contrato não encontrado, não completo, ou você não está envolvido'
      });
    }

    // Check if review already exists
    const existing = await db.query(
      `SELECT id FROM reviews 
       WHERE contract_id = $1 AND reviewer_id = $2 AND reviewed_id = $3`,
      [contract_id, reviewerId, reviewed_user_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Você já avaliou este usuário neste contrato'
      });
    }

    // Create review
    const review = await db.query(
      `INSERT INTO reviews (contract_id, reviewer_id, reviewed_id, rating, comment, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [contract_id, reviewerId, reviewed_user_id, rating, comment || null]
    );

    res.status(201).json({
      success: true,
      message: 'Avaliação criada com sucesso',
      data: review.rows[0]
    });
  } catch (error) {
    console.error('[Reviews] Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar avaliação',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * PUT /api/reviews/:id
 * Update review (only by reviewer)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Verify review exists and user is the reviewer
    const review = await db.query(
      'SELECT * FROM reviews WHERE id = $1 AND reviewer_id = $2',
      [id, userId]
    );

    if (review.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada ou você não tem permissão'
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating deve estar entre 1 e 5'
      });
    }

    // Update review
    const updated = await db.query(
      `UPDATE reviews SET rating = COALESCE($1, rating), comment = COALESCE($2, comment), updated_at = NOW()
      WHERE id = $3
      RETURNING *`,
      [rating || null, comment || null, id]
    );

    res.json({
      success: true,
      message: 'Avaliação atualizada com sucesso',
      data: updated.rows[0]
    });
  } catch (error) {
    console.error('[Reviews] Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar avaliação',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/reviews/:id
 * Delete review (only by reviewer)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Verify review exists and user is the reviewer
    const review = await db.query(
      'SELECT * FROM reviews WHERE id = $1 AND reviewer_id = $2',
      [id, userId]
    );

    if (review.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Avaliação não encontrada ou você não tem permissão'
      });
    }

    // Delete review
    await db.query('DELETE FROM reviews WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Avaliação deletada com sucesso'
    });
  } catch (error) {
    console.error('[Reviews] Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar avaliação',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
