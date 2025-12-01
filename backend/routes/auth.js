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

module.exports = router;
