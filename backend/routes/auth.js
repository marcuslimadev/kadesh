const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { validateEmail } = require('../utils/validators');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Novo modelo: perfil unificado, o switch do frontend decide a visão (cliente/prestador)

    // Validations
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Email inválido'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já está em uso'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with unified type (frontend switch controls view mode)
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, type, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, type, created_at`,
      [name, email, passwordHash, 'unified']
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: user.type
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('❌ [Register] Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validations
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Email inválido'
      });
    }

    // Find user
    const result = await db.query(
      `SELECT id, name, email, password_hash, type, status, created_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Email ou senha incorretos'
      });
    }

    const user = result.rows[0];
    
    // Check if user is admin (type = 'admin')
    const isAdmin = user.type === 'admin';

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        error: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Email ou senha incorretos'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        type: user.type,
        isAdmin: isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        status: user.status,
        created_at: user.created_at,
        isAdmin: isAdmin
      },
      token
    });

  } catch (error) {
    console.error('❌ [Register] Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, type, status, created_at, last_login
       FROM users WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];
    const isAdmin = user.type === 'admin';

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        status: user.status,
        created_at: user.created_at,
        last_login: user.last_login,
        isAdmin: isAdmin
      }
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Logout (optional - if you want to track logout)
router.post('/logout', auth, async (req, res) => {
  try {
    // You could implement token blacklisting here if needed
    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Forgot password - request reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Check if user exists
    const result = await db.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    );

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({ 
        success: true, 
        message: 'Se o email existir, você receberá instruções para redefinir sua senha.' 
      });
    }

    const user = result.rows[0];

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store token in database (optional - for extra security)
    await db.query(
      `UPDATE users SET 
        password_reset_token = $1, 
        password_reset_expires = NOW() + INTERVAL '1 hour',
        updated_at = NOW()
       WHERE id = $2`,
      [resetToken, user.id]
    );

    // In production, send email here
    // For now, log the reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log(`[Password Reset] Link para ${email}: ${resetLink}`);

    res.json({ 
      success: true, 
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.',
      // DEV ONLY - remove in production:
      devResetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});

// Reset password - with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    // Check if token matches stored token
    const result = await db.query(
      `SELECT id, email FROM users 
       WHERE id = $1 
       AND password_reset_token = $2 
       AND password_reset_expires > NOW()`,
      [decoded.userId, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    await db.query(
      `UPDATE users SET 
        password_hash = $1, 
        password_reset_token = NULL, 
        password_reset_expires = NULL,
        updated_at = NOW()
       WHERE id = $2`,
      [passwordHash, decoded.userId]
    );

    res.json({ 
      success: true, 
      message: 'Senha alterada com sucesso! Você já pode fazer login.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

module.exports = router;
