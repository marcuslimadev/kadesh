const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const { validateProjectData } = require('../utils/validators');

const router = express.Router();

// Get all projects (with filters)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      budget_min, 
      budget_max, 
      status = 'open',
      limit = 20, 
      offset = 0,
      search 
    } = req.query;

    let query = `
      SELECT 
        p.*,
        u.name as client_name,
        u.email as client_email,
        COUNT(b.id) as bid_count
      FROM projects p
      JOIN users u ON p.client_id = u.id
      LEFT JOIN bids b ON p.id = b.project_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (status) {
      query += ` AND p.status = $${++paramCount}`;
      params.push(status);
    }

    if (category) {
      query += ` AND p.category = $${++paramCount}`;
      params.push(category);
    }

    if (budget_min) {
      query += ` AND p.budget >= $${++paramCount}`;
      params.push(parseFloat(budget_min));
    }

    if (budget_max) {
      query += ` AND p.budget <= $${++paramCount}`;
      params.push(parseFloat(budget_max));
    }

    if (search) {
      query += ` AND (p.title ILIKE $${++paramCount} OR p.description ILIKE $${++paramCount})`;
      params.push(`%${search}%`, `%${search}%`);
      paramCount++;
    }

    query += `
      GROUP BY p.id, u.name, u.email
      ORDER BY p.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      projects: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        p.*,
        u.name as client_name,
        u.email as client_email,
        COUNT(b.id) as bid_count
      FROM projects p
      JOIN users u ON p.client_id = u.id
      LEFT JOIN bids b ON p.id = b.project_id
      WHERE p.id = $1
      GROUP BY p.id, u.name, u.email
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    res.json({
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      skills_required
    } = req.body;

    // Validate project data
    const validation = validateProjectData({
      title,
      description,
      category,
      budget,
      deadline
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.errors.join(', ')
      });
    }

    // Create project
    const result = await db.query(`
      INSERT INTO projects (
        client_id, title, description, category, budget, deadline,
        requirements, skills_required, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open', NOW(), NOW())
      RETURNING *
    `, [
      req.user.userId,
      title,
      description,
      category,
      parseFloat(budget),
      deadline,
      requirements || null,
      skills_required || null
    ]);

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      skills_required,
      status
    } = req.body;

    // Check if project exists and user owns it
    const projectCheck = await db.query(
      'SELECT client_id FROM projects WHERE id = $1',
      [id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    if (projectCheck.rows[0].client_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Você não tem permissão para editar este projeto'
      });
    }

    // Update project
    const result = await db.query(`
      UPDATE projects SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        category = COALESCE($4, category),
        budget = COALESCE($5, budget),
        deadline = COALESCE($6, deadline),
        requirements = COALESCE($7, requirements),
        skills_required = COALESCE($8, skills_required),
        status = COALESCE($9, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [
      id,
      title,
      description,
      category,
      budget ? parseFloat(budget) : null,
      deadline,
      requirements,
      skills_required,
      status
    ]);

    res.json({
      message: 'Projeto atualizado com sucesso',
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists and user owns it
    const projectCheck = await db.query(
      'SELECT client_id, status FROM projects WHERE id = $1',
      [id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    const project = projectCheck.rows[0];

    if (project.client_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Você não tem permissão para deletar este projeto'
      });
    }

    // Only allow deletion if project is not in progress or completed
    if (['in_progress', 'completed', 'paid'].includes(project.status)) {
      return res.status(400).json({
        error: 'Não é possível deletar projetos em andamento ou finalizados'
      });
    }

    // Soft delete (update status instead of actually deleting)
    await db.query(
      'UPDATE projects SET status = $2, updated_at = NOW() WHERE id = $1',
      [id, 'deleted']
    );

    res.json({
      message: 'Projeto deletado com sucesso'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Get user's projects
router.get('/user/my-projects', auth, async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT 
        p.*,
        COUNT(b.id) as bid_count
      FROM projects p
      LEFT JOIN bids b ON p.id = b.project_id
      WHERE p.client_id = $1
    `;
    
    const params = [req.user.userId];
    let paramCount = 1;

    if (status && status !== 'all') {
      query += ` AND p.status = $${++paramCount}`;
      params.push(status);
    }

    query += `
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      projects: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;