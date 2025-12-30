const express = require('express');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const logger = require('../utils/logger');

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info('Tentativa de login admin', { email });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário apenas por email (sem is_admin)
    const result = await db.query(
      'SELECT id, email, password, name, user_type FROM users WHERE email = ?',
      [email]
    );

    if (result.rows.length === 0) {
      logger.warn('Usuário não encontrado', { email });
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    logger.info('Usuário encontrado', { id: user.id, email: user.email });

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Senha inválida', { email });
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se é admin pelo email (emails específicos)
    const adminEmails = [
      'admin@kadesh.local',
      'kaddesh@kaddesh.com',
      'admin@kaddesh.com'
    ];

    const isAdmin = adminEmails.includes(user.email.toLowerCase());
    
    if (!isAdmin) {
      logger.warn('Usuário não é admin', { email: user.email });
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    // Update last login (MySQL usa last_activity ao invés de last_login)
    try {
      await db.query(
        'UPDATE users SET last_activity = NOW() WHERE id = ?',
        [user.id]
      );
    } catch (updateError) {
      logger.warn('Erro ao atualizar last_activity', { error: updateError.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: user.id,
        userId: user.id,
        isAdmin: true,
        role: 'admin',
        permissions: ['all']
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    logger.info('Login admin bem-sucedido', { email: user.email, id: user.id });

    res.json({
      success: true,
      token,
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
        permissions: ['all']
      }
    });
  } catch (error) {
    logger.error('Erro no login admin', { error: error.message, stack: error.stack });
    res.status(500).json({ 
      error: 'Erro ao fazer login', 
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
  }
});

// Get Admin Profile
router.get('/profile', adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, type, is_admin, last_login, created_at FROM users WHERE id = $1 AND is_admin = true',
      [req.admin.adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin não encontrado' });
    }

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        role: 'admin',
        permissions: ['all']
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

// Get Logs
router.get('/logs', adminAuth, async (req, res) => {
  try {
    const { level, limit, since } = req.query;

    const logs = logger.getLogs({
      level,
      limit: limit ? parseInt(limit) : 100,
      since
    });

    const stats = logger.getStats();

    res.json({
      success: true,
      logs,
      stats,
      count: logs.length
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

// Clear Logs
router.delete('/logs', adminAuth, async (req, res) => {
  try {
    const count = logger.clearLogs();

    res.json({
      success: true,
      message: `${count} logs removidos`,
      cleared: count
    });
  } catch (error) {
    console.error('Clear logs error:', error);
    res.status(500).json({ error: 'Erro ao limpar logs' });
  }
});

// Get Dashboard Statistics
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    // Get total users
    const usersResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN user_type = 'contractor' THEN 1 ELSE 0 END) as clients,
        SUM(CASE WHEN user_type = 'provider' THEN 1 ELSE 0 END) as providers,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN created_at > NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) as new_this_month
      FROM users`
    );

    // Get total projects
    const projectsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN created_at > NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) as new_this_month
      FROM projects`
    );

    // Get total bids
    const bidsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN created_at > NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) as new_this_month
      FROM bids`
    );

    // Get payment statistics
    const paymentsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        COALESCE(SUM(amount), 0) as total_amount,
        0 as total_fees,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as completed,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as completed_amount
      FROM payments`
    );

    // Get recent activity
    const recentUsers = await db.query(
      'SELECT name, email, user_type as type, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );

    const recentProjects = await db.query(
      `SELECT p.id, p.title, p.max_budget as budget, p.created_at, u.name as client_name 
       FROM projects p 
       JOIN users u ON p.contractor_id = u.id 
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

    if (type) {
      whereConditions.push(`user_type = ?`);
      params.push(type);
    }

    if (status) {
      whereConditions.push(`is_active = ?`);
      params.push(status === 'active' ? 1 : 0);
    }

    if (search) {
      whereConditions.push(`(name LIKE ? OR email LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
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
      `SELECT id, name, email, user_type as type, is_active as status, phone, email_verified_at as email_verified, last_activity as last_login, created_at, updated_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
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

// Promote user to admin
router.post('/users/:id/promote', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    // Verificar se usuário existe
    const userCheck = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userCheck.rows[0];

    // Hash da senha
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar admin_user
    const result = await db.query(
      `INSERT INTO admin_users (username, password, name, email, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, name, email, role, created_at`,
      [username, hashedPassword, user.name, user.email, role]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: `${user.name} foi promovido a administrador`
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Username já existe' });
    }
    console.error('Promote user error:', error);
    res.status(500).json({ error: 'Erro ao promover usuário' });
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
    // Tabela system_settings não existe no MySQL atual
    // Retornando vazio até implementação completa
    res.json({
      success: true,
      data: [],
      message: 'Funcionalidade em desenvolvimento'
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

// Run migrations manually
router.post('/run-migrations', adminAuth, async (req, res) => {
  try {
    const { runMigrations } = require('../scripts/auto-migrate-module');
    const logs = await runMigrations();
    
    res.json({
      success: true,
      message: 'Migrações executadas com sucesso',
      logs: logs
    });
  } catch (error) {
    console.error('Run migrations error:', error);
    res.status(500).json({ 
      error: 'Erro ao executar migrações',
      details: error.message,
      logs: [error.message]
    });
  }
});

// ===== DISPUTE MANAGEMENT =====
// List disputes grouped by contract
router.get('/disputes', adminAuth, async (req, res) => {
  try {
    // Tabela contracts não existe no MySQL atual
    // Retornando vazio até implementação completa
    res.json({
      success: true,
      disputes: [],
      total: 0,
      message: 'Funcionalidade em desenvolvimento'
    });
  } catch (error) {
    console.error('Get disputes error:', error);
    res.status(500).json({ error: 'Erro ao buscar disputas' });
  }
});

// Get details for a specific contract dispute
router.get('/disputes/:id', adminAuth, async (req, res) => {
  try {
    // Tabela contracts não existe no MySQL atual
    res.json({
      success: true,
      data: null,
      message: 'Funcionalidade em desenvolvimento'
    });
  } catch (error) {
    console.error('Get dispute details error:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da disputa' });
  }
});

// Resolve a contract dispute
router.post('/disputes/:id/resolve', adminAuth, async (req, res) => {
  try {
    // Tabela contracts não existe no MySQL atual
    res.json({
      success: true,
      message: 'Funcionalidade em desenvolvimento'
    });
  } catch (error) {
    console.error('Resolve dispute error:', error);
    res.status(500).json({ error: 'Erro ao resolver disputa' });
  }
});

module.exports = router;
