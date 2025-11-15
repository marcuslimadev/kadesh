const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      type, 
      is_read, 
      limit = 20, 
      offset = 0 
    } = req.query;

    let query = `
      SELECT 
        id,
        type,
        title,
        content as message,
        data,
        is_read,
        action_url as link,
        created_at
      FROM notifications
      WHERE user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
    }

    if (is_read !== undefined) {
      paramCount++;
      query += ` AND is_read = $${paramCount}`;
      params.push(is_read === 'true' || is_read === true);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count and unread count
    let countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE user_id = $1';
    const countParams = [userId];
    
    if (type) {
      countQuery += ' AND type = $2';
      countParams.push(type);
    }
    if (is_read !== undefined) {
      countQuery += ` AND is_read = $${countParams.length + 1}`;
      countParams.push(is_read === 'true' || is_read === true);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    const unreadResult = await db.query(
      'SELECT COUNT(*) as unread FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );
    const unread = parseInt(unreadResult.rows[0].unread);

    res.json({
      success: true,
      data: {
        notifications: result.rows,
        unread_count: unread,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + result.rows.length < total
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Erro ao buscar notificações'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Notificação não encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        notification: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      error: 'Erro ao marcar notificação como lida'
    });
  }
});

// Mark all notifications as read
router.post('/read-all', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    );

    res.json({
      success: true,
      message: 'Todas as notificações foram marcadas como lidas'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      error: 'Erro ao marcar notificações como lidas'
    });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Notificação não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Notificação excluída'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      error: 'Erro ao excluir notificação'
    });
  }
});

// Create notification (internal use / webhooks)
router.post('/', auth, async (req, res) => {
  try {
    const { user_id, type, title, content, action_url, data } = req.body;

    if (!user_id || !type || !title) {
      return res.status(400).json({
        error: 'user_id, type e title são obrigatórios'
      });
    }

    const result = await db.query(`
      INSERT INTO notifications (user_id, type, title, content, action_url, data)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [user_id, type, title, content, action_url, data ? JSON.stringify(data) : null]);

    res.status(201).json({
      success: true,
      data: {
        notification: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      error: 'Erro ao criar notificação'
    });
  }
});

module.exports = router;
