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

module.exports = router;

// ===== DISPUTE MANAGEMENT =====
// List disputes grouped by contract
router.get('/disputes', adminAuth, async (req, res) => {
  try {
    const { status } = req.query // optional: 'open' | 'closed'

    const rows = await db.query(
      `WITH base AS (
         SELECT 
           c.id AS contract_id,
           c.project_id,
           c.client_id,
           c.provider_id,
           c.amount,
           c.status AS contract_status,
           p.title AS project_title,
           uc.name AS client_name,
           up.name AS provider_name,
           MAX(allm.created_at) AS last_activity,
           EXISTS (
             SELECT 1 FROM messages m2 
             WHERE m2.contract_id = c.id 
               AND m2.is_system_message = TRUE 
               AND m2.content LIKE '[DISPUTE_CLOSED%'
           ) AS is_closed
         FROM contracts c
         JOIN projects p ON c.project_id = p.id
         JOIN users uc ON c.client_id = uc.id
         JOIN users up ON c.provider_id = up.id
         JOIN messages m ON m.contract_id = c.id AND m.is_system_message = TRUE AND m.content LIKE '[DISPUTE%'
         JOIN messages allm ON allm.contract_id = c.id
         GROUP BY c.id, p.title, uc.name, up.name
       )
       SELECT * FROM base
       ${status === 'open' ? 'WHERE NOT is_closed' : status === 'closed' ? 'WHERE is_closed' : ''}
       ORDER BY last_activity DESC`
    )

    res.json({ success: true, data: rows.rows })
  } catch (error) {
    console.error('Get disputes error:', error)
    res.status(500).json({ error: 'Erro ao buscar disputas' })
  }
})

// Get details for a specific contract dispute
router.get('/disputes/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params

    const contractResult = await db.query(
      `SELECT 
         c.*, p.title AS project_title, p.description AS project_description,
         uc.name AS client_name, uc.email AS client_email,
         up.name AS provider_name, up.email AS provider_email
       FROM contracts c
       JOIN projects p ON c.project_id = p.id
       JOIN users uc ON c.client_id = uc.id
       JOIN users up ON c.provider_id = up.id
       WHERE c.id = $1`,
      [id]
    )

    if (contractResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' })
    }

    const messagesResult = await db.query(
      `SELECT id, content, created_at
       FROM messages
       WHERE contract_id = $1 AND is_system_message = TRUE AND content LIKE '[DISPUTE%'
       ORDER BY created_at ASC`,
      [id]
    )

    const isClosed = messagesResult.rows.some(m => m.content.startsWith('[DISPUTE_CLOSED'))

    res.json({
      success: true,
      data: {
        contract: contractResult.rows[0],
        disputeMessages: messagesResult.rows,
        isClosed
      }
    })
  } catch (error) {
    console.error('Get dispute details error:', error)
    res.status(500).json({ error: 'Erro ao buscar disputa' })
  }
})

// Resolve a contract dispute
router.post('/disputes/:id/resolve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { action, notes } = req.body // action: release | refund | dismiss

    if (!['release', 'refund', 'dismiss'].includes(action)) {
      return res.status(400).json({ error: 'Ação inválida' })
    }

    const { createWalletTransaction } = require('../services/walletService')

    await db.transaction(async (client) => {
      const contractResult = await client.query('SELECT * FROM contracts WHERE id = $1 FOR UPDATE', [id])
      if (contractResult.rows.length === 0) {
        const e = new Error('Contrato não encontrado')
        e.status = 404
        throw e
      }

      const contract = contractResult.rows[0]
      const amount = Number(contract.amount)

      if (action === 'release') {
        // Credit provider, debit client
        await createWalletTransaction(
          contract.provider_id,
          {
            amount: amount,
            type: 'escrow_release',
            description: 'Liberação de pagamento do contrato',
            referenceType: 'contract',
            referenceId: contract.id
          },
          client
        )

        await createWalletTransaction(
          contract.client_id,
          {
            amount: -amount,
            type: 'payment_sent',
            description: 'Pagamento de contrato (liberação)',
            referenceType: 'contract',
            referenceId: contract.id
          },
          client
        )

        // Ensure end_date is set
        await client.query(
          `UPDATE contracts SET end_date = COALESCE(end_date, NOW()), updated_at = NOW() WHERE id = $1`,
          [id]
        )
      } else if (action === 'refund') {
        // Refund client (no debit to provider since funds aren't held here)
        await createWalletTransaction(
          contract.client_id,
          {
            amount: amount,
            type: 'refund',
            description: 'Reembolso de contrato',
            referenceType: 'contract',
            referenceId: contract.id
          },
          client
        )

        // Mark as cancelled
        await client.query(
          `UPDATE contracts SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
          [id]
        )
      }

      // Register resolution system message
      const resolutionTag = `[DISPUTE_CLOSED:${action.toUpperCase()}]`
      const messageContent = `${resolutionTag} ${notes || ''}`.trim()

      await client.query(
        `INSERT INTO messages (contract_id, sender_id, receiver_id, content, is_system_message)
         VALUES ($1, $2, $3, $4, TRUE)`,
        [
          id,
          contract.client_id,
          contract.provider_id,
          messageContent
        ]
      )
    })

    res.json({ success: true, message: 'Disputa resolvida com sucesso' })
  } catch (error) {
    console.error('Resolve dispute error:', error)
    res.status(error.status || 500).json({ error: error.message || 'Erro ao resolver disputa' })
  }
})
