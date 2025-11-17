const express = require('express');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Check if admin exists
    const result = await db.query(
      'SELECT * FROM admin_users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const admin = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Update last login
    await db.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        role: admin.role,
        permissions: admin.permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Get Admin Profile
router.get('/profile', adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, name, role, permissions, last_login, created_at FROM admin_users WHERE id = $1',
      [req.admin.adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin não encontrado' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// Get Dashboard Statistics
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    // Get total users
    const usersResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE type = 'client') as clients,
        COUNT(*) FILTER (WHERE type = 'provider') as providers,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_this_month
      FROM users`
    );

    // Get total projects
    const projectsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'open') as open,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_this_month
      FROM projects`
    );

    // Get total bids
    const bidsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_this_month
      FROM bids`
    );

    // Get payment statistics
    const paymentsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(platform_fee), 0) as total_fees,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as completed_amount
      FROM payments`
    );

    // Get recent activity
    const recentUsers = await db.query(
      'SELECT name, email, type, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );

    const recentProjects = await db.query(
      `SELECT p.id, p.title, p.budget, p.created_at, u.name as client_name 
       FROM projects p 
       JOIN users u ON p.client_id = u.id 
       ORDER BY p.created_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        users: usersResult.rows[0],
        projects: projectsResult.rows[0],
        bids: bidsResult.rows[0],
        payments: paymentsResult.rows[0],
        recentUsers: recentUsers.rows,
        recentProjects: recentProjects.rows
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ===== USER MANAGEMENT =====

// Get all users with pagination and filters
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramCounter = 1;

    if (type) {
      whereConditions.push(`type = $${paramCounter}`);
      params.push(type);
      paramCounter++;
    }

    if (status) {
      whereConditions.push(`status = $${paramCounter}`);
      params.push(status);
      paramCounter++;
    }

    if (search) {
      whereConditions.push(`(name ILIKE $${paramCounter} OR email ILIKE $${paramCounter})`);
      params.push(`%${search}%`);
      paramCounter++;
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    // Get users
    params.push(limit, offset);
    const usersResult = await db.query(
      `SELECT id, name, email, type, status, phone, location, email_verified, last_login, created_at, updated_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`,
      params
    );

    res.json({
      success: true,
      data: usersResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Get single user details
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await db.query(
      `SELECT u.*, 
        pp.title, pp.hourly_rate, pp.skills, pp.experience_years, pp.rating, pp.total_reviews, pp.total_projects
       FROM users u
       LEFT JOIN provider_profiles pp ON u.id = pp.user_id
       WHERE u.id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Get user's projects
    const projectsResult = await db.query(
      'SELECT id, title, status, budget, created_at FROM projects WHERE client_id = $1 ORDER BY created_at DESC LIMIT 10',
      [id]
    );

    // Get user's bids
    const bidsResult = await db.query(
      `SELECT b.id, b.amount, b.status, b.created_at, p.title as project_title
       FROM bids b
       JOIN projects p ON b.project_id = p.id
       WHERE b.provider_id = $1
       ORDER BY b.created_at DESC LIMIT 10`,
      [id]
    );

    res.json({
      success: true,
      data: {
        user: userResult.rows[0],
        projects: projectsResult.rows,
        bids: bidsResult.rows
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Update user status
router.patch('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const result = await db.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});

// ===== PROJECT MANAGEMENT =====

// Get all projects with filters
router.get('/projects', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramCounter = 1;

    if (status) {
      whereConditions.push(`p.status = $${paramCounter}`);
      params.push(status);
      paramCounter++;
    }

    if (category) {
      whereConditions.push(`p.category = $${paramCounter}`);
      params.push(category);
      paramCounter++;
    }

    if (search) {
      whereConditions.push(`(p.title ILIKE $${paramCounter} OR p.description ILIKE $${paramCounter})`);
      params.push(`%${search}%`);
      paramCounter++;
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM projects p ${whereClause}`,
      params
    );

    // Get projects
    params.push(limit, offset);
    const projectsResult = await db.query(
      `SELECT p.*, u.name as client_name, u.email as client_email,
        (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bids_count
       FROM projects p
       JOIN users u ON p.client_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`,
      params
    );

    res.json({
      success: true,
      data: projectsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

// Update project status
router.patch('/projects/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'in_progress', 'completed', 'cancelled', 'deleted'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const result = await db.query(
      'UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// Delete project
router.delete('/projects/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({
      success: true,
      message: 'Projeto excluído com sucesso'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Erro ao excluir projeto' });
  }
});

// ===== PAYMENT MANAGEMENT =====

// Get all payments with filters
router.get('/payments', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];
    let paramCounter = 1;

    if (status) {
      whereConditions.push(`p.status = $${paramCounter}`);
      params.push(status);
      paramCounter++;
    }

    if (search) {
      whereConditions.push(`(payer.name ILIKE $${paramCounter} OR receiver.name ILIKE $${paramCounter})`);
      params.push(`%${search}%`);
      paramCounter++;
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total 
       FROM payments p
       JOIN users payer ON p.payer_id = payer.id
       JOIN users receiver ON p.receiver_id = receiver.id
       ${whereClause}`,
      params
    );

    // Get payments
    params.push(limit, offset);
    const paymentsResult = await db.query(
      `SELECT p.*, 
        payer.name as payer_name, payer.email as payer_email,
        receiver.name as receiver_name, receiver.email as receiver_email
       FROM payments p
       JOIN users payer ON p.payer_id = payer.id
       JOIN users receiver ON p.receiver_id = receiver.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`,
      params
    );

    res.json({
      success: true,
      data: paymentsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Erro ao buscar pagamentos' });
  }
});

// ===== SYSTEM SETTINGS =====

// Get all system settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM system_settings ORDER BY key'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
});

// Update system setting
router.put('/settings/:key', adminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const { value, description, is_public } = req.body;

    const result = await db.query(
      `UPDATE system_settings 
       SET value = $1, description = COALESCE($2, description), is_public = COALESCE($3, is_public), updated_at = NOW()
       WHERE key = $4
       RETURNING *`,
      [value, description, is_public, key]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuração não encontrada' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Erro ao atualizar configuração' });
  }
});

// Create new system setting
router.post('/settings', adminAuth, async (req, res) => {
  try {
    const { key, value, description, is_public } = req.body;

    if (!key || !value) {
      return res.status(400).json({ error: 'Key e value são obrigatórios' });
    }

    const result = await db.query(
      `INSERT INTO system_settings (key, value, description, is_public)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [key, value, description || '', is_public || false]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Configuração já existe' });
    }
    console.error('Create setting error:', error);
    res.status(500).json({ error: 'Erro ao criar configuração' });
  }
});

module.exports = router;
