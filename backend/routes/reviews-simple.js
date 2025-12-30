/**
 * Simple Reviews System for MySQL
 * Uses project_id instead of contract_id since contracts table doesn't exist in MySQL
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

/**
 * POST /api/reviews-simple
 * Create a review after project completion
 */
router.post('/', auth, async (req, res) => {
  try {
    const { project_id, reviewed_id, rating, comment, is_public = true } = req.body;
    const reviewer_id = req.user.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating deve ser entre 1 e 5'
      });
    }

    // Validate project exists and payment was released
    const projectResult = await db.query(
      `SELECT * FROM projects 
       WHERE id = ? AND payment_status = 'released'
         AND (contractor_id = ? OR winner_id = ?)`,
      [project_id, reviewer_id, reviewer_id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Projeto não encontrado ou pagamento ainda não foi liberado. Só é possível avaliar após a conclusão.'
      });
    }

    const project = projectResult.rows[0];

    // Determine who is being reviewed
    const isContractor = project.contractor_id === reviewer_id;
    const actualReviewedId = reviewed_id || (isContractor ? project.winner_id : project.contractor_id);

    // Check if review already exists
    const existingReview = await db.query(
      `SELECT id FROM reviews WHERE project_id = ? AND reviewer_id = ?`,
      [project_id, reviewer_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Você já avaliou este projeto'
      });
    }

    // Create review
    const result = await db.query(
      `INSERT INTO reviews (project_id, reviewer_id, reviewed_id, rating, comment, is_public, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [project_id, reviewer_id, actualReviewedId, rating, comment || null, is_public ? 1 : 0]
    );

    // Get inserted ID (MySQL returns insertId)
    const reviewId = result.insertId;

    // Create notification for reviewed user
    await db.query(
      `INSERT INTO notifications (user_id, type, title, content, action_url, data, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        actualReviewedId,
        'review',
        '⭐ Nova Avaliação Recebida!',
        `Você recebeu uma avaliação de ${rating} ${rating === 1 ? 'estrela' : 'estrelas'} no projeto "${project.title}".`,
        `/projects/${project_id}`,
        JSON.stringify({ projectId: project_id, reviewId: reviewId, rating: rating })
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Avaliação criada com sucesso',
      data: {
        id: reviewId,
        project_id,
        reviewer_id,
        reviewed_id: actualReviewedId,
        rating,
        comment
      }
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
 * GET /api/reviews-simple/user/:userId
 * Get all reviews received by a user (rating average + list)
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // Get average rating
    const avgResult = await db.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
       FROM reviews WHERE reviewed_id = ? AND is_public = 1`,
      [userId]
    );

    const avgRating = Number(avgResult.rows[0]?.avg_rating || 0).toFixed(1);
    const totalReviews = Number(avgResult.rows[0]?.total_reviews || 0);

    // Get reviews with reviewer details
    const reviewsResult = await db.query(
      `SELECT 
        r.id, r.project_id, r.rating, r.comment, r.created_at,
        u.id as reviewer_id, u.name as reviewer_name, u.avatar as reviewer_avatar,
        p.title as project_title
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      LEFT JOIN projects p ON r.project_id = p.id
      WHERE r.reviewed_id = ? AND r.is_public = 1
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        avgRating: Number(avgRating),
        totalReviews,
        reviews: reviewsResult.rows
      },
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: totalReviews
      }
    });
  } catch (error) {
    console.error('[Reviews] Error getting user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar avaliações',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/reviews-simple/project/:projectId
 * Get all reviews for a project (both contractor and provider reviews)
 */
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const reviewsResult = await db.query(
      `SELECT 
        r.id, r.reviewer_id, r.reviewed_id, r.rating, r.comment, r.is_public, r.created_at,
        reviewer.name as reviewer_name, reviewer.avatar as reviewer_avatar,
        reviewed.name as reviewed_name, reviewed.avatar as reviewed_avatar
      FROM reviews r
      JOIN users reviewer ON r.reviewer_id = reviewer.id
      JOIN users reviewed ON r.reviewed_id = reviewed.id
      WHERE r.project_id = ?
      ORDER BY r.created_at DESC`,
      [projectId]
    );

    res.json({
      success: true,
      data: reviewsResult.rows,
      total: reviewsResult.rows.length
    });
  } catch (error) {
    console.error('[Reviews] Error getting project reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar avaliações do projeto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
